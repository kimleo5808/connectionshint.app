/**
 * Sync puzzle data from Cloudflare KV back into the local JSON files so that
 * build-time data stays current. After the migration to KV, the cron worker
 * writes new puzzles only to KV, leaving puzzles.json / puzzle-index.json frozen
 * at the last manual export. That stale fallback is what the static build,
 * generateStaticParams, and the sitemap read — so anything not rendered with
 * force-dynamic ends up months behind.
 *
 * This script (run in CI before the build) reads meta:all-puzzles from KV via
 * the Cloudflare REST API and rewrites:
 *   - data/connections/puzzles.json       (oldest-first, full puzzles)
 *   - data/connections/puzzle-index.json  (newest-first, {id, date})
 *
 * It never blocks the build: on any failure it leaves the existing JSON intact
 * and exits 0, so a transient KV/API issue can't break a deploy.
 */
import { writeFile } from "node:fs/promises";

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const NAMESPACE_ID =
  process.env.PUZZLES_KV_ID ?? "489eb2b783064bfba7b4fae18309fc9d";

const PUZZLES_PATH = "data/connections/puzzles.json";
const INDEX_PATH = "data/connections/puzzle-index.json";

function bail(message) {
  // Warn, but exit 0 so the build proceeds with the existing JSON.
  console.warn(`[sync-kv] ${message} — keeping existing JSON files.`);
  process.exit(0);
}

async function kvGet(key) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(
    key
  )}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  if (!res.ok) {
    throw new Error(`KV get "${key}" failed: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

function isValidPuzzle(p) {
  return (
    p &&
    typeof p.id === "number" &&
    typeof p.date === "string" &&
    Array.isArray(p.answers) &&
    p.answers.length === 4 &&
    p.answers.every(
      (g) =>
        g &&
        typeof g.level === "number" &&
        typeof g.group === "string" &&
        Array.isArray(g.members) &&
        g.members.length === 4
    )
  );
}

async function main() {
  if (!ACCOUNT_ID || !API_TOKEN) {
    bail("Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN");
  }

  let raw;
  try {
    raw = await kvGet("meta:all-puzzles");
  } catch (err) {
    bail(err.message);
  }

  let puzzles;
  try {
    puzzles = JSON.parse(raw);
  } catch {
    bail('"meta:all-puzzles" is not valid JSON');
  }

  if (!Array.isArray(puzzles)) {
    bail('"meta:all-puzzles" is not an array');
  }

  const valid = puzzles.filter(isValidPuzzle);
  if (valid.length === 0) {
    bail("KV payload contained no valid puzzles");
  }

  // Deduplicate by date (KV is the source of truth; keep the last occurrence)
  const byDate = new Map();
  for (const p of valid) byDate.set(p.date, p);

  // Oldest-first matches the puzzles.json convention (latest = last element)
  const oldestFirst = [...byDate.values()].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const now = new Date().toISOString();

  const puzzlesJson = { lastUpdated: now, puzzles: oldestFirst };
  const indexJson = {
    lastUpdated: now,
    // Newest-first matches the puzzle-index.json convention
    puzzles: [...oldestFirst]
      .reverse()
      .map((p) => ({ id: p.id, date: p.date })),
  };

  await writeFile(PUZZLES_PATH, JSON.stringify(puzzlesJson, null, 2) + "\n");
  await writeFile(INDEX_PATH, JSON.stringify(indexJson, null, 2) + "\n");

  const latest = indexJson.puzzles[0];
  console.log(
    `[sync-kv] Wrote ${oldestFirst.length} puzzles (latest #${latest.id} / ${latest.date}).`
  );
}

main();

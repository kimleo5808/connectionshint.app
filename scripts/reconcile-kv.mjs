// CI is the sole writer of the classic archive snapshot and lookup keys.
import { readFile } from "node:fs/promises";
import { mergePuzzles } from "../lib/puzzle-archive.mjs";

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const NAMESPACE_ID =
  process.env.PUZZLES_KV_ID ?? "489eb2b783064bfba7b4fae18309fc9d";

const KV_BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}`;

function bail(message) {
  console.warn(`[reconcile-kv] ${message} — skipping reconciliation.`);
  process.exit(0);
}

async function kvGet(key) {
  const res = await fetch(`${KV_BASE}/values/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  if (res.status === 404) return "[]";
  if (!res.ok) {
    throw new Error(`KV get "${key}" failed: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

async function kvBulkPut(entries) {
  // Bulk endpoint accepts up to 10,000 entries per call.
  const res = await fetch(`${KV_BASE}/bulk`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entries),
  });
  if (!res.ok) {
    throw new Error(`KV bulk put failed: ${res.status} ${res.statusText}`);
  }
}

async function kvBulkDelete(keys) {
  const res = await fetch(`${KV_BASE}/bulk/delete`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(keys),
  });
  if (!res.ok) {
    throw new Error(`KV bulk delete failed: ${res.status} ${res.statusText}`);
  }
}

async function main() {
  if (!ACCOUNT_ID || !API_TOKEN) bail("Missing Cloudflare credentials");
  const local = JSON.parse(await readFile(new URL("../data/connections/puzzles.json", import.meta.url), "utf8"));
  const existing = JSON.parse(await kvGet("meta:all-puzzles"));
  const recent = JSON.parse(await kvGet("classic:recent"));
  const allPuzzles = mergePuzzles(existing, local.puzzles, recent);
  const previous = new Map(existing.map(p => [p.date, p]));
  const changed = allPuzzles.filter(p => JSON.stringify(p) !== JSON.stringify(previous.get(p.date)));
  if (!changed.length) return;
  const dates = allPuzzles.map(p => p.date).reverse();
  const months = [...new Set(dates.map(date => date.slice(0, 7)))];
  const lookups = changed.flatMap(p => [
    { key: `puzzle:date:${p.date}`, value: JSON.stringify(p) },
    { key: `puzzle:id:${p.id}`, value: JSON.stringify(p) },
  ]);
  const index = { lastUpdated: new Date().toISOString(), count: dates.length, latestDate: dates[0], dates, months };
  const liveIds = new Set(allPuzzles.map(p => p.id));
  const staleIds = changed.map(p => previous.get(p.date)?.id).filter(id => Number.isSafeInteger(id) && !liveIds.has(id));
  for (let i = 0; i < lookups.length; i += 10000) {
    await kvBulkPut(lookups.slice(i, i + 10000));
  }
  if (staleIds.length) await kvBulkDelete([...new Set(staleIds)].map(id => `puzzle:id:${id}`));
  await kvBulkPut([{ key: "meta:index", value: JSON.stringify(index) }]);
  // Publish last so an interrupted run retries lookup writes from the old snapshot.
  await kvBulkPut([{ key: "meta:all-puzzles", value: JSON.stringify(allPuzzles) }]);
  console.log(`Published ${changed.length} corrected boards (${allPuzzles.length} total).`);
}

await main();

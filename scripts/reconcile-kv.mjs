/**
 * Reconcile the KV puzzle data against the community source of truth.
 *
 * The community repo (Eyefyre/NYT-Connections-Answers) is the canonical record
 * for puzzle numbering. Historically the cron worker's NYT-API fallback stored
 * NYT's internal id instead of the public puzzle number, and entries already
 * in KV were never corrected afterwards. This script repairs that:
 *
 *   - id/answer mismatches vs the community data are overwritten
 *   - local dates the community source never had are pruned once they are
 *     older than 7 days (a fresh NYT-API fallback is left alone)
 *   - stale puzzle:id:<n> keys that no longer belong to any live puzzle are
 *     deleted
 *
 * Run in CI before sync-kv-to-json.mjs. Uses the Cloudflare REST bulk
 * endpoints, so even a full repair is a handful of API calls. It never blocks
 * the build: on any failure it exits 0 and the next run retries.
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const NAMESPACE_ID =
  process.env.PUZZLES_KV_ID ?? "489eb2b783064bfba7b4fae18309fc9d";

const COMMUNITY_SOURCE =
  "https://raw.githubusercontent.com/Eyefyre/NYT-Connections-Answers/refs/heads/main/connections.json";

const KV_BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}`;

function bail(message) {
  console.warn(`[reconcile-kv] ${message} — skipping reconciliation.`);
  process.exit(0);
}

async function kvGet(key) {
  const res = await fetch(`${KV_BASE}/values/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
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

function normalizePuzzle(puzzle) {
  const answers = puzzle.answers
    .map((a, idx) => ({
      level: a.level >= 0 && a.level <= 3 ? a.level : idx,
      group: a.group,
      members: a.members.map((m) => String(m).toUpperCase()),
    }))
    .sort((a, b) => a.level - b.level);
  return { id: puzzle.id, date: puzzle.date, answers };
}

async function main() {
  if (!ACCOUNT_ID || !API_TOKEN) {
    bail("Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN");
  }

  let existing;
  try {
    existing = JSON.parse(await kvGet("meta:all-puzzles"));
  } catch (err) {
    bail(err.message);
  }
  if (!Array.isArray(existing)) bail('"meta:all-puzzles" is not an array');

  let community;
  try {
    const res = await fetch(COMMUNITY_SOURCE, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    community = await res.json();
  } catch (err) {
    bail(`Community source fetch failed: ${err.message}`);
  }
  if (!Array.isArray(community) || community.length === 0) {
    bail("Community source returned no data");
  }

  const byDate = new Map(
    existing.filter(isValidPuzzle).map((p) => [p.date, p])
  );
  const changed = [];
  const staleIds = [];
  const prunedDates = [];
  const communityDates = new Set();

  for (const raw of community) {
    if (!isValidPuzzle(raw)) continue;
    const puzzle = normalizePuzzle(raw);
    communityDates.add(puzzle.date);
    const current = byDate.get(puzzle.date);
    if (!current) {
      byDate.set(puzzle.date, puzzle);
      changed.push(puzzle);
    } else if (
      current.id !== puzzle.id ||
      JSON.stringify(current.answers) !== JSON.stringify(puzzle.answers)
    ) {
      if (current.id !== puzzle.id) {
        console.log(
          `[reconcile-kv] ${puzzle.date}: id ${current.id} -> ${puzzle.id}`
        );
        staleIds.push(current.id);
      }
      byDate.set(puzzle.date, puzzle);
      changed.push(puzzle);
    }
  }

  const cutoff = new Date(Date.now() - 7 * 86400_000)
    .toISOString()
    .split("T")[0];
  for (const [date, puzzle] of [...byDate]) {
    if (!communityDates.has(date) && date < cutoff) {
      console.log(`[reconcile-kv] pruning spurious date ${date} (id ${puzzle.id})`);
      byDate.delete(date);
      prunedDates.push(date);
      staleIds.push(puzzle.id);
    }
  }

  if (changed.length === 0 && prunedDates.length === 0) {
    console.log("[reconcile-kv] KV data already matches the community source.");
    return;
  }

  const allPuzzles = [...byDate.values()].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const allDates = [...byDate.keys()].sort().reverse();
  const months = [...new Set(allDates.map((d) => d.slice(0, 7)))].sort().reverse();

  const entries = [
    ...changed.flatMap((p) => [
      { key: `puzzle:date:${p.date}`, value: JSON.stringify(p) },
      { key: `puzzle:id:${p.id}`, value: JSON.stringify(p) },
    ]),
    {
      key: "meta:index",
      value: JSON.stringify({
        lastUpdated: new Date().toISOString(),
        count: allDates.length,
        latestDate: allDates[0],
        dates: allDates,
        months,
      }),
    },
    { key: "meta:all-puzzles", value: JSON.stringify(allPuzzles) },
  ];

  const liveIds = new Set(allPuzzles.map((p) => p.id));
  const deletions = [
    ...[...new Set(staleIds)]
      .filter((id) => !liveIds.has(id))
      .map((id) => `puzzle:id:${id}`),
    ...prunedDates.map((d) => `puzzle:date:${d}`),
  ];

  try {
    await kvBulkPut(entries);
    if (deletions.length > 0) await kvBulkDelete(deletions);
  } catch (err) {
    bail(err.message);
  }

  console.log(
    `[reconcile-kv] Repaired ${changed.length} puzzles, pruned ${prunedDates.length} dates, deleted ${deletions.length} stale keys. Total: ${allPuzzles.length}.`
  );
}

main();

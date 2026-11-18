#!/usr/bin/env node
// Run update-sports.mjs first to refresh the durable snapshot used for migration.
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { isPlayableSportsBoard } from "../lib/sports-archive.mjs";

const require = createRequire(import.meta.url);
const snapshot = JSON.parse(await readFile(new URL("../data/sports/puzzles.json", import.meta.url), "utf8"));
const puzzles = snapshot.puzzles;
if (!puzzles.length || !puzzles.every(isPlayableSportsBoard)) throw new Error("Invalid sports snapshot");
const dates = puzzles.map(p => p.date).sort().reverse();
const entries = puzzles.flatMap(p => [
  { key: `sports:puzzle:date:${p.date}`, value: JSON.stringify(p) },
  { key: `sports:puzzle:id:${p.id}`, value: JSON.stringify(p) },
]);
entries.push({ key: "sports:index", value: JSON.stringify({
  dates, count: dates.length, latestDate: dates[0], lastUpdated: snapshot.lastUpdated,
}) }, { key: "sports:all-puzzles", value: JSON.stringify(puzzles) });
const dir = await mkdtemp(join(tmpdir(), "sports-kv-"));
try {
  const file = join(dir, "entries.json");
  await writeFile(file, JSON.stringify(entries));
  execFileSync(process.execPath, [require.resolve("wrangler/bin/wrangler.js"), "kv", "bulk", "put",
    file, "--binding", "PUZZLES_KV", "--remote"], { stdio: "inherit" });
} finally {
  await rm(dir, { recursive: true, force: true });
}

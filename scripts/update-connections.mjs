#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { dateForPuzzleNumber, publicPuzzleNumber, editionDate, mergePuzzles, readOfficialPuzzle } from "../lib/puzzle-archive.mjs";

const directory = new URL("../data/connections/", import.meta.url);
const communityUrl = "https://raw.githubusercontent.com/Eyefyre/NYT-Connections-Answers/refs/heads/main/connections.json";

async function fetchJSON(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; ConnectionsHint/1.0; +https://connectionshint.app)",
          Accept: "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      console.error(
        `  Attempt ${attempt}/${retries} failed for ${url}: ${err.message}`
      );
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
  }
  return null;
}

const dataPath = new URL("puzzles.json", directory);
const existing = JSON.parse(await readFile(dataPath, "utf8"));
const community = await fetchJSON(communityUrl);
const today = editionDate();
const puzzles = mergePuzzles(existing.puzzles, Array.isArray(community) ? community : [])
  .filter(puzzle => puzzle.date <= today);
const ids = new Set(puzzles.map(puzzle => puzzle.id));
const last = publicPuzzleNumber(today);
for (let id = 1; id <= last; id++) {
  if (ids.has(id)) continue;
  const date = dateForPuzzleNumber(id);
  const data = await fetchJSON(`https://www.nytimes.com/svc/connections/v2/${date}.json`, 2);
  const puzzle = readOfficialPuzzle(data, date);
  if (puzzle) puzzles.push(puzzle);
  else console.warn(`No verified board for ${date} (#${id})`);
}
puzzles.sort((a, b) => a.id - b.id);
const changed = JSON.stringify(existing.puzzles) !== JSON.stringify(puzzles);
const lastUpdated = changed ? new Date().toISOString() : existing.lastUpdated;
const index = puzzles.map(({ id, date }) => ({ id, date })).reverse();
await writeFile(dataPath, JSON.stringify({ lastUpdated, puzzles }, null, 2) + "\n");
await writeFile(new URL("puzzle-index.json", directory), JSON.stringify({ lastUpdated, puzzles: index }, null, 2) + "\n");
console.log(`Verified ${puzzles.length} boards; latest #${puzzles.at(-1)?.id}.`);

import { readFile, writeFile, rename } from "node:fs/promises";
import { editionDate } from "../lib/puzzle-archive.mjs";
import { fetchSportsBoard, isPlayableSportsBoard } from "../lib/sports-archive.mjs";

const file = new URL("../data/sports/puzzles.json", import.meta.url);
const snapshot = JSON.parse(await readFile(file, "utf8"));
const boards = new Map(snapshot.puzzles.filter(isPlayableSportsBoard).map(p => [p.date, p]));
const today = editionDate();
const last = [...boards.keys()].sort().at(-1) ?? "2024-09-18";
const start = process.argv[2] || new Date(Date.parse(last) - 6 * 86400000).toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || start < "2024-09-18" || start > today) throw new Error("Invalid start date");
const pending = [];
for (let time = Date.parse(start); time <= Date.parse(today); time += 86400000) {
  const date = new Date(time).toISOString().slice(0, 10);
  if (!boards.has(date)) pending.push(date);
}
let added = 0;
let failures = 0;
async function fill(date) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const board = await fetchSportsBoard(date);
      if (board) { boards.set(date, board); added++; }
      return;
    } catch (error) {
      if (attempt === 3) { failures++; console.warn(date, error.message); }
      else await new Promise(resolve => setTimeout(resolve, 700 * attempt));
    }
  }
}
for (let i = 0; i < pending.length; i += 4) {
  await Promise.all(pending.slice(i, i + 4).map(fill));
  if (i % 60 === 0) console.log(`Checked ${Math.min(i + 4, pending.length)}/${pending.length} missing dates`);
}
if (added) {
  const puzzles = [...boards.values()].sort((a,b) => a.date.localeCompare(b.date));
  const temp = new URL(`puzzles-${process.pid}.tmp`, file);
  await writeFile(temp, JSON.stringify({ lastUpdated: new Date().toISOString(), puzzles }, null, 2) + "\n");
  await rename(temp, file);
}
console.log(`Added ${added} sports boards. Archive contains ${boards.size}. Latest: ${[...boards.keys()].sort().at(-1)}.`);
if (failures) process.exitCode = 1;

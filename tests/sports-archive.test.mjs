import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sportsDate, sportsNumber, readSportsBoard, isPlayableSportsBoard } from "../lib/sports-archive.mjs";

const date = "2026-11-12";
const categories = Array.from({ length: 4 }, (_, group) => ({
  title: "Group " + group, cards: [0,1,2,3].map(i => ({ content: `word ${group * 4 + i}` })),
}));
const row = { id: "1180", print_date: date, categories };
const link = "https://www.nytimes.com/athletic/7774637/2026/11/12/connections-sports-edition-hints-answers-nov-12-2026/";

test("public Sports Edition numbers differ from database IDs and exclude previews", () => {
  assert.equal(sportsNumber("2026-11-18"), 786);
  assert.equal(sportsDate(786), "2026-11-18");
  assert.equal(sportsNumber("2024-09-18"), null);
  assert.equal(sportsNumber("2026-02-30"), null);
  assert.equal(sportsDate(0), null);
});

test("only exact print dates or matching publisher article dates confirm a board", () => {
  assert.equal(readSportsBoard(row, date).id, 1180);
  const placeholder = { ...row, print_date: "YYYY-MM-DD", hint_url: link };
  assert.equal(readSportsBoard(placeholder, date).answers[0].members[0], "WORD 0");
  assert.equal(readSportsBoard(placeholder, "2026-11-13"), null);
  assert.equal(readSportsBoard({ ...placeholder, hint_url: link.replace("www.nytimes.com", "example.org") }, date), null);
  assert.equal(readSportsBoard({ ...placeholder, print_date: "2026-11-11" }, date), null);
});

test("incomplete, blank and duplicate tiles never open as a replay", () => {
  for (const invalid of ["WORD 1", null, "", "undefined", 14]) {
    const copy = structuredClone(row);
    copy.categories[0].cards[0].content = invalid;
    assert.equal(readSportsBoard(copy, date), null);
  }
  assert.equal(readSportsBoard({ ...row, categories: [] }, date), null);
  const snapshot = JSON.parse(readFileSync(new URL("../data/sports/puzzles.json", import.meta.url), "utf8")).puzzles;
  assert.ok(snapshot.every(isPlayableSportsBoard));
  assert.equal(new Set(snapshot.map(board => board.date)).size, snapshot.length);
});

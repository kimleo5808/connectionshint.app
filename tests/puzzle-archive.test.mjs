import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { dateForPuzzleNumber, editionDate, mergePuzzles, nextEditionTime, publicPuzzleNumber, readOfficialPuzzle } from "../lib/puzzle-archive.mjs";

const readSnapshot = name => JSON.parse(readFileSync(new URL(`../data/connections/${name}.json`, import.meta.url)));
const { puzzles } = readSnapshot("puzzles");

test("the public puzzle number survives gaps in the community feed", () => {
  for (const [date, id] of [["2023-06-12", 1], ["2025-10-31", 873], ["2026-11-17", 1255], ["2026-11-18", 1256]]) {
    assert.equal(publicPuzzleNumber(date), id);
    assert.equal(dateForPuzzleNumber(id), date);
  }
  assert.equal(publicPuzzleNumber("2026-02-30"), 0);
  assert.equal(dateForPuzzleNumber(Infinity), null);
});

test("static number and date indexes agree, including all five mixed or image editions", () => {
  const index = readSnapshot("puzzle-index").puzzles;
  assert.deepEqual(index, puzzles.map(({ date, id }) => ({ date, id })).reverse());
  assert.equal(new Set(puzzles.map(p => p.date)).size, puzzles.length);
  for (const p of puzzles) assert.equal(p.id, publicPuzzleNumber(p.date));
  for (const date of ["2025-10-31", "2026-02-07", "2026-03-07", "2026-04-01", "2026-05-06"]) {
    const p = puzzles.find(p => p.date === date);
    assert.equal(p?.imageTiles, true, date);
    assert.equal(new Set(p.answers.flatMap(g => g.members)).size, 16);
  }
});

test("official picture labels and mixed boards survive partial or misnumbered later feeds", () => {
  const board = puzzles.find(p => p.date === "2026-03-07");
  const official = {
    print_date: board.date, id: 99999,
    categories: board.answers.map(g => ({
      title: g.group,
      cards: g.members.map(word => word === "THIS GAME" ? { image_alt_text: word } : { content: word }),
    })),
  };
  assert.deepEqual(readOfficialPuzzle(official, board.date), board);
  assert.equal(readOfficialPuzzle(official, "2026-03-08"), null);
  const textOnly = { ...board, id: 1, imageTiles: false };
  assert.deepEqual(mergePuzzles([board], [], [textOnly]), [board]);
  delete official.categories[3].cards.find(c => c.image_alt_text).image_alt_text;
  assert.equal(readOfficialPuzzle(official, board.date), null);
  assert.deepEqual(mergePuzzles([board], [board]), [board]);
});

test("the site changes edition at New York midnight, including both DST transitions", () => {
  for (const [time, date, next] of [
    ["2026-11-18T04:59:59Z", "2026-11-17", "2026-11-18T05:00:00Z"],
    ["2026-11-18T05:00:00Z", "2026-11-18", "2026-11-19T05:00:00Z"],
    ["2026-03-08T05:00:00Z", "2026-03-08", "2026-03-09T04:00:00Z"],
    ["2026-11-01T04:00:00Z", "2026-11-01", "2026-11-02T05:00:00Z"],
  ]) {
    assert.equal(editionDate(new Date(time)), date);
    assert.equal(nextEditionTime(new Date(time)), Date.parse(next));
  }
});

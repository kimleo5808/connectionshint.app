import assert from "node:assert/strict";
import test from "node:test";
import { analyzeGrid, emojiRow, sampleGrids } from "../lib/result-grid.mjs";

test("official-style copy with emoji presentation marks, a puzzle number and a trailing link", () => {
  const input = ["Connections","Puzzle #1,256",...sampleGrids[0].rows.map(row=>Array.from(emojiRow(row)).join("\uFE0F")),"https://www.nytimes.com/games/connections"].join("\r\n");
  const result = analyzeGrid(input);
  assert.equal(result.outcome,"Solved");
  assert.deepEqual(result.order,["G","Y","P","B"]);
  assert.equal(result.mistakes,1);
  assert.equal(result.nearMisses,1);
  assert.equal(result.guesses[0].row,"YYYB");
});

test("classifies every mixed pattern once and permits repeated color patterns", () => {
  const result = analyzeGrid("YYBY\nGGPP\nPBPY\nYGBP");
  assert.equal(result.outcome,"Out of mistakes");
  assert.deepEqual(result.guesses.map(g=>g.pattern),["3+1","2+2","2+1+1","1+1+1+1"]);
  assert.equal(result.mistakes,4);
  assert.equal(result.nearMisses,1);
  assert.equal(analyzeGrid("YYYB\nYYYB").nearMisses,2);
});

test("reads a compact perfect grid, partial rows, and the longest valid win", () => {
  assert.equal(analyzeGrid("ppppbbbbggggyyyy").outcome,"Perfect solve");
  assert.equal(analyzeGrid("y y y b\nGGGG").outcome,"Partial grid");
  assert.equal(analyzeGrid("YYBY\nGGBP\nGGGG\nYYPB\nYYYY\nPPPP\nBBBB").outcome,"Solved");
});

test("rejects truncated lines, unsupported symbols, reused solved groups and rows past the end", () => {
  for(const input of ["","Connections\nPuzzle #15","YYB\nGGGG","🟨🟥🟩🟦","YYYY\nYBBG","YYYY\nYYYY",
    "YGBP\nYYGP\nBBGP\nPPGB\nGGGG","YYYY\nGGGG\nBBBB\nPPPP\nYYYY","YYYY\nConnections\nGGGG","Wordle 501 3/6\nGGGG"]) {
    assert.ok(analyzeGrid(input).error,input);
  }
});

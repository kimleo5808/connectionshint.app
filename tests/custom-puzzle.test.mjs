import assert from "node:assert/strict";
import test from "node:test";
import { decodePuzzle, emptyDraft, encodePuzzle, exampleDraft, firstIssue, hasDraftShape } from "../lib/custom-puzzle.mjs";

test("a player link carries a complete independent board, including international text and punctuation", () => {
  const draft = structuredClone(exampleDraft);
  draft.title = "Été & 秋 🍁";
  draft.groups[0].words[0] = "  Río  Grande  ";
  draft.groups[1].words[0] = "A, B";
  const fragment = encodePuzzle(draft);
  assert.match(fragment, /^p1\.[A-Za-z0-9_-]+$/);
  const received = decodePuzzle(fragment);
  assert.equal(received.title, draft.title);
  assert.equal(received.groups[0].words[0], "Río Grande");
  assert.equal(received.groups[1].words[0], "A, B");
  draft.title = "Edited later";
  assert.equal(decodePuzzle(fragment).title, "Été & 秋 🍁");
});

test("validation identifies missing and duplicate fields across groups", () => {
  assert.equal(firstIssue(emptyDraft()).field, "name");
  const draft = structuredClone(exampleDraft);
  draft.groups[2].words[1] = "";
  assert.deepEqual([firstIssue(draft).index, firstIssue(draft).field], [2, "tile-1"]);
  draft.groups[2].words[1] = " ＢＡＳＳ ";
  assert.match(firstIssue(draft).message, /already appears in Yellow/);
  assert.throws(() => encodePuzzle(draft));
});

test("blank, truncated, unsupported and malformed share payloads never produce a game", () => {
  for (const fragment of ["", "p1.", "p2.abc", "p1.!!!!", "p1.e30", encodePuzzle(exampleDraft).slice(0, -4)]) {
    assert.equal(decodePuzzle(fragment), null);
  }
  const bad = structuredClone(exampleDraft);
  bad.groups[0].words.push("Extra");
  assert.equal(hasDraftShape(bad), false);
  assert.throws(() => encodePuzzle(bad));
});

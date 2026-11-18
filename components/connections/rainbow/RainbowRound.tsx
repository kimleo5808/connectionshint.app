"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ConnectionsPuzzle } from "@/types/connections";
import { analyzeGrid, colorNames } from "@/lib/result-grid.mjs";
import ConnectionsGame from "../ConnectionsGame";
import styles from "./rainbow.module.css";

const target = ["P", "B", "G", "Y"];
const names: Record<string, string> = colorNames;

function OrderTracker({ rows, restart }: { rows: string[]; restart: () => void }) {
  const report = rows.length ? analyzeGrid(rows.join("\n")) : undefined;
  const order: string[] = report?.order ?? [];
  const mistakes = report?.mistakes ?? 0;
  const inOrder = order.every((code, i) => code === target[i]);
  const eligible = inOrder && mistakes === 0;
  const complete = order.length === 4;
  let message = "Select four words for purple.";
  if (mistakes === 4) message = `Round ended with ${order.length} of 4 groups solved.`;
  else if (complete && eligible) message = "Reverse rainbow complete!";
  else if (complete && inOrder) message = "Reverse order complete with mistakes.";
  else if (complete) message = "Board solved in a different order.";
  else if (!eligible) message = "Clean run ended. You can finish the board.";
  else if (order.length) message = `Next target: ${names[target[order.length]]}.`;

  return <div className={styles.score}>
    <ol aria-label="Target colors and your solve order" className={styles.track}>
      {target.map((code, i) => <li key={code} data-color={code}>
        <strong>{names[code]}</strong>
        <span>{order[i] ? (order[i] === code ? "Matched" : "Got " + names[order[i]]) : "Step " + (i + 1)}</span>
      </li>)}
    </ol>
    <div className={styles.readout}>
      <p role="status" aria-live="polite">{message} <span>{mistakes} {mistakes === 1 ? "miss" : "misses"}</span></p>
      {!eligible && !complete && mistakes < 4 && <button type="button" onClick={restart}>Retry run</button>}
    </div>
  </div>;
}

export default function RainbowRound({ puzzle, boardIds }: { puzzle: ConnectionsPuzzle; boardIds: number[] }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <section className={styles.panel} id="challenge" aria-label="Reverse rainbow practice board">
    <div className={styles.board}>
      <fieldset disabled={!ready} aria-label="Play the reverse rainbow challenge">
        <ConnectionsGame groups={puzzle.answers} renderProgress={(rows, restart) => <OrderTracker rows={rows} restart={restart}/>}/>
      </fieldset>
      <noscript>Enable JavaScript to play the board.</noscript>
    </div>
    <aside className={styles.options}>
      <h2>Archive puzzle #{puzzle.id}</h2>
      <p>Make four clean submissions in the order shown. You can finish the puzzle after a miss.</p>
      <form method="get" action="/connections-reverse-rainbow#challenge">
        <label htmlFor="rainbow-board">Choose a practice board</label>
        <div><select id="rainbow-board" name="board" defaultValue={puzzle.id}>
          {boardIds.map(id => <option key={id} value={id}>Puzzle #{id}</option>)}
        </select><button>Open board</button></div>
      </form>
      <Link href={"/connections-number/" + puzzle.id}>Review the archive clues</Link>
    </aside>
  </section>;
}

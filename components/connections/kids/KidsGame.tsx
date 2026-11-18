"use client";

import { useEffect, useState } from "react";
import ConnectionsGame from "../ConnectionsGame";
import type { KidsBoard } from "@/data/kids-boards";
import styles from "./kids.module.css";

export default function KidsGame({ board, index, choices }: {
  board: KidsBoard; index: number; choices: Pick<KidsBoard, "title" | "difficulty">[];
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const next = (index + 1) % choices.length + 1;
  return <section id="play" className={styles.panel} aria-label="Kids word grouping game">
    <div className={styles.banner}>
      <h2>{board.title}</h2><span>{board.difficulty} · {index + 1} of {choices.length}</span>
    </div>
    <div className={styles.layout}>
      <div className={styles.play}>
        <fieldset disabled={!ready} aria-label="Word tiles and game controls">
          <ConnectionsGame groups={board.groups} learningMode
            renderTile={word => <span className={word.split(" ").some(part => part.length >= 8) ? styles.longWord : undefined}>{word}</span>} />
        </fieldset>
        <noscript>Enable JavaScript to play. You can read the picture puzzles below.</noscript>
      </div>
      <aside className={styles.desk}>
        <form action="/connections-for-kids#play" method="get">
          <label htmlFor="kids-choice">Choose a puzzle</label>
          <div><select id="kids-choice" name="board" defaultValue={index + 1}>
            {(["Starter", "Explorer"] as const).map(level => <optgroup key={level} label={level}>
              {choices.map((choice, i) => choice.difficulty === level && <option key={i} value={i + 1}>{i + 1}. {choice.title}</option>)}
            </optgroup>)}
          </select><button type="submit">Open</button></div>
        </form>
        <p><strong>Starter</strong> groups use familiar things and actions. <strong>Explorer</strong> groups add second meanings and wordplay.</p>
        <a href={"/connections-for-kids?board=" + next + "#play"}>{next === 1 ? "Back to puzzle 1" : "Next puzzle"}</a>
      </aside>
    </div>
  </section>;
}

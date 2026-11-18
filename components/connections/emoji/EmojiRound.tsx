"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { EmojiBoard } from "@/data/emoji-boards";
import ConnectionsGame from "../ConnectionsGame";
import styles from "./emoji.module.css";

export default function EmojiRound({ board, number, total }: { board: EmojiBoard; number: number; total: number }) {
  const [showNames, setShowNames] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const next = number === total ? 1 : number + 1;
  return (
    <section id="emoji-board" aria-label="Play Emoji Connections" className={styles.panel}>
      <header className={styles.bar}>
        <h2>Board {number} of {total}</h2>
        <label><input type="checkbox" disabled={!ready} checked={showNames}
          onChange={event => setShowNames(event.target.checked)}/> Show names</label>
      </header>
      <div className={styles.layout}>
        <fieldset disabled={!ready} className={styles.board} aria-label="Picture tiles and game controls">
          <ConnectionsGame groups={board.groups} completionNote={board.explanation} renderTile={name => <>
            <span aria-hidden="true" className={styles.symbol}>{board.symbols[name]}</span>
            <span className={showNames ? styles.name : "sr-only"}>{name}</span>
          </>}/>
        </fieldset>
        <aside className={styles.options}>
          <p>Select four pictures that share a link, then submit your group.</p>
          <details><summary>Show a hint</summary><p>{board.hint}</p></details>
          <form action="/emoji-connections#emoji-board" method="get">
            <label htmlFor="emoji-number">Choose a board</label>
            <div><select id="emoji-number" name="board" defaultValue={number}>
              {Array.from({ length: total }, (_, i) => <option key={i} value={i + 1}>Board {i + 1}</option>)}
            </select><button type="submit">Open board</button></div>
          </form>
          <Link href={"/emoji-connections?board=" + next + "#emoji-board"}>{number === total ? "Back to board 1" : "Play board " + next}</Link>
        </aside>
      </div>
      <noscript>Enable JavaScript to play. The illustrated examples are available below.</noscript>
    </section>
  );
}

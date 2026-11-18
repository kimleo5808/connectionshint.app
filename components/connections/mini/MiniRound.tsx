"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MiniBoard } from "@/data/mini-boards";
import ConnectionsGame from "../ConnectionsGame";
import styles from "./mini.module.css";

export default function MiniRound({ board, number, total }: { board: MiniBoard; number: number; total: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const next = number === total ? 1 : number + 1;
  return <section id="mini-board" className={styles.panel} aria-label="Mini Connections game">
    <div className={styles.bar}>
      <h2>Board {number} <span>of {total}</span></h2>
      <Link href={"/mini-connections?board=" + next + "#mini-board"}>{number === total ? "First board" : "Next board"} <span aria-hidden="true">→</span></Link>
    </div>
    <div className={styles.layout}>
      <div className={styles.board}>
        <p className={styles.instruction} role="status">{ready ? "Select three related words, then submit." : "Loading the game controls…"}</p>
        <fieldset disabled={!ready} aria-label="Word tiles and game controls">
          <ConnectionsGame groups={board.groups} mini completionNote={board.explanation}/>
        </fieldset>
        <noscript>Enable JavaScript to play this board.</noscript>
      </div>
      <aside className={styles.drawer} aria-label="Board options">
        <form action="/mini-connections#mini-board" method="get">
          <label htmlFor="mini-number">Choose a board</label>
          <div><select id="mini-number" name="board" defaultValue={number}>
            {Array.from({length:total}, (_, index) => <option key={index} value={index+1}>Board {index+1}</option>)}
          </select><button type="submit">Open</button></div>
        </form>
        <details><summary>Show a hint</summary><p>{board.hint}</p></details>
        <p className={styles.rules}>Find three groups. Each new wrong guess costs one mistake. The third ends the round and reveals the groups.</p>
      </aside>
    </div>
  </section>;
}

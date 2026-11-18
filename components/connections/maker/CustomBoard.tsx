"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { decodePuzzle, emptyDraft } from "@/lib/custom-puzzle.mjs";
import type { ConnectionsLevel } from "@/types/connections";
import ConnectionsGame from "../ConnectionsGame";
import styles from "./maker.module.css";

export type MakerDraft = ReturnType<typeof emptyDraft>;

export function CustomBoard({ puzzle }: { puzzle: MakerDraft }) {
  return <div className={styles.game}><ConnectionsGame customPuzzle groups={puzzle.groups.map((group, index) => ({
    level: index as ConnectionsLevel, group: group.name.trim(), members: group.words.map(word => word.trim().replace(/\s+/gu, " ")),
  }))} /></div>;
}

export function SharedBoard() {
  const [fragment, setFragment] = useState<string | null>(null);
  useEffect(() => {
    function read() { setFragment(window.location.hash.slice(1)); }
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  const puzzle = fragment ? decodePuzzle(fragment) : null;
  return <section className={styles.player}>
    <h1>{puzzle?.title || "Custom Connections puzzle"}</h1>
    {fragment === null ? <p role="status">Opening the board…</p> : puzzle ? <>
      <p>Find four groups of four. Select four tiles and submit your guess.</p>
      <CustomBoard key={fragment} puzzle={puzzle}/>
    </> : <p role="alert">This link is missing part of the puzzle. Ask the maker to copy the full player link again.</p>}
    <Link className={styles.returnLink} href="/connections-maker">Make your own Connections puzzle</Link>
  </section>;
}

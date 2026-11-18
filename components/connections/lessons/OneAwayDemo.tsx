"use client";

import { useState } from "react";
import { event } from "@/gtag";
import type { ConnectionsGroup } from "@/types/connections";
import styles from "./lessons.module.css";

const startingHand = ["HONEY", "BUZZ", "COMB", "YELLOW"];

export function OneAwayDemo({ groups }: { groups: ConnectionsGroup[] }) {
  const [hand, setHand] = useState(startingHand);
  const [outgoing, setOutgoing] = useState<string | null>(null);
  const [swaps, setSwaps] = useState(0);
  const available = groups.flatMap(group => group.members).filter(word => !hand.includes(word)).sort();
  const overlaps = groups.map(group => hand.filter(word => group.members.includes(word)).length);
  const solved = groups[overlaps.indexOf(4)];
  const feedback = solved ? "Solved! " + solved.group + "."
    : overlaps.includes(3) ? "One away! Three of these four share a group."
    : "No group has three of these tiles. Try a different swap.";

  function swap(word: string) {
    if (!outgoing || solved) return;
    const nextHand = hand.map(tile => tile === outgoing ? word : tile);
    if (groups.some(group => nextHand.every(tile => group.members.includes(tile)))) {
      event({ action: "one_away_demo_solved", category: "connections", label: "1256", value: 1 });
    }
    setHand(nextHand);
    setOutgoing(null);
    setSwaps(swaps + 1);
  }

  return <section className={styles.panel + " " + styles.swap} aria-label="Interactive One Away example">
    <h2>Find the fourth word</h2>
    <p className={styles.subtle}>Pick a tile to take out, then choose its replacement. You can experiment freely.</p>
    <div className={styles.swapLayout}>
      <div>
        <h3>Your four tiles</h3>
        <div className={styles.wordRow}>{hand.map(word => <button key={word} type="button" className={styles.tile}
          disabled={Boolean(solved)} aria-pressed={outgoing === word} onClick={() => setOutgoing(outgoing === word ? null : word)}>{word}</button>)}</div>
        <p className={styles.feedback} role="status">{outgoing ? "Choose a replacement for " + outgoing + "." : feedback}</p>
      </div>
      <div>
        <h3>Available replacements</h3>
        <div className="grid grid-cols-3 gap-1.5">{available.map(word => <button type="button" key={word}
          className={styles.tile} disabled={!outgoing || Boolean(solved)} onClick={() => swap(word)}>{word}</button>)}</div>
      </div>
    </div>
    {(swaps > 0 || outgoing) && <button className={styles.secondary + " mt-3"} onClick={() => {
      setHand(startingHand); setOutgoing(null); setSwaps(0);
    }}>Reset example</button>}
  </section>;
}

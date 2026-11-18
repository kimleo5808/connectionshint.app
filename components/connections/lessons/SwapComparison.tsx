"use client";

import { useState } from "react";
import styles from "./lessons.module.css";

export function SwapComparison() {
  const [swapped, setSwapped] = useState(false);
  return <figure className={styles.diagram}>
    <figcaption>One swap repairs both groups</figcaption>
    <div className={styles.switches} role="group" aria-label="Show the groups before or after the swap">
      <button type="button" aria-pressed={!swapped} onClick={() => setSwapped(false)}>Before swap</button>
      <button type="button" aria-pressed={swapped} onClick={() => setSwapped(true)}>After swap</button>
    </div>
    <div aria-live="polite" className={styles.hands}>
      {[
        ["Things bees produce", "HONEY", "BUZZ", "COMB", swapped ? "VENOM" : "YELLOW"],
        ["Lemon descriptors", "JUICY", "OVOID", "SOUR", swapped ? "YELLOW" : "VENOM"],
      ].map(([label, ...tiles]) => <div key={label}><strong>{label}</strong>
        <div className={styles.handTiles}>{tiles.map((tile, i) => <span key={i} data-moved={i === 3}>{tile}</span>)}</div>
      </div>)}
      <span>{swapped ? "VENOM and YELLOW are back in their groups. Both sets are complete." : "Each row has one outsider. Exchange the two outlined tiles."}</span>
    </div>
  </figure>;
}

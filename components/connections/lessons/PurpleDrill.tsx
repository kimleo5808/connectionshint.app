"use client";

import { useState } from "react";
import Link from "next/link";
import { event } from "@/gtag";
import type { ConnectionsPuzzle } from "@/types/connections";
import styles from "./lessons.module.css";

export type Drill = {
  board: ConnectionsPuzzle;
  technique: string;
  hint: string;
  explanation: string;
};

function Round({ drill, children, next, last }: {
  drill: Drill;
  children: React.ReactNode;
  next: () => void;
  last: boolean;
}) {
  const { board, hint, explanation } = drill;
  const [selected, setSelected] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState<"solved" | "revealed" | null>(null);
  const [feedback, setFeedback] = useState("");
  const target = board.answers.find(group => group.level === 3)!;
  const words = board.answers.flatMap(group => group.members).sort();

  function toggle(word: string) {
    if (finished) return;
    setSelected(selected.includes(word) ? selected.filter(item => item !== word) : [...selected, word]);
    setFeedback("");
  }

  function check() {
    const hits = selected.filter(word => target.members.includes(word)).length;
    if (hits === 4) {
      setFinished("solved");
      setFeedback("");
      event({ action: "purple_drill_solved", category: "connections", label: board.date, value: 1 });
      return;
    }
    const otherGroup = board.answers.find(group => selected.every(word => group.members.includes(word)));
    if (otherGroup) setFeedback("You found a complete group of another color. Try for purple.");
    else setFeedback(hits === 3 ? "One away from purple. Try swapping one tile." : "These four do not make the purple group. Try a different set.");
  }

  return <>
    <div className={styles.drillLayout}>
      <div>
        <h2>Puzzle #{board.id}</h2>
        <div className={styles.board} aria-label="Puzzle tiles">{words.map(word => <button
          type="button" className={styles.tile} key={word} aria-pressed={finished ? target.members.includes(word) : selected.includes(word)}
          disabled={Boolean(finished) || (selected.length === 4 && !selected.includes(word))} onClick={() => toggle(word)}>{word}</button>)}</div>
      </div>
      <div className={styles.controls}>
        {finished ? <button className={styles.check} onClick={next}>{last ? "Practice again" : "Next puzzle"}</button> : <>
          <div className={styles.actions}>
            <button className={styles.check} disabled={selected.length !== 4} onClick={check}>Check group</button>
            <span className="ml-2 text-sm" aria-live="polite">{selected.length} of 4 selected</span>
          </div>
          <div className={styles.actions}>
            <button className={styles.quiet} aria-expanded={showHint} onClick={() => setShowHint(!showHint)}>{showHint ? "Hide hint" : "Get a hint"}</button>
            <button className={styles.quiet} onClick={() => { setFinished("revealed"); setFeedback(""); }}>Reveal answer</button>
          </div>
          {showHint && <p>{hint}</p>}
        </>}
        <p role="status">{feedback || (finished === "solved" ? "Purple group solved!" : finished === "revealed" ? "Answer revealed." : "")}</p>
        {children}
      </div>
    </div>
    {finished && <div className={styles.explanation}>
      <h3 className="font-bold">{target.group}</h3>
      <p>{explanation}</p>
      <Link className="mt-2 inline-block text-sm underline" href={"/connections-hint/" + board.date}>Review the full puzzle</Link>
    </div>}
  </>;
}

export function PurpleDrill({ drills }: { drills: Drill[] }) {
  const [technique, setTechnique] = useState("");
  const [index, setIndex] = useState(0);
  const pool = technique ? drills.filter(drill => drill.technique === technique) : drills;
  const drill = pool[index];
  return <section className={styles.drill} aria-label="Purple group practice">
    <Round key={technique + drill.board.id} drill={drill} last={index === pool.length - 1} next={() => setIndex((index + 1) % pool.length)}>
      <label>Practice set
        <select value={technique} onChange={event => { setTechnique(event.target.value); setIndex(0); }}>
          <option value="">Mixed techniques</option>
          {[...new Set(drills.map(item => item.technique))].map(item => <option key={item}>{item}</option>)}
        </select>
      </label>
      <p>Board {index + 1} of {pool.length}</p>
    </Round>
  </section>;
}

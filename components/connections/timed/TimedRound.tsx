"use client";

import { useEffect, useRef, useState } from "react";
import ConnectionsGame from "../ConnectionsGame";
import { LEVEL_COLORS, type ConnectionsGroup, type ConnectionsPuzzle } from "@/types/connections";
import styles from "./timed.module.css";

type Split = { group: ConnectionsGroup; at: number };
type Finish = { at: number; won: boolean };

function formatTime(tenths: number) {
  const minutes = Math.floor(tenths / 600);
  const seconds = String(Math.floor(tenths / 10) % 60).padStart(2, "0");
  return minutes + ":" + seconds + "." + tenths % 10;
}

function elapsed(start: number) {
  return Math.max(0, Math.floor((performance.now() - start) / 100));
}

function RunningClock({ start }: { start: number }) {
  const [ticks, setTicks] = useState(() => elapsed(start));
  useEffect(() => {
    const tick = () => setTicks(elapsed(start));
    const interval = window.setInterval(tick, 100);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [start]);
  return <>{formatTime(ticks)}</>;
}

function storedBest(key: string) {
  const raw = localStorage.getItem(key);
  const value = Number(raw);
  return raw && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

export default function TimedRound({ puzzle, boardIds }: { puzzle: ConnectionsPuzzle; boardIds: number[] }) {
  const [ready, setReady] = useState(false);
  const [start, setStart] = useState<number | null>(null);
  const [finish, setFinish] = useState<Finish | null>(null);
  const [splits, setSplits] = useState<Split[]>([]);
  const [best, setBest] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const storageKey = "connections:timed:v1:" + puzzle.id;
  const running = start !== null && !finish;

  useEffect(() => {
    setReady(true);
    function read() {
      try { setBest(storedBest(storageKey)); } catch { /* Play also works without storage. */ }
    }
    read();
    const sync = (event: StorageEvent) => { if (event.key === storageKey || event.key === null) read(); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [storageKey]);

  useEffect(() => {
    if (start !== null) boardRef.current?.querySelector<HTMLButtonElement>("button[aria-pressed]")?.focus({ preventScroll: true });
  }, [start]);

  function begin() {
    setSplits([]);
    setFinish(null);
    setStart(performance.now());
  }

  function record(group: ConnectionsGroup | null, status: "playing" | "lost" | "won") {
    if (start === null || finish) return;
    const at = elapsed(start);
    if (group) setSplits(previous => [...previous, { group, at }]);
    if (status === "playing") return;
    setFinish({ at, won: status === "won" });
    if (status === "won") {
      let fastest = Math.min(best ?? at, at);
      try {
        fastest = Math.min(storedBest(storageKey) ?? at, fastest);
        localStorage.setItem(storageKey, String(fastest));
      } catch { /* Keep the visit's best in memory if saving is unavailable. */ }
      setBest(fastest);
    }
  }

  return <section className={styles.panel} id="timer" aria-label="Timed Connections game">
    <header className={styles.strip}>
      <div><h2>Puzzle #{puzzle.id}</h2><time dateTime={puzzle.date}>{new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(puzzle.date))}</time></div>
      <div className={styles.clock}><span>Elapsed</span><strong role="timer" aria-label="Elapsed time">
        {finish ? formatTime(finish.at) : start === null ? "0:00.0" : <RunningClock key={start} start={start} />}
      </strong></div>
    </header>
    <div className={styles.layout}>
      <div className={styles.board} ref={boardRef}>
        {start === null ? <div className={styles.launch}>
          <h3>{finish ? "Ready for another attempt?" : "Ready to see the words?"}</h3>
          <p>The clock starts when the sixteen tiles appear. Solve all four groups before your fourth mistake.</p>
          <button type="button" onClick={begin} disabled={!ready}>Start timed board</button>
          <noscript>Enable JavaScript to play the timed board.</noscript>
        </div> : <ConnectionsGame key={start} groups={puzzle.answers} onGuess={record} onReplay={begin}
          completionNote={finish?.won ? "Compare the four intervals on your split sheet." : "The split sheet keeps the groups you solved before the run ended."} />}
      </div>
      <aside className={styles.sheet} aria-label="Run details">
        {!running && <form method="get" action="/timed-connections#timer">
          <label htmlFor="timed-board">Choose an archive board</label>
          <div><select id="timed-board" name="board" defaultValue={puzzle.id}>{boardIds.map(id => <option key={id} value={id}>Puzzle #{id}</option>)}</select>
          <button type="submit">Open</button></div>
        </form>}
        <div className={styles.sheetTitle}><h3>Split sheet</h3><span>{splits.length} / 4 groups</span></div>
        {splits.length ? <table><thead><tr><th scope="col">Group</th><th scope="col">Interval</th><th scope="col">Elapsed</th></tr></thead>
          <tbody>{splits.map(({ group, at }, i) => <tr key={group.level}>
            <th scope="row"><i aria-hidden="true" data-color={LEVEL_COLORS[group.level]} />{LEVEL_COLORS[group.level]}</th>
            <td>{formatTime(at - (splits[i - 1]?.at ?? 0))}</td><td>{formatTime(at)}</td>
          </tr>)}</tbody></table> : <p>Your first correct group sets the first split.</p>}
        <p className={styles.best}><strong>Board best</strong><span>{best === null ? "No finish yet" : formatTime(best)}</span></p>
        {running && <button type="button" className={styles.stop} onClick={() => {
          setFinish({ at: elapsed(start), won: false });
          setStart(null);
        }}>Stop run</button>}
        {finish && <p role="status">{finish.won ? "Finished in " : start === null ? "Stopped at " : "Run ended at "}{formatTime(finish.at)}. <a href={"/connections-hint/" + puzzle.date}>Review puzzle #{puzzle.id}</a></p>}
      </aside>
    </div>
  </section>;
}

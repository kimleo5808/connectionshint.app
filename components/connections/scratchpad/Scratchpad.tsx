"use client";

import { useEffect, useRef, useState } from "react";
import { draftKey, freshDraft, labelLimit, lastBoardKey, readDraft, rowLetters, swapWords, wordProblem } from "./board";
import type { BoardSource, Draft } from "./board";
import styles from "./scratchpad.module.css";

export default function Scratchpad({ boards }: { boards: BoardSource[] }) {
  const [active, setActive] = useState(boards[0].id);
  const [draft, setDraft] = useState(() => freshDraft(boards[0].words));
  const [ready, setReady] = useState(false);
  const [hasCustom, setHasCustom] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [history, setHistory] = useState<string[][]>([]);
  const [message, setMessage] = useState("");
  const [paste, setPaste] = useState("");
  const [error, setError] = useState("");
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const dragging = useRef<number | null>(null);
  const pastePanel = useRef<HTMLDetailsElement>(null);
  const drafts = useRef(new Map<string, Draft>());
  const sourceDate = boards.find(board => board.id === active)?.dateLabel;

  useEffect(() => {
    const custom = readDraft("custom");
    if (custom) drafts.current.set("custom", custom);
    setHasCustom(Boolean(custom));
    let previous: string | null = null;
    try {
      previous = localStorage.getItem(lastBoardKey);
    } catch {
      setStorageUnavailable(true);
    }
    const source = boards.find(b => b.id === previous) ?? boards[0];
    if (previous === "custom" && custom) {
      setActive("custom");
      setDraft(custom);
    } else {
      setActive(source.id);
      setDraft(readDraft(source.id, source.words) ?? freshDraft(source.words));
    }
    setReady(true);
  }, [boards]);

  function write(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      setStorageUnavailable(true);
    }
  }

  function save(next: Draft, id = active) {
    drafts.current.set(id, next);
    setDraft(next);
    write(draftKey(id), JSON.stringify(next));
  }

  function openBoard(id: string, next: Draft) {
    setActive(id);
    setDraft(next);
    setSelected(null);
    setHistory([]);
    setMessage("");
    setError("");
    dragging.current = null;
    write(lastBoardKey, id);
  }

  function choose(id: string) {
    const source = boards.find(b => b.id === id);
    const next = drafts.current.get(id) ?? readDraft(id, source?.words);
    if (next) openBoard(id, next);
    else if (source) openBoard(id, freshDraft(source.words));
  }

  function exchange(first: number, second: number) {
    setSelected(null);
    if (first === second) return;
    setHistory(previous => [...previous.slice(-49), draft.words]);
    save({ ...draft, words: swapWords(draft.words, first, second) });
    setMessage(`Swapped ${draft.words[first]} and ${draft.words[second]}.`);
  }

  function pick(index: number) {
    if (selected === null) {
      setSelected(index);
      setMessage(`${draft.words[index]} selected. Choose the other tile.`);
    } else if (selected === index) {
      setSelected(null);
      setMessage("Selection cleared.");
    } else {
      exchange(selected, index);
    }
  }

  function undo() {
    const previous = history[history.length - 1];
    if (!previous) return;
    save({ ...draft, words: previous });
    setHistory(history.slice(0, -1));
    setSelected(null);
    setMessage("Undid the last swap.");
  }

  function importWords(event: React.FormEvent) {
    event.preventDefault();
    const words = paste.split(/[,\n\t]+/u).map(w => w.trim().replace(/\s+/gu, " ")).filter(Boolean);
    const problem = wordProblem(words);
    if (problem) {
      setError(problem);
      return;
    }
    const next = freshDraft(words);
    setHasCustom(true);
    openBoard("custom", next);
    save(next, "custom");
    setPaste("");
    if (pastePanel.current) pastePanel.current.open = false;
    setMessage("Your sixteen tiles are ready to arrange.");
    document.getElementById("scratch-board")?.focus();
  }

  return (
    <section aria-label="Connections scratchpad workspace" id="scratchpad" className={styles.workspace}>
      <fieldset disabled={!ready}>
        <div className={styles.toolbar}>
          <label htmlFor="scratch-source">Board</label>
          <select id="scratch-source" value={active} onChange={e => choose(e.target.value)}>
            {boards.map(b => <option value={b.id} key={b.id}>{b.label}</option>)}
            {hasCustom && <option value="custom">My pasted words</option>}
          </select>
          <button type="button" onClick={undo} disabled={!history.length}>Undo swap</button>
        </div>
        <details className={styles.import} ref={pastePanel}>
          <summary>Paste your own 16 words</summary>
          <form onSubmit={importWords}>
            <label htmlFor="scratch-import">Separate tiles with commas, tabs or new lines. Keep spaces inside a phrase.</label>
            <textarea id="scratch-import" rows={3} value={paste} onChange={e => { setPaste(e.target.value); setError(""); }}
              aria-invalid={Boolean(error)} aria-describedby={error ? "scratch-error" : undefined}/>
            {error && <p id="scratch-error" role="alert">{error}</p>}
            <button type="submit">{hasCustom ? "Replace pasted board" : "Open pasted board"}</button>
          </form>
        </details>
        <div className={styles.desk}>
          <div className={styles.board} id="scratch-board" tabIndex={-1}>
            <p className={styles.direction}>Tap two tiles or drag to swap.</p>
            {rowLetters.map((letter, row) => (
              <div key={letter} role="group" aria-label={`Row ${letter}${draft.labels[row] ? ", " + draft.labels[row] : ""}`} className={styles.row}>
                <span aria-hidden="true">{letter}</span>
                {draft.words.slice(row * 4, row * 4 + 4).map((word, column) => {
                  const index = row * 4 + column;
                  return <button type="button" key={column} draggable={ready} aria-pressed={selected === index}
                    onClick={() => pick(index)}
                    onDragStart={event => {
                      dragging.current = index;
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", word);
                    }}
                    onDragOver={event => { if (dragging.current !== null) event.preventDefault(); }}
                    onDrop={event => {
                      event.preventDefault();
                      if (dragging.current !== null) exchange(dragging.current, index);
                      dragging.current = null;
                    }}
                    onDragEnd={() => { dragging.current = null; }}
                  >{word}</button>;
                })}
              </div>
            ))}
            <p className={styles.status} role="status">{message || (ready ? sourceDate || "Your pasted board" : "Loading your board…")}</p>
          </div>
          <aside className={styles.notes}>
            <h2>Row notes</h2>
            <p>Give each group a working title.</p>
            {rowLetters.map((letter, i) => <label key={letter}>
              <strong>{letter}</strong>
              <input aria-label={"Row " + letter + " note"} placeholder="Possible connection" maxLength={labelLimit}
                value={draft.labels[i]} onChange={e => {
                  const labels = [...draft.labels];
                  labels[i] = e.target.value;
                  save({ ...draft, labels });
                }}/>
            </label>)}
          </aside>
        </div>
      </fieldset>
      {storageUnavailable && <p className={styles.storage}>Browser storage is unavailable. Keep this tab open to keep your draft.</p>}
      <noscript>Enable JavaScript to move tiles and save notes.</noscript>
    </section>
  );
}

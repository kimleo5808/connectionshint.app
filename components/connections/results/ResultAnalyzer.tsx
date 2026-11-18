"use client";

import { useEffect, useRef, useState } from "react";
import { analyzeGrid, colorNames, emojiRow, sampleGrids } from "@/lib/result-grid.mjs";
import styles from "./results.module.css";

type Report = Extract<ReturnType<typeof analyzeGrid>, { outcome: string }>;
const labels: Record<string, string> = colorNames;
const example = sampleGrids[0].rows.map(emojiRow).join("\n");
const sample = analyzeGrid(example) as Report;

export default function ResultAnalyzer() {
  const [input, setInput] = useState("");
  const [report, setReport] = useState<Report | null>(sample);
  const [isExample, setIsExample] = useState(true);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    function importGrid() {
      if (!window.location.hash.startsWith("#grid=")) return;
      const value = window.location.hash.slice(6).split(".").join("\n");
      const parsed = analyzeGrid(value);
      setIsExample(false);
      if ("outcome" in parsed && parsed.outcome) {
        setReport(parsed);
        setError("");
        setInput(parsed.guesses.map(g => emojiRow(g.row)).join("\n"));
      } else {
        setReport(null);
        setInput("");
        setError(parsed.error || "Check the rows in this game link.");
      }
    }
    importGrid();
    setReady(true);
    window.addEventListener("hashchange", importGrid);
    return () => window.removeEventListener("hashchange", importGrid);
  }, []);

  function read(value: string, demo = false) {
    const parsed = analyzeGrid(value);
    setIsExample(demo);
    if ("outcome" in parsed && parsed.outcome) {
      setError("");
      setReport(parsed);
      requestAnimationFrame(() => resultHeading.current?.focus());
    } else {
      setReport(null);
      setError(parsed.error || "Check the rows and try again.");
      field.current?.focus();
    }
  }

  function edit(value: string) {
    if (window.location.hash.startsWith("#grid=")) {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    }
    setInput(value);
    setIsExample(false);
    setError("");
    setReport(null);
  }

  return <section id="reader" className={styles.panel} aria-label="Analyze a Connections result">
    <form className={styles.form} onSubmit={event => {event.preventDefault();read(input);}}>
      <label htmlFor="result-paste">Paste your result</label>
      <p id="result-format">Paste the shared squares or type four letters per row using Y, G, B and P.</p>
      <textarea id="result-paste" ref={field} rows={4} maxLength={3000} value={input} spellCheck={false}
        placeholder="Paste the squares here…" aria-invalid={!!error} aria-describedby={"result-format" + (error ? " result-error" : "")}
        onChange={e => edit(e.target.value)} />
      {error && <p id="result-error" role="alert" className={styles.error}>{error}</p>}
      <div className={styles.actions}><button disabled={!ready} type="submit">Read my grid</button>
        {input && <button className={styles.clear} type="button" onClick={()=>{edit("");field.current?.focus();}}>Clear</button>}
      </div>
      <div className={styles.samples}><span>Try an example</span>{sampleGrids.map(item =>
        <button type="button" key={item.label} disabled={!ready} onClick={()=>{
          const value = item.rows.map(emojiRow).join("\n");edit(value);read(value,true);
        }}>{item.label}</button>)}</div>
      <noscript>Enable JavaScript to read your own grid, or follow the worked example below.</noscript>
    </form>
    <div className={styles.slip}>
      <div className={styles.slipHead}><h2 ref={resultHeading} tabIndex={-1}>{isExample ? "Example breakdown" : "Your breakdown"}</h2>
        {report && <b>{report.outcome}</b>}</div>
      {report ? <>
        <dl className={styles.totals}>
          {[["Groups solved",report.order.length + " / 4"],["Mistakes",report.mistakes],["One away",report.nearMisses]].map(([label,n])=><div key={label}><dt>{label}</dt><dd>{n}</dd></div>)}
        </dl>
        <ol className={styles.ledger} aria-label="Guesses in order">{report.guesses.map((guess,i)=><li key={i}>
          <span className={styles.index}><span className="sr-only">Guess </span>{i+1}</span>
          <span className={styles.swatches} role="img" aria-label={[...guess.row].map(code=>labels[code]).join(", ")}>
            {[...guess.row].map((code,j)=><i key={j} data-color={code} aria-hidden="true">{code}</i>)}</span>
          <strong>{guess.label}</strong>
        </li>)}</ol>
        {report.outcome === "Partial grid" && <p className={styles.note}>Only the pasted guesses are shown. Add the remaining rows to see the final outcome.</p>}
      </> : <p className={styles.note}>Your guess-by-guess reading will appear here.</p>}
    </div>
  </section>;
}

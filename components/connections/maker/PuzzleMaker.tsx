"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Play, Link2 } from "lucide-react";
import { colorNames, emptyDraft, encodePuzzle, exampleDraft, firstIssue, hasDraftShape, nameLimit, titleLimit, wordLimit } from "@/lib/custom-puzzle.mjs";
import { CustomBoard, type MakerDraft } from "./CustomBoard";
import styles from "./maker.module.css";

const storageKey = "connections-maker:draft:v1";

export default function PuzzleMaker() {
  const [draft, setDraft] = useState(emptyDraft);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [preview, setPreview] = useState(false);
  const [link, setLink] = useState("");
  const [feedback, setFeedback] = useState("");
  const [issue, setIssue] = useState<ReturnType<typeof firstIssue>>(null);
  const playerLink = useRef<HTMLInputElement>(null);
  const group = draft.groups[active];
  const filled = draft.groups.flatMap(g => g.words).filter(w => w.trim()).length;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (hasDraftShape(saved)) setDraft(saved);
    } catch { /* Storage can be unavailable in a private window. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (issue) document.getElementById("maker-" + issue.field)?.focus();
  }, [issue]);

  function update(next: MakerDraft) {
    setDraft(next);
    setLink("");
    setIssue(null);
    setFeedback("");
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Editing works without storage. */ }
  }

  function changeGroup(name: string, words: string[]) {
    update({ ...draft, groups: draft.groups.map((entry, i) => i === active ? { name, words } : entry) });
  }

  function replace(next: MakerDraft) {
    if (JSON.stringify(draft) === JSON.stringify(next)) return;
    const hasWork = draft.title.trim() || draft.groups.some(g => g.name.trim() || g.words.some(w => w.trim()));
    if (hasWork && !window.confirm("Replace the current draft? Links you already shared will still work.")) return;
    update(next);
    setActive(0);
  }

  function run(action: "preview" | "share") {
    const invalid = firstIssue(draft);
    if (invalid) {
      setActive(invalid.index);
      setIssue(invalid);
      return;
    }
    setFeedback("");
    if (action === "preview") {
      setPreview(true);
    } else {
      const url = new URL(window.location.href);
      url.pathname = url.pathname.replace(/\/$/, "") + "/play";
      url.search = "";
      url.hash = encodePuzzle(draft);
      setLink(url.href);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setFeedback("Player link copied.");
    } catch {
      playerLink.current?.focus();
      playerLink.current?.select();
      setFeedback("Select Copy in your browser to copy the player link.");
    }
  }

  const fields = group.words.map((word,i) => <label key={i} className={styles.tileInput}>
    <span>Tile {i + 1}</span><input id={"maker-tile-" + i} maxLength={wordLimit} value={word}
      aria-invalid={issue?.index === active && issue.field === "tile-" + i || undefined}
      aria-describedby={issue?.field === "tile-" + i && issue.index === active ? "maker-error" : undefined}
      onChange={e => changeGroup(group.name, group.words.map((old, j) => j === i ? e.target.value : old))}
      placeholder={["First word", "Second word", "Third word", "Fourth word"][i]}/>
  </label>);

  return <section id="editor" className={styles.workbench} aria-label="Puzzle editor">
    {preview ? <div className={styles.tryout}>
      <div className={styles.bar}><h2>Playtest{draft.title.trim() ? " · " + draft.title.trim() : ""}</h2><button type="button" onClick={() => setPreview(false)}>Back to editor</button></div>
      <p>Select four tiles, then submit your guess.</p><CustomBoard puzzle={draft}/>
    </div> : <fieldset disabled={!ready} className={styles.editorFields}>
      <div className={styles.bar}><h2>Build your board</h2><button type="button" onClick={() => replace(exampleDraft)}>Load example</button></div>
      <div className={styles.layout}>
        <div className={styles.edit}>
          <div className={styles.tabs} role="group" aria-label="Choose a group to edit">
            {colorNames.map((color, i) => <button key={color} data-color={i} type="button" aria-pressed={i === active}
              onClick={() => setActive(i)}><i aria-hidden="true"/>{color}</button>)}
          </div>
          <div className={styles.group} data-color={active}>
            <label htmlFor="maker-name">Group name <span>· {colorNames[active]}</span></label>
            <input id="maker-name" value={group.name} maxLength={nameLimit} placeholder="What connects these four tiles?"
              aria-invalid={issue?.index === active && issue.field === "name" || undefined}
              aria-describedby={issue?.field === "name" && issue.index === active ? "maker-error" : undefined}
              onChange={e => changeGroup(e.target.value, group.words)}/>
            <div className={styles.wordFields}>{fields}</div>
            <div className={styles.groupFoot}><small>{group.words.filter(w => w.trim()).length} of 4 tiles filled</small>
              {active < 3 && <button type="button" onClick={() => setActive(active+1)}>Next group →</button>}
            </div>
          </div>
        </div>
        <div className={styles.sheet}>
          <label htmlFor="maker-title">Puzzle title <span>(optional)</span></label>
          <input id="maker-title" maxLength={titleLimit} value={draft.title} placeholder="My custom puzzle" onChange={e => update({ ...draft, title:e.target.value })}/>
          <div className={styles.overview} aria-hidden="true">
            {draft.groups.map((g,i) => <div key={i} data-color={i}>{g.words.map((word,j) => <span key={j} data-filled={!!word.trim()}>{word.trim() || "·"}</span>)}</div>)}
          </div>
          <div className={styles.meter}><b>{filled} / 16 tiles</b>{(filled > 0 || draft.title || draft.groups.some(g=>g.name)) && <button type="button" onClick={() => replace(emptyDraft())}>Clear draft</button>}</div>
        </div>
      </div>
      {issue && <p role="alert" id="maker-error" className={styles.error}>{issue.message}</p>}
      <div className={styles.actions}>
        <button type="button" className={styles.strong} onClick={() => run("preview")}><Play size={16}/> Playtest</button>
        <button type="button" className={styles.light} onClick={() => run("share")}><Link2 size={17}/> Get share link</button>
      </div>
      {link && <div className={styles.share}>
        <label htmlFor="maker-link">Player link</label><div><input ref={playerLink} id="maker-link" readOnly value={link} onFocus={e=>e.target.select()}/>
          <button className={styles.light} type="button" onClick={copyLink}>{feedback === "Player link copied." ? <Check size={16}/> : <Copy size={16}/>} Copy link</button></div>
        <a href={link} target="_blank" rel="noopener noreferrer">Open player view ↗</a><p role="status">{feedback}</p>
      </div>}
    </fieldset>}
    <noscript>Enable JavaScript to edit, playtest and share a puzzle.</noscript>
  </section>;
}

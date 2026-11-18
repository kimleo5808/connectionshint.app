import Link from "next/link";
import styles from "./lessons.module.css";

export function NiceMeaningMap() {
  return <figure className={styles.diagram}>
    <figcaption>Three ways to read NICE</figcaption>
    <div className={styles.mapRoot}>NICE</div>
    <ul className={styles.branches}>
      {[
        ["Praise", "COOL · SICK · SWEET", "2024-06-05", "#360"],
        ["A city", "LIMA · OSAKA · PHOENIX", "2026-03-08", "#1001"],
        ["A change in pronunciation", "HERB · JOB · READING", "2025-04-02", "#661"],
      ].map(([meaning, neighbors, date, number]) => <li key={meaning}>
        <strong>{meaning}</strong><span>{neighbors}</span>
        <Link href={"/connections-hint/" + date}>Puzzle {number}</Link>
      </li>)}
    </ul>
  </figure>;
}

export function GuessPatterns() {
  const examples = [
    { count: "3 + 1", message: "One away", tiles: [["HONEY", "Bee"], ["BUZZ", "Bee"], ["COMB", "Bee"], ["YELLOW", "Lemon"]] },
    { count: "2 + 2", message: "Miss", tiles: [["HONEY", "Bee"], ["COMB", "Bee"], ["SOUR", "Lemon"], ["YELLOW", "Lemon"]] },
    { count: "1 + 1 + 1 + 1", message: "Miss", tiles: [["DIJON", "City"], ["FRENCH", "Fry"], ["HONEY", "Bee"], ["YELLOW", "Lemon"]] },
  ];
  return <figure className={styles.diagram}>
    <figcaption>How a four-tile guess is scored in puzzle #1256</figcaption>
    {examples.map(({ count, message, tiles }) => <div className={styles.patternRow} key={count}>
      <div className={styles.patternLabel}><strong>{count}</strong><span>{message}</span></div>
      <div className={styles.patternTiles}>{tiles.map(([tile, group]) => <div key={tile} data-group={group}>
        <b>{tile}</b><small>{group}</small>
      </div>)}</div>
    </div>)}
  </figure>;
}

export function HiddenEndings() {
  return <figure className={styles.diagram}>
    <figcaption>Find the word at the right edge</figcaption>
    <div className={styles.suffixGrid}>{[
      ["BAS", "SOON"], ["BEL", "FAST"], ["NES", "QUICK"], ["THERMO", "STAT"],
    ].map(([prefix, ending]) => <div key={ending}><span>{prefix}</span><mark>{ending}</mark></div>)}</div>
    <div className={styles.diagramNote}>The highlighted endings all express urgency in <Link href="/connections-hint/2026-05-16">puzzle #1070</Link>.</div>
  </figure>;
}

export function FlukeTimeline() {
  return <figure className={styles.diagram}>
    <figcaption>Follow FLUKE through three editions</figcaption>
    <ol className={styles.timeline}>{[
      ["2024-07-10", "#395", "A fish", "PERCH and PIKE are its neighbors."],
      ["2025-05-19", "#708", "A whale’s tail lobe", "FLIPPER and BLUBBER point to anatomy."],
      ["2025-12-17", "#920", "A hidden name", "Remove F and the word becomes LUKE."],
    ].map(([date, number, meaning, clue]) => <li key={date}>
      <Link href={"/connections-hint/" + date}>{number}</Link>
      <strong>{meaning}</strong><span>{clue}</span>
    </li>)}</ol>
  </figure>;
}

export function GoldenPhrases() {
  return <figure className={styles.diagram}>
    <figcaption>One partner, four complete phrases</figcaption>
    <div className={styles.phraseGrid}>
      {["FLEECE", "GIRLS", "PARACHUTE", "RULE"].map(tile => <div key={tile}><span>GOLDEN</span><strong>{tile}</strong></div>)}
    </div>
    <div className={styles.diagramNote}>Read each pair left to right. The missing word always comes first in <Link href="/connections-hint/2024-04-18">puzzle #312</Link>.</div>
  </figure>;
}

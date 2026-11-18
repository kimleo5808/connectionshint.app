import { LessonPage } from "@/components/connections/lessons/LessonPage";
import { getAllPuzzles } from "@/lib/connections-data";
import { getWordBoards, normalizeArchiveWord, rankWords } from "@/lib/connections-word-frequency";
import { constructMetadata } from "@/lib/metadata";
import { editionDate } from "@/lib/puzzle-archive.mjs";
import { LEVEL_COLORS, type ConnectionsLevel } from "@/types/connections";
import { FrequencyGuide } from "./FrequencyGuide";
import styles from "./frequency.module.css";

const path = "/most-common-connections-words";
const colors = Object.values(LEVEL_COLORS);
const pageSize = 10;
type Query = Record<string, string | string[] | undefined>;
const first = (value: Query[string]) => Array.isArray(value) ? value[0] : value;
const number = (count: number) => count.toLocaleString("en-US");
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const formatDate = (date: string) => dateFormat.format(new Date(date));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return constructMetadata({
    locale, page: "Word frequency", path, canonicalUrl: path,
    title: "Most Common NYT Connections Words, Ranked by Puzzle",
    description: "Which words appear most often in NYT Connections? Filter the past puzzle rankings by year and group color, then open a word to check its puzzle dates.",
    keywords: ["most common Connections words", "most repeated NYT Connections words", "Connections word frequency"],
    images: ["/images/word-frequency-ring.webp"],
  });
}

export default async function MostCommonWords({ searchParams }: { searchParams: Promise<Query> }) {
  const [allBoards, query] = await Promise.all([getAllPuzzles(), searchParams]);
  const archive = getWordBoards(allBoards, editionDate());
  const years = [...new Set(archive.map(board => board.date.slice(0, 4)))].sort().reverse();
  const inputYear = first(query.year) || "";
  const year = years.includes(inputYear) ? inputYear : "";
  const color = colors.find(label => label === first(query.color)) || "";
  const term = normalizeArchiveWord((first(query.q) || "").slice(0, 75));
  const boards = year ? archive.filter(board => board.date.startsWith(year)) : archive;
  const rows = rankWords(boards, color ? colors.indexOf(color) as ConnectionsLevel : undefined);
  const matches = term ? rows.filter(row => row.word.includes(term)) : rows;
  const pages = Math.max(1, Math.ceil(matches.length / pageSize));
  const page = Math.min(pages, Math.max(1, Math.trunc(Number(first(query.page))) || 1));
  const visible = matches.slice((page - 1) * pageSize, page * pageSize);
  const dates = boards.map(board => board.date).sort();
  const chart = rankWords(archive.filter(board => board.date.startsWith("2025")))
    .filter(row => row.word === "RING" || row.word === "JACK");
  function pageHref(target: number) {
    const params = new URLSearchParams();
    if (term) params.set("q", term);
    if (year) params.set("year", year);
    if (color) params.set("color", color);
    if (target > 1) params.set("page", String(target));
    return path + (params.size ? "?" + params : "") + "#rankings";
  }

  return <LessonPage parent={{ label: "Puzzle statistics", path: "/connections-stats" }}
    path={path} title="Most common Connections words" tone="archive"
    intro="See which tiles turn up most often in past NYT puzzles. Open a word to check its dates and groups."
    guidePreview={{ file: "/images/word-frequency-ring.webp", label: "How RING changes meaning", anchor: "ring" }}>
    <section id="rankings" aria-label="Word frequency rankings" className={styles.index}>
      <form className={styles.filters} method="get" action={path + "#rankings"}>
        <label>Tile contains<input name="q" type="search" placeholder="e.g. RING" maxLength={75} defaultValue={term} /></label>
        <label><span id="rank-year-label">Year</span><select name="year" aria-labelledby="rank-year-label" defaultValue={year}><option value="">All years</option>{years.map(value => <option key={value}>{value}</option>)}</select></label>
        <label><span id="rank-color-label">Group color</span><select name="color" aria-labelledby="rank-color-label" defaultValue={color}><option value="">All colors</option>{colors.map(label => <option key={label} value={label}>{label[0].toUpperCase() + label.slice(1)}</option>)}</select></label>
        <button type="submit">Apply filters</button>
      </form>
      <div className={styles.coverage}>
        <strong>{number(boards.length)} past puzzles</strong>
        {dates.length > 0 && <span>{formatDate(dates[0])} – {formatDate(dates[dates.length - 1])}</span>}
      </div>
      {visible.length ? <>
        <div className={styles.columnHeads} aria-hidden="true"><span>Rank</span><span>Repeated tile</span><span>Puzzles</span></div>
        <ol className={styles.rows} aria-label="Ranked words">{visible.map(row =>
          <li key={row.word}><details>
            <summary>
              <span className={styles.rank}><span className="sr-only">Rank </span>{number(row.rank)}</span>
              <span className={styles.word}>{row.word}<span aria-hidden="true">▾</span></span>
              <span className={styles.total}>{row.count}<span className="sr-only"> puzzles</span></span>
            </summary>
            <div className={styles.evidence}>
              <p>{color ? "Selected color: " + color : colors.map((name, i) => name + " " + row.colors[i]).join(" · ")}</p>
              <strong>{row.count > row.latest.length ? "Three latest matching puzzles" : "Matching puzzles"}</strong>
              <ul>{row.latest.map(appearance => <li key={appearance.date}>
                <a href={"/connections-hint/" + appearance.date}>#{appearance.id} · {formatDate(appearance.date)}</a>
                <span>{LEVEL_COLORS[appearance.level]} · {appearance.group}</span>
              </li>)}</ul>
              <a href={"/connections-word-finder?word=" + encodeURIComponent(row.word)}>Full history for {row.word}</a>
            </div>
          </details></li>)}</ol>
        <nav aria-label="Ranking pages" className={styles.pager}>
          <span>{number(matches.length)} repeated {matches.length === 1 ? "tile" : "tiles"} · Page {page} of {pages}</span>
          <div>{page > 1 && <a href={pageHref(page - 1)}>Previous</a>}{page < pages && <a href={pageHref(page + 1)}>Next</a>}</div>
        </nav>
      </> : <div className={styles.empty}><h2>No repeated tiles match these filters</h2>
        <p>A tile needs two puzzle dates in the selected year and color. Try fewer letters or a wider date range.</p>
        <a href={path + "#rankings"}>Reset filters</a>
      </div>}
    </section>
    <FrequencyGuide chart={chart} />
  </LessonPage>;
}

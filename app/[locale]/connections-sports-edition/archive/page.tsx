import { redirect } from "next/navigation";
import type { Locale } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import { getAllSportsPuzzles } from "@/lib/sports-data";
import { sportsDate, sportsNumber } from "@/lib/sports-archive.mjs";
import { editionDate } from "@/lib/puzzle-archive.mjs";
import { LessonPage } from "@/components/connections/lessons/LessonPage";
import SportsArchiveGuide from "@/components/connections/lessons/SportsArchiveGuide";
import styles from "./archive.module.css";

const parent = "/connections-sports-edition";
const path = parent + "/archive";
const monthFormat = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const dayFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const formatMonth = (month: string) => monthFormat.format(Date.parse(month + "-01"));
const formatDate = (date: string) => dayFormat.format(Date.parse(date));
const replay = (date: string) => parent + "?date=" + date;
const monthLink = (month: string) => path + "?month=" + month;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  return constructMetadata({ page: "SportsArchive", locale: (await params).locale, path, canonicalUrl: path,
    title: "Connections Sports Edition Archive – Replay Past Puzzles",
    description: "Pick a date or enter a Sports Edition puzzle number to replay a past board. Explore worked examples of team names, scoring terms and cross-sport wordplay.",
    keywords: ["Connections Sports Edition archive", "past Sports Connections puzzles", "Sports Connections puzzle number"],
    images: ["/images/sports-archive-helmet.webp"],
  });
}

export default async function SportsArchive({ searchParams }: {
  searchParams: Promise<{ month?: string; number?: string }>;
}) {
  const [query, boards] = await Promise.all([searchParams, getAllSportsPuzzles()]);
  const dates = new Set(boards.map(board => board.date));
  const today = editionDate();
  const latest = boards[0]?.date;
  const first = boards.at(-1)?.date;
  const months: string[] = [];
  const cursor = new Date((latest ?? today).slice(0, 7) + "-01T00:00:00Z");
  while (first && cursor.toISOString().slice(0, 7) >= first.slice(0, 7)) {
    months.push(cursor.toISOString().slice(0, 7));
    cursor.setUTCMonth(cursor.getUTCMonth() - 1);
  }
  const month = months.includes(query.month ?? "") ? query.month! : months[0] ?? today.slice(0, 7);
  const monthIndex = months.indexOf(month);
  const start = new Date(month + "-01T00:00:00Z");
  const dayCount = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate();
  const requested = typeof query.number === "string" && /^\d{1,7}$/.test(query.number.trim()) ? sportsDate(Number(query.number)) : null;
  if (requested && dates.has(requested)) redirect(replay(requested));

  return <LessonPage parent={{ label: "Sports Edition", path: parent }} title="Connections Sports Edition Archive"
    path={path} tone="archive" guidePreview={{ file: "/images/sports-archive-helmet.webp", label: "The ballpark puzzle", anchor: "ballpark" }}
    intro="Replay a board by date or puzzle number. The calendar keeps the answers hidden.">
    {latest && first ? <section className={styles.panel} aria-label="Find a sports puzzle">
      <div className={styles.top}>
        <div><h2>Replay a sports puzzle</h2><p>{boards.length.toLocaleString("en-US")} boards · {formatDate(first)} – {formatDate(latest)}</p></div>
        <a className={styles.latest} href={replay(latest)}>Play latest{sportsNumber(latest) ? " · #" + sportsNumber(latest) : ""} <span aria-hidden="true">→</span></a>
      </div>
      <div className={styles.columns}>
        <div>
          <div className={styles.monthBar}>
            <h3>{formatMonth(month)}</h3>
            <nav aria-label="Adjacent months">
              {months[monthIndex + 1] && <a aria-label={"Previous month, " + formatMonth(months[monthIndex + 1])} href={monthLink(months[monthIndex + 1])}>←</a>}
              {months[monthIndex - 1] && <a aria-label={"Next month, " + formatMonth(months[monthIndex - 1])} href={monthLink(months[monthIndex - 1])}>→</a>}
            </nav>
          </div>
          <div className={styles.grid}>
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(label => <span key={label} className={styles.weekday}>{label}</span>)}
            {Array.from({length: start.getUTCDay()}, (_, index) => <span key={"space" + index} aria-hidden="true" />)}
            {Array.from({length: dayCount}, (_, index) => {
              const day = index + 1;
              const date = month + "-" + String(day).padStart(2, "0");
              const number = sportsNumber(date);
              if (!dates.has(date)) return <span key={date} className={date > today ? styles.future : styles.missing}
                aria-label={formatDate(date) + (date > today ? ", upcoming" : ", unavailable")}>{day}</span>;
              return <a key={date} href={replay(date)} aria-label={"Play " + formatDate(date) + (number ? ", puzzle " + number : ", preview board")}
                aria-current={date === today ? "date" : undefined}>{day}</a>;
            })}
          </div>
          <p className={styles.legend}><b>Shaded</b> playable <span>·</span> <s>Struck through</s> unavailable <span>·</span> Plain upcoming</p>
        </div>
        <div className={styles.filters}>
          <form action={path} method="get"><label htmlFor="sports-month">Jump to month</label>
            <div><select id="sports-month" name="month" defaultValue={month}>{months.map(value =>
              <option key={value} value={value}>{formatMonth(value)}</option>)}</select><button>Show</button></div>
          </form>
          <form action={path} method="get"><label htmlFor="sports-number">Find a puzzle number</label>
            <input type="hidden" name="month" value={month}/>
            <div><input id="sports-number" name="number" type="text" inputMode="numeric" pattern="[0-9]+" required
              defaultValue={typeof query.number === "string" ? query.number : ""} placeholder={"e.g. " + sportsNumber(latest)}
              aria-describedby={query.number !== undefined ? "number-feedback" : undefined}/><button>Play</button></div>
            {query.number !== undefined && <p id="number-feedback" role="status">No playable board for that number. Choose a shaded date or try another number.</p>}
          </form>
        </div>
      </div>
    </section> : <p>No verified sports boards are available yet.</p>}
    <SportsArchiveGuide />
  </LessonPage>;
}

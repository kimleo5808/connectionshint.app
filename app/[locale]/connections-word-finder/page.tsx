import Link from "next/link";
import { WordResultLink } from "@/components/connections/lessons/WordResultLink";
import { LessonFigure, LessonPage } from "@/components/connections/lessons/LessonPage";
import styles from "@/components/connections/lessons/lessons.module.css";
import { getAllPuzzles } from "@/lib/connections-data";
import { constructMetadata } from "@/lib/metadata";
import { LEVEL_COLORS } from "@/types/connections";

const path = "/connections-word-finder";
const image = "/images/connections-word-finder-bass.webp";
const examples = ["BASS", "NICE", "SPRING"];
const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });
type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params;
  return constructMetadata({ locale, page: "Word finder", path, canonicalUrl: path,
    title: "NYT Connections Word Finder for Past Puzzles",
    description: "Look up a word or phrase in past NYT Connections boards. Find its puzzle dates, reveal its groups and compare the different meanings it has had.",
    keywords: ["NYT Connections word finder", "search past Connections puzzles by word"], images: [image] });
}

function normalize(word: string) {
  return word.normalize("NFKC").trim().replace(/\s+/g, " ").replace(/[‘’]/g, "'").toUpperCase();
}

export default async function WordFinder({ searchParams }: {
  searchParams: Promise<{ word?: string | string[] }>;
}) {
  const { word } = await searchParams;
  const term = normalize((Array.isArray(word) ? word[0] : word) || "") || "BASS";
  const boards = await getAllPuzzles();
  const matches = boards.flatMap(board => board.answers
    .filter(group => group.members.some(member => normalize(member) === term))
    .map(group => ({ date: board.date, id: board.id, group })));

  return <LessonPage parent={{ label: "Puzzle archive", path: "/connections-hint" }}
    title="NYT Connections word finder" path={path}
    intro="Remember a word but forgot the puzzle? Search for the exact tile to find its past boards and uncover the connection.">
    <section className={styles.panel} aria-label="Search the puzzle archive">
      <form action={path} method="get">
        <label htmlFor="word" className="font-semibold">Word or phrase from the board</label>
        <div className={styles.search}>
          <input key={term} id="word" name="word" type="search" defaultValue={word ? term : ""} placeholder="Try BASS or MASKED BALL" required />
          <button className={styles.primary}>Find word</button>
        </div>
      </form>
      <div className={styles.examples}>Try a word
        {examples.map(example => <Link key={example} prefetch={false} scroll={false} href={path + "?word=" + example}>{example}</Link>)}
      </div>
      <div className={styles.results}>
        <h2 className="break-words">{term} · {matches.length} {matches.length === 1 ? "appearance" : "appearances"}</h2>
        {matches.length ? <ul>{matches.map(({ date, id, group }) => <li key={date + group.level}>
          <div className={styles.resultRow}>
            <WordResultLink date={date} id={id} />
            <time dateTime={date}>{dateFormat.format(new Date(date))}</time>
          </div>
          <details key={term}><summary>Reveal group for #{id}</summary>
            <p><strong className="capitalize">{LEVEL_COLORS[group.level]} group</strong> · {group.group}</p>
            <p>{group.members.join(" · ")}</p>
          </details>
        </li>)}</ul> : <p className="mt-2">No exact tile matched in {boards.length.toLocaleString("en-US")} boards. Check the spelling or try the full phrase printed on the tile.</p>}
      </div>
    </section>
    <article className={styles.article}>
      <div className={styles.spread}>
        <div>
          <h2>How can the same word fit different groups?</h2>
          <p>A tile keeps its spelling from one puzzle to the next. The other three words tell you which meaning to use. BASS makes a good test because it even changes sound.</p>
          <h3>Five early appearances of BASS</h3>
          <p>In puzzles <Link href="/connections-hint/2023-11-29">#171</Link> and <Link href="/connections-hint/2024-03-26">#289</Link>, BASS is a musical instrument. In <Link href="/connections-hint/2024-07-10">#395</Link>, FLUKE, PERCH and PIKE put it back in the water.</p>
          <h4>When pronunciation changes the answer</h4>
          <p>Say the fish name so it rhymes with “mass,” then the instrument so it rhymes with “face.” That switch earns BASS a place with DOVE in <Link href="/connections-hint/2023-12-30">#202</Link> and with DOES in <Link href="/connections-hint/2025-08-31">#812</Link>. Both groups are heteronyms.</p>
        </div>
        <LessonFigure file={image} alt="A freshwater bass beside a four-string bass guitar" caption="One spelling can suggest a fish, an instrument or the difference between their pronunciations." />
      </div>
      <h2 className="mt-8">What can I look up?</h2>
      <h3>Search a whole tile</h3>
      <p>Enter the word or multiword phrase as it appeared on the board. Uppercase and lowercase both work. A result records the group on that date, so keep its name folded if you want to replay the puzzle.</p>
      <h3>Find a board another way</h3>
      <p>Have all sixteen words? The <Link href="/connections-solver">Connections solver</Link> can match the board. If you remember when you played, <Link href="/connections-hint">browse puzzles by date</Link>.</p>
    </article>
  </LessonPage>;
}

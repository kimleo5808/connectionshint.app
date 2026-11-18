import Link from "next/link";
import { WordResultLink } from "@/components/connections/lessons/WordResultLink";
import { LessonContents, LessonFigure, LessonPage } from "@/components/connections/lessons/LessonPage";
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
      <LessonContents links={[["bass", "The five BASS boards"], ["find-a-board", "Find a half-remembered puzzle"], ["nice", "NICE as a name"], ["spring", "The many jobs of SPRING"], ["compare", "Compare two results"], ["search-help", "Search tips"]]} />
      <div className={styles.spread}>
        <div>
          <h2 id="bass">How can the same word fit different groups?</h2>
          <p>A tile keeps its spelling from one puzzle to the next. The other three words tell you which meaning to use. BASS makes a good test because it even changes sound.</p>
          <h3>Five early appearances of BASS</h3>
          <p>In puzzles <Link href="/connections-hint/2023-11-29">#171</Link> and <Link href="/connections-hint/2024-03-26">#289</Link>, BASS is a musical instrument. In <Link href="/connections-hint/2024-07-10">#395</Link>, FLUKE, PERCH and PIKE put it back in the water.</p>
          <h4>When pronunciation changes the answer</h4>
          <p>Say the fish name so it rhymes with “mass,” then the instrument so it rhymes with “face.” That switch earns BASS a place with DOVE in <Link href="/connections-hint/2023-12-30">#202</Link> and with DOES in <Link href="/connections-hint/2025-08-31">#812</Link>. Both groups are heteronyms.</p>
        </div>
        <LessonFigure file={image} alt="A freshwater bass beside a four-string bass guitar" caption="One spelling can suggest a fish, an instrument or the difference between their pronunciations." />
      </div>
      <h3>Pick the right BASS board from a single memory</h3>
      <p>Suppose you remember a music puzzle with BASS and HARP. You can find both tiles together in two of these results. Open the groups one at a time. HORN and ORGAN complete the quartet in November 2023. BASSOON and RECORDER complete it in March 2024. Remembering even one of those instruments settles which puzzle you played.</p>
      <p>The two heteronym results reward a different memory. Perhaps someone at the breakfast table read WIND aloud as a breeze and another person heard it as the instruction on an old clock. That conversation points to puzzle #202. If the discussion was about whether DOES meant female deer or what somebody does, open #812.</p>
      <p>You can also stop at the dates. If you are sending a puzzle to someone who has never played it, follow the numbered link and share the dated board with its hints folded. Your friend gets the original challenge, and you avoid having to explain why four particular words belong together before they have even begun.</p>

      <h2 id="find-a-board">How to find a half-remembered puzzle</h2>
      <h3>Start with the tile you could quote</h3>
      <p>Imagine remembering a Beatles reference, something about bowling and a two-word place name. These memories have different jobs. The Beatles association helps you recall the lettering. Bowling is your memory of the solution. PENNY LANE is the actual tile and the strongest thing to type into the box. Open its dated result and look for the other words you recognize.</p>
      <p>If you remember KINGPIN as well, you have a second way to confirm the match. Look it up separately and compare puzzle dates. You can do this before revealing either category. Two remembered tiles appearing on the same day give you a much better lead than a general impression that the puzzle had something to do with music.</p>
      <h3>Use the smallest clue that distinguishes two dates</h3>
      <p>A useful detail can be surprisingly modest. For the two instrument groups above, “there was a keyboard instrument” is enough to identify the earlier board. “There was something my class learned to play at school” might bring RECORDER to mind and suggest the later one. Your clue can be personal as long as it leads back to something printed on the board.</p>
      <p>If the first result feels familiar, take a moment to check a second tile. A category can recur years later. The date beside a result belongs to the edition that contained that exact tile, and the numbered link takes you back to the full set of sixteen. That is where you can check a neighboring group or a memorable red herring.</p>

      <h2 id="nice">Reading NICE as praise, a city and a sound</h2>
      <h3>What did you hear when you read the tile?</h3>
      <p>Read NICE as a reaction to good news. In <Link href="/connections-hint/2024-06-05">puzzle #360</Link>, COOL, SICK and SWEET can all serve as enthusiastic responses. The tone of voice brings the four together. A later board, <Link href="/connections-hint/2024-09-21">#468</Link>, puts NICE beside IMPRESSIVE, PROPS and WELL DONE. Imagine saying each one to a friend who just finished a difficult job.</p>
      <p>Now open <Link href="/connections-hint/2026-03-08">puzzle #1001</Link>. LIMA, OSAKA and PHOENIX change how you read that same string of letters. Here Nice is the French city, pronounced roughly like “niece” in English. A puzzle board gives every tile capital letters, so the typography offers little help distinguishing an everyday adjective from a place name.</p>
      <h4>When both readings matter</h4>
      <p>In <Link href="/connections-hint/2025-04-02">puzzle #661</Link>, the partners are HERB, JOB and READING. Calling the group “French cities” would leave you with three awkward explanations. Try reading each tile once as an ordinary word and once as a proper name. JOB moves from employment to the Biblical name. READING can describe what you are doing or name an English town.</p>
      <p>Those three results make a useful listening exercise. Ask a friend to read NICE aloud with its partners hidden. Then read out one partner from a group and let them try again. A change in pronunciation may settle the city example. For the praise examples, the sound stays put and the speaker’s intention does the work.</p>

      <h2 id="spring">How SPRING changes jobs across the archive</h2>
      <h3>Trace a noun from a landscape to a machine</h3>
      <p>In <Link href="/connections-hint/2023-09-23">puzzle #104</Link>, FOUNTAIN, TAP and WELL are companions for SPRING. Think of places from which water flows. In <Link href="/connections-hint/2024-03-31">#294</Link>, the companions become MINERAL, STILL and TAP. Water still matters, but the question has changed. These are descriptions you might encounter when choosing water to drink. A familiar companion like TAP can survive the change in category.</p>
      <p>Open <Link href="/connections-hint/2024-05-04">#328</Link> and picture a lock taken apart on a workbench. The other pieces include a CYLINDER, a PIN and a TUMBLER. Here you could pick up the spring with your fingers. In <Link href="/connections-hint/2025-04-21">#680</Link>, a corkscrew and a piece of fusilli invite you to trace that same coil in the air. The physical object is familiar, while the relevant feature has shifted to its shape.</p>
      <h3>Try the tile as a verb</h3>
      <p>Another set places SPRING beside BOUND, LEAP and VAULT. Put “over the puddle” after each word and imagine the motion. You can use that little sentence to find <Link href="/connections-hint/2023-12-10">puzzle #182</Link> again. It also explains why saving a label like “spring means a season” would tell you very little about this board.</p>
      <h4>What a missing partner can supply</h4>
      <p>FUNKY, POPCORN, RUBBER and SPRING look peculiar side by side until you add CHICKEN after each. A spring chicken supplies an age expression, a rubber chicken suggests a comedy prop, and popcorn chicken belongs on a menu. All four complete the same blank in <Link href="/connections-hint/2026-03-02">puzzle #995</Link>. The absent word explains the solution, while SPRING is the search term that finds this appearance.</p>

      <h2 id="compare">How to compare two search results</h2>
      <h3>Follow one companion into another puzzle</h3>
      <p>Take FLUKE from the fish group in #395 and search for it on its own. In <Link href="/connections-hint/2025-05-19">puzzle #708</Link>, FLIPPER and BLUBBER point to the body of a whale. MELON looks strange until you recognize another anatomical term in that context. A memory of “something in the ocean” could describe both dates, but the companion words separate a list of fish from parts of an animal.</p>
      <p>You can take that comparison one step further in <Link href="/connections-hint/2025-12-17">#920</Link>. Cover the first letter of FLUKE and LUKE remains. LABEL leaves ABEL, MADAM leaves ADAM, and TRUTH leaves RUTH. Someone recalling the Biblical theme might naturally search for LUKE. To recover this particular tile through the finder, the initial F matters. The puzzle number is a handy bookmark once you have found it.</p>
      <h3>Recognize a repeated set even when its title changes</h3>
      <p>COMB, GEAR, SAW and ZIPPER appear together in <Link href="/connections-hint/2023-09-04">#85</Link> and <Link href="/connections-hint/2024-12-12">#550</Link>. Both groups depend on teeth. Searching COMB and seeing nearly the same result twice is an accurate reflection of the archive. Open the full boards to identify which one contains the other twelve tiles you remember.</p>
      <p>Try a small challenge before opening another result. Can you find an appearance of COMB where it names an action? Imagine searching every inch of a field, then look for three other verbs that could describe a careful search. <Link href="/connections-hint/2024-10-14">Puzzle #491</Link> lets you check your prediction. The everyday hair tool supplies the spelling, but changing its part of speech gets you to the explanation.</p>

      <h3>Does a word’s history predict its next group?</h3>
      <p>A list of appearances can give you ideas to test. With LEAD, two useful starting points are the heavy metal and the verb meaning to guide. In <Link href="/connections-hint/2023-07-16">puzzle #35</Link>, IRON, TIN and ZINC support the metal reading. In <Link href="/connections-hint/2023-11-16">#158</Link>, DIRECT, GUIDE and STEER all tell someone how to get somewhere or how to take charge. You can test those readings against a new board without opening an answer.</p>
      <p>A third result shows the limit of that approach. In <Link href="/connections-hint/2024-05-10">#334</Link>, a dog owner could take a LEAD on a walk. Try the metal and the verb here and neither helps explain why COLLAR, HALTER and HARNESS belong together. Spotting two of those companions is enough to send you looking for a piece of equipment.</p>
      <h4>Make a note you can test on another day</h4>
      <p>Choose two appearances and write one short question beside each. For the metal, ask whether the other three tiles could be entries on a periodic table. For the walking equipment, ask whether you could reasonably use each item when taking a dog outside. Both questions let a future board supply fresh evidence. A note that simply says “try LEAD with TIN again” works on far fewer puzzles.</p>
      <p>If you share your finding, include the puzzle number and the partner that changed your mind. “Look at LEAD beside HALTER in #334” gives another player a precise place to start. They can decide how much of the answer to reveal, then return to the finder and investigate a different appearance themselves.</p>

      <h2 id="search-help">What can I look up?</h2>
      <h3>Search a whole tile</h3>
      <p>Enter the word or multiword phrase as it appeared on the board. Uppercase and lowercase both work. A result records the group on that date, so keep its name folded if you want to replay the puzzle.</p>
      <p>Typing masked ball with extra spaces between the words still finds MASKED BALL. Typing BALL finds appearances of BALL as a complete tile. If a phrase contained a hyphen, keep it. Curly and straight apostrophes are treated alike, so you can copy a tile from a message without retyping its apostrophe.</p>
      <h3>What should I do with an empty result?</h3>
      <p>First ask whether your memory is of a printed word, a category title or a word you supplied to complete a phrase. If it is a title, go back to one of its four examples. If it is a word you said aloud, check whether a sound-alike was on the board. Even a singular ending can distinguish two tiles, so try the exact form you remember seeing.</p>
      <h3>Find a board another way</h3>
      <p>Have all sixteen words? The <Link href="/connections-solver">Connections solver</Link> can match the board. If you remember when you played, <Link href="/connections-hint">browse puzzles by date</Link>.</p>
    </article>
  </LessonPage>;
}

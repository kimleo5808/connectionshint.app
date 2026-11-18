import { LessonContents, LessonFigure, LessonTable } from "@/components/connections/lessons/LessonPage";
import lesson from "@/components/connections/lessons/lessons.module.css";
import type { FrequencyRow } from "@/lib/connections-word-frequency";
import { LEVEL_COLORS } from "@/types/connections";
import styles from "./frequency.module.css";

export function FrequencyGuide({ chart }: { chart: FrequencyRow[] }) {
  const scale = Math.max(1, ...chart.flatMap(row => row.colors));
  return <article className={lesson.article}>
    <LessonContents links={[
      ["ranking", "Read a frequency rank"], ["ring", "RING on three boards"],
      ["jack", "JACK in a different role"], ["color", "Compare group colors"],
      ["practice", "Try a blind comparison"], ["method", "What the archive counts"],
    ]} illustration={<LessonFigure file="/images/word-frequency-ring.webp"
      alt="A gold ring, rotary telephone and service bell on a wooden counter"
      caption="One spelling can name an object, describe a sound or tell someone what to do." />} />

    <h2 id="ranking">How often does a Connections word come back?</h2>
    <p>Start with all years and all four colors. The first row answers a precise question. It tells you which complete tile appears on the largest number of past puzzle dates in this archive. Open the row to see how those appearances divide among the colors. The three most recent dates give you somewhere to start reading.</p>
    <h3>Read the number beside the word</h3>
    <p>Imagine finding BALL twice in an old puzzle recap. A writer might say it in the introduction and repeat it in the explanation. Those mentions give BALL just one appearance here if it was actually a tile on that board. If the word appeared only in a category title, the recap contributes nothing to its count.</p>
    <p>The spelling matters. A masked ball is a ball, but MASKED BALL and BALL occupy different squares in the index. Type BALL into the filter and both spellings can surface if each has recurred in your selected range. Read the tile name before you compare their counts. The letters you enter can occur anywhere in it.</p>
    <h4>What a tie looks like</h4>
    <p>Two tiles on the same number of boards share a rank. If the first two tie, the next tile ranks third. Alphabetical order tells you where to find a word among its peers. Searching for part of its spelling leaves the rank in place, so the first result of a narrow search might be well outside the top ten.</p>
    <h4>Can a tile return the very next day?</h4>
    <p>BALL did. On <a href="/connections-hint/2025-01-03">January 3, 2025</a>, it appeared beside ARCH, HEEL and SOLE. You could point to each answer on a foot. On <a href="/connections-hint/2025-01-04">January 4</a>, it sat with CRUMPLE, SCRUNCH and WAD. Picture a loose sheet of paper in your hand and try each word as an instruction. The two adjacent dates give BALL as much weight in the ranking as two dates a year apart.</p>
    <h3>Change one filter at a time</h3>
    <p>Choose a year and leave the color open to see what recurred during that edition year. Then select blue. A word needs two blue appearances in that year to stay on the list. You can now answer two different questions about the same tile. Was it used repeatedly at all? Did the same color account for more than one of those uses?</p>

    <h2 id="ring">Three ways to read RING on a real board</h2>
    <p>Cover the group names in the table and look at the companions. With DIAL and PHONE on the table, read RING as something one person can do to reach another. With CHAIN and BANGLE in view, picture something you might take off before washing your hands. The change comes from the other squares. The tile itself supplies no signal that its job has changed.</p>
    <LessonTable caption="Three RING appearances you can check" headers={["Archive board", "Other three tiles", "Reading of RING"]} rows={[
      [<a key="phone" href="/connections-hint/2025-02-27">#627 · Feb 27, 2025</a>, "CALL, DIAL, PHONE", "Contact someone by telephone"],
      [<a key="jewel" href="/connections-hint/2025-12-03">#906 · Dec 3, 2025</a>, "BANGLE, CHAIN, CHARM", "A piece of jewelry"],
      [<a key="box" href="/connections-hint/2026-04-14">#1038 · Apr 14, 2026</a>, "BELL, GLOVES, ROUND", "The space for a boxing match"],
    ]} />
    <h3>Why two convincing words can mislead</h3>
    <p>BELL and RING make an especially tempting pair. Read them aloud and one seems to finish the thought started by the other. Now bring in GLOVES and ROUND from the same board. A doorbell supplies neither a standard pair of gloves nor a timed round. A boxing match gives each item a job you can explain without stretching the clue.</p>
    <p>Try replacing RING with one short definition in each row. “Call” works in the first. “Band” is closer in the second. In the third, a place makes more sense than either a call or a piece of jewelry. This little substitution exercise also reveals when your proposed category is too broad to rule anything out.</p>
    <h4>Can the same meaning come back?</h4>
    <p>Compare the two green finger groups on <a href="/connections-hint/2024-07-31">July 31, 2024</a> and <a href="/connections-hint/2026-10-02">October 2, 2026</a>. Both use LITTLE, MIDDLE and RING. The remaining tile changes from POINTER to INDEX. A higher count for RING records both dates. Someone counting different senses of the word would have good reason to put these two appearances together.</p>

    <h2 id="jack">JACK in the workshop, at the card table and on the menu</h2>
    <div className={lesson.spread}>
      <LessonFigure file="/images/word-frequency-jack.webp" alt="A playing card with a court figure, a steel scissor jack and a wedge of pale cheese"
        caption="Three things someone might mean by JACK. Give each object three companions of its own." />
      <div><h3>Identify the kind of list</h3>
        <p>Consider the JACK in <a href="/connections-hint/2024-05-02">puzzle #326</a>. CHOCK, TIRE and WRENCH place it beside a car with a flat. Try the narrower heading “tools.” A tire gives you trouble immediately. Describing the four as things used to fix a flat accommodates both the equipment and the part being handled.</p>
        <p>In <a href="/connections-hint/2025-05-25">puzzle #714</a>, ACE, KING and QUEEN put JACK in a deck of cards. In <a href="/connections-hint/2025-06-25">puzzle #745</a>, BLUE, GOAT and SWISS point to cheese. Both groups were yellow. Someone remembering the color alone would still have two quite different ways to finish the quartet.</p>
      </div>
    </div>
    <h3>Try a frame that fits every companion</h3>
    <p>For the cheese board, imagine ordering a slice of each kind at a counter. “Swiss cheese” and “goat cheese” sound ordinary. Jack fits once you supply the familiar name Monterey Jack. On the card board you can draw a jack, an ace, a king or a queen. The verb you choose can help you discover which sense of the noun you are using.</p>
    <h4>A fourth reading that the illustration leaves open</h4>
    <p>When BILLY, BUCK and RAM sit beside JACK, none of the pictured objects is much help. Here JACK names a male donkey. Check <a href="/connections-hint/2025-09-05">puzzle #817</a> and see what happens if you try “farm animals” as your heading. The shared detail about the sex of the animals explains the particular four names more precisely.</p>

    <h2 id="color">What colors tell you about a repeated word</h2>
    <p>RING and JACK make a tidy comparison in 2025. Look at their totals first, then follow each color across the two rows of the chart. Yellow accounts for more of one word’s appearances. Blue accounts for the same number in both. Counting colors makes a difference visible even when the overall number of dates looks identical.</p>
    <figure className={styles.chart}>
      <figcaption>Where RING and JACK appeared in 2025</figcaption>
      <table><thead><tr><th scope="col">Group</th>{chart.map(row => <th scope="col" key={row.word}>{row.word}</th>)}</tr></thead>
        <tbody>{Object.values(LEVEL_COLORS).map((color, index) => <tr key={color}>
          <th scope="row">{color}</th>{chart.map(row => <td key={row.word}>
            <div><span className={styles.barTrack} aria-hidden="true"><i data-color={color} style={{ width: (100 * row.colors[index] / scale) + "%" }} /></span>
            <strong>{row.colors[index]}</strong></div>
          </td>)}
        </tr>)}</tbody></table>
    </figure>
    <h3>A color belongs to a group on a date</h3>
    <p>Open the 2025 results for RING and compare the blue appearances in June and July. A crime ring is an organization. To ring at a front door is an action. Both groups carry blue in the archive. If you filed the word under a single “blue meaning,” one of these two boards would already be a counterexample.</p>
    <p>A zero in this chart has a narrow interpretation. It means that none of the included 2025 boards placed that spelling in that color. The archive can tell you what happened in that window. It cannot assign a color to the next puzzle where you meet the same word. Reopen all years if you want to see whether the zero survives a longer comparison.</p>
    <h4>Which denominator answers your question?</h4>
    <p>Three of RING’s six appearances in 2025 were yellow. That makes yellow half of the dates on which you saw RING that year. To work out how often you could have encountered a yellow RING while playing every eligible puzzle, divide three by the full puzzle count shown under the 2025 filter. Those two fractions answer different questions about the same three games.</p>

    <h2 id="practice">A five-minute exercise with two old puzzles</h2>
    <h3>Choose the word before you look at its categories</h3>
    <p>Pick a tile whose spelling you recognize and write two everyday uses of it. For PITCH, you might think about a singer trying to hit a note and a player throwing a ball. Give each use three possible companions. The choice of companions will tell you more about your guesses than the number of possible definitions you can recite.</p>
    <p>Open <a href="/connections-hint/2025-03-28">March 28, 2025</a> and <a href="/connections-hint/2026-03-17">March 17, 2026</a> with those guesses in mind. On the first date, CHUCK, PELT and SLING are alternative actions. They narrow the ballpark idea to the act of throwing. On the second date, KEY, SCALE and TONE name concepts you might discuss in a music lesson. Decide which of your proposed companions would actually belong.</p>
    <h4>Keep a note you can use again</h4>
    <p>For each date, record a companion that ruled out your first reading. Suppose you initially read PITCH as a sales presentation. SLING makes that reading difficult to sustain, even though you might pitch something to a customer. Keeping SLING next to the date gives you a concrete reason for changing your mind when you return to the board later.</p>
    <p>Trade notes with another player using only the date, the repeated word and one companion. Give your partner PITCH and KEY first. Once they have proposed a category, add SCALE. See whether they can name the remaining member before opening the puzzle. Then switch roles with a different dated appearance of PITCH. The ranking gives you a ready supply of pairs for this exercise.</p>
    <LessonTable caption="Choose a view for the question you have" headers={["Your question", "Where to look", "What to compare"]} rows={[
      ["Which tiles recur?", <a key="rank" href="#rankings">Frequency rankings</a>, "Number of distinct puzzle dates"],
      ["When did I see one exact tile?", <a key="finder" href="/connections-word-finder">Word finder</a>, "Dates, groups and companions"],
      ["What else was on that board?", <a key="archive" href="/connections-hint">Puzzle archive</a>, "All four groups for one date"],
    ]} />

    <h2 id="method">Which puzzles and spellings count?</h2>
    <h3>Where the dates come from</h3>
    <p>The ranking reads the classic daily Connections boards held in the Connections Hint archive. Each dated puzzle contributes once. The current New York edition stays out until its date has passed. The period printed above the ranking shows the first and last eligible dates for the year you have selected. Sports Edition and the original practice games on this site have separate boards.</p>
    <p>The date range matters when you compare two years. The 2023 archive begins in June. A year still in progress ends with the latest eligible past puzzle. A word can lead a shorter period on fewer appearances than it takes to lead a longer one. Use the displayed number of puzzles if you want to express a count as a share of that period.</p>
    <h3>How the index treats spelling and pictures</h3>
    <p>Capitalization, repeated spaces and typographic versions of an apostrophe are normalized before counting. Other meaningful spelling differences stay visible. A plural has its own entry, and a complete phrase gets a line of its own if it recurs. A search for part of a spelling can therefore return several lines. Each line still counts only the complete tile printed on it.</p>
    <p>Boards marked as picture editions are left out because an archive description of a drawing could introduce words the player never saw. A board made entirely of emoji also falls outside this index. On a mixed text board, an individual tile must contain at least one letter to qualify. A digit or standalone punctuation mark contributes no word appearance.</p>
    <h4>Check a surprising result</h4>
    <p>Open the word in the ranking and follow a dated puzzle link. Find the exact tile among its three companions and check the color. The full word history link opens a wider search across the archive, including dates outside your selected year. If you want to reproduce a filtered count, carry the year and color with you as you read those results.</p>
  </article>;
}

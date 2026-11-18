import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonContents, LessonFigure, LessonPage, LessonTable } from "@/components/connections/lessons/LessonPage";
import { GoldenPhrases, HiddenEndings } from "@/components/connections/lessons/LessonDiagrams";
import { PurpleDrill } from "@/components/connections/lessons/PurpleDrill";
import styles from "@/components/connections/lessons/lessons.module.css";
import { purpleLessons } from "@/data/connections/purple-drills";
import { getPuzzleByDate } from "@/lib/connections-data";
import { constructMetadata } from "@/lib/metadata";
import { LOCALES } from "@/i18n/routing";

const path = "/connections-practice/purple-groups";
const image = "/images/connections-purple-group-bowling.webp";

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return constructMetadata({ locale, page: "Purple groups", path, canonicalUrl: path,
    title: "NYT Connections Purple Groups to Practice",
    description: "Find the purple group first on real 16-word boards. Practice hidden words, sound-alikes, shared phrases and letter changes with optional hints.",
    keywords: ["NYT Connections purple groups", "purple Connections practice", "purple Connections examples"], images: [image] });
}

export default async function PurplePracticePage() {
  const boards = await Promise.all(purpleLessons.map(lesson => getPuzzleByDate(lesson.date)));
  const drills = purpleLessons.flatMap((lesson, index) => {
    const board = boards[index];
    return board ? [{ ...lesson, board }] : [];
  });
  if (!drills.length) notFound();
  return <LessonPage parent={{ label: "Practice mode", path: "/connections-practice" }} path={path} tone="purple"
    guidePreview={{ file: "/images/purple-anagram-instruments.webp", label: "Anagrams into instruments", anchor: "instrument-anagrams" }}
    title="NYT Connections purple groups"
    intro="Pick four tiles to find purple first.">
    <PurpleDrill drills={drills} />
    <article className={styles.article}>
      <LessonContents links={[["spot", "Read the board"], ["endings", "Hidden endings"], ["phrases", "Build a phrase"], ["sound", "Hear a second spelling"], ["letters", "Change or rearrange letters"], ["choice", "Choose a group"]]}
        illustration={<LessonFigure file="/images/purple-meaning-of-keys.webp" alt="Piano keys, a brass key and a pair of islands connected by a bridge" caption="In puzzle #8 the word “keys” connects a piano, a locksmith and Florida." />} />
      <h2 id="spot">How to spot a purple group</h2>
      <p>Pick a tile that feels unusually specific. A two-word name, an odd spelling or a word with several pronunciations gives you something concrete to test against the rest of the board.</p>
      <h3>Look at word endings</h3>
      <p>Start at the last letter and read back until you have a short word. Try that on another tile. The endings can have different lengths and still share a theme.</p>
      <details><summary>Open the worked example from puzzle #1255</summary>
        <div className={styles.spread}>
          <div>
            <h4>How VALLEY hides ALLEY</h4>
            <p>VALLEY looks like a landform. Cover the V and you get ALLEY. Now look at the ends of KINGPIN, MASKED BALL and PENNY LANE. PIN, BALL, LANE and ALLEY all belong in a bowling group.</p>
            <p>Try saying each whole phrase first, then just its ending. PENNY LANE can pull you toward music until you hear LANE on its own.</p>
          </div>
          <LessonFigure file={image} alt="A purple bowling ball rolling along a lane toward white pins" caption="Pin, ball, lane and alley are the four words hidden at the ends of these tiles." />
        </div>
      </details>
      <h3>Test both sides of a shared phrase</h3>
      <p>Say a possible partner word before each tile, then after it. All four phrases need to work in the same direction. The <Link href="/connections-patterns/fill-in-the-blank">fill-in-the-blank guide</Link> has another worked example.</p>
      <h3>Listen for a different spelling</h3>
      <p>Read an odd-looking tile aloud. If its sound suggests a familiar object, try to turn three more tiles into objects of the same kind. Use the sound-alikes set above to isolate that skill.</p>
      <h3>Change one letter consistently</h3>
      <p>Keep the same position in all four words. If your first two candidates need a new initial, try changing the initial of a third before spending a guess. For a whole game across all four colors, open <Link href="/connections-practice">classic practice mode</Link>.</p>
      <h3>Give the oddest tile a partner</h3>
      <LessonTable caption="Four ways to test an unusual tile" headers={["Technique", "Try this", "Archive example"]} rows={[
        ["Hidden ending", "Read from the right edge.", <span key="end">BEL<strong>FAST</strong></span>],
        ["Shared phrase", "Put one word before each tile.", "Golden rule"],
        ["Sound-alike", "Say it aloud.", "WON → one"],
        ["Letter change", "Remove a letter.", "FAIR → FIR"],
      ]} />
      <p>On a fresh board, read all sixteen tiles before selecting any. Then pick the one you would have the hardest time explaining to somebody else. A long compound, a short everyday verb or a strangely particular name can all be good starting points. Find a second tile on which you can perform the same operation. That pair gives you a hypothesis you can actually test.</p>
      <p>For instance, suppose the first word ends in a color. Check whether a second one ends in a different color. If your next candidate merely reminds you of a colorful object, put it aside. You have already learned something about the boundary of your proposed group, even if you end up dropping it entirely.</p>

      <h2 id="endings">Where to look for words inside longer tiles</h2>
      <HiddenEndings />
      <h3>Read from the last letter backward</h3>
      <p>Try <Link href="/connections-hint/2026-05-16">puzzle #1070</Link> as a worked example away from the practice set. BASSOON is a musical instrument and BELFAST is a place. Their ordinary meanings take you in different directions. Read just their right edges and you can find SOON and FAST. Now you have two ways to suggest urgency and a reason to keep searching the board.</p>
      <p>NESQUICK supplies QUICK. THERMOSTAT supplies STAT, the brisk instruction to do something immediately. Each extracted word ends on the final letter of its tile. The cuts fall in different places. Trying to remove a fixed number of letters would make a good solution look inconsistent, even though the actual rule holds for every member.</p>
      <h4>What makes a hidden ending convincing?</h4>
      <p>Ask two questions. Can you point to the exact letters you are reading? Do the pieces you have kept belong to a category you can name? Nearly any long word contains a short word somewhere inside it. Requiring a shared position and a shared meaning gives you a much sharper test than simply circling anything familiar.</p>
      <h3>When the endings share a spelling property</h3>
      <p>In <Link href="/connections-hint/2026-11-11">puzzle #1249</Link>, the end of AFTERNOON gives you NOON. RHEOSTATS ends with STATS. Say them aloud and you will hear little in common. Write them down and read each one backward. Both are palindromes. That observation tells you what to look for in PATOOT and SHREDDER, even if those two struck you as unlikely partners on a first reading.</p>
      <p>Try drawing a vertical line in each full word where its palindrome begins. You get TOOT from PATOOT and REDDER from SHREDDER. A good dividing line leaves every letter of the short word in order. This pencil exercise is especially helpful when a word has repeated letters that make its boundary hard to see on a small screen.</p>

      <h2 id="phrases">Build the same phrase four ways</h2>
      <h3>Use the distinctive pair to supply the missing word</h3>
      <GoldenPhrases />
      <p>FLEECE, GIRLS, PARACHUTE and RULE form a purple group in <Link href="/connections-hint/2024-04-18">puzzle #312</Link>. Start with the combination you recognize most readily. If “golden rule” comes to mind, put GOLDEN before each of the other tiles. The Golden Fleece belongs to a story, The Golden Girls is a television title, and a golden parachute is a financial expression. Their subject matter wanders, but the placement is consistent.</p>
      <p>If PARACHUTE was your first anchor, you might initially think of things that open. Test that idea against FLEECE and RULE. Neither gives you a clean example. A phrase that neatly explains a difficult pair offers more to work with than an association that opens up dozens of possibilities for a single tile.</p>
      <h4>Check that the partner stays on the same side</h4>
      <p>Write the missing word on a slip of paper and place each candidate beside it. In <Link href="/connections-hint/2024-04-07">puzzle #301</Link>, CHARLEY, CRAZY, DARK and GIFT all take HORSE after them. A dark horse and a gift horse belong to very different expressions. If you can move the same slip along the row without changing sides or adding a small linking word, your candidate group holds together.</p>
      <h3>Let one unfamiliar phrase remain provisional</h3>
      <p>You may know three expressions and have never heard the fourth. Set the uncertain tile beside the other three and look for a rival on the board. With the horse example, “charley horse” is a phrase for a muscle cramp. Someone who usually calls it a cramp can still reach the answer through the other phrases and then learn why the last one fits.</p>

      <h2 id="sound">Hear a second spelling behind the printed tile</h2>
      <h3>Read once for meaning and once for sound</h3>
      <p>In <Link href="/connections-hint/2023-09-20">puzzle #101</Link>, the four spoken sounds behind ATE, FOR, TOO and WON are eight, four, two and one. ATE and WON look like past-tense verbs. That observation is perfectly sound until FOR and TOO enter the picture. Saying the words in a different order can help your ear notice the counting words before your eyes settle on parts of speech.</p>
      <p>Cover the printed tiles and ask a friend to read them aloud. Which spellings would you write down if you had only the sound? This is an unusually effective drill for short words because familiarity can make their first spelling feel inevitable. Restore the printed version afterward so you can explain both halves of the trick.</p>
      <h3>Distinguish a rhyme from a homophone</h3>
      <LessonTable caption="Hear the difference in two archived puzzles" headers={["Sound rule", "Printed tile", "What you hear"]} rows={[
        [<Link key="101" href="/connections-hint/2023-09-20">Homophone · #101</Link>, "ATE", "Eight"],
        [<Link key="900" href="/connections-hint/2025-11-27">Rhyme · #900</Link>, "SWELLING SEA", "Spelling Bee"],
      ]} />
      <p>A homophone can substitute for the sound of the whole word. A rhyme shares an ending and leaves room for a different beginning. Compare the number board with <Link href="/connections-hint/2025-11-27">puzzle #900</Link>. There, HURDLE points toward Wordle and SWELLING SEA toward Spelling Bee. The longer title gives you the rhythm as well as an ending to listen for.</p>
      <p>Once you hear one match, try saying the whole tile and its proposed partner in quick succession. The rest of that group includes GRANDS and CONFECTIONS. They suggest Strands and Connections. A grid full of apparent synonyms can hide an entirely different family of words that emerges only when you stop reading silently.</p>

      <h2 id="letters">Decide which letters you are allowed to change</h2>
      <h3>Remove a letter and read what survives</h3>
      <p>In <Link href="/connections-hint/2026-02-02">puzzle #967</Link>, FAIR, MARPLE, POPULAR and PSALM disguise trees. Remove A from FAIR to uncover FIR. Remove R from MARPLE to uncover MAPLE. Notice what you can preserve from your first success. The operation stays the same, but the extra letter and its position are free to change.</p>
      <p>Work through the other two slowly. POPULAR becomes POPLAR once U disappears. PSALM becomes PALM once S disappears. Someone scanning only the beginning or end of each tile would have little reason to put these four together. Finding two convincing trees gives you permission to test the interior letters of the other candidates one at a time.</p>
      <h4>When a promising word has too many letters left</h4>
      <p>Write down exactly what you crossed out. If your first example removes one letter and your fourth requires two deletions and a spelling change, set the fourth aside. That mismatch is a useful clue. Another tile may satisfy the narrower rule, or your entire group may depend on a different operation such as rearranging all the letters.</p>
      <h3 id="instrument-anagrams">Keep every letter for an anagram</h3>
      <div className={styles.spread}>
        <LessonFigure file="/images/purple-anagram-instruments.webp" alt="A tuba, bugle and viola with its bow on lavender paper" caption="ABUT, BULGE and VOILA rearrange into three instruments in puzzle #780." />
        <div>
          <p>In <Link href="/connections-hint/2025-07-30">puzzle #780</Link>, ABUT becomes TUBA when rearranged. BULGE becomes BUGLE. Try GROAN on a piece of paper, crossing off each letter as you use it. ORGAN accounts for all five. VOILA becomes VIOLA. The two longer names may be easier to hear once the first pair has suggested musical instruments.</p>
          <p>For a fresh test of the same skill, try <Link href="/connections-hint/2024-11-07">puzzle #515</Link>. MONTE can become MONET and YOGA can become GOYA. Here the destination is a family of painters. Separating the mechanical step, rearranging letters, from the knowledge step, recognizing names, helps you see exactly where you need a hint.</p>
        </div>
      </div>
      <h2 id="choice">How to choose between two plausible purple groups</h2>
      <h3>Check what the leftover words would have to do</h3>
      <p>Imagine finding three musical terms and a fourth tile that needs an elaborate explanation. Before committing, scan the twelve words you would leave behind. If that fourth tile is also a straightforward member of another quartet, park it there temporarily. Try the purple rule on the tile that takes its place. You can compare the two arrangements without spending a guess.</p>
      <p>Sometimes the shared idea is broader than a spelling trick. In <Link href="/connections-hint/2023-06-19">puzzle #8</Link>, PIANO, FLORIDA, CRYPTOGRAPHY and LOCKSMITH all lead to keys. Picture a keyboard, the Florida Keys, an encryption key and a key in a lock. One familiar word ties together four different contexts. Spelling transformations would be a long detour on this particular board.</p>
      <h3>Make the review useful for your next board</h3>
      <p>After checking a group, pick the tile that cost you the most time. Reconstruct your first reading and the precise detail that changed it. “I kept hearing an instrument until I saw SOON at the end of BASSOON” is a more useful note to revisit than copying down four answers. It tells you what to try the next time a musical name turns up in an unlikely place.</p>
      <p>Use a technique set when you want to work on one particular blind spot. Use the mixed set when choosing the technique is itself the part you find difficult. On your next attempt, pause once before asking for a hint and name the operation you are about to test. Whether the guess works or fails, you will know what you just learned.</p>
    </article>
  </LessonPage>;
}

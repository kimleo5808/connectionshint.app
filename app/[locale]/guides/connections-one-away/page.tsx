import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonContents, LessonFigure, LessonPage, LessonTable } from "@/components/connections/lessons/LessonPage";
import { GuessPatterns } from "@/components/connections/lessons/LessonDiagrams";
import { SwapComparison } from "@/components/connections/lessons/SwapComparison";
import { OneAwayDemo } from "@/components/connections/lessons/OneAwayDemo";
import styles from "@/components/connections/lessons/lessons.module.css";
import { getPuzzleByDate } from "@/lib/connections-data";
import { constructMetadata } from "@/lib/metadata";
import { LOCALES } from "@/i18n/routing";

const path = "/guides/connections-one-away";
const image = "/images/connections-one-away-bee-and-lemon.webp";

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return constructMetadata({ locale, page: "One Away", path, canonicalUrl: path,
    title: "What Does One Away Mean in NYT Connections?",
    description: "Try a real One Away guess. Swap a tile, see which guesses still miss, and learn what three matching words tell you about the fourth.",
    keywords: ["what does one away mean in NYT Connections", "Connections one away twice"], images: [image] });
}

export default async function OneAwayPage() {
  const board = await getPuzzleByDate("2026-11-18");
  if (!board) notFound();
  return <LessonPage parent={{ label: "Puzzle guides", path: "/guides" }} path={path} tone="swap"
    guidePreview={{ file: "/images/one-away-sub.webp", label: "The submarine trap", anchor: "other-board" }}
    title="What does “One Away” mean in NYT Connections?"
    intro="Three of your four selected words belong to the same group. The game leaves you to figure out which tile to swap.">
    <OneAwayDemo groups={board.answers} />
    <article className={styles.article}>
      <LessonContents links={[["bee-guess", "Read the first guess"], ["count", "Count the matches"], ["twice", "Compare two swaps"], ["other-board", "Try another board"], ["last-life", "Choose your next move"], ["quiz", "Test your reasoning"]]}
        illustration={<LessonFigure file={image} alt="A bee hovering over honeycomb beside a yellow lemon" caption="Honeycomb and a lemon both suggest yellow. Only one is something bees make." />} />
      <h2 id="bee-guess">Why did this guess get “One Away”?</h2>
      <p>HONEY, BUZZ, COMB and YELLOW all bring a bee to mind. To test the guess, try finishing the same sentence with each tile. A bee produces honey, a buzz and comb. The sentence breaks down at yellow.</p>
      <h3>Why YELLOW feels right</h3>
      <p>YELLOW describes how a bee looks. Elsewhere on the board it fits a lemon, alongside JUICY, OVOID and SOUR. A convincing association can still leave a word with a better home.</p>
      <h4>Which swap completes the group?</h4>
      <p>Replacing YELLOW with VENOM gives the four things bees produce. Try the swap above, or open the full board from <Link href="/connections-hint/2026-11-18">puzzle #1256</Link>.</p>
      <h2 id="count">Which combinations produce the message?</h2>
      <GuessPatterns />
      <h3>Count membership in the puzzle’s four groups</h3>
      <p>Think of the four words in your guess as four seats at a table. If three seats belong to one answer group and the fourth belongs somewhere else, you get One Away. You would receive the same message with the odd word in the first seat. The order in which you selected the tiles gives you no clue about which one to move.</p>
      <p>Take JUICY, SOUR, YELLOW and HONEY on this board. Three describe a lemon, and HONEY belongs with the things bees produce. This selection earns exactly the same feedback as the starting guess in the demo, even though it is close to a different solution. Only the words you selected and their actual group memberships determine the result.</p>
      <h3>What does a miss without the message tell you?</h3>
      <p>Try HONEY, COMB, SOUR and YELLOW. Honey and comb share the bee group while sour and yellow share the lemon group. You have found two useful pairs, and neither supplies a trio. This guess misses without a One Away message. It is worth keeping those pairs in mind when you scan the unused words.</p>
      <p>A plain miss can also come from four different groups. DIJON, FRENCH, HONEY and YELLOW make an especially persuasive guess if you are thinking about mustard. On this board DIJON is a city, FRENCH goes before FRY, HONEY comes from bees and YELLOW describes a lemon. A shared association can be clever and still distribute your tiles across all four solutions.</p>
      <h4>Can one selection be one away from two groups?</h4>
      <p>No. Each tile occupies one place in the answer key. A single four-tile guess would need three members of one group and three of another for both groups to be one word short. That would take six places. A word can suggest several ideas to a player, but it has only one assigned group when the game checks the guess.</p>

      <h2 id="twice">What if you get “One Away” twice?</h2>
      <LessonTable caption="Compare one change to the opening guess" headers={["Swap", "Feedback", "What changed"]} rows={[
        ["YELLOW → SOUR", "One away", "All three bee tiles stay in the hand."],
        ["HONEY → VENOM", "One away", "A new bee tile replaces an old one."],
        ["BUZZ → DIJON", "Miss", "The bee trio loses a member."],
        ["YELLOW → VENOM", "Solved", "All four tiles name things bees produce."],
      ]} />
      <h3>Keep track of the word you changed</h3>
      <p>Replace YELLOW with SOUR in the starting guess. HONEY, BUZZ and COMB still belong together, so you see the same feedback. That second message alone cannot tell you which three words match.</p>
      <h3>Test the three you kept</h3>
      <p>Reset the example and replace HONEY with VENOM. You get the same message again, this time because BUZZ, COMB and VENOM match. The word you added can be correct even when the guess still misses.</p>
      <h3>The two explanations for another near miss</h3>
      <p>Write down the three words that stayed and the two words that traded places. In one possible explanation, all three stationary words belong together. Both the outgoing and incoming tiles are outsiders. In the other explanation, only two stationary words belong together. The outgoing tile and its replacement both fit those two, while the third stationary tile is the outsider.</p>
      <p>There is a useful detail hidden in that second explanation. If two guesses differ by exactly one tile and both get One Away, they were close to the same group. A different group would also need at least two members among the three words you kept. There is room for only one pair of a single group alongside one outsider, or for three members of one group.</p>
      <h4>What changes if the message disappears?</h4>
      <p>Reset to HONEY, BUZZ, COMB and YELLOW. Take out BUZZ and put in DIJON. The new guess has two bee words, a lemon descriptor and a city. Losing the message tells you something definite about the old guess. If the three stationary words had formed the original trio, keeping them would have preserved the message. BUZZ was part of the trio you broke.</p>
      <p>That inference works even if you have no idea what the category is called. Mark the removed tile as a member of the original near match. Study the three you kept and look for the two that go with it. If you changed two tiles between guesses, the comparison no longer isolates one departure, so save the full old selection before drawing a conclusion.</p>

      <h2 id="other-board">Three archive puzzles where a tempting fourth word fails</h2>
      <div className={styles.spread}>
        <LessonFigure file="/images/one-away-sub.webp" alt="A navy submarine and a long submarine sandwich shown side by side" caption="In puzzle #33, SUB looks at home with boats until CLUB, CUBAN and MELT turn up." />
        <div>
          <h3>A submarine can sail straight into the sandwich group</h3>
          <p>In <Link href="/connections-hint/2023-07-14">puzzle #33</Link>, try reasoning through FERRY, TUG, YACHT and SUB. You can picture all four on the water. The intended boat group has JUNK as its fourth member, in the sense of a sailing vessel. SUB belongs alongside CLUB, CUBAN and MELT. Think of ordering lunch and each of those four acquires a different sort of context.</p>
          <p>Here a more precise definition of SUB will take you only so far. It really can stand for a submarine. The stronger test is to complete both candidate groups on paper. Moving SUB to the sandwich group gives three other tiles a clear match. Bringing JUNK back to the boats accounts for all eight words at once.</p>
        </div>
      </div>
      <h3>A computer can lend a file to the wrong quartet</h3>
      <p>In <Link href="/connections-hint/2025-11-27">puzzle #900</Link>, select DESKTOP, DOCUMENTS, DOWNLOADS and FILES in your head. FILES feels particularly safe because all the other words can be found on a computer. Look again at DRILLS, ROUTERS and SAWS. A file becomes a workshop tool in their company. MUSIC is the folder you can put in the computer group in its place.</p>
      <p>This board rewards attention to the level of detail in your category. “Things on a computer” admits far too many possibilities. “Names of main folders” makes a smaller promise that you can check tile by tile. That narrower description creates a reason to look for MUSIC, even if the first connection you saw was between files and documents.</p>
      <h3>Bowling has a genuine extra candidate</h3>
      <p>Consider ALLEY, BALL, PIN and SPARE in <Link href="/connections-hint/2023-09-20">puzzle #101</Link>. A bowler could explain every selection. Look elsewhere and SPARE also completes a group with BACKUP, COPY and EXTRA. LANE completes the bowling quartet. The feedback means your proposed allocation misses the published one by a single tile, even when a specialist could defend your original reading.</p>
      <p>Compare this with the bee board. “Things bees produce” resolves the ambiguity in the wording of the group itself. The bowling board asks you to use another group to break the tie. When you have argued yourself into five good candidates, looking outside the group can do more for you than finding a fifth reason why all five fit.</p>

      <h2 id="last-life">How to choose your next move with one mistake left</h2>
      <h3>Give the least certain tile a second home</h3>
      <p>Start with the tile for which your explanation takes the most words. In the bee guess, you can say “bees produce a buzz” in a breath. Explaining YELLOW requires a shift from what bees make to what they look like. Now see whether the board offers a more direct home for the color. Sour and juicy give you a concrete place to investigate.</p>
      <p>On a different board, your most familiar word may deserve the closest look. SUB and SPARE are easy to explain immediately, which makes them easy to overlook when a guess fails. Put each into a second sentence using a completely different sense. Then search the remaining tiles for words that would naturally appear in that sentence.</p>
      <h3>Choose between two repairs before submitting either</h3>
      <p>Write the original four on one line. On a second line, cross out a single word and pencil in its replacement. For each repair, name the group, explain the new fourth member, and say where the displaced word might go. A repair that leaves you with a second plausible quartet gives you two independent reasons to favor it.</p>
      <p>If both repairs still sound equally good, try solving a group that uses none of the disputed words. Clearing four tiles can narrow the choice without spending a guess on the original uncertainty. The demo above lets you test as many swaps as you like. When you go back to a daily board, you can do that exploratory work mentally.</p>
      <h3>With eight tiles left, examine the other four</h3>
      <SwapComparison />
      <p>Suppose you have already solved the French cities and the FRY group. Eight tiles remain. Put HONEY, BUZZ, COMB and YELLOW on one side of a sheet of paper. On the other side write JUICY, OVOID, SOUR and VENOM. The first set is one away from the bee group. Because only two groups remain, the second set must also be one away from its own solution.</p>
      <p>Read the second set aloud. The leap from the lemon descriptions to VENOM may be much easier to hear than the leap from bees to YELLOW on the first side. Exchange the two outsiders on paper and read both groups again. One swap repairs both quartets. This shortcut depends on having exactly two groups left. Earlier in the puzzle, the twelve tiles outside your guess can divide up in many more ways.</p>

      <h2 id="quiz">Can you predict these three outcomes?</h2>
      <div className={styles.quiz}>
      <h3>How many of these words name French cities?</h3>
      <p>Consider CANNES, DIJON, NICE and FRENCH. The language association feels almost too obvious. Count only actual cities and you have three. The board therefore returns One Away. Replacing FRENCH with TOURS completes the quartet, even though TOURS also looks like an English travel word on an all-capitals tile.</p>
      <h3>What happens when a second lemon word enters?</h3>
      <p>Start with HONEY, BUZZ, COMB and SOUR. Replace COMB with YELLOW. Now you have two products of bees and two descriptions of lemons. Predict the feedback before you try it in the demo. The disappearance of One Away lets you recover one fact about the first guess even without looking up the answer key.</p>
      <h3>Can “fry” change meaning between tiles?</h3>
      <p>Group DEEP, FRENCH, SMALL and VOCAL. Read the word “fry” after each one, allowing its meaning to change. French fry names a food, small fry can refer to somebody unimportant, and vocal fry describes a way a voice sounds. This set completes a group. The shared feature is the word that follows each tile, so the difference in meanings is part of the solution.</p>
      </div>
      <p>Use <Link href="/connections-practice">a full practice board</Link> to try this with a fresh set of words. For other kinds of overlap, see <Link href="/connections-patterns/common-traps">common Connections traps</Link>.</p>
    </article>
  </LessonPage>;
}

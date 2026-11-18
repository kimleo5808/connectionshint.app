import { LessonContents, LessonFigure, LessonTable } from "../lessons/LessonPage";
import lesson from "../lessons/lessons.module.css";
import styles from "./timed.module.css";

const example = [
  { label: "Green", interval: 24, elapsed: "0:24.0" },
  { label: "Yellow", interval: 38, elapsed: "1:02.0" },
  { label: "Purple", interval: 17, elapsed: "1:19.0" },
  { label: "Blue", interval: 7, elapsed: "1:26.0" },
];

export default function TimedGuide() {
  return <article className={lesson.article}>
    <LessonContents links={[["splits", "Read a split sheet"], ["start", "Your first timed run"], ["cake", "The POUND decision"], ["wax", "The SEAL decision"], ["replay", "Compare two runs"], ["records", "Times and records"]]}
      illustration={<LessonFigure file="/images/timed-connections-stopwatch.webp"
        alt="A mechanical stopwatch and a pencil on a timekeeper’s score pad" caption="Every correct submission marks a split. Four completed groups give you a finish time." />} />

    <h2 id="splits">What does a Connections split time tell you?</h2>
    <p>Imagine finishing a board in one minute and twenty-six seconds. You remember spotting an easy pair right away and staring at a strange word in the middle. The finish time alone cannot tell you where the seconds went. The split sheet marks the moment each group was accepted, so you can go back to the part of the solve you remember.</p>
    <h3>Read the interval and the elapsed time together</h3>
    <p>Elapsed time starts with the button that uncovers the board. An interval starts at the previous correct submission, or at the start of the run for the first group. On the illustrative sheet below, green landed at twenty-four seconds. Yellow landed at one minute and two seconds. Subtract those two readings and you get thirty-eight seconds between the groups.</p>
    <figure className={styles.figure}><figcaption>How an example 1:26.0 finish breaks down</figcaption>
      <ol>{example.map(({ label, interval }) => <li key={label}><strong>{label}</strong><span aria-hidden="true"><i style={{ width: (100 * interval / 38) + "%" }} /></span><b>{interval} s</b></li>)}</ol>
    </figure>
    <p>The long bar invites a question. Did you spend thirty-eight seconds considering the yellow words, or were you trying an entirely different group when yellow came into view? Both stories produce the same line on the sheet. Spend a moment remembering the guess before it. Pairing the numbers with one concrete decision makes a replay much more interesting.</p>
    <h4>How a wrong guess appears on the clock</h4>
    <p>A mixed guess uses a mistake and the stopwatch keeps running. The next correct group gets a split that includes the time spent choosing the mixed four, reading the feedback and rearranging them. There is no fixed time penalty to subtract afterward. The result grid can show where the mixed guess occurred if you want to reconstruct that interval.</p>
    <p>Here is a quick check you can do on the example. Cover the elapsed column except for the finish and add up the four bars. Twenty-four and thirty-eight take you to sixty-two seconds. Seventeen more makes seventy-nine, and the last seven brings you to eighty-six. You have recovered the whole run, including any time spent on unsuccessful guesses between those marks.</p>
    <LessonTable caption="Read this example from top to bottom" headers={["Group solved", "Interval", "Elapsed"]} rows={
      example.map(row => [row.label, row.interval + " seconds", row.elapsed])
    } />

    <h2 id="start">How to start a timed Connections run</h2>
    <p>Choose a puzzle by number, press Open, then start the timed board when you are ready to read. The sixteen tiles become available together. The selector is outside the timed part, so you can pick the same number as a friend before either person sees the words. A new round opens with the words in alphabetical order.</p>
    <h3>Give yourself one pass across the board</h3>
    <p>Read each tile once, even when an appealing pair shows up near the top left. Two words can agree on a link that appears nowhere else in the puzzle. As you move on, hold onto a short description such as “things in a kitchen drawer.” When a third and fourth example appear, you will know what question to ask about them.</p>
    <h3>Check the weakest member first</h3>
    <p>Before submitting, choose the tile you would have the hardest time explaining to another person. Say what it shares with the other three. If the answer requires a second meaning halfway through the sentence, leave that tile out for a moment. One quick check here can save an entire round of guessing which member to swap after a near miss.</p>
    <h4>Keep your place after a shuffle</h4>
    <p>Shuffle changes where the remaining tiles sit on screen. Use it when your eyes keep following the same row, perhaps reading two neighbors as a phrase because they happen to be side by side. Name the pair you wanted to keep before shuffling. Finding those two words again gives you an anchor while a different set of neighbors comes into view.</p>

    <h2 id="cake">A worked decision from puzzle #68</h2>
    <p>The next two worked examples discuss the answers to puzzles #68 and #224. If you would like a first attempt at either one, open <a href="?board=68#timer">the timed #68 board</a> or <a href="?board=224#timer">the timed #224 board</a> before reading on. These boards are useful to compare because their most tempting words can each be defended in more than one way.</p>
    <div className={lesson.spread}>
      <LessonFigure file="/images/timed-connections-pound.webp" alt="A slice of pound cake, British coins and an iron balance weight"
        caption="POUND can send you to the bakery, a currency exchange or a scale. Test which scene has four tiles on this board." />
      <div><h3>Why POUND is expensive to guess early</h3>
        <p>POUND fits comfortably beside words about measurement and money. Look first at CUP, PINT, QUART and GALLON. You could fill four containers to compare those quantities. A pound of flour answers a different question from a cup of flour. Moving POUND out of this set gives you a tighter heading and a complete group ready to submit.</p>
        <p>Now consider RAND, REAL, STERLING and WON. All four are currency names. POUND could plausibly join them, especially when STERLING brings the phrase “pound sterling” to mind. You can settle the question elsewhere on the board. Say CARROT, COFFEE and SPONGE with the same word after each. Try POUND in that frame and listen for a familiar fourth cake.</p>
      </div>
    </div>
    <h4>What to remember from this split</h4>
    <p>If the currency decision took most of the run, write down the competing uses of POUND while you can still remember them. On the next unfamiliar board, look out for the moment when you already have four good candidates and a fifth appears. Checking that fifth candidate against a second cluster can resolve two groups with one decision.</p>
    <p>For a partner exercise, let one person argue for POUND as currency while the other explains the cake group. Both can support their claims. Ask each person what would become of the unused tile after their choice. This moves the discussion away from who knows the most definitions and back to the practical job of placing all sixteen tiles.</p>

    <h2 id="wax">A different fork in puzzle #224</h2>
    <p>Imagine uncovering SEAL and NOSE in the same quick scan. A seal has a nose, so the two words immediately conjure up an animal. Look a little farther and you will also see EAR and HEAD. Anatomical words have begun to collect around an entirely reasonable picture. Now ask whether each tile actually names the same kind of thing in that picture.</p>
    <LessonTable caption="Three checks on the January 21, 2024 board" headers={["Anchor", "Check it beside", "Shared description"]} rows={[
      ["SEAL", "CANDLE, CRAYON, HONEYCOMB", "Each can be made of wax."],
      ["NOSE", "CABIN, ENGINE, WING", "Parts of an airplane."],
      ["EAR", "BULB, HEAD, STALK", "Units used for vegetables."],
    ]} />
    <h3>Switch from a scene to a phrase</h3>
    <p>Put “of corn” after EAR and “of celery” after STALK. An ear of corn and a stalk of celery are quantities you could put on a shopping list. A bulb of garlic and a head of lettuce use the same construction. Once those four sit together, NOSE has fewer rivals and its place alongside WING becomes easier to see.</p>
    <h4>Explain the wax with one object</h4>
    <p>Picture a letter closed with a blob of wax and the impression of a stamp. That seal shares its material with a candle, a crayon and a honeycomb. Simply saying “a seal is an animal” would send you away from that heading. Finding a particular seal you could draw gives you a second reading clear enough to test against three other tiles.</p>
    <p>After the round, open the <a href="/connections-hint/2024-01-21">full #224 board</a> and try covering each group title before reading its four members aloud. Which group can you name in a sentence? Which one still requires an example? The answer often explains why a group that looked quick on the split sheet felt harder when you first saw it.</p>

    <h2 id="replay">How to compare a first solve with a replay</h2>
    <p>Keep the first attempt on a puzzle separate in your notes. On a replay you may remember the category before you have read its fourth member. That can be exactly what you want to practice. It also changes what the finish time measures. Record the puzzle number and whether you recognized the answers when you compare times with another player.</p>
    <h3>Follow the same group through both runs</h3>
    <p>Suppose green was the first group you saw on your first attempt and the third on your second. Comparing the first line of each sheet would now compare different decisions. Find the color in both lists and look at which groups had already left the board. An eight-tile search and a sixteen-tile search give that familiar green group different neighbors.</p>
    <h4>Try a fresh board for the transfer test</h4>
    <p>After a replay, carry just one habit into a new puzzle. On <a href="?board=44#timer">puzzle #44</a>, for instance, try spelling a stubborn tile aloud before committing a fourth word. Resist the urge to study its archive page first. After the run, decide whether thinking about letters actually helped you recognize a group that a definition alone would have missed.</p>
    <p>Two players can use the same numbered link on separate screens. Agree whether you are both seeing it for the first time and wait until both start buttons are ready. Afterward, exchange the color you solved first and the interval that took longest. These two small details usually explain more about your different routes than a comparison of final times alone.</p>
    <h4>Compare a clean run with a fast recovery</h4>
    <p>Imagine that one player spent a minute finding the first group and then placed the remaining three in quick succession. Another player found an opening pair immediately, guessed wrong twice and still finished a few seconds earlier. Ask each player which word changed their mind. A repeated mistake points to a tempting alternative heading you can discuss even when both players end up with similar totals.</p>

    <h2 id="records">When does the stopwatch stop?</h2>
    <h3>Finishing and running out of guesses</h3>
    <p>The clock stops on the submission that completes the last group. It also stops if you make a fourth distinct wrong guess. In that case the game reveals the groups for review. Only the groups you actually found appear on your split sheet. A quick loss therefore cannot replace a longer completed solve as your best time for that puzzle.</p>
    <h3>Where your personal best is kept</h3>
    <p>Each numbered board has its own fastest completed time in this browser. Play Again starts a fresh timed attempt on the same words. A slower finish leaves the earlier best in place. If you switch devices or clear the site's browser data, you can start a new set of records. With browser storage blocked, you can still time a run during the visit.</p>
    <h4>Leaving the page during a run</h4>
    <p>Switching tabs leaves the stopwatch running. If someone needs your attention, choose Stop run. You can read the splits you have already earned and choose another board when you return. Refreshing starts you back at the opening screen and clears the unfinished attempt. Finish a board before following an archive link if you want its time to count toward your best.</p>
    <p>For an open-ended session, the <a href="/connections-practice">regular practice boards</a> let you work through guesses at your own pace. The <a href="/connections-reverse-rainbow">reverse rainbow challenge</a> gives you a different target by asking you to solve the colors in order.</p>
  </article>;
}

import Link from "next/link";
import { LessonContents, LessonFigure, LessonTable } from "../lessons/LessonPage";
import lesson from "../lessons/lessons.module.css";
import styles from "./rainbow.module.css";

const boardUrl = (id: number) => "/connections-reverse-rainbow?board=" + id + "#challenge";

export default function RainbowGuide() {
  return <article aria-label="Reverse rainbow strategy guide" className={lesson.article}>
    <h2>What is a reverse rainbow in Connections?</h2>
    <p>A reverse rainbow is a clean solve in descending color order. Submit the purple group first, blue second, green third and yellow last, with all four guesses correct. You can spot the yellow words as soon as you open the board. Leave them on the screen until the fourth submission. The order in which you press Submit is what the tracker records.</p>
    <p>Choose any of the eight historical boards above for a practice run. Puzzle 73 opens first. The two full walkthroughs below use different boards, so you can read either example and still play the opening challenge fresh. Each practice board uses the color assignments recorded for that puzzle in the ConnectionsHint archive.</p>
    <LessonContents links={[
      ["score", "Read the four steps"],
      ["plan", "Plan a route through sixteen words"],
      ["cricket", "Puzzle 9 and the extra insect"],
      ["coins", "Puzzle 50 and the missing coin endings"],
      ["last-two", "Choose between green and yellow"],
      ["replay", "Read your result and choose another board"],
    ]} illustration={<figure className={lesson.diagram}>
      <figcaption>Three things to decide before Submit</figcaption>
      <ol className={lesson.timeline}>
        <li><strong>Membership</strong><span>Which four words belong together?</span></li>
        <li><strong>Color</strong><span>What color might the setter have given them?</span></li>
        <li><strong>Timing</strong><span>Is this the group your next step needs?</span></li>
      </ol>
    </figure>}/>

    <h2 id="score">Read the target and your actual solve order</h2>
    <h3>Each step has a color and a position</h3>
    <p>Above the board, four labeled boxes show the target. Select four tiles and submit them. If you find a group, the next box records the color you actually solved. For example, submitting a correct blue group first fills the purple position with “Got Blue.” You keep the group, and you can carry on playing to find out how the rest of your plan holds up.</p>
    <p>A mixed guess uses one of your four mistakes. It leaves every step in the color tracker open that was open before. A group you later solve still occupies the next available step. That distinction matters when you see four matched boxes at the end and also see a miss beside the tracker. They describe two different parts of your run.</p>
    <LessonTable caption="How this practice challenge scores a finished attempt" headers={["What happened", "What the tracker saw", "Result"]} rows={[
      ["Four clean groups in target order", "Purple, blue, green, yellow. No misses.", "Reverse rainbow complete"],
      ["Same four colors after a mixed guess", "All four steps matched, with at least one miss.", "Reverse order complete with mistakes"],
      ["Four correct groups in another order", "At least one position received a different color.", "Board solved in a different order"],
      ["Fourth distinct wrong guess", "Only the groups you submitted correctly count.", "Round ended"],
    ]}/>
    <h4>Keep playing after a broken run</h4>
    <p>If your first guess turns out to be green, use the remaining puzzle as an experiment. Write down which group you thought was blue and check that prediction on your next turn. You might discover that you understood every connection and simply read one color differently. Retry run starts another attempt immediately. Play Again becomes available at the end of the round.</p>
    <p>A one-away message uses a mistake too. It tells you that three selected words share a group while the fourth belongs elsewhere. If your goal was a clean run, there is still something to learn before restarting. Pick out the three you trust, name their rule and find the replacement. You will be testing a specific correction on your next attempt.</p>

    <h2 id="plan">Plan four groups while all sixteen tiles are visible</h2>
    <h3>Start with the words you recognize fastest</h3>
    <p>Read the whole board once and look for a group you can name in a few words. Say its four members quietly or jot them down. Those are four fewer words to consider for purple, even though they still occupy their places on the board. This is especially helpful when one familiar word keeps catching your eye every time you scan the grid.</p>
    <p>Give your next proposed group a short description too. Imagine that you are telling someone what to buy in a shop. “Paint” might lead them to buy a brush, a drop cloth or a can of primer. “Types of paint” narrows the shopping list. A description precise enough to exclude a tempting fifth member gives you more confidence about the four you leave behind.</p>
    <h3>Separate confidence in the group from confidence in its color</h3>
    <p>You might be certain that four names belong to jazz musicians and have little idea whether the puzzle calls them blue or purple. Keep both judgments in view. Membership is a language or knowledge question. Predicting the color asks how that group sits alongside three particular alternatives on one particular board.</p>
    <p>One practical way to rehearse this is to tell a partner the category names without mentioning any colors. Let them rank those categories, then compare their proposed order with yours. When the rankings differ, ask which group took longer to explain. That question often reveals a second meaning or a spelling change you had silently supplied for yourself.</p>

    <h2 id="cricket">Puzzle 9 puts CRICKET between two groups</h2>
    <div className={lesson.spread}>
      <div>
        <h3>Decide where the fifth insect goes</h3>
        <p>Open <Link href={boardUrl(9)}>practice puzzle 9</Link> and look for things with six legs. ANT, BEETLE, MANTIS and TERMITE make a tidy collection. CRICKET is an equally good match in everyday English. Picking any four insects leaves one on the table. Before submitting, give that spare insect a destination and see whether it can genuinely complete another row.</p>
        <p>Read FENCING, POLO and SQUASH as activities you could compete in. CRICKET gives those three a fourth sport. Try replacing it with MANTIS or TERMITE and the sports list stops making sense. You now have a reason to leave CRICKET out of the insect group that works even for someone who has never seen this puzzle before.</p>
      </div>
      <LessonFigure file="/images/reverse-rainbow-cricket.webp" alt="A cricket insect on a wooden cricket bat beside a red cricket ball." caption="A cricket has six legs. Cricket also has a bat and a ball. One reading completes a different row."/>
    </div>
    <h3>Keep the sports group for your last move</h3>
    <p>The archive assigns insects to purple and sports to yellow. It is perfectly possible to see the insects first because they are familiar animals. There is no hidden letter operation to perform on ANT or BEETLE. The difficulty on this board comes from allocating CRICKET and handling the extra readings of words elsewhere in the grid.</p>
    <p>SQUASH can also sit beside vegetables in a kitchen. Collect BEET, CARROT, CORN and ONION before deciding what to do with it. They fill the blue row on their own. CAMI, HALTER, TANK and TEE fill the green row as tops. Now you can submit insects, vegetables, tops and sports, with a reason for the position of every crossover word.</p>
    <h4>Check the evidence after the round</h4>
    <p>The <Link href="/connections-number/9">archive entry for puzzle 9</Link> lets you check the four published labels. If your order came out purple, blue, yellow, green, inspect the final pair. You already solved the harder allocation problem involving CRICKET and SQUASH. The thing to practice next is choosing which complete group to enter third.</p>

    <h2 id="coins">Puzzle 50 hides the starts of four coins</h2>
    <div className={lesson.spread}>
      <LessonFigure file="/images/reverse-rainbow-coins.webp" alt="Copper and silver-colored coins beside a paintbrush and blue paint." caption="The coin names need endings supplied. The paint types are already on the board as complete words."/>
      <div>
        <h3>Read DIM and NICK as beginnings</h3>
        <p>Try <Link href={boardUrl(50)}>practice puzzle 50</Link>. Alone, DIM might describe a lamp and NICK might describe a small cut. Extend the first word to dime and the second to nickel. PEN can begin penny and QUART can begin quarter. Each printed tile starts the name of a US coin. The number of missing letters varies, but the direction of the operation stays the same.</p>
        <p>Make one more check before you submit. QUART is also a unit you might see on a measuring jug. FOOT, INCH, MILE and YARD already form a set of length units. A quart measures volume. That small distinction keeps it out of the measurement group and gives the proposed coin row a fourth member with a good explanation.</p>
      </div>
    </div>
    <h3>Choose between the frying pan and the paint box</h3>
    <p>OIL suggests a way to cook, and several tiles name foods that can be deep-fried. Read the food names together. FALAFEL, KATSU, SAMOSA and SCHNITZEL can occupy the blue group. Adding OIL would change the role of one member from food to cooking medium. As a type of paint it can join ACRYLIC, TEMPERA and WATERCOLOR on equal terms.</p>
    <p>Enter the completed coin fragments first, then the fried foods, the paint types and the length units. That sequence reproduces the archived color order for this edition. A painter might have recognized the green group immediately, while a cook spotted blue first. Either path through the clues can lead to the same four submissions. Compare them with the <Link href="/connections-number/50">published puzzle 50 groups</Link>.</p>

    <h2 id="last-two">Choose green before yellow with eight words left</h2>
    <h3>Look at what each label asks a player to supply</h3>
    <p>Once purple and blue are gone, assign all eight remaining words before choosing another group. Tell yourself the label for each side. Does one set fit a phrase a child could hear at the grocery store? Does the other require a particular sense of a common verb? These questions give you reasons to favor an order. The recorded colors can still surprise you.</p>
    <figure className={lesson.diagram}>
      <figcaption>Two perfect solves with different submission orders</figcaption>
      <div className={styles.samples}>
        {[
          ["Reverse rainbow", "Purple", "Blue", "Green", "Yellow"],
          ["Last pair reversed", "Purple", "Blue", "Yellow", "Green"],
        ].map(([label, ...colors]) => <div key={label}><strong>{label}</strong><span>{colors.map(color =>
          <b key={color} data-color={color[0]}>{color}</b>
        )}</span></div>)}
      </div>
    </figure>
    <p>Notice that the two records in the figure contain exactly the same colors. Every guess in each record is correct. Only the final pair changes places. This is a useful diagnosis if you usually finish the board and still miss the challenge. Repeating a drill that only asks for purple gives you little practice making that particular last decision.</p>
    <h4>Try a fresh set of final pairs</h4>
    <p>On <Link href={boardUrl(200)}>puzzle 200</Link>, watch for the difference between things you could point to on a car and verbs that tell someone to move quickly. On <Link href={boardUrl(555)}>puzzle 555</Link>, compare names for a road with words for courage. Choose a color for each row and say why before you submit. Afterwards, check which of your reasons traveled well from one board to the other.</p>
    <h3>Compare what a cook hears with what a speller sees</h3>
    <p>For another test, open <Link href={boardUrl(90)}>puzzle 90</Link>. SALMON makes an inviting partner for CARP. Try putting each into a sentence as a verb. You can carp about a decision, catfish someone online, flounder during a speech and smelt ore. All four verbs are also names for fish. SALMON would need a different explanation to earn a place in that row.</p>
    <p>Read WALK and YOLK aloud. Each contains a written L that drops out of the usual pronunciation. Try SALMON again, this time listening for that letter. You just found a test for the purple group and a different test for blue. Compare the sports calls and heat sources left on the board before deciding which set you will reserve for the finish.</p>
    <h3>Keep a sound-alike from taking two seats</h3>
    <p>In <Link href={boardUrl(32)}>puzzle 32</Link>, someone reading the tiles to you might make SOLE and SOUL sound identical. Look at the spelling before moving either one. HEEL, LACE and TONGUE give the underside of a shoe somewhere to go. That makes SOLE a candidate for yellow even though you might also describe a rubber sole.</p>
    <p>Now read SOUL with RUBBER in front of it. The album title <i>Rubber Soul</i> sits alongside rubber band, rubber cement and rubber duckie. Those four expressions give the purple group its own use for the other spelling. Submitting that row first would leave all four shoe parts available for the end. You can verify both proposed memberships before committing to either color.</p>

    <h2 id="replay">Read the result, then pick a different test</h2>
    <LessonTable caption="Where to go after a practice run" headers={["What you noticed", "Try next", "What to watch"]} rows={[
      ["An animal or food had two homes", <Link key="nine" href={boardUrl(9)}>Puzzle 9</Link>, "The fifth plausible member of a category."],
      ["A word sounded right in two rows", <Link key="thirteen" href={boardUrl(13)}>Puzzle 13</Link>, "The difference between spelling and pronunciation."],
      ["A familiar word hid a longer one", <Link key="fifty" href={boardUrl(50)}>Puzzle 50</Link>, "Whether all four tiles work in the same direction."],
      ["A specialist topic felt easy to you", <Link key="tennis" href={boardUrl(555)}>Puzzle 555</Link>, "How your knowledge changes which group you spot first."],
    ]}/>
    <p>After the game, open Read my result grid to see the guesses in chronological order. A single-color row records a solved group. A mixed row records a mistake. If you have a result copied from another classic game, paste it into the <Link href="/connections-results">result grid reader</Link> and read the solid rows from top to bottom. For a clean reverse rainbow you should see just four rows.</p>
    <p>For an untimed planning exercise, copy a board into the <Link href="/connections-scratchpad">Connections scratchpad</Link>. Give the promising groups working names and arrange the tiles until every word has a place. Return to this challenge to make your four submissions. Practice here is independent of your NYT Games account. Use a different numbered board when you want to test a new prediction without remembering the answer from the last run.</p>
    <p>To see how long each group takes when you can choose the order, open <Link href="/timed-connections">Timed Connections</Link>. The stopwatch records a split for each group you solve.</p>
  </article>;
}

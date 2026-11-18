import Link from "next/link";
import { LessonContents, LessonFigure, LessonTable } from "../lessons/LessonPage";
import styles from "../lessons/lessons.module.css";
import miniStyles from "./mini.module.css";

const boardUrl = (number: number) => "/mini-connections?board=" + number + "#mini-board";

export default function MiniGuide() {
  return (
    <article aria-label="Mini Connections solving guide" className={styles.article}>
      <h2>How to play Mini Connections</h2>
      <p>Pick three words that share a connection and press Submit. A correct trio moves above the tiles and reveals its category. Find all three trios to finish the board. You have three mistakes to spend and as much thinking time as you like. Start with any numbered board in the selector above.</p>
      <p>The first part of this guide keeps the opening puzzle intact. The worked examples farther down name words and answers from specific boards. If you enjoy discovering the trick yourself, open the numbered board first, play it, then come back to see how a different player might have read the same nine words.</p>

      <LessonContents links={[
        ["first-move", "What to look for on the first move"],
        ["apple", "Board 2 and the three lives of APPLE"],
        ["brush", "Board 3 and the difference one word makes"],
        ["needle", "Board 4 and a perfectly good decoy"],
        ["formats", "Moving between mini and full-size boards"],
        ["next-round", "Choose a board to practice a particular skill"],
      ]} illustration={
        <figure className={styles.diagram}>
          <figcaption>How the board gets smaller</figcaption>
          <ol className={styles.timeline}>
            <li><strong>9 words</strong><span>Find a first trio and name its rule.</span></li>
            <li><strong>6 words</strong><span>Check both sides of the split.</span></li>
            <li><strong>3 words</strong><span>Name their connection and submit.</span></li>
          </ol>
        </figure>
      }/>

      <h2 id="first-move">A first move you can explain</h2>
      <h3>Give your three words a sentence</h3>
      <p>Imagine seeing ENVELOPE, STAMP and POSTCARD. You could find all three at a post office. Now try the narrower label “things you put a stamp on.” An envelope and a postcard pass. The stamp itself plays a different part. Both descriptions sound postal, yet only one can accept all three objects on equal terms.</p>
      <p>Use that little test before touching Submit. Say each tile in the same sentence, keeping the rest of the sentence unchanged. If you have to switch from “is a kind of” to “is used with,” hold the third word in reserve. Look through the other six for a word that makes your first sentence work again.</p>
      <h3>Read the feedback on a missed guess</h3>
      <LessonTable caption="What the game tells you after a submission" headers={["Message", "What you know", "What to try next"]} rows={[
        ["Correct!", "The three tiles share an intended category.", "Read the label, then scan the remaining words."],
        ["One away…", "Two tiles in your guess belong together.", "Identify which pair you can justify most precisely."],
        ["Incorrect", "Your trio drew one tile from each category.", "Split up all three when building your next guess."],
        ["Already guessed!", "You previously submitted that same set.", "Change a tile. This repeat costs no extra mistake."],
      ]}/>
      <p>“One away” leaves the identity of the pair open. With three selected tiles, any of the three pairs could be the useful one. Think of the possibilities as AB, AC and BC. If another unselected word fits BC beautifully, try that idea even when A was the word that originally caught your eye.</p>
      <h4>Use a free change of view</h4>
      <p>Shuffle moves the tiles and keeps your current selection. It helps when two words sat side by side and you started treating their position as evidence. Deselect All clears your selection so you can test a fresh sentence. Neither control spends a mistake. Only a new incorrect submission reduces the dots below the board.</p>

      <h2 id="apple">Board 2 has three places you might put APPLE</h2>
      <div className={styles.spread}>
        <div>
          <h3>Start with what your hands do</h3>
          <p>On <Link href={boardUrl(2)}>Board 2</Link>, MOUSE and KEYBOARD almost invite you to click APPLE. If you walked into a computer shop, all three labels could appear in the same window. Try explaining the connection to someone who bought a computer from a different brand. They could still move a pointer and type a letter using exactly the same two devices.</p>
          <p>TRACKPAD supplies another way to give that computer an instruction. Watch what happens to the category when it joins the pair. You can describe a concrete action for each item. A keyboard accepts keystrokes, a mouse tracks movement and clicks, and a trackpad accepts finger movement or taps. The three devices now answer the same question.</p>
        </div>
        <LessonFigure file="/images/mini-connections-apple.webp" alt="An apple pie beside a computer mouse on a lavender surface." caption="The apple in the pie and the mouse on the desk point to two different readings of the same board."/>
      </div>
      <figure className={styles.diagram}>
        <figcaption>One swap turns a theme into a group</figcaption>
        <div className={miniStyles.diagramRows}>
          {[["APPLE", "One away. APPLE can name a brand."], ["TRACKPAD", "Correct. Each device accepts input."]].map(([tile, note]) =>
            <div key={tile}><span className={miniStyles.trio}><b>MOUSE</b><b>KEYBOARD</b><b data-swap="true">{tile}</b></span><small>{note}</small></div>
          )}
        </div>
      </figure>
      <h3>Give the loose word another job</h3>
      <p>With the devices settled, APPLE has two strong invitations left. It could sit with PECAN and CHERRY as a pie filling. It could also follow BIG in the nickname for New York City. You can make both of those arguments from everyday English. The decision comes from counting who else can take each seat.</p>
      <p>Say Big Dipper, Big Ben and big toe out loud. Those three expressions fill the entire BIG group. Now take APPLE out of the pie group and look for a third filling among DIPPER, BEN and TOE. The dessert menu quickly settles the argument. Putting APPLE with the pies uses every word in a way you can explain.</p>

      <h2 id="brush">Board 3 asks who has the teeth</h2>
      <h3>Distinguish an object from its feature</h3>
      <p>Run your finger along the edge of an imaginary comb. The projections are its teeth. A gear also has teeth around its edge, and the sides of a zipper have teeth that interlock. On <Link href={boardUrl(3)}>Board 3</Link>, the tile TOOTH makes this connection easy to spot and surprisingly easy to get wrong.</p>
      <p>Test the four candidates by finishing “a thing with teeth, such as a…” A comb works. A gear works. A zipper works. When you reach “a tooth,” you hear the problem. It names one of the features that the description asks you to find on something else. Save TOOTH for a different kind of connection.</p>
      <h3>Try reading a tile as part of a longer word</h3>
      <p>HAIR and PAINT can each go before BRUSH. That gives you a hairbrush for getting ready in the morning and a paintbrush for putting color on a surface. Transfer the same ending to TOOTH and you get a toothbrush. The resulting objects have different uses. The construction of their names supplies the common rule.</p>
      <h4>Check the six before submitting the three</h4>
      <p>If PAINT keeps drawing you toward the art words, read the spare trio as instructions. You could sketch the outline of a cup with a pencil, trace a shape through thin paper or doodle in the margin. All three directions work with the same tool. That leaves PAINT free to complete paintbrush without squeezing a pencil into a painting lesson.</p>

      <h2 id="needle">Board 4 makes room for needlepoint</h2>
      <div className={styles.spread}>
        <LessonFigure file="/images/mini-connections-clock.webp" alt="A sewing bobbin and needle next to a brass clock pendulum on blue cloth." caption="A needle passes thread through fabric. A pendulum swings. Try describing the moving part of each machine."/>
        <div>
          <h3>Use a word with fewer possible homes</h3>
          <p>Anyone who sews has a good reason to try NEEDLE with the words that come before POINT. Needlepoint is a familiar craft, and ballpoint and match point are perfectly good expressions too. If you spend a guess on them in <Link href={boardUrl(4)}>Board 4</Link>, the near miss tells you to investigate the pieces you left behind.</p>
          <p>Look at PRESSER FOOT. On a sewing machine it holds the fabric against the feed dogs while the needle goes through. The bobbin carries the lower thread. These are three parts you could point to on one machine. Putting NEEDLE back with them leaves FOCAL available, and focal point completes the word pattern.</p>
        </div>
      </div>
      <h3>Ask what the leftover clock parts do</h3>
      <p>A clock hand shows the time against a dial. A pendulum swings to regulate the mechanism of a pendulum clock. These words fit even though a modern digital clock can do without all three visible pieces. Naming the particular type of clock makes the label accurate and gives each word a recognizable place within it.</p>
      <p>There is a useful distinction here for players who want to challenge an answer. You can prove an individual expression exists and still have another question to answer. Can all six tiles left outside your proposed trio form two groups? Needlepoint survives the dictionary test. FOCAL, BOBBIN and PRESSER FOOT make it much harder to defend as a move.</p>

      <h2 id="formats">How the 3×3 game changes a full-size solve</h2>
      <LessonTable caption="Mini Connections and the standard practice format on this site" headers={["During a round", "Mini board", "Full-size board"]} rows={[
        ["Opening grid", "9 words in 3 rows", "16 words in 4 rows"],
        ["One complete group", "3 words", "4 words"],
        ["A one-away guess", "2 of the 3 words match", "3 of the 4 words match"],
        ["Round ends on", "Third distinct mistake", "Fourth distinct mistake"],
      ]}/>
      <p>The difference you feel most comes after one success. In the mini game there are just six words left. Choose any three in your head and you have proposed both final groups at once. Take a moment to read the spare three before pressing Submit. They often expose a weak label faster than another look at your favorite trio.</p>
      <h3>Use the smaller board to study a near miss</h3>
      <p>Suppose you have six words left and your guess comes back one away. Two selected words belong to one category and the third belongs across the divide. The three you left on the board must have the reverse mixture. Start with those overlooked words. Sometimes the pair you need is easier to see from the opposite side.</p>
      <p>To transfer the exercise to a larger puzzle, play a round of <Link href="/connections-practice">full-size Connections practice</Link> and wait until two categories are solved. Eight tiles now form two groups of four. Ask the same question about the unselected half. A fourth word that sounds plausible on its own may leave four very awkward companions behind.</p>

      <h2 id="next-round">Choose your next board by the trick you want to practice</h2>
      <h3>Practice choosing a precise unit</h3>
      <p>Try <Link href={boardUrl(5)}>Board 5</Link> with a clock and a pencil in mind. Listen to how you use PERIOD in everyday speech. A busy period at work might last two hours or most of the winter. Now look for tiles you could put after a number in an answer to “How long did it take?” A minute, an hour and a week each tell the listener how to measure the wait.</p>
      <p>Try a second reading of PERIOD at the end of a written sentence. The tiny mark you put there has a name of its own. Check whether two other tiles also name marks you might put on a page. This time the label has an easy physical test. You can pick up the pencil and draw each member of the proposed group.</p>
      <h3>Practice listening, then check the spelling</h3>
      <p>Try <Link href={boardUrl(6)}>Board 6</Link> with a partner. Have one person read the nine words aloud while the other listens, then look at the tiles together. Two words sound exactly alike. When one appears to fit a compound, say the entire compound and check the printed spelling. Another tile belongs on a chessboard even though your ears offered the same sound.</p>
      <h3>Practice spotting a fourth candidate</h3>
      <p>Open <Link href={boardUrl(8)}>Board 8</Link> if you usually stop searching the moment you spot three plausible words. Look for everything that could follow DRUM before you select anything. Ask which candidate a baker would miss. Repeat the exercise on <Link href={boardUrl(10)}>Board 10</Link> with SEA. This time an animal’s body gives you a second way to check the split.</p>
      <h3>Practice switching between word and object</h3>
      <p>For a different kind of double meaning, open <Link href={boardUrl(9)}>Board 9</Link> and imagine handing a visitor a map. A LEGEND explains what the little symbols stand for. A SCALE lets the visitor work out how far two stops are from each other. Find the tile they would consult to tell which way is north. One task for each object gives you a good reason to put all three in the same group.</p>
      <p>On <Link href={boardUrl(12)}>Board 12</Link>, pause on MOUTH and describe where you would find one. Your first description might involve a face. A person pointing to a map could give an equally natural answer involving a river. Make a mental note of both scenes. Then see which scene already has enough members to finish its own group.</p>
      <h4>Replay a numbered puzzle with someone else</h4>
      <p>Choose a board in the selector and press Open. Copy that page address to give a friend the same nine words. Let them play before you tell them the misleading connection you noticed. Comparing which pair each of you trusted first makes a better discussion than comparing mistake counts, especially when both routes reach the same three labels.</p>
      <p>The twelve boards here stay available by number. Use Play Again to replay the current words in a new arrangement, or Next board to move on to a different puzzle. If you want a little help before the last dot disappears, open the hint beside the board. The fuller explanation appears once the round has ended.</p>
    </article>
  );
}

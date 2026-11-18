import Link from "next/link";
import { LessonContents, LessonFigure, LessonTable } from "../lessons/LessonPage";
import lesson from "../lessons/lessons.module.css";
import styles from "./scratchpad.module.css";

export default function ScratchpadGuide() {
  return (
    <article className={lesson.article} aria-label="Connections scratchpad guide">
      <h2>How to use a Connections scratchpad</h2>
      <p>A Connections scratchpad gives you somewhere to put a possible group while you think about the rest of the board. Every tile has one seat. Swap two words and you immediately see what the move does to both rows. There is no answer button here. When you have four groups you like, take your choices back to the puzzle you are playing.</p>
      <p>Try the controls with a historical board if you want to save today’s words for later. The examples below discuss puzzles 5 and 8 from June 2023. Both are available in the board menu above. You can arrange the words on your own before reading the explanations, or open the examples and follow the moves as you read.</p>
      <LessonContents links={[
        ["moves", "Move tiles and keep a draft"],
        ["mustard", "Puzzle 5 and the spare condiment"],
        ["king", "Puzzle 8 and two ways to read KING"],
        ["last-eight", "Compare the final eight words"],
        ["paste", "Bring a board with multiword tiles"],
        ["finish", "Take a finished draft back to the game"],
      ]} illustration={<figure className={lesson.diagram}>
        <figcaption>What one swap changes</figcaption>
        <ol className={lesson.timeline}>
          <li><strong>Choose a tile</strong><span>Pick the word you have doubts about.</span></li>
          <li><strong>Choose its partner</strong><span>The two tiles trade places.</span></li>
          <li><strong>Read both rows</strong><span>Try each name on its new fourth member.</span></li>
        </ol>
      </figure>}/>

      <h2 id="moves">Move two tiles and keep track of the idea</h2>
      <h3>Use a tap, a drag or the keyboard</h3>
      <p>Tap a tile once to mark it. Tap a second tile to exchange their positions. You can also drag one word directly onto another with a mouse. On a keyboard, use Tab to reach the first tile, press Enter or Space, then repeat on the second. Selecting the first tile again cancels the pending move and leaves the row intact.</p>
      <p>Start with just two words you would tell a friend about. If you see a pair that could both follow the same missing word, bring them into row A. Leave the other two seats in that row occupied for now. Those occupants are convenient places to swap into later. A half-built row is a good place to leave a question.</p>
      <h3>Give the row a name that can fail</h3>
      <p>Use the row note to write something a fourth word could prove wrong. “Things at a concert” admits tickets, drums, coats and people. “Instruments you strike” asks every tile to pass a more demanding test. If the fourth candidate only passes after you change the meaning of the note, you have learned something before spending a guess.</p>
      <p>The letters A through D tell you where your words are. You decide what each letter means. Some players reserve D for the words that have yet to find a home. Others put their strongest idea in the first convenient row. You can change a note at any time, including after a row that looked promising has fallen apart.</p>
      <h4>Keep the note when you undo a swap</h4>
      <p>Undo swap restores the previous tile positions on the current board. Your row notes stay where you typed them. This lets you compare two possible arrangements against the same labels. You can undo successive moves from the current visit to that board. Switching boards or refreshing the page starts a fresh undo history while keeping the saved arrangement.</p>

      <h2 id="mustard">Puzzle 5 puts an extra condiment on the table</h2>
      <div className={lesson.spread}>
        <div>
          <h3>Build the lunch-counter row</h3>
          <p>Open Archive #5 in the menu. KETCHUP, MAYO, RELISH and MUSTARD could sit together at a lunch counter. Put those four in row A and write “condiments” beside them. You have a sensible first draft. The trouble appears when you scan the other twelve words and find TARTAR, another word that could stand on that counter before “sauce.”</p>
          <p>Write the rivals down in the note if you need a reminder. “Condiments, mustard or tartar?” fits in the margin and keeps the decision visible. For now, leave all five candidates in play. Identifying a real connection gives you a place to work, even when it admits one more word than the puzzle has seats.</p>
        </div>
        <LessonFigure file="/images/scratchpad-mustard.webp" alt="A jar of mustard beside a mustard-yellow wooden playing piece." caption="Set the lunch counter beside a game board and MUSTARD has two plausible jobs."/>
      </div>
      <h3>Build a second row before spending a guess</h3>
      <p>Find GREEN, PLUM and SCARLET. Treat these as names you might meet in the board game Clue. If MUSTARD joins them, you get a fourth character. Now try TARTAR in the same seat. You can order tartar sauce with lunch, but it is hard to introduce a Clue suspect by that name. The second row breaks the tie left by the first.</p>
      <figure className={lesson.diagram}>
        <figcaption>Exchange the last tiles in these two draft rows</figcaption>
        <div className={styles.flow}>
          {[
            ["A before", "KETCHUP", "MAYO", "RELISH", "MUSTARD"],
            ["B before", "GREEN", "PLUM", "SCARLET", "TARTAR"],
            ["A after", "KETCHUP", "MAYO", "RELISH", "TARTAR"],
            ["B after", "GREEN", "PLUM", "SCARLET", "MUSTARD"],
          ].map(([label, ...words]) => <div key={label}><strong>{label}</strong><span>{words.map(w => <b key={w}>{w}</b>)}</span></div>)}
        </div>
      </figure>
      <p>Make that one exchange on the scratchpad and then read the other eight tiles. HULU, NETFLIX, PEACOCK and PRIME belong to streaming services. BLUE, DOWN, GLUM and LOW can describe a sad mood. BLUE could have joined several of the color names you saw earlier. Its partners give you an independent reason to leave it here.</p>
      <h4>Use the archive to check your reasoning</h4>
      <p>Open the <Link href="/connections-number/5">puzzle 5 archive entry</Link> when you want to compare your labels with the published groups. A note such as “suspects in Clue” and the archive label “Clue characters” pick out the same four people. Compare membership first. Then look at how the published label expresses a broad enough rule to include every member.</p>

      <h2 id="king">Puzzle 8 gives KING and QUEEN two homes</h2>
      <div className={lesson.spread}>
        <LessonFigure file="/images/scratchpad-king.webp" alt="A black chess king stands beside a small made-up bed on a chessboard." caption="KING names a piece you move and a size you can order. The next three tiles decide which reading works."/>
        <div>
          <h3>Distinguish the game from its pieces</h3>
          <p>Switch to Archive #8. Put CHESS, KING and QUEEN side by side. They look as though they came out of the same box. Try naming the row “games you can play.” You can play chess. A king and a queen are pieces that you can move during a game. The sentence has quietly changed by the time you reach the second tile.</p>
          <p>Look for three things you can play in exactly the same sense as chess. BACKGAMMON and CHECKERS fit easily. GO is easy to overlook if you first read it as an instruction. Move GO into the fourth seat and try the sentence again. Each tile is now the name of a board game you could set up for the evening.</p>
        </div>
      </div>
      <h3>Let the plainest words decide the label</h3>
      <p>Find FULL and TWIN before deciding where to park KING and QUEEN. Picture someone shopping for fitted sheets. All four words can complete the same request for a mattress size. You have given KING and QUEEN somewhere better to go, and you have found a specific use for two words that otherwise have dozens of ordinary meanings.</p>
      <LessonTable caption="Three drafts from the June 19, 2023 board" headers={["Working note", "Test the words", "Decision"]} rows={[
        ["Chess-related", "CHESS, KING and QUEEN fit the scene in different roles.", "Keep looking for a single role."],
        ["Board games", "BACKGAMMON, CHECKERS, CHESS and GO are all game titles.", "Keep this row together."],
        ["Mattress sizes", "FULL, KING, QUEEN and TWIN all fit a bedding order.", "Give the two royal words these seats."],
      ]}/>
      <p>Read the other rows in the <Link href="/connections-number/8">puzzle 8 archive entry</Link> after trying them yourself. One groups things commonly pictured in red, including FIRE TRUCK and CHERRY. The other uses keys in several senses, including the musical sense in PIANO and the geographical one in FLORIDA. A good note can accommodate several meanings when that variety is the connection itself.</p>

      <h2 id="last-eight">Compare two complete arrangements of the last eight</h2>
      <h3>Write down both explanations</h3>
      <p>Imagine you have finished two rows and feel unsure about a single word in each remaining row. Leave the finished eight tiles alone. Name the two unfinished rows, read their fourth members, then swap only those two words. You now have a controlled comparison. Everything in the arrangement is the same except the decision you wanted to test.</p>
      <p>Ask a different question of each side. Which label became more precise after the exchange? Which word lost the only natural home you had found for it? If both rows improved, keep the move. If one improved and the other became a pile of unrelated leftovers, undo the swap and inspect one of the three words you had treated as certain.</p>
      <h4>Work through a one-away clue on paper first</h4>
      <p>If your game already reported one away, copy your four submitted words into a scratchpad row. You know three belong to the same intended group. You still have four choices for the outsider. Pick the word for which you can name a different row and put its proposed replacement in view. Only make the next live guess after reading both sides of that exchange.</p>
      <p>Suppose three words in your tentative row name animals and the fourth sounds like an animal when spoken. Say all four aloud, then look again at their spellings. A sound-based rule could apply to all four, or the fourth could be borrowing a rule that only applies to its neighbors. The <Link href="/guides/connections-one-away">one-away practice guide</Link> lets you study that feedback separately.</p>

      <h2 id="paste">Bring a board with phrases, spaces or punctuation</h2>
      <h3>Choose separators that preserve each tile</h3>
      <p>Open “Paste your own 16 words” above the grid. If you have the entries in a spreadsheet, copy four rows of four cells. Tabs between columns and new lines between rows mark the tile boundaries. If you are typing by hand, use a comma or a new line after each complete tile. The order you enter becomes your opening arrangement.</p>
      <LessonTable caption="How the scratchpad reads pasted words" headers={["Your text", "Tiles created", "Why"]} rows={[
        ["FIRE TRUCK", "One", "A space stays inside a tile."],
        ["FIRE TRUCK, STOP SIGN", "Two", "A comma ends the first tile."],
        ["One spreadsheet row of four cells", "Four", "Each tab starts a new entry."],
        ["KING, king", "Duplicate warning", "Capitalization does not make a new word."],
      ]}/>
      <p>Picture the red objects in puzzle 8. FIRE TRUCK and STOP SIGN each occupy one seat although each uses two printed words. If you split on every space, the count would be wrong before you even started arranging the board. Check that the input contains sixteen complete tile names and leave the spaces inside those names intact.</p>
      <h4>Return to a board you set aside</h4>
      <p>Look at the date beneath the tiles when you start a daily draft. A fresh text edition opens with its words in alphabetical order, so the opening rows carry no category information. On a picture edition, or while the new text board is still pending, the two numbered archive examples give you a place to practice.</p>
      <p>The two archive boards and the current dated board each keep their own arrangement in this browser. Switching between them is handy if you want to practice the mustard example without disturbing today’s draft. A pasted board gets a separate slot. The next time you replace that pasted board, its new sixteen words take over the slot and its row notes start empty.</p>
      <p>Using a different browser or device starts a separate workspace. A friend opening this page can choose the same archive number and arrange the same words independently. That makes for a useful two-person exercise. Compare the labels you gave a difficult row before you compare its four members. Often one person spotted a tighter description of exactly the same group.</p>

      <h2 id="finish">When to take a draft back to the puzzle</h2>
      <p>Cover the row notes and try to name each group from the tiles alone. An arrangement you can reconstruct is easier to transfer to another tab. If you struggle to remember why a particular word belonged, uncover the note and test that word once more. Read the fourth row as carefully as the first, especially when it formed entirely from leftovers.</p>
      <p>Submit your choices in the game you started with. If you are practicing from our archive, use its replay or answer controls when you are ready to compare. If all you have is a copied board and you want to identify the original puzzle, the <Link href="/connections-solver">Connections solver</Link> can look it up. Your scratchpad remains available for the next comparison.</p>
    </article>
  );
}

import { LessonContents, LessonFigure, LessonTable } from "../lessons/LessonPage";
import lesson from "../lessons/lessons.module.css";
import styles from "./kids.module.css";

export default function KidsGuide() {
  return <article className={lesson.article}>
    <LessonContents links={[["levels", "Choose a level"], ["pencil", "Pack a pencil case"], ["bat", "Which BAT?"], ["sail", "SAIL or SALE?"], ["together", "Play together"], ["classroom", "Take it to class"]]}
      illustration={<LessonFigure file="/images/kids-connections-pencil-case.webp" alt="A pencil, eraser, ruler and wax crayon beside a pencil pouch"
        caption="What would you pack to draw a picture, measure a line and rub out a mark?" />} />

    <h2 id="levels">Which word puzzle should we play first?</h2>
    <p>Start with Pack your bag if this is your first game of Connections for Kids. Read the sixteen tiles together and let the youngest player point out two that might belong together. Leave them on the board while you look for two more. You have time to change your mind, even after checking a guess.</p>
    <h3>Starter or Explorer?</h3>
    <p>The six Starter boards use things you can picture or actions you could act out. A good test for this level is whether you can give someone an imaginary object and ask them to show you how they would use it. If your partner pretends to open an umbrella or put on a hat, you already have something to talk about.</p>
    <p>In the six Explorer boards, familiar words can do unfamiliar jobs. A word might be half of a longer word, sound exactly like its neighbor, or name two quite different things. Move up when a player enjoys arguing for a choice. A younger reader who likes explaining jokes may enjoy an Explorer puzzle with someone reading the tiles aloud.</p>
    <LessonTable caption="Pick a board for the way you want to play" headers={["What sounds fun?", "Try this puzzle", "What to look for"]} rows={[
      ["Grouping things you know", <a key="one" href="?board=1#play">1. Pack your bag</a>, "What could fit in the same place?"],
      ["Acting out everyday words", <a key="five" href="?board=5#play">5. By the water</a>, "Which words tell you how to move?"],
      ["Spotting a second meaning", <a key="seven" href="?board=7#play">7. After dark</a>, "Could the same word name something else?"],
      ["Listening for word twins", <a key="ten" href="?board=10#play">10. At the harbor</a>, "Which spelling belongs in this sentence?"],
    ]} />
    <h4>When to take a hint</h4>
    <p>Ask for a hint when you can read all the tiles but cannot see where to begin. The first hint invites you to imagine a scene. Pause there and see what turns up. The second hint gives two words from that group. Someone still has to find their two partners and say what connects all four.</p>
    <h4>A warm-up you can do away from the screen</h4>
    <p>Put a spoon, a fork and a pencil on a table. Ask which two you would take to eat soup and salad. Change the question to which two could leave a mark in soft clay. You might get a different answer, and that is worth hearing. Back at the puzzle, invite the player to choose the question that will account for four tiles at once.</p>

    <h2 id="pencil">What belongs in a pencil case?</h2>
    <p>Look at the four school supplies in the picture. Which one would you reach for if a line came out crooked? The eraser helps you remove the line. The ruler helps you draw it straight the second time. Those two things do different jobs, yet the same student might zip them into a little case at the end of the lesson.</p>
    <h3>Give the first pair a useful name</h3>
    <p>Suppose you begin with PENCIL and CRAYON and call them “things that draw.” It sounds promising until you pick up the ERASER. Try rubbing an imaginary mark off the table. Now ask where the three tools live when nobody is using them. A different question leaves room for the RULER, which also belongs in a pencil case.</p>
    <ol className={styles.sequence} aria-label="Three steps for testing the pencil case group">
      <li><b>1. Pair</b><span>PENCIL and CRAYON can make marks.</span></li>
      <li><b>2. Test</b><span>An ERASER takes marks away.</span></li>
      <li><b>3. Rename</b><span>All three and a RULER are pencil case supplies.</span></li>
    </ol>
    <h4>Let the child challenge the answer</h4>
    <p>A child may say their ruler is too long for their case. Take the objection seriously. Imagine a short ruler beside a long one, or find an actual pencil pouch and see what fits. The category describes a common use. You can still explain why the tile belongs while agreeing about the perfectly real ruler in front of you.</p>
    <h3>Look at the words that stayed behind</h3>
    <p>On this board, SOCKS and SLIPPERS invite a smaller version of the same conversation. If your first label is “shoes,” socks are a problem. Ask the player to finish the sentence “I put all four on my …” and wait for the last word. Finding the right heading can be just as satisfying as finding the fourth tile.</p>

    <h2 id="bat">Which group gets the BAT?</h2>
    <div className={lesson.spread}>
      <LessonFigure file="/images/kids-connections-bat.webp" alt="A flying bat at dusk beside a wooden baseball bat, a glove and a ball on a field"
        caption="Say BAT while pointing at each picture. The sound and spelling stay the same as the meaning changes." />
      <div><h3>Try both pictures before choosing</h3>
        <p>Open <a href="?board=7#play">After dark</a> and imagine telling a friend that you saw a bat. They could ask whether it was flying past a tree or lying beside a baseball glove. Either question makes sense. This is a good time to let a child defend two answers before asking them to commit to one.</p>
        <p>Set BAT beside OWL in your imagination. A moth near a porch light and a raccoon searching for food complete a nighttime scene. Now place BAT beside MOUND and BASE. That scene makes sense too, but take away the players and their equipment. The mound and base remain on the field. The wooden bat can leave with the batter.</p>
      </div>
    </div>
    <h4>Use a question that separates the two groups</h4>
    <p>“Does it belong at a baseball game?” lets too many things in. A hot dog, a ticket and a jacket would pass that test. Ask instead whether you could point to the place on an empty field. Home PLATE and the FOUL LINE pass alongside BASE and MOUND. That leaves an inviting space for the living bat among the night animals.</p>
    <h3>Try the rain words with your ears</h3>
    <p>The same board also has a BOW. A child might picture a hair ribbon or the thing an archer holds. Give them RAIN and ask them to say the two words without pausing. A rainbow appears. Then try the same beginning with DROP, COAT and FALL. Each complete word must sound familiar, and each must keep RAIN in the same place.</p>
    <p>To check that someone has heard the new meaning, give them a choice of drawings. Would a raindrop look like a single bead of water or a whole puddle? Could someone wear a raincoat or stand underneath a rainbow? Children can answer by pointing. You can learn which word needs another example even when a player is shy about speaking.</p>

    <h2 id="sail">SAIL and SALE at the harbor</h2>
    <p>Ask two players to turn away from the screen. Say “sale” and ask each player to draw what they heard. One might draw a cloth triangle above a boat and the other a sign in a shop window. Show them the two written tiles on <a href="?board=10#play">At the harbor</a>. Now the drawings give them a reason to look closely at the spellings.</p>
    <LessonTable caption="Two spellings for the sound you heard" headers={["Tile", "Finish the sentence", "Check a neighbor"]} rows={[
      ["SAIL", "Wind filled the boat’s ___.", "A MAST supports it."],
      ["SALE", "The shoes cost less during the ___.", "The PRICE might drop."],
    ]} />
    <h3>Give the listener enough information</h3>
    <p>Say “I saw a sail” aloud. Your partner still cannot choose the spelling with certainty. Add a mast, a gust of wind or a boat turning toward home and let them decide again. Then trade roles and ask them to give you a sentence in which a receipt or a coupon would naturally appear.</p>
    <h4>What if a new word gets in the way?</h4>
    <p>RUDDER might be unfamiliar even when SAIL is easy. Cup one hand into a little boat and put a finger at its back. Move the finger as if it were turning the boat. Tell the player that this steering part is called a rudder. You have given them the meaning of one tile while leaving them the fun of building the whole group.</p>
    <p>Once the boat group is solved, point to the written explanation and ask someone to match each part with its job. Which part catches wind, and which part keeps the boat afloat? A child who can explain those two jobs can help a partner who knew the words only as pictures.</p>

    <h2 id="together">How to help without giving away all four words</h2>
    <h3>Take turns being the picker and the checker</h3>
    <p>Give the picker the mouse or the phone. Their job is to choose two words and offer a heading. The checker gets to ask one question before any more words are selected. “Would an eraser work too?” asks for a real decision. When the two players can explain all four tiles, let the checker press Check group and swap roles.</p>
    <p>If the game reports that three fit, keep the selection on screen and read the four words from left to right. Let each player nominate the tile they trust least. Ask what would have to be true for it to stay. Tap that tile to take it out, choose a replacement and check the new group together.</p>
    <h4>Play with a reader who wants a little help</h4>
    <p>Read each word in a steady voice. If you make animal noises or point at a matching picture too soon, it is easy to give a category away. On a second pass, invite the child to act out one word of their choice. Let them pick the next tile that could join the action and explain the connection in their own words.</p>
    <h3>Make room for a different correct observation</h3>
    <p>A shop near a harbor could sell all sorts of things, including a sail. Acknowledge the story a child tells, then ask whether their proposed heading still works with the other three words. A good conversation can end with both of you liking the story and still choosing a different group to finish the puzzle.</p>

    <h2 id="classroom">Use one board for a short classroom activity</h2>
    <p>Project one numbered board and give each pair a scrap of paper. Ask for just one group, a heading and a reason. While pairs talk, keep the hints closed. Invite two pairs with different groups to share first. The class hears two ways to begin, and the screen still holds the evidence for both ideas.</p>
    <h3>Three questions worth putting on the board</h3>
    <LessonTable caption="Prompts for a partner or small group" headers={["When", "Ask", "Listen for"]} rows={[
      ["Two words match", "What other word would fit your heading?", "A prediction they can test."],
      ["One tile is doubtful", "Which of these four would you swap first?", "A reason for choosing that tile."],
      ["A group is solved", "Can you add a fifth example of your own?", "A new word that follows the same rule."],
    ]} />
    <p>For a quick final turn, ask everyone for a fifth example of a solved group. A marker might join the pencil case, while a fox could join the nighttime animals. Let the class vote on an example only after someone explains why it fits. The discussion works especially well when a proposed addition exposes a heading that is a little too broad.</p>
    <h4>Give everyone a way to report back</h4>
    <p>Fold a sheet into four squares. One partner draws a member of the group in each square while the other writes the heading across the top. Exchange sheets with a pair who picked another group and cover both headings. See whether the other pair can recover yours from the pictures. Keep any heading they invent that describes all four equally well.</p>
    <h4>Give the next class the same starting point</h4>
    <p>Choose a puzzle by number and open it before copying the address. The link brings the next pair to the same words with a fresh board. They can solve in a different order, use hints independently and compare the group that took the longest to explain. Replaying a finished board also gives everyone a new arrangement of the tiles.</p>
    <p>To make a version with words from your current lesson, use the <a href="/connections-maker">Connections puzzle maker</a>. Pick four examples of each concept and ask a colleague to try the result before class. For an offline activity using the classic daily game's vocabulary, the <a href="/connections-printable">printable puzzle archive</a> lets you choose a board and how much of the answer to print.</p>
  </article>;
}

import Link from "next/link";
import { LessonContents, LessonFigure, LessonTable } from "../lessons/LessonPage";
import lesson from "../lessons/lessons.module.css";
import styles from "./emoji.module.css";

const play = (board: number) => "/emoji-connections?board=" + board + "#emoji-board";

export default function EmojiGuide() {
  return <article className={lesson.article} aria-label="Emoji Connections picture puzzle guide">
    <h2>How to play Emoji Connections</h2>
    <p>Select four pictures that share a connection and press Submit. A correct group moves above the remaining tiles, where you can read its category and the names of its four members. Find all four groups to finish the board. A new incorrect guess uses one mistake. The fourth mistake ends the round and reveals the remaining answers.</p>
    <p>Give the first board a try before opening a hint. If you see an unfamiliar picture, switch on Show names. The caption identifies the object while leaving its group for you to work out. You can switch names on and off in the middle of a guess. Your selections and remaining mistakes stay as they were.</p>
    <LessonContents links={[
      ["read", "How to read a picture tile"],
      ["necks", "Board 2 and four kinds of neck"],
      ["ball", "Board 4 and the basketball clue"],
      ["feedback", "What a near miss tells you"],
      ["more", "Choose your next board"],
      ["archive", "Try an archive puzzle with emoji"],
    ]} illustration={<figure className={lesson.diagram}>
      <figcaption>Three readings of a picture</figcaption>
      <ol className={lesson.timeline}>
        <li><strong>Object</strong><span>A guitar is an instrument.</span></li>
        <li><strong>Part</strong><span>A guitar has strings and a neck.</span></li>
        <li><strong>Word</strong><span>Say its name and listen for a phrase.</span></li>
      </ol>
    </figure>}/>

    <h2 id="read">Read each picture more than one way</h2>
    <h3>Start with the noun you would say aloud</h3>
    <p>Imagine looking at a picture of an apple. You might say apple, fruit, snack or lunch. Begin with the most specific everyday name you recognize, then look around the board for three more objects that answer the same question. A second fruit gives you a promising pair. A lunchbox on its own only tells you that the two things could share a scene.</p>
    <p>When two people disagree about what a tile shows, turn on its name before arguing about the category. A picture of an orange citrus fruit could be described as an orange, a mandarin or a tangerine. Those differences barely matter in a group of fruit you can peel. They matter a great deal if the puzzle uses the name to make a longer word.</p>
    <h3>Move from an object to one of its parts</h3>
    <p>Cover the other tiles with your hand for a moment. What could you point to on this object? A clock has a face, a bottle has a neck and a gear has teeth. Now uncover the board and look for a different object with a part that has the same name. The two objects can have entirely different shapes and purposes.</p>
    <p>A precise label is easier to test than a story about the pictures. A notebook, a newspaper and a calendar might all sit on a desk, but so could a coffee cup or a lamp. “Usually made from paper” lets you inspect each candidate in turn. If the fourth item makes you change the test, hold that guess and scan the remaining tiles.</p>
    <h4>Use the controls while your idea is still forming</h4>
    <p>Tapping an already selected tile removes it from the guess. Deselect All clears the current four seats and leaves the pictures in place. Shuffle rearranges the remaining pictures while keeping your selections. Try shuffling when two neighbors seem inseparable simply because you have been looking at them side by side. Only a submitted new wrong group costs a mistake.</p>

    <h2 id="necks">Board 2 gives the giraffe two good homes</h2>
    <div className={lesson.spread}><div>
      <h3>Count the hooves before choosing four animals</h3>
      <p>Open <Link href={play(2)}>picture board 2</Link> if you want to work through this example. The giraffe, horse, zebra, cow and goat are all animals with hooves. The fact that one of them is especially tall does nothing to disqualify it. The puzzle asks a more interesting question. Which animal can leave the herd and do a useful job among the other pictures?</p>
      <p>Look at the guitar. A player presses the strings against the fingerboard along its neck. Now picture the narrow part of the bottle just below its opening. That part is a neck too. The T-shirt has a neck opening, and the giraffe supplies the literal animal neck. The horse, zebra, cow and goat can still make a full set of four.</p>
    </div><LessonFigure file="/images/emoji-connections-necks.webp" alt="A giraffe figurine, acoustic guitar, green bottle and folded crew-neck shirt." caption="Look at a different part of each object. The same word names a feature on all four."/></div>
    <h3>Test the shirt against the zipper row</h3>
    <p>The clothing tiles offer a second distraction. Jeans, a coat and a T-shirt could all hang in one closet. Look beyond the closet and you will find a backpack and a suitcase. Imagine closing each one. A zipper is plausible on both bags, on the front of a coat and on the fly of jeans. A standard crew-neck T-shirt takes you back to the other group.</p>
    <LessonTable caption="Three readings to try on board 2" headers={["First idea", "Word or picture to check", "What settles the choice"]} rows={[
      ["Animals with hooves", "Giraffe", "Four other hoofed animals fit without it."],
      ["Clothes in a closet", "Backpack and suitcase", "A zipper connects the bags to jeans and a coat."],
      ["Things with a neck", "T-shirt", "Name the opening your head passes through."],
    ]}/>
    <h4>Check what one exchange does to both groups</h4>
    <p>Suppose your proposed animals are giraffe, horse, zebra and cow. Swap the giraffe for the goat in your head. The new animal group is every bit as good, and the guitar group gains the member it needed. Trying the exchange the other way would leave the goat beside the bottle and the shirt. That comparison gives you evidence before you spend a guess.</p>

    <h2 id="ball">Board 4 turns pictures into the first half of a word</h2>
    <div className={lesson.spread}>
      <LessonFigure file="/images/emoji-connections-ball.webp" alt="A wicker basket with a snowball beside an orange basketball in the snow." caption="Basket and snow name different things. Add ball after each and you have two familiar compounds."/>
      <div><h3>Say the name, then add BALL</h3>
        <p>On <Link href={play(4)}>picture board 4</Link>, the basket might remind you of laundry or a picnic. Neither scene explains the fire or the snowflake. Say the object name and add ball after it. Basketball is an ordinary word. Try the same direction with snow and fire to get snowball and fireball. The foot supplies football and completes the four.</p>
        <p>You can see why the object names matter particularly on this board. A snowflake is a single crystal, yet the picture also represents snow. The name switch shows the short reading used in the puzzle. It still leaves you to discover the shared ending. If you start from the word basket rather than from the drawing of its handle, the partnership becomes easier to hear.</p>
      </div>
    </div>
    <figure className={lesson.diagram}><figcaption>One ending, four different pictures</figcaption>
      <ul className={styles.pairs}>{[
        ["🦶","Foot","Football"], ["🧺","Basket","Basketball"], ["❄️","Snow","Snowball"], ["🔥","Fire","Fireball"],
      ].map(([glyph,word,joined]) => <li key={word}><span className={styles.symbol} aria-hidden="true">{glyph}</span><div><strong>{joined}</strong><small>{word} + ball</small></div></li>)}</ul>
    </figure>
    <h3>Give the foot a job outside the body group</h3>
    <p>Ear, nose, eye, mouth and foot make five perfectly recognizable body parts. Point to where you would find each one. Four are on the head. The foot fits the broader description and sits outside the narrower one. This gives the word-building group an independent check. You can put the foot there without taking a member away from the face.</p>
    <p>Try the same exercise on the sewing pictures. A needle, thread, scissors and a safety pin can all live in one sewing kit. Thread passes through the eye of a needle, so the eye picture can draw your attention back to sewing. The actual eye belongs with the features of the head. Try naming all four members before following that tempting pair.</p>

    <h2 id="feedback">Use a near miss to decide which picture to move</h2>
    <h3>One away leaves four possible outsiders</h3>
    <p>A one-away guess contains three tiles from one intended group. The message leaves the identity of the odd tile open. Consider what would happen if you removed each candidate in turn. If dropping one picture leaves three with a much tighter description, find a fourth that fits that description before submitting again. This saves you from cycling blindly through every spare tile.</p>
    <LessonTable caption="How the game responds to a submitted group" headers={["Message", "What you know", "A useful next move"]} rows={[
      ["Correct!", "All four belong to the revealed category.", "Read its label and inspect the remaining pictures."],
      ["One away…", "Three belong together.", "Compare the possible outsiders with the other groups."],
      ["Incorrect", "No category has three of your tiles.", "Test a different pair or try another reading."],
      ["Already guessed!", "That same set was submitted earlier.", "Replace a tile. This repeat costs no extra mistake."],
    ]}/>
    <p>Take a board with a shark, a seal and several tools. Adding another sea animal might help you find a group quickly, but it does little to explain why a comb and a gear appeared together. Ask what the gear and the comb have in common first. Once you have a second place to put the shark, you can make a much more deliberate change to the ocean row.</p>
    <h4>Read the note after the last group appears</h4>
    <p>Each board ends with a short explanation of its central overlap. Compare that explanation with the rule you used. If two descriptions choose the same four tiles, yours can be perfectly serviceable. The more useful question is whether your description would also have admitted a fifth picture. On a replay, see how soon you can explain why that fifth candidate belongs somewhere else.</p>

    <h2 id="more">Choose a board for the kind of clue you enjoy</h2>
    <h3>Pick a shared feature you can point to</h3>
    <p><Link href={play(3)}>Board 3</Link> works well for two players who enjoy arguing a case. One person gets the comb and the gear. The other gets the marine animals. Have each person choose the next tile their group needs and give a reason for it. A shark really is an ocean hunter, yet its teeth also connect it to the tools. Decide which arrangement uses every tile once.</p>
    <p>For a less visible part, open <Link href={play(5)}>board 5</Link>. Put a finger on the side of an imaginary wristwatch where you would adjust the time. That little knob has a name. Look at the top of a pineapple and then at the top of a tree. If you can use the same noun for all three, try it once more on the tooth.</p>
    <h4>Ask what the picture leaves out</h4>
    <p>The piano tile shows a keyboard. Imagine lifting the lid of an acoustic piano, striking a key and watching a small hammer hit the strings inside. The violin and guitar show their strings on the outside. The banjo joins them too. Drawing the entire instrument at the size of a tile would make the keys hard to see, so a player has to supply the rest.</p>
    <p>Compare that with the airplane on the same board. Both wings are visible in the drawing. A bat, a bee and a butterfly use wings to fly as well. If a teammate objects to the airplane because it has an engine, read your proposed label aloud. “Flying animals” excludes it. “Things with wings” includes all four and still leaves a clear role for the piano.</p>
    <h3>Change the direction of a compound</h3>
    <p><Link href={play(6)}>Board 6</Link> makes an interesting follow-up to the basketball board. On board 4 you supplied a word after each picture. Here, try leaving a space in front. A coat might land with other garments until you say raincoat. Use the same beginning with drop and storm. Finally consider what you would call a ribbon tied into two loops.</p>
    <p>For a group session, choose a board number and send its page address to another player. Let each person finish independently before comparing guesses. Ask which picture they renamed in their head, which row attracted five candidates, and what finally freed the extra one. Those answers tell you more about how you each saw the picture than a comparison of mistake totals alone.</p>

    <h2 id="archive">How these boards compare with an archive picture puzzle</h2>
    <p>For a historical example, look at <Link href="/connections-number/295">Connections puzzle 295 from April 1, 2024</Link>. One of its groups used a brain, a plane, rain and a train. The four objects have little in common at a glance. Say their English names aloud and the common ending becomes apparent. Another group used the sounds of letter names, a different test on the very same board.</p>
    <p>Try alternating that archive example with a numbered board here. First describe the pictures to someone who cannot see them. Then let that person suggest a connection using just the words you supplied. Switch roles for the next guess. If you would like a shorter round built around written words, <Link href="/mini-connections">Mini Connections</Link> gives you nine tiles and three groups to find.</p>
  </article>;
}

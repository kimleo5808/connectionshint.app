import Link from "next/link";
import { LessonContents, LessonFigure, LessonTable } from "../lessons/LessonPage";
import styles from "../lessons/lessons.module.css";

export default function MakerGuide() {
  return <article className={styles.article} aria-label="How to write a custom Connections puzzle">
    <h2>How to make a Connections puzzle someone else can solve</h2>
    <p>Try writing down four words that go with music. Now imagine a friend has to find those four in a crowd of sixteen. What would persuade them to pick TENOR and leave BASS behind? That small decision is the heart of puzzle making. Load <em>The Sunday Set</em> in the editor to follow one original board from its first tempting mistake to its final answer key.</p>
    <LessonContents links={[
      ["first-group","Write a group that holds together"],["red-herring","Test the two readings of BASS"],
      ["four-rows","Build the other three groups"],["playtest","Run a blind playtest"],
      ["audience","Adapt the board for your players"],["share","Send the playable version"],
    ]} illustration={<LessonFigure file="/images/connections-maker-worktable.webp"
      alt="Hands moving a tile among groups of colored paper squares on a cutting mat."
      caption="Move one tile at a time. Check what happens to the group it leaves behind."/>}/>

    <h2 id="first-group">Write the group name before the fourth tile</h2>
    <h3>Give your solver a sentence they can finish</h3>
    <p>Start with a subject you could explain across a kitchen table. For the yellow group in our example, the sentence is “You could catch a freshwater fish called a ___.” CARP, PIKE and PERCH fit without any extra explanation. BASS fits too. That makes a handy answer key: you can say the same short sentence four times and mean it every time.</p>
    <p>Now try a first draft labeled “A day at the lake.” A bass might swim there, a rod might catch it, a sandwich might sit on the bank and a boat might pass overhead. A player could defend almost any picnic word with a little imagination. Narrowing the label to freshwater fish gives that player a way to decide when a guess is complete.</p>
    <h4>What to do with a word you love</h4>
    <p>Suppose the word you really wanted was REEL. Put it aside while you finish the fish. Later you might discover three dances to go with it, or three other things you do with a fishing line. Keeping one word in reserve gives a future board a starting point and saves the current group from having to explain a fishing tool as a fish.</p>
    <h3>Know which words carry the clue</h3>
    <p>Read the four fish names to a friend, one at a time. PIKE could be a weapon and PERCH could be a place to sit. CARP is especially helpful because it gives the listener a way into the fish reading. When several words have two lives, one recognizable member can do more for the experience than an elaborate clue attached to the answer screen.</p>

    <h2 id="red-herring">The BASS test for a fair red herring</h2>
    <div className={styles.spread}>
      <LessonFigure file="/images/connections-maker-bass.webp" alt="A blue paper largemouth bass faces a wooden double bass."
        caption="BASS can point to fish or music. The other fifteen tiles decide which reading works here."/>
      <div><h3>Give the tempting word somewhere to go</h3>
        <p>On the shuffled example board, put BASS beside ALTO, TENOR and SOPRANO. All four can name singing voices. A player who sees this has made a good observation. The pressure comes from BARITONE still being on the table. Try switching it in for BASS and the fish group gains exactly the word it needed.</p>
        <p>Say the fish name aloud, then say the name of the instrument in the picture. The spelling holds still while the sound changes. On a board of printed tiles, the solver gets to choose a pronunciation. That small freedom makes BASS a much more interesting crossing point than a word whose only connection to music is that it once appeared in a song.</p>
      </div>
    </div>
    <h3>Could a player swap two tiles and still be right?</h3>
    <p>Consider an earlier possible green group containing DRUM, FLUTE, HARP and OBOE under “musical instruments.” A freshwater drum is a fish. A bass can be an instrument. Exchange DRUM and BASS and you can still fill both the instrument group and the fish group. A player who knows both meanings could give you a second complete solution and explain every word.</p>
    <LessonTable caption="One revision that preserves the trap" headers={["Draft","Green group","What the swap leaves behind"]} rows={[
      ["Early idea","DRUM · FLUTE · HARP · OBOE","DRUM can take the vacant place among the fish. Both arrangements work."],
      ["Playable example","ALTO · BARITONE · SOPRANO · TENOR","Moving BASS into voices leaves a voice with nowhere to go among the fish."],
    ]}/>
    <h4>Leave the interesting mistake in place</h4>
    <p>You could solve the ambiguity by removing BASS entirely. The published example takes a different route and changes what the green group asks for. The tempting guess survives, and the leftover tiles give a careful solver evidence to change their mind. When editing your own puzzle, try adjusting the neighboring group before giving up the word that made you want to write the board.</p>

    <h2 id="four-rows">Give each of the four rows a different job</h2>
    <h3>Use a physical object for a change of pace</h3>
    <p>After fish and voices, picture opening a hardcover book. You can run a finger down its SPINE, slide off its JACKET, lift the ENDPAPER and turn to the TITLE PAGE. Someone who does not recognize ENDPAPER immediately can still work from the other three. They have a physical object to picture while testing the unfamiliar word against the rest of the board.</p>
    <p>BOOK would be a tempting addition here. It would also change the relationship: it names the whole object while the others are parts. Put it beside PILLOW, SHOW and SUIT, and it starts asking for CASE as well. Before adopting a particularly clever tile, check which jobs it would be doing in the two groups it touches. Sometimes one useful word comes with too many possible repairs.</p>
    <h3>Read the purple row in a fixed direction</h3>
    <p>PILLOW, SHOW, STAIR and SUIT each make a familiar word when CASE goes on the right. Read each completed word aloud. A pillowcase goes on a bed. A showcase puts something on display. A staircase takes you to another floor. A suitcase can travel with you. The four objects have very little in common until you supply the missing letters.</p>
    <figure className={styles.diagram}>
      <figcaption>Keep the missing piece on the same side</figcaption>
      <div className={styles.phraseGrid}>{["Pillow","Show","Stair","Suit"].map(word=><div key={word}><strong>{word}</strong><span>+ case</span></div>)}</div>
    </figure>
    <h4>Decide whether an expression is familiar enough</h4>
    <p>Imagine you want to use TROPHY to complete “trophy case.” The expression is familiar, but it uses two words where the other examples close up into one. You might deliberately allow that and name the group accordingly. For this particular set, four single compounds give the player a tidy check on their last guess. A consistent small detail can make the final reveal more satisfying.</p>

    <h2 id="playtest">Playtest the board before you send it</h2>
    <figure className={styles.diagram}>
      <figcaption>From the answer key to a friend’s board</figcaption>
      <ol className={styles.timeline}>
        <li><strong>Write</strong><span>Name each group and enter its four tiles.</span></li>
        <li><strong>Playtest</strong><span>Try a tempting wrong guess on the shuffled grid.</span></li>
        <li><strong>Share</strong><span>Copy the player link and open it in a fresh tab.</span></li>
      </ol>
    </figure>
    <h3>Try to break your favorite group first</h3>
    <p>Press Playtest and choose BASS, ALTO, TENOR and SOPRANO. You should see the one-away message. Now put BARITONE in place of BASS and submit again. Watch the difference between the two outcomes. This deliberately awkward first guess checks the trap more carefully than solving four groups from memory in the order you wrote them down.</p>
    <p>Next look at the remaining grid from the opposite direction. Suppose your friend opens with book parts and spots the CASE endings immediately afterward. Are there still enough clues to separate fish from voices with eight words left? Trying two different solving orders can expose a puzzle that makes sense only when someone follows the exact route you had in mind.</p>
    <h3>Ask one question after a blind solve</h3>
    <p>Give a tester the player link. Let them finish a group or run out of guesses before explaining anything. Then ask which four words they most wanted the game to accept. Write down their exact selection. A single strange choice might just be a personal association. Four words that another person can explain with one clean label deserve a closer look.</p>
    <h4>Use their answer to choose an edit</h4>
    <p>A tester who recognizes the fish and gets stranded on ENDPAPER may need a more familiar book part. A tester who offers you a second complete arrangement has found a structural problem that a hint will never resolve. Make one change, then replay the section of the board where the trouble first appeared. Changing all four groups at once makes it hard to tell what helped.</p>
    <h4>Try the reveal with the group name covered</h4>
    <p>Show a tester just the four book tiles after the game and ask them to write the label they expected. “Pieces of a book” is close enough to tell you the idea landed. “Things in a library” is worth a follow-up. Ask where they pictured JACKET. If they meant the coat on a chair, their route to the answer was quite different from the one you imagined.</p>
    <p>That distinction matters when you choose what to change. A short explanation of a dust jacket might give this player a pleasant discovery. Replacing JACKET with COVER would make the row easier on sight. Keep the first version when discovering a second meaning is the pleasure of the puzzle. Choose the second when the book group is meant to give beginners an early foothold.</p>

    <h2 id="audience">Tune a custom puzzle for the people playing</h2>
    <LessonTable caption="What changes with the audience?" headers={["Setting","Start with","Check with a tester"]} rows={[
      ["Family evening","Four people, places or objects everyone at the table knows.","Can the newest guest recognize the category from the tiles?"],
      ["Classroom","A concept students have worked with in more than one example.","Can students explain the rule in their own words?"],
      ["A puzzle-loving friend","An ordinary word with two credible readings.","Does one reading give a good home to every leftover tile?"],
    ]}/>
    <h3>For a class, turn the reveal into a question</h3>
    <p>A music teacher could adapt the green group and ask students to arrange the revealed voices from lower to higher. That gives the class something to discuss after the last guess. Leave the specialist vocabulary in a group where a familiar example can support a newer one. If students are still learning the words, four unfamiliar terms together test recall of a list more than recognition of a relationship.</p>
    <h3>For a family, let a newcomer into the joke</h3>
    <p>Picture a holiday puzzle with a row about four things left behind on family trips. It might be hilarious to the people who were there and impossible for the person who joined you this year. Give the tiles an everyday connection a newcomer can discover, then tell the vacation story when the group appears. Both players get a chance to contribute, and the reveal gives the host a natural moment for the story.</p>
    <h4>Pick a title that suits the occasion</h4>
    <p>Use the invitation as a test. A friend opening “Friday after dinner” knows which game you sent without learning anything about the answers. A title such as “Four cases for the choir” gives a practiced solver two of the mechanisms before the first tap. Read your title once beside the shuffled grid and decide how much of a head start you want to give the room.</p>

    <h2 id="share">Share the version you want people to play</h2>
    <h3>What does the player link include?</h3>
    <p>The link carries a copy of your title, the sixteen tiles and their group assignments. Your friend opens a shuffled grid and can play without an account. The group names appear as the game reveals the solution. Give the board a neutral title if you want the opening guess to be a surprise. “The Sunday Set” gives away less than “At the Lake with the Choir.”</p>
    <p>If a test solve sends you back to the editor, make the change and generate a fresh link. The person holding the earlier link can still play the earlier version. This makes it easy to compare two drafts: keep the first link in your notes, send the revised one to a second tester, and ask where each player made their first confident guess.</p>
    <h4>What if someone opens an incomplete link?</h4>
    <p>Copy the full address from the Player link field, including the part after the hash sign. Pasting just the beginning opens the player without its board. To check delivery, open the copied address in a separate tab and look for your title above sixteen ungrouped tiles. Once you see those, you have the version to send around the table.</p>
    <p>Ready to try your own idea? <a href="#editor">Return to the editor</a> and start with one quartet you can explain in a sentence. For more examples of how a tempting fourth word changes a guess, the <Link href="/guides/connections-one-away">one-away guide</Link> lets you try the swap yourself. The <Link href="/connections-practice/purple-groups">purple group practice board</Link> is a place to experiment with harder patterns before writing one for someone else.</p>
  </article>;
}

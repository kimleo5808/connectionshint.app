import Link from "next/link";
import { LessonContents, LessonFigure, LessonTable } from "../lessons/LessonPage";
import page from "../lessons/lessons.module.css";
import styles from "./results.module.css";

function Strip({ row }: { row: string }) {
  const names: Record<string,string> = {Y:"yellow",G:"green",B:"blue",P:"purple"};
  return <span className={styles.strip} role="img" aria-label={[...row].map(c=>names[c]).join(", ")}>
    {[...row].map((c,i)=><i key={i} data-color={c} aria-hidden="true">{c}</i>)}</span>;
}

export default function ResultsGuide() {
  return <article className={page.article} aria-label="Guide to reading Connections results">
    <h2>How to read the squares in a Connections result</h2>
    <p>Each row records one submitted guess. A square takes its color from the answer group that owns the selected word. Four squares of one color mean a solved group. A row containing two or more colors means one mistake. Read the rows from top to bottom and you can follow a friend’s solve even if neither of you wants to give away a single word.</p>
    <LessonContents links={[["first-read","Read a five-row result"],["near-miss","Find a one-away guess"],["mixed","Distinguish the mixed rows"],
      ["finish","Recognize a win or a loss"],["compare","Compare two players"],["copy","Copy and check a grid"]]}
      illustration={<LessonFigure file="/images/result-grid-loupe.webp" alt="A magnifying glass over a blue tile beside three yellow tiles."
        caption="Three yellow squares and one blue square put this guess one word away from yellow."/>}/>

    <h2 id="first-read">Follow a five-row result from the first guess</h2>
    <p>Choose <strong>One away</strong> above to load a worked example. The opening row contains three yellow squares and a blue square. Yellow is the group the player came close to solving. Blue is the group that supplied the outsider. At this point you can tell exactly how close the selection was, even though you have no way to name the four words.</p>
    <h3>Why does the next row turn green?</h3>
    <p>The second row is solid green. The player found all four green words while the yellow group was still on the board. They might have deliberately put a troublesome guess aside, or the green connection may have jumped out as they looked again. The order tells you when green was submitted successfully. Their reason for choosing it is a good question to ask afterward.</p>
    <p>Read the last three rows aloud as colors: yellow, purple, blue. Four different groups have now been solved. Five submissions minus four correct guesses leaves one mistake. The one-away count is also one, because that very first submission was the only mixed row. Counting the near miss a second time would give the player a penalty for a guess they made only once.</p>
    <h4>What happened between the rows?</h4>
    <p>A player might select three words, change their mind, shuffle the board and start another quartet. Until they submit a guess, that exploration creates no row to share. Two green words you considered for a minute leave exactly the same trace as two you never looked at. This is why the grid can settle a question about guesses while leaving a good deal of the story to its player.</p>
    <LessonTable caption="Three different questions about the example" headers={["What do you want to know?","Where to look","Answer"]} rows={[
      ["Which group was first solved?","The first solid row","Green, on guess two."],
      ["Which group was first nearly solved?","The first row with three matching squares","Yellow, on guess one."],
      ["Which group remained at the end?","The last solid row","Blue, on guess five."],
    ]}/>

    <h2 id="near-miss">What three matching squares can tell you</h2>
    <h3>Read the majority color first</h3>
    <p>Imagine a row that reads green, purple, green, green. Move the purple square to the end when describing it to a friend and the diagnosis stays the same. Three selected words belong to green. One belongs to purple. The printed position of that purple square helps you point at it in the message, but the message carries no tile labels to go with those positions.</p>
    <p>To see what that means in words, take an older board. On <Link href="/connections-hint/2025-03-11">March 11, 2025</Link>, the green group was things that ring. Imagine choosing BELL, ALARM, PHONE and KEYS. Keys can jingle on a metal ring, which gives that last word a reason to feel at home. In the puzzle it belongs to a different group, leaving the selection one away from green.</p>
    <h4>Two different guesses can produce the same picture</h4>
    <p>Keep BELL and PHONE, then use INTERCOM in place of ALARM. For the fourth word use KING instead of KEYS. KING and KEYS both come from the purple group on that board. Your second imagined guess still contains three greens and a purple. Anyone who saw just the colored squares would have no basis for deciding whether you tried the keys or the king.</p>
    <p>This is also why two identical mixed rows in a friend’s message can be perfectly plausible. The player could have changed one word for another of the same color. The rows preserve the mix and lose the spelling. If your friend swears they swapped a tile, check what the color can actually tell you before declaring that they made the same guess twice.</p>

    <h2 id="mixed">Read a mixed row by counting the largest group</h2>
    <figure className={page.diagram}><figcaption>Four ways a wrong guess can look</figcaption>
      <ul className={styles.diagramList}>{[["YYBY","Three plus one · one away"],["GBGB","Two pairs"],["PBPY","One pair and two singles"],["PGYB","Four different groups"]].map(([row,label])=>
        <li key={row}><Strip row={row}/><strong>{label}</strong></li>)}</ul>
    </figure>
    <h3>Two pairs can feel very convincing</h3>
    <p>Take a guess with two greens and two blues. Each pair could have an excellent connection internally. The two green words might both ring, while the two blue words could name objects often made of leather. A story about a telephone in a leather case could make the four sound related. The result records two pairs because group membership is what the game checks when you submit.</p>
    <p>For a guess with two purples, one blue and one yellow, begin with the same question. How many of these words share one actual group? The largest set is the purple pair. You would need to replace two words to complete purple. A two-pair row also needs at least two replacements to complete either of its pairs, even though its picture looks more symmetrical.</p>
    <h4>Where one away ends</h4>
    <p>One square of every color represents four different destinations. You can keep any one word as the start of a group, but you would have to change the other three to finish it. The game still charges just one mistake for submitting the row. The number of tiles you would replace and the number of guesses spent answer different questions about the same turn.</p>
    <p>If you want to feel the difference on a board, the <Link href="/guides/connections-one-away">one-away practice guide</Link> lets you swap a tile and inspect the result. Try saying which group you intend to finish before making the swap. That gives you something specific to check when the feedback appears and makes it easier to explain your next choice to a partner.</p>

    <h2 id="finish">Recognize a perfect solve, a loss and a partial grid</h2>
    <p>In a complete winning result, look for one solid row of each color. Exactly four rows with all four groups solved means a perfect game. A mixed row can appear before the first solid row or between two later solves. With three mistakes before the last solve, a winning grid can extend to seven rows. Read the colors before trying to judge the outcome by its height.</p>
    <LessonTable caption="What the ending supports" headers={["Rows you received","What you can report","What to check"]} rows={[
      ["Four different solid rows","All four groups solved without a miss in the pasted grid.","Count each group once."],
      ["Four mixed rows and no solid rows","The fourth mistake ended this game.","No groups were solved before the limit."],
      ["Two solid rows and one mixed row","Two groups solved and one miss shown.","More rows are needed for the final result."],
    ]}/>
    <h3>Three solid rows leave a very particular board</h3>
    <p>Once three groups have been removed, only four words remain and they belong to the same color. A subsequent mixed guess would require a word from a group that has already left the board. If someone pastes a solid green line and later a row containing green, check whether two separate results were joined when copying a conversation. The reader flags this point rather than counting an impossible turn.</p>
    <h4>Check what got copied before calling a loss</h4>
    <p>Two mixed rows at the end of a screenshot can look dramatic. If those are the only rows visible, you know there have been two misses in the excerpt. There is still room for the player to recover. Pick the four-miss example above and remove the last line. Reading it again changes the outcome to partial because the fourth unsuccessful submission is no longer present.</p>
    <h3>Can two six-row results end differently?</h3>
    <p>Draw six short dashes on paper. Mark four of them as solves and place a miss on each of the other two. End on a solve and you have the outline of a win. On a second line of six dashes, mark just two solves and four misses, with the last miss at the end. That player ran out of guesses. Both messages take up the same space on a phone.</p>
    <figure className={page.diagram}><figcaption>Two paths through six submissions</figcaption>
      <div className={styles.paths}>{([
        ["Win", ["Miss","Solve","Solve","Miss","Solve","Solve"]],
        ["Loss", ["Miss","Solve","Miss","Solve","Miss","Miss"]],
      ] as const).map(([label,turns]) => <div key={label}><b>{label}</b><ol>{turns.map((item,i)=>
        <li data-miss={item === "Miss"} key={i}>{item}</li>)}</ol></div>)}</div>
    </figure>
    <p>Try the same thought experiment with only four dashes. A complete four-row win needs all four to be solid. A complete four-row loss needs all four to be mixed. If you see two of each, there is no way to infer the ending from those four rows alone. Asking for the rest of the message is enough to resolve the uncertainty.</p>

    <h2 id="compare">Compare two players who used the same number of guesses</h2>
    <div className={page.spread}><LessonFigure file="/images/result-grid-tallies.webp"
      alt="Two manual tally counters in different colors, ready to compare two players’ guess totals."
      caption="A guess count measures how many submissions you used. The rows show where your paths differed."/>
      <div><h3>Ask which group each player found first</h3>
        <p>Imagine two friends who each send four solid lines. One went yellow, green, blue, purple. The other went purple, blue, green, yellow. Both have perfect results. The second friend happened to recognize the group marked trickiest at the start, perhaps because its wordplay was familiar to them. The first friend used the easiest group as a way into the other twelve words.</p>
        <p>Now give both friends a five-row win. One gets a yellow one-away before solving anything. The other solves two groups cleanly and then guesses a pair from each of the remaining groups. Both spent one mistake. The first player might want to talk about the odd word in a strong trio. The second might want to explain why the final eight seemed to split in two different ways.</p>
      </div></div>
    <h4>Why a personal ranking needs more information</h4>
    <p>The squares alone contain no timer, player identity or statistics for everyone else who played that day. A friend who took ten quiet minutes can send the very same grid as one who spotted the groups over breakfast in a hurry. To compare with other solvers on the publisher’s game, see the information about Connections Bot and ratings in <a href="https://thenewyorktimeshelpcenter.helpjuice.com/360011158491-New-York-Times-Games/28525912587924-Connections">the New York Times Help Center</a>.</p>

    <h2 id="copy">How to copy a result without sharing the answers</h2>
    <h3>Keep each submitted guess on its own line</h3>
    <p>Use the game’s share option when the result is available and copy the colored squares. The Connections heading and puzzle number can stay above them. A message often contains someone else’s result just beneath yours, so check where your own last row ends. In the reader, each line can also be typed using the initials Y, G, B and P. This is handy when a keyboard makes individual emoji awkward to enter.</p>
    <p>For a quick check, enter YYYB on one line and GGGG on the next. The first submission came close to yellow. The next solved green. Change the blue letter at the end of the first line to a fourth Y and read it again. Now the same two submissions record two solved groups and zero mistakes. That one-letter edit is a small demonstration of exactly what the squares encode.</p>
    <h3>Share the solve order before discussing clues</h3>
    <p>If a friend still plans to play, send just the grid and let them decide whether to ask for a hint. Even a broad clue can reveal more than the squares. After they finish, compare the word each of you considered moving when a guess came back one away. That conversation can be far more revealing than comparing who finished with one extra row.</p>
    <p>To keep a longer record, enter the outcome in the <Link href="/connections-streak">streak tracker</Link>. To read another result, <a href="#reader">return to the grid reader</a> and paste the new set of rows. Each grid describes one attempt at one board, so reading them separately keeps the sequence of removed groups and remaining guesses intact.</p>
  </article>;
}

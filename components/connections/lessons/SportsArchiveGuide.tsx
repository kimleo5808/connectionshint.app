import { LessonContents, LessonFigure, LessonTable } from "./LessonPage";
import styles from "./lessons.module.css";

const replay = (date: string) => "/connections-sports-edition?date=" + date;
const contents: [string, string][] = [
  ["choosing", "Choose a board without spoilers"],
  ["ballpark", "A souvenir helmet and four golf shots"],
  ["scoring", "Two ways to read a score"],
  ["ties", "How four sports settle a tie"],
  ["names", "Read a team name twice"],
  ["practice", "Build a three-board practice session"],
];

export default function SportsArchiveGuide() {
  return <article className={styles.article} aria-label="Sports archive field guide">
    <h2>A field guide to past Sports Connections puzzles</h2>
    <p>Someone sends you a grid of colored squares after a game, and by the time you see it, the daily board has changed. Find that edition in the calendar above and you can play it before asking what their last row meant. If you came to practice, the dates below offer a different way in. Each one illustrates a particular decision you can try on the board yourself.</p>
    <LessonContents links={contents} illustration={<LessonFigure file="/images/sports-archive-helmet.webp"
      alt="Ice cream in a miniature batting helmet beside a serving of ballpark fries."
      caption="On the February 19 board, the helmet belongs at the concession stand."/>}/>
    <h2 id="choosing">Choose a board without spoilers</h2>
    <h3>Start with the date on the result</h3>
    <p>If a friend says they played on Tuesday, ask which date appeared above the puzzle. A message sent just after midnight can refer to yesterday’s solve. Open that month here and choose the shaded day. The calendar gives you the edition date without listing its categories. You can send the dated game link to a friend and both start with the same sixteen words.</p>
    <p>If the result has a number, use the number printed on the Sports Edition result. The classic Connections game has its own sequence. Entering a number from the classic game can open a perfectly playable sports puzzle from a completely different day. A useful cross-check is the edition date printed above the board after you open it.</p>
    <h4>What an unavailable day tells you</h4>
    <p>A crossed-out date means this archive has no complete, verified text board for that day. An upcoming date is plain. A missed day stays visible so that the rows still line up with the weekdays. For early preview boards, the date is the most reliable way to share a game. For a challenge across different time zones, sending the dated link also saves both players from guessing what “today” means.</p>
    <h3>Pick the kind of challenge you want</h3>
    <LessonTable caption="Three starting points from the archive" headers={["If you enjoy…","Open this board","Try this before submitting"]} rows={[
      ["Everyday language", <a href={replay("2025-02-19")}>February 19, 2025</a>, "Give CHIP two meanings."],
      ["Scorekeeping", <a href={replay("2025-03-11")}>March 11, 2025</a>, "Say the numbers aloud as an umpire might."],
      ["Rules across sports", <a href={replay("2026-03-23")}>March 23, 2026</a>, "Picture the moment at the end of regulation."],
    ]}/>
    <p>To play any example blind, open its date before reading the section below. Once a quartet is solved, compare your own description with the printed category. A close match tells you what you understood. A looser description can be more interesting, because it shows exactly where another tile might have slipped into your group.</p>

    <h2 id="ballpark">What is CHIP doing at the ballpark?</h2>
    <p>On <a href={replay("2025-02-19")}>February 19, 2025</a>, CHIP looks quite comfortable beside FRIES and NACHOS. If your first picture is a concession stand, you already have a reason to keep those words near each other. You also have a problem. The board has more food associations than you can comfortably defend as a single group of four.</p>
    <h3>Make the golfer finish the sentence</h3>
    <p>Try saying “the golfer played a…” before each candidate. CHIP works, and so do DRIVE, PUNCH and PUTT. A punch shot may be the least familiar of the four. Picture a golfer trying to keep a shot low under a branch. That image gives PUNCH a specific job. Now go back to the food group and see whether it still needs CHIP.</p>
    <p>FRIES, ICE CREAM, NACHOS and TENDERS fit the published category of food served in a baseball helmet. The unusual detail is the container. If you have never eaten out of a miniature batting helmet, you can still solve the board. Four recognizable concession foods remain together after CHIP has an especially good home among the golf shots.</p>
    <figure className={styles.diagram}><figcaption>Two readings of one tile</figcaption>
      <div className={styles.mapRoot}>CHIP</div><ul className={styles.branches}>
        <li><strong>At the concession stand</strong><span>A snack. FRIES and NACHOS make this tempting.</span></li>
        <li><strong>On the golf course</strong><span>A shot. DRIVE, PUNCH and PUTT complete the group.</span></li>
      </ul>
    </figure>
    <h4>Try the same test with DRIVE</h4>
    <p>DRIVE can describe a trip down a football field or an attack toward a basketball hoop. Pick either reading and look for three companions on this particular board. Then repeat the exercise with the golf reading. Counting plausible companions is more revealing than counting definitions. You are looking for the interpretation that lets the other twelve words work too.</p>
    <p>There is a second trap for a sports fan here. LIONS, TIGERS and BEARS practically announce themselves as team nicknames. Read them aloud in that order and pause. OH MY suddenly sounds like the end of a familiar line. That fourth tile is evidence you could easily overlook while trying to remember another animal mascot.</p>

    <h2 id="scoring">Two scoreboards, two kinds of language</h2>
    <p>The <a href={replay("2025-03-11")}>March 11, 2025 puzzle</a> rewards anyone willing to say a score out loud. LOVE, 15 and 40 belong in the voice of someone calling a tennis game. DEUCE can be called from the same chair. You need no arithmetic pattern that turns the first number into the next one. You need four expressions that make sense in that setting.</p>
    <h3>Listen for a state or an event</h3>
    <p>The basketball group nearby asks a different question. Imagine a commentator describing a successful shot. BASKET, BUCKET, FIELD GOAL and MAKE can each name what just happened. Saying “that was a nice deuce” does very little to connect the two rows. The distinction between a score being announced and a shot going in helps keep the quartets apart.</p>
    <LessonTable caption="Three tests for a scoring word" headers={["Prompt","A tile that passes","What it explains"]} rows={[
      ["What might the tennis umpire call?", "DEUCE", "A state of the game can have a spoken name."],
      ["What did the basketball player get?", "A BUCKET", "A successful shot can have an informal name."],
      ["Whose story does this number belong to?", "24", "A number can identify a player as well as a score."],
    ]}/>
    <h4>Give the extra number a chance</h4>
    <p>There is a particularly good decoy in 24. Seeing 15 and 40 makes another numeral feel like an easy addition. On this board, 24 belongs with GIANTS, SAY HEY KID and THE CATCH through Willie Mays. If you recognize two of those references, set 24 beside them temporarily. Then check whether the tennis group is easier to name with DEUCE back in it.</p>
    <p>For a second pass, cover the published group names and describe each quartet to someone who has never watched those sports. What could they hear from the umpire? What could they hear from a fan after a shot? If your examples come easily, you have a clue you could give another player without handing over all four words.</p>

    <h2 id="ties">What happens when regulation ends level?</h2>
    <div className={styles.spread}><LessonFigure file="/images/sports-archive-curling.webp" alt="Curling stones on the rings beside an inset of a hockey puck and net."
      caption="An extra end and a shootout take different forms. Both can decide a tied contest."/>
      <div><h3>Look for a shared job across sports</h3>
        <p>On <a href={replay("2026-03-23")}>March 23, 2026</a>, a baseball fan might spot EXTRA INNINGS immediately and start searching for three more baseball phrases. Try holding the game clock still for a moment. The score is level and ordinary play has finished. What choices can the rules give the players next?</p>
        <p>EXTRA END takes you to curling, where an end is a unit of play. OVERTIME extends a contest. SHOOTOUT changes how opponents take their chances. The four terms belong together because they can settle a tie. Some describe longer play and one describes a different procedure. The category leaves room for both.</p>
      </div></div>
    <figure className={styles.diagram}><figcaption>From one game situation to four tiles</figcaption>
      <div className={styles.mapRoot}>Tied score</div><ul className={styles.branches}>
        <li><strong>Extend play</strong><span>Extra innings · Extra end · Overtime</span></li>
        <li><strong>Take attempts</strong><span>Shootout</span></li>
      </ul></figure>
    <h4>Use the outlier to improve the label</h4>
    <p>Suppose you wrote down “extra periods” before seeing SHOOTOUT. The fourth tile is an invitation to revise your wording. Ask what extra periods accomplish, then ask whether a shootout can accomplish the same thing. This small change gives you a category specific enough to test without requiring every sport to resolve a tie under identical rules.</p>
    <p>The same board offers a useful counterexample. SHOTGUN sounds a little like SHOOTOUT and might tempt you to group two dramatic words together. Read it beside WILDCAT and WISHBONE. Those are names a football coach could put on a formation diagram. Even the solitary letter I starts to look at home once you picture the backs lined up behind the quarterback.</p>

    <h2 id="names">When a team name doubles as a clue</h2>
    <h3>Keep the exact word on the tile</h3>
    <p>Think back to the March 23 board and the word CARDINALS, this time as a possible group label. ARIZONA and ST. LOUIS make a strong professional-sports pair. LOUISVILLE and BALL STATE complete the set through college teams. A search limited to four teams from the same league would miss half the connection. The shared nickname is the useful part of the label.</p>
    <p>Now open <a href={replay("2025-02-23")}>February 23, 2025</a> and try CECIL, PRINCE, CATCHER and SHORTSTOP. A catcher and a shortstop are fielders. Cecil Fielder and Prince Fielder supply the very same word as a surname. A category can make a small joke from switching between those readings. Adding a familiar first or last name aloud can bring an apparently unrelated pair into focus.</p>
    <h4>Try a clue that works for all four fielders</h4>
    <p>Imagine giving this clue to a partner who knows baseball positions but has never heard of either player. “People in the infield” may help them choose CATCHER and SHORTSTOP. To help with the other pair, ask what word you could print on the back of both players’ jerseys. Your partner gets a reason to consider names, and you can still leave both first names for them to discover.</p>
    <p>There is another reward for looking at the leftovers. On that same board, PITCH is a candidate for a baseball group until you put it alongside GROUNDS, FIELD and TURF. Try describing a soccer match after heavy rain. A commentator might talk about the condition of the pitch. A completely ordinary use of the word now explains why the tempting baseball reading would have cost you a guess.</p>
    <h4>Make the location do some work</h4>
    <p>On <a href={replay("2025-03-28")}>March 28, 2025</a>, GRITTY and the PHILLIE PHANATIC can get a Philadelphia fan halfway to a group. SWOOP and FRANKLIN complete the mascot quartet. If you know only the first pair, ask what sort of figure you would expect to see entertaining a crowd. That question gives you a way to weigh the unfamiliar names against other words still on the board.</p>

    <h2 id="practice">A three-board practice session</h2>
    <h3>Save the word with two homes</h3>
    <p>Try February 19 before you read a category. On a piece of paper, write two short sentences using one tile in different ways. Circle the sentence that gives it three companions. When someone else plays the board, compare the first image you each had. You may both solve the puzzle cleanly and still have taken completely different routes through the same word.</p>
    <h3>Write the narrowest clue you can defend</h3>
    <p>For March 11, jot down a clue that would send a partner toward the tennis row while leaving all four tiles hidden. “Sports numbers” admits 24 and leaves out LOVE. “What the chair umpire might say while calling a game” helps with both problems. Read your clue against the unused tiles once more before you decide to share it.</p>
    <h3>Explain the least familiar member</h3>
    <p>Finish with March 23. Pick the word you recognized last and explain why it belongs in a sentence of its own. For EXTRA END, imagine what a curling team needs after a tied game. If the sentence still feels vague, replay the group after a break. Remembering the situation is a more portable skill than remembering where a tile sat on yesterday’s screen.</p>
    <h4>Compare notes after both players finish</h4>
    <p>Each player can pick one moment when they changed their mind. Say which tile you moved, the group you first saved it for, and the word that convinced you to move it. A friend who watches football might spot WISHBONE before you do. You might recognize the curling term first. Put those two observations together and you have a specific way to help each other on a future board.</p>
    <p>For a fresh board, return to the calendar and pick a date outside these examples. If three words keep fitting and a fourth keeps failing, the <a href="/guides/connections-one-away">one-away guide</a> lets you try a swap on a separate practice board. To play the publisher’s current edition, visit <a href="https://www.nytimes.com/athletic/connections-sports-edition/">The Athletic’s Sports Edition</a>. Keep the dated archive link if you want to compare the same puzzle with a friend later.</p>
  </article>;
}

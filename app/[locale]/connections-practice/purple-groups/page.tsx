import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonFigure, LessonPage } from "@/components/connections/lessons/LessonPage";
import { PurpleDrill } from "@/components/connections/lessons/PurpleDrill";
import styles from "@/components/connections/lessons/lessons.module.css";
import { purpleLessons } from "@/data/connections/purple-drills";
import { getPuzzleByDate } from "@/lib/connections-data";
import { constructMetadata } from "@/lib/metadata";
import { LOCALES } from "@/i18n/routing";

const path = "/connections-practice/purple-groups";
const image = "/images/connections-purple-group-bowling.webp";

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return constructMetadata({ locale, page: "Purple groups", path, canonicalUrl: path,
    title: "NYT Connections Purple Groups to Practice",
    description: "Find the purple group first on real 16-word boards. Practice hidden words, sound-alikes, shared phrases and letter changes with optional hints.",
    keywords: ["NYT Connections purple groups", "purple Connections practice", "purple Connections examples"], images: [image] });
}

export default async function PurplePracticePage() {
  const boards = await Promise.all(purpleLessons.map(lesson => getPuzzleByDate(lesson.date)));
  const drills = purpleLessons.flatMap((lesson, index) => {
    const board = boards[index];
    return board ? [{ ...lesson, board }] : [];
  });
  if (!drills.length) notFound();
  return <LessonPage parent={{ label: "Practice mode", path: "/connections-practice" }} path={path}
    title="NYT Connections purple groups"
    intro="Pick four tiles to find purple first.">
    <PurpleDrill drills={drills} />
    <article className={styles.article}>
      <h2>How to spot a purple group</h2>
      <p>Pick a tile that feels unusually specific. A two-word name, an odd spelling or a word with several pronunciations gives you something concrete to test against the rest of the board.</p>
      <h3>Look at word endings</h3>
      <p>Start at the last letter and read back until you have a short word. Try that on another tile. The endings can have different lengths and still share a theme.</p>
      <details><summary>Open the worked example from puzzle #1255</summary>
        <div className={styles.spread}>
          <div>
            <h4>How VALLEY hides ALLEY</h4>
            <p>VALLEY looks like a landform. Cover the V and you get ALLEY. Now look at the ends of KINGPIN, MASKED BALL and PENNY LANE. PIN, BALL, LANE and ALLEY all belong in a bowling group.</p>
            <p>Try saying each whole phrase first, then just its ending. PENNY LANE can pull you toward music until you hear LANE on its own.</p>
          </div>
          <LessonFigure file={image} alt="A purple bowling ball rolling along a lane toward white pins" caption="Pin, ball, lane and alley are the four words hidden at the ends of these tiles." />
        </div>
      </details>
      <h3>Test both sides of a shared phrase</h3>
      <p>Say a possible partner word before each tile, then after it. All four phrases need to work in the same direction. The <Link href="/connections-patterns/fill-in-the-blank">fill-in-the-blank guide</Link> has another worked example.</p>
      <h3>Listen for a different spelling</h3>
      <p>Read an odd-looking tile aloud. If its sound suggests a familiar object, try to turn three more tiles into objects of the same kind. Use the sound-alikes set above to isolate that skill.</p>
      <h3>Change one letter consistently</h3>
      <p>Keep the same position in all four words. If your first two candidates need a new initial, try changing the initial of a third before spending a guess. For a whole game across all four colors, open <Link href="/connections-practice">classic practice mode</Link>.</p>
    </article>
  </LessonPage>;
}

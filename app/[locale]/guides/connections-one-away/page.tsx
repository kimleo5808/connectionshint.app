import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonFigure, LessonPage } from "@/components/connections/lessons/LessonPage";
import { OneAwayDemo } from "@/components/connections/lessons/OneAwayDemo";
import styles from "@/components/connections/lessons/lessons.module.css";
import { getPuzzleByDate } from "@/lib/connections-data";
import { constructMetadata } from "@/lib/metadata";
import { LOCALES } from "@/i18n/routing";

const path = "/guides/connections-one-away";
const image = "/images/connections-one-away-bee-and-lemon.webp";

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return constructMetadata({ locale, page: "One Away", path, canonicalUrl: path,
    title: "What Does One Away Mean in NYT Connections?",
    description: "Try a real One Away guess. Swap a tile, see which guesses still miss, and learn what three matching words tell you about the fourth.",
    keywords: ["what does one away mean in NYT Connections", "Connections one away twice"], images: [image] });
}

export default async function OneAwayPage() {
  const board = await getPuzzleByDate("2026-11-18");
  if (!board) notFound();
  return <LessonPage parent={{ label: "Puzzle guides", path: "/guides" }} path={path}
    title="What does “One Away” mean in NYT Connections?"
    intro="Three of your four selected words belong to the same group. The game leaves you to figure out which tile to swap.">
    <OneAwayDemo groups={board.answers} />
    <article className={styles.article}>
      <div className={styles.spread}>
        <div>
          <h2>Why did this guess get “One Away”?</h2>
          <p>HONEY, BUZZ, COMB and YELLOW all bring a bee to mind. To test the guess, try finishing the same sentence with each tile. A bee produces honey, a buzz and comb. The sentence breaks down at yellow.</p>
          <h3>Why YELLOW feels right</h3>
          <p>YELLOW describes how a bee looks. Elsewhere on the board it fits a lemon, alongside JUICY, OVOID and SOUR. A convincing association can still leave a word with a better home.</p>
          <h4>Which swap completes the group?</h4>
          <p>Replacing YELLOW with VENOM gives the four things bees produce. Try the swap above, or open the full board from <Link href="/connections-hint/2026-11-18">puzzle #1256</Link>.</p>
        </div>
        <LessonFigure file={image} alt="A bee hovering over honeycomb beside a yellow lemon" caption="The lemon shares a color with the bee. Honeycomb has a more specific relationship to it." />
      </div>
      <h2 className="mt-8">What if you get “One Away” twice?</h2>
      <h3>Keep track of the word you changed</h3>
      <p>Replace YELLOW with SOUR in the starting guess. HONEY, BUZZ and COMB still belong together, so you see the same feedback. That second message alone cannot tell you which three words match.</p>
      <h3>Test the three you kept</h3>
      <p>Reset the example and replace HONEY with VENOM. You get the same message again, this time because BUZZ, COMB and VENOM match. The word you added can be correct even when the guess still misses.</p>
      <p>Use <Link href="/connections-practice">a full practice board</Link> to try this with a fresh set of words. For other kinds of overlap, see <Link href="/connections-patterns/common-traps">common Connections traps</Link>.</p>
    </article>
  </LessonPage>;
}

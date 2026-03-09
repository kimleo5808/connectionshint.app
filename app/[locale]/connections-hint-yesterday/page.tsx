import { AnswerReveal } from "@/components/connections/AnswerReveal";
import { HintCardList } from "@/components/connections/HintCard";
import { PuzzleCardCompact } from "@/components/connections/PuzzleCard";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getLatestPuzzle,
  getRecentPuzzles,
  getYesterdayPuzzle,
} from "@/lib/connections-data";
import {
  formatPatternLabel,
  getPrimaryPuzzlePattern,
  getPuzzleDifficultyNote,
} from "@/lib/connections-insights";
import { articleSchema, breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import { ArrowRight, Calendar, History, Lightbulb } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string }>;

function getMonthPath(date: string) {
  const [year, month] = date.split("-");
  return `/connections-hint/${year}/${month}`;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const puzzle = await getYesterdayPuzzle();

  if (!puzzle) {
    return constructMetadata({
      page: "Daily",
      title: "Yesterday's Connections Hint and Answers",
      description:
        "Review the previous Connections board with progressive hints and a full answer reveal.",
      locale: locale as Locale,
      path: `/connections-hint-yesterday`,
      canonicalUrl: `/connections-hint-yesterday`,
    });
  }

  const formattedDate = dayjs(puzzle.date).format("MMMM D, YYYY");

  return constructMetadata({
    page: "Daily",
    title: `Yesterday's Connections Hint and Answers for ${formattedDate}`,
    description: `Review yesterday's Connections board from ${formattedDate} with progressive hints, full answers, and a short recap of what made the puzzle tricky.`,
    keywords: [
      "connections yesterday",
      "yesterday's connections answers",
      `connections ${formattedDate}`,
      `connections puzzle #${puzzle.id}`,
    ],
    locale: locale as Locale,
    path: `/connections-hint-yesterday`,
    canonicalUrl: `/connections-hint-yesterday`,
  });
}

export default async function ConnectionsHintYesterdayPage({
  params,
}: {
  params: Params;
}) {
  await params;

  const puzzle = await getYesterdayPuzzle();
  const latestPuzzle = await getLatestPuzzle();
  const recentPuzzles = await getRecentPuzzles(8);

  if (!puzzle) {
    notFound();
  }

  const formattedDate = dayjs(puzzle.date).format("MMMM D, YYYY");
  const dayOfWeek = dayjs(puzzle.date).format("dddd");
  const monthPath = getMonthPath(puzzle.date);
  const primaryPattern = formatPatternLabel(getPrimaryPuzzlePattern(puzzle));
  const relatedPuzzles = recentPuzzles
    .filter((item) => item.id !== puzzle.id && item.id !== latestPuzzle?.id)
    .slice(0, 4);

  const articleTitle = `Yesterday's Connections Hint and Answers for ${formattedDate}`;
  const articleDescription = `Review puzzle #${puzzle.id} from ${formattedDate} with layered hints, complete answers, and a quick note on the board's main solving pattern.`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Yesterday's Puzzle",
            url: `${BASE_URL}/connections-hint-yesterday`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: articleTitle,
          description: articleDescription,
          url: `${BASE_URL}/connections-hint-yesterday`,
          datePublished: puzzle.date,
          dateModified: puzzle.date,
        })}
      />

      <header className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {dayOfWeek}, {formattedDate}
          </span>
          <span className="mx-1">&middot;</span>
          <span>Puzzle #{puzzle.id}</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Yesterday&apos;s Connections Hint and Answers
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Review the previous board with layered hints first, then reveal the
          full groups only when you are ready to confirm your solve.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/connections-hint-today"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Open Today&apos;s Puzzle
          </Link>
          <Link
            href={`/connections-number/${puzzle.id}`}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Puzzle #{puzzle.id} Lookup
          </Link>
          <Link
            href={monthPath}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Browse {dayjs(puzzle.date).format("MMMM YYYY")}
          </Link>
        </div>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <History className="mx-auto mb-3 h-8 w-8 text-blue-500" />
          <h2 className="font-heading text-sm font-bold text-foreground">
            Previous Board Review
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Best for catching up after missing a day.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <Lightbulb className="mx-auto mb-3 h-8 w-8 text-amber-500" />
          <h2 className="font-heading text-sm font-bold text-foreground">
            Progressive Hints
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Reveal broad clues first and keep spoilers controlled.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <ArrowRight className="mx-auto mb-3 h-8 w-8 text-emerald-500" />
          <h2 className="font-heading text-sm font-bold text-foreground">
            Fast Study Path
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Move from yesterday to today, then into the month archive.
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="mb-3 font-heading text-xl font-bold text-foreground">
              Yesterday&apos;s Hints
            </h2>
            <p className="mb-5 text-sm text-muted-foreground">
              Use the hint ladder in order. The first clue stays broad, the
              second gets more specific, and the third nearly confirms the
              group.
            </p>
            <HintCardList groups={puzzle.answers} />
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <AnswerReveal puzzle={puzzle} />
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              What Made Yesterday&apos;s Puzzle Difficult
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {getPuzzleDifficultyNote(puzzle)}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Primary Pattern
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {primaryPattern}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Best Next Step
                </p>
                <p className="mt-1 text-sm text-foreground">
                  Compare this board with the current puzzle to see whether the
                  same traps showed up two days in a row.
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside className="w-full shrink-0 lg:w-80">
          <div className="sticky top-24 space-y-6">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-heading text-sm font-bold text-foreground">
                Continue Studying
              </h2>
              <div className="mt-3 space-y-2">
                <Link
                  href="/connections-hint-today"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <span className="font-medium text-foreground">
                    Today&apos;s Puzzle
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Link>
                <Link
                  href={`/connections-number/${puzzle.id}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <span className="font-medium text-foreground">
                    Puzzle #{puzzle.id} Page
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Link>
                <Link
                  href={monthPath}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <span className="font-medium text-foreground">
                    {dayjs(puzzle.date).format("MMMM YYYY")} Archive
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Link>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-heading text-sm font-bold text-foreground">
                More Recent Boards
              </h2>
              <div className="mt-3 space-y-1">
                {relatedPuzzles.map((item) => (
                  <PuzzleCardCompact key={item.date} puzzle={item} />
                ))}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

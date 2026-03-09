import { AnswerReveal } from "@/components/connections/AnswerReveal";
import { HintCardList } from "@/components/connections/HintCard";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getAllPuzzles,
  getNextPuzzleById,
  getPreviousPuzzleById,
  getPuzzleById,
} from "@/lib/connections-data";
import {
  formatPatternLabel,
  getPrimaryPuzzlePattern,
  getPuzzleDifficultyNote,
} from "@/lib/connections-insights";
import { articleSchema, breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Hash,
  Lightbulb,
  Target,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; id: string }>;

function getMonthPath(date: string) {
  const [year, month] = date.split("-");
  return `/connections-hint/${year}/${month}`;
}

function getQuickFacts(id: number, date: string, patternLabel: string) {
  return [
    { label: "Puzzle Number", value: `#${id}` },
    { label: "Publish Date", value: dayjs(date).format("MMMM D, YYYY") },
    { label: "Primary Pattern", value: patternLabel },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const puzzleId = Number(id);
  const puzzle = Number.isNaN(puzzleId)
    ? undefined
    : await getPuzzleById(puzzleId);

  if (!puzzle) {
    return {};
  }

  const formattedDate = dayjs(puzzle.date).format("MMMM D, YYYY");

  return constructMetadata({
    page: "Daily",
    title: `Connections #${puzzle.id} Hint, Answers, and Puzzle Review`,
    description: `Look up Connections puzzle #${puzzle.id} from ${formattedDate}, review progressive hints, and see how the groups fit together.`,
    keywords: [
      `connections #${puzzle.id}`,
      `connections puzzle ${puzzle.id}`,
      `nyt connections ${puzzle.id}`,
      `connections ${formattedDate}`,
    ],
    locale: locale as Locale,
    path: `/connections-number/${puzzle.id}`,
    canonicalUrl: `/connections-number/${puzzle.id}`,
  });
}

export default async function ConnectionsNumberPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const puzzleId = Number(id);

  if (Number.isNaN(puzzleId)) {
    notFound();
  }

  const puzzle = await getPuzzleById(puzzleId);

  if (!puzzle) {
    notFound();
  }

  const previousPuzzle = await getPreviousPuzzleById(puzzle.id);
  const nextPuzzle = await getNextPuzzleById(puzzle.id);
  const monthPath = getMonthPath(puzzle.date);
  const patternLabel = formatPatternLabel(getPrimaryPuzzlePattern(puzzle));
  const quickFacts = getQuickFacts(puzzle.id, puzzle.date, patternLabel);
  const articleTitle = `Connections #${puzzle.id} Hint, Answers, and Puzzle Review`;
  const articleDescription = `Look up puzzle #${puzzle.id} by number, review layered hints, and compare the board with its neighboring puzzles.`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Puzzle Number Lookup",
            url: `${BASE_URL}/connections-number/${puzzle.id}`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: articleTitle,
          description: articleDescription,
          url: `${BASE_URL}/connections-number/${puzzle.id}`,
          datePublished: puzzle.date,
          dateModified: puzzle.date,
        })}
      />

      <header className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Hash className="h-4 w-4" />
          <span>Puzzle #{puzzle.id}</span>
          <span className="mx-1">&middot;</span>
          <span>{dayjs(puzzle.date).format("MMMM D, YYYY")}</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Connections #{puzzle.id} Hint, Answers, and Puzzle Review
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Use this page when you remember the puzzle number before the date.
          You can review the board with progressive hints first, then use the
          full answer reveal as a final check.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href={`/connections-hint/${puzzle.date}`}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Open Date Page
          </Link>
          <Link
            href={monthPath}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Browse {dayjs(puzzle.date).format("MMMM YYYY")}
          </Link>
          <Link
            href="/connections-hint-today"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Open Today&apos;s Puzzle
          </Link>
        </div>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        {quickFacts.map((fact) => (
          <div
            key={fact.label}
            className="rounded-xl border border-border bg-card p-5 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {fact.label}
            </p>
            <p className="mt-2 text-sm font-bold text-foreground">
              {fact.value}
            </p>
          </div>
        ))}
      </section>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Hints for Puzzle #{puzzle.id}
              </h2>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">
              Start with the lightest clue and move down only when you need to.
              This keeps the number page useful as both a lookup page and a
              spoiler-controlled review page.
            </p>
            <HintCardList groups={puzzle.answers} />
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <AnswerReveal puzzle={puzzle} />
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                How This Puzzle Was Structured
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {getPuzzleDifficultyNote(puzzle)}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The fastest solve usually comes from locking in the cleanest
              category first, then using the reduced board to confirm the less
              obvious pattern behind the remaining words.
            </p>
          </section>
        </div>

        <aside className="w-full shrink-0 lg:w-80">
          <div className="sticky top-24 space-y-6">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-heading text-sm font-bold text-foreground">
                Nearby Puzzles
              </h2>
              <div className="mt-4 space-y-2">
                {previousPuzzle ? (
                  <Link
                    href={`/connections-number/${previousPuzzle.id}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  >
                    <span className="font-medium text-foreground">
                      Puzzle #{previousPuzzle.id}
                    </span>
                    <ArrowLeft className="h-3 w-3 text-muted-foreground" />
                  </Link>
                ) : null}
                {nextPuzzle ? (
                  <Link
                    href={`/connections-number/${nextPuzzle.id}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  >
                    <span className="font-medium text-foreground">
                      Puzzle #{nextPuzzle.id}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </Link>
                ) : null}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-heading text-sm font-bold text-foreground">
                Useful Cross-Links
              </h2>
              <div className="mt-3 space-y-2">
                <Link
                  href={`/connections-hint/${puzzle.date}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <span className="font-medium text-foreground">
                    Date-Based Review
                  </span>
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                </Link>
                <Link
                  href={monthPath}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <span className="font-medium text-foreground">
                    Month Archive
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Link>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const puzzles = await getAllPuzzles();
  const params: { locale: string; id: string }[] = [];

  for (const locale of LOCALES) {
    for (const puzzle of puzzles) {
      params.push({ locale, id: String(puzzle.id) });
    }
  }

  return params;
}

import { PuzzleCardCompact } from "@/components/connections/PuzzleCard";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getAllPuzzles } from "@/lib/connections-data";
import {
  formatPatternLabel,
  getPrimaryPuzzlePattern,
  getPuzzleDifficultyNote,
  getPuzzleDifficultyScore,
} from "@/lib/connections-insights";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import {
  ArrowRight,
  BookOpen,
  Brain,
  FolderOpen,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

type RankedPuzzle = {
  id: number;
  date: string;
  score: number;
  note: string;
  patternLabel: string;
};

function buildHardestRecent(puzzles: Awaited<ReturnType<typeof getAllPuzzles>>): RankedPuzzle[] {
  return puzzles
    .slice(0, 60)
    .map((puzzle) => ({
      id: puzzle.id,
      date: puzzle.date,
      score: getPuzzleDifficultyScore(puzzle),
      note: getPuzzleDifficultyNote(puzzle),
      patternLabel: formatPatternLabel(getPrimaryPuzzlePattern(puzzle)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function buildDriverStats(puzzles: Awaited<ReturnType<typeof getAllPuzzles>>) {
  const recent = puzzles.slice(0, 60);
  const fillInBlank = recent.filter(
    (puzzle) => getPrimaryPuzzlePattern(puzzle) === "fill-in-the-blank"
  ).length;
  const wordplay = recent.filter(
    (puzzle) => getPrimaryPuzzlePattern(puzzle) === "wordplay"
  ).length;
  const structuredSet = recent.filter(
    (puzzle) => getPrimaryPuzzlePattern(puzzle) === "structured-set"
  ).length;
  const purplePressure = recent.filter((puzzle) =>
    puzzle.answers.some(
      (group) => group.level === 3 && getPrimaryPuzzlePattern(puzzle) !== "category"
    )
  ).length;

  return [
    {
      title: "Phrase or Fill-in-the-Blank Boards",
      stat: fillInBlank,
      description:
        "These boards become harder when the real relationship stays invisible until you test the words inside a shared phrase.",
    },
    {
      title: "Wordplay-Driven Boards",
      stat: wordplay,
      description:
        "These boards punish players who keep grouping by topic after the solve has already shifted to spelling, phrasing, or language structure.",
    },
    {
      title: "Named Set Boards",
      stat: structuredSet,
      description:
        "These are often manageable once the set reveals itself, but overlap can still delay the second or third submit.",
    },
    {
      title: "Purple Late-Game Pressure",
      stat: purplePressure,
      description:
        "These recent boards had a hard purple finish backed by something less literal than a normal category match.",
    },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "Guides",
    title: "Connections Difficulty Guide and Hardest Recent Puzzles",
    description:
      "Use real recent Connections boards to understand what makes a puzzle hard, from misleading overlap to purple-group wordplay.",
    keywords: [
      "connections difficulty",
      "hardest connections puzzles",
      "why are connections puzzles hard",
      "connections purple group",
    ],
    locale: locale as Locale,
    path: `/connections-difficulty`,
    canonicalUrl: `/connections-difficulty`,
  });
}

export default async function ConnectionsDifficultyPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const allPuzzles = await getAllPuzzles();
  const hardestRecent = buildHardestRecent(allPuzzles);
  const driverStats = buildDriverStats(allPuzzles);
  const recentExamples = allPuzzles.slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Connections Difficulty",
            url: `${BASE_URL}/connections-difficulty`,
          },
        ])}
      />

      <header className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Brain className="h-4 w-4" />
          <span>Difficulty Guide</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Connections Difficulty Guide and Hardest Recent Puzzles
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Difficulty in Connections is usually not about obscure vocabulary.
          Hard boards are the ones where fake groupings feel plausible for too
          long, or where the final confirmation depends on phrasing rather than
          subject matching.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/connections-patterns"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Study Patterns
          </Link>
          <Link
            href="/connections-hint"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Browse Archive
          </Link>
          <Link
            href="/guides/advanced-techniques"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Advanced Guide
          </Link>
        </div>
      </header>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <Lightbulb className="mb-3 h-7 w-7 text-amber-500" />
          <h2 className="font-heading text-base font-bold text-foreground">
            First Clean Category
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We treat a board as easier when one category can be identified early
            without needing elimination or phrasing tricks.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <Sparkles className="mb-3 h-7 w-7 text-purple-500" />
          <h2 className="font-heading text-base font-bold text-foreground">
            Late-Game Pressure
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hard boards usually save their real trap for the end, especially
            when the purple set only resolves after two obvious groups are gone.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <BookOpen className="mb-3 h-7 w-7 text-blue-500" />
          <h2 className="font-heading text-base font-bold text-foreground">
            Language Shift
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The sharpest jump in difficulty comes when a board stops rewarding
            topic matching and starts rewarding phrase logic or wordplay.
          </p>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          How We Judge Puzzle Difficulty
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Our working model looks at three things: how easy it is to spot the
          first clean category, how much believable overlap exists between the
          remaining words, and whether the hardest group depends on a phrase or
          language pattern instead of a direct topic label.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              1. Clean Start
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              If one group is obvious early, the board gets materially easier.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              2. Overlap Pressure
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              If multiple words can plausibly live in two groups, error risk rises fast.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              3. Pattern Shift
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Boards get hardest when they switch from topic matching to phrasing or wordplay.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Hardest Recent Connections Boards
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              These recent boards scored highest under the current site
              heuristics. They are the best places to study overlap, delayed
              confirmation, and purple-group pressure.
            </p>
            <div className="mt-5 space-y-3">
              {hardestRecent.map((item) => (
                <Link
                  key={item.id}
                  href={`/connections-hint/${item.date}`}
                  className="block rounded-xl border border-border p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:hover:border-blue-700 dark:hover:bg-blue-950/10"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        Puzzle #{item.id}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {dayjs(item.date).format("MMMM D, YYYY")} &middot;{" "}
                        {item.patternLabel}
                      </p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      Score {item.score}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.note}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={
                        item.patternLabel === "Fill in the Blank"
                          ? "/connections-patterns/fill-in-the-blank"
                          : item.patternLabel === "Wordplay"
                            ? "/connections-patterns/wordplay"
                            : "/connections-patterns/common-traps"
                      }
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
                    >
                      Study related pattern
                    </Link>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              What Usually Makes a Puzzle Hard
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {driverStats.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-muted/20 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Recent Count
                  </p>
                  <p className="mt-1 text-lg font-bold text-foreground">
                    {item.stat}
                  </p>
                  <h3 className="mt-2 font-heading text-sm font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Why Purple Groups Break Solve Streaks
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Most failed boards are not lost on the yellow or green groups.
              They are lost when the final purple set asks you to stop grouping
              by topic and start grouping by phrasing, spelling, or another
              hidden structure.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/connections-patterns"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
              >
                Explore Pattern Library
              </Link>
              <Link
                href="/connections-patterns/fill-in-the-blank"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
              >
                Fill-in-the-Blank
              </Link>
              <Link
                href="/connections-patterns/wordplay"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
              >
                Wordplay
              </Link>
              <Link
                href="/connections-patterns/common-traps"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
              >
                Common Traps
              </Link>
              <Link
                href="/guides/common-mistakes"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
              >
                Common Mistakes Guide
              </Link>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-heading text-sm font-bold text-foreground">
              Recent Study Examples
            </h2>
            <div className="mt-3 space-y-1">
              {recentExamples.map((puzzle) => (
                <PuzzleCardCompact key={puzzle.date} puzzle={puzzle} />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-heading text-sm font-bold text-foreground">
              Keep Moving
            </h2>
            <div className="mt-3 space-y-2">
              <Link
                href="/connections-patterns"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <span className="font-medium text-foreground">
                  Pattern Library
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </Link>
              <Link
                href="/connections-hint"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <span className="font-medium text-foreground">
                  Full Archive
                </span>
                <FolderOpen className="h-3 w-3 text-muted-foreground" />
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

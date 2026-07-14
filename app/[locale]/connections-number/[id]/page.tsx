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
import { getStaticPuzzles } from "@/lib/connections-static";
import {
  formatPatternLabel,
  getGroupPattern,
  getPrimaryPuzzlePattern,
  getPuzzleDifficultyNote,
} from "@/lib/connections-insights";
import type { ConnectionsGroup, ConnectionsPuzzle } from "@/types/connections";
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

const LEVEL_NAMES = ["Yellow", "Green", "Blue", "Purple"] as const;
const LEVEL_DOTS = [
  "bg-yellow-400",
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
] as const;

function getWordFacts(puzzle: ConnectionsPuzzle) {
  const words = puzzle.answers
    .flatMap((group) => group.members)
    .sort((a, b) => a.localeCompare(b));
  const byLength = [...words].sort((a, b) => a.length - b.length);
  const shortest = byLength[0];
  const longest = byLength[byLength.length - 1];
  const multiWordCount = words.filter((w) => w.includes(" ")).length;

  const lengthSentence =
    shortest.length === longest.length
      ? `Every entry on this board is exactly ${shortest.length} characters long, which makes visual scanning less helpful than usual.`
      : `Entries range from ${shortest} (${shortest.length} letters) to ${longest} (${longest.length} letters).`;

  const phraseSentence =
    multiWordCount > 0
      ? `${multiWordCount} of the 16 entries are multi-word phrases, which often signals a fill-in-the-blank or title-based group.`
      : `All 16 entries are single words, so watch for letter play and double meanings rather than phrase completion.`;

  return { words, sentence: `${lengthSentence} ${phraseSentence}` };
}

function getGroupSummary(group: ConnectionsGroup) {
  switch (getGroupPattern(group)) {
    case "fill-in-the-blank":
      return "each word completes the same phrase pattern";
    case "wordplay":
      return "the link lives in the letters, not the meanings";
    case "structured-set":
      return "all four belong to one defined set";
    default:
      return "the connection is a straight meaning-based match";
  }
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
  const primaryPattern = getPrimaryPuzzlePattern(puzzle);
  const patternLabel = formatPatternLabel(primaryPattern);

  const allPuzzles = await getAllPuzzles();
  const wordFacts = getWordFacts(puzzle);
  const relatedByPattern = allPuzzles
    .filter(
      (p) => p.id !== puzzle.id && getPrimaryPuzzlePattern(p) === primaryPattern
    )
    .sort((a, b) => Math.abs(a.id - puzzle.id) - Math.abs(b.id - puzzle.id))
    .slice(0, 6)
    .sort((a, b) => a.id - b.id);
  const sameMonthPuzzles = allPuzzles
    .filter(
      (p) =>
        p.id !== puzzle.id && p.date.slice(0, 7) === puzzle.date.slice(0, 7)
    )
    .sort(
      (a, b) =>
        Math.abs(dayjs(a.date).diff(puzzle.date, "day")) -
        Math.abs(dayjs(b.date).diff(puzzle.date, "day"))
    )
    .slice(0, 5)
    .sort((a, b) => a.date.localeCompare(b.date));
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

      <section className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          The 16 Words in Puzzle #{puzzle.id}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Listed alphabetically so the original board layout stays unspoiled.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {wordFacts.words.map((word) => (
            <div
              key={word}
              className="rounded-lg border border-border bg-background px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-foreground sm:text-sm"
            >
              {word}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {wordFacts.sentence}
        </p>
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

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Answer Summary for Puzzle #{puzzle.id}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A compact reference of all four groups. Collapsed by default so
              you can still solve spoiler-free — expand it when you want the
              full breakdown.
            </p>
            <details className="mt-4 group">
              <summary className="cursor-pointer rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-blue-300 dark:hover:border-blue-700">
                Show the four groups and their words
              </summary>
              <ul className="mt-4 space-y-3">
                {[...puzzle.answers]
                  .sort((a, b) => a.level - b.level)
                  .map((group) => (
                    <li
                      key={group.group}
                      className="rounded-lg border border-border bg-background p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${LEVEL_DOTS[group.level] ?? LEVEL_DOTS[0]}`}
                        />
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {LEVEL_NAMES[group.level] ?? "Yellow"}
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {group.group}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-foreground">
                        {group.members.join(" · ")}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Here {getGroupSummary(group)}.
                      </p>
                    </li>
                  ))}
              </ul>
            </details>
          </section>

          {relatedByPattern.length > 0 ? (
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <h2 className="font-heading text-xl font-bold text-foreground">
                More {patternLabel} Puzzles
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Boards whose hardest twist works the same way as #{puzzle.id}
                — useful when you want to practice one pattern in a row.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {relatedByPattern.map((related) => (
                  <Link
                    key={related.id}
                    href={`/connections-number/${related.id}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
                  >
                    <span className="font-medium">Puzzle #{related.id}</span>
                    <span className="text-xs text-muted-foreground">
                      {dayjs(related.date).format("MMM D, YYYY")}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
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

            {sameMonthPuzzles.length > 0 ? (
              <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h2 className="font-heading text-sm font-bold text-foreground">
                  More From {dayjs(puzzle.date).format("MMMM YYYY")}
                </h2>
                <div className="mt-4 space-y-2">
                  {sameMonthPuzzles.map((monthPuzzle) => (
                    <Link
                      key={monthPuzzle.id}
                      href={`/connections-number/${monthPuzzle.id}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                    >
                      <span className="font-medium text-foreground">
                        Puzzle #{monthPuzzle.id}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {dayjs(monthPuzzle.date).format("MMM D")}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // Pre-render only the ~60 most recent puzzles. Older ids are generated on
  // demand at runtime (dynamicParams defaults to true), which keeps the
  // OpenNext incremental-cache file count low enough to avoid R2 429 errors
  // during deploy. Every /connections-number/[id] URL stays valid and
  // indexable — uncached ones are just rendered on first request.
  const puzzles = getStaticPuzzles().slice(0, 60);
  const params: { locale: string; id: string }[] = [];

  for (const locale of LOCALES) {
    for (const puzzle of puzzles) {
      params.push({ locale, id: String(puzzle.id) });
    }
  }

  return params;
}

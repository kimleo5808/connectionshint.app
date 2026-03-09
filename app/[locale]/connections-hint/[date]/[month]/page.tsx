import { PuzzleCard } from "@/components/connections/PuzzleCard";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getAvailableMonths,
  getLatestPuzzle,
  getPuzzlesByMonth,
} from "@/lib/connections-data";
import { getMonthSummary } from "@/lib/connections-insights";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import { ArrowLeft, ArrowRight, Calendar, FolderOpen } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; date: string; month: string }>;

function getMonthKey(year: string, month: string) {
  return `${year}-${month}`;
}

function getMonthLabel(yearMonth: string) {
  return dayjs(`${yearMonth}-01`).format("MMMM YYYY");
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, date: year, month } = await params;
  const yearMonth = getMonthKey(year, month);
  const puzzles = await getPuzzlesByMonth(yearMonth);

  if (puzzles.length === 0) {
    return {};
  }

  const monthLabel = getMonthLabel(yearMonth);

  return constructMetadata({
    page: "Archive",
    title: `${monthLabel} Connections Archive`,
    description: `Browse every Connections puzzle from ${monthLabel}, compare the boards by date, and review which patterns and trap styles showed up most often that month.`,
    keywords: [
      `${monthLabel} connections`,
      `${monthLabel} connections archive`,
      `connections archive ${yearMonth}`,
      "past connections answers",
    ],
    locale: locale as Locale,
    path: `/connections-hint/${year}/${month}`,
    canonicalUrl: `/connections-hint/${year}/${month}`,
  });
}

export default async function ConnectionsMonthArchivePage({
  params,
}: {
  params: Params;
}) {
  const { date: year, month } = await params;
  const yearMonth = getMonthKey(year, month);
  const availableMonths = await getAvailableMonths();

  if (!/^\d{4}$/.test(year) || !/^\d{2}$/.test(month)) {
    notFound();
  }

  if (!availableMonths.includes(yearMonth)) {
    notFound();
  }

  const puzzles = await getPuzzlesByMonth(yearMonth);

  if (puzzles.length === 0) {
    notFound();
  }

  const latestPuzzle = await getLatestPuzzle();
  const monthLabel = getMonthLabel(yearMonth);
  const summary = getMonthSummary(puzzles);
  const monthIndex = availableMonths.indexOf(yearMonth);
  const newerMonth = monthIndex > 0 ? availableMonths[monthIndex - 1] : null;
  const olderMonth =
    monthIndex >= 0 && monthIndex < availableMonths.length - 1
      ? availableMonths[monthIndex + 1]
      : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Connections Archive",
            url: `${BASE_URL}/connections-hint`,
          },
          {
            name: monthLabel,
            url: `${BASE_URL}/connections-hint/${year}/${month}`,
          },
        ])}
      />

      <header className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <FolderOpen className="h-4 w-4" />
          <span>{monthLabel}</span>
          <span className="mx-1">&middot;</span>
          <span>{summary.count} puzzles</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {monthLabel} Connections Archive
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Browse every board from {monthLabel}, compare the puzzle flow across
          the month, and use the archive as a review tool instead of a plain
          answer list.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/connections-hint-today"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Open Today&apos;s Puzzle
          </Link>
          <Link
            href="/connections-hint-yesterday"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Review Yesterday
          </Link>
          <Link
            href="/connections-hint"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Full Archive Index
          </Link>
        </div>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Puzzle Range
          </p>
          <p className="mt-2 text-sm font-bold text-foreground">
            #{summary.firstId} to #{summary.lastId}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Most Common Pattern
          </p>
          <p className="mt-2 text-sm font-bold text-foreground">
            {summary.topPatterns[0]?.label || "Category Match"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Latest Site Puzzle
          </p>
          <p className="mt-2 text-sm font-bold text-foreground">
            {latestPuzzle ? `#${latestPuzzle.id}` : "Unavailable"}
          </p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              All Puzzles from {monthLabel}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Open any date to get progressive hints, the complete answers, and
              the puzzle-by-puzzle review page.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {puzzles.map((puzzle) => (
                <PuzzleCard key={puzzle.date} puzzle={puzzle} />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              What Stood Out This Month
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {monthLabel} included {summary.count} published boards, with the
              strongest recurring pattern leaning toward{" "}
              {summary.topPatterns[0]?.label?.toLowerCase() || "plain category"}{" "}
              logic. The harder boards this month were the ones that delayed the
              final confirmation step by mixing obvious thematic groups with a
              less literal late-game pattern.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {summary.topPatterns.map((item) => (
                <div
                  key={item.pattern}
                  className="rounded-xl border border-border bg-muted/20 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Pattern
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Appeared in {item.count} boards this month.
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-heading text-sm font-bold text-foreground">
              Most Challenging Boards
            </h2>
            <div className="mt-4 space-y-3">
              {summary.hardestPuzzles.map(({ puzzle, note, score }) => (
                <Link
                  key={puzzle.date}
                  href={`/connections-hint/${puzzle.date}`}
                  className="block rounded-xl border border-border p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:hover:border-blue-700 dark:hover:bg-blue-950/10"
                >
                  <p className="text-sm font-bold text-foreground">
                    Puzzle #{puzzle.id}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {dayjs(puzzle.date).format("MMMM D, YYYY")} &middot; score{" "}
                    {score}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {note}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-heading text-sm font-bold text-foreground">
              Month Navigation
            </h2>
            <div className="mt-4 space-y-2">
              {newerMonth ? (
                <Link
                  href={`/connections-hint/${newerMonth.slice(0, 4)}/${newerMonth.slice(5, 7)}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <span className="font-medium text-foreground">
                    {getMonthLabel(newerMonth)}
                  </span>
                  <ArrowLeft className="h-3 w-3 text-muted-foreground" />
                </Link>
              ) : null}
              {olderMonth ? (
                <Link
                  href={`/connections-hint/${olderMonth.slice(0, 4)}/${olderMonth.slice(5, 7)}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <span className="font-medium text-foreground">
                    {getMonthLabel(olderMonth)}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Link>
              ) : null}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-heading text-sm font-bold text-foreground">
              Keep Moving
            </h2>
            <div className="mt-3 space-y-2">
              <Link
                href="/connections-hint-today"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <span className="font-medium text-foreground">
                  Today&apos;s Puzzle
                </span>
                <Calendar className="h-3 w-3 text-muted-foreground" />
              </Link>
              <Link
                href="/connections-hint-yesterday"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <span className="font-medium text-foreground">
                  Yesterday&apos;s Board
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </Link>
              <Link
                href="/connections-patterns"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <span className="font-medium text-foreground">
                  Pattern Library
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const months = await getAvailableMonths();
  const params: { locale: string; date: string; month: string }[] = [];

  for (const locale of LOCALES) {
    for (const yearMonth of months) {
      params.push({
        locale,
        date: yearMonth.slice(0, 4),
        month: yearMonth.slice(5, 7),
      });
    }
  }

  return params;
}

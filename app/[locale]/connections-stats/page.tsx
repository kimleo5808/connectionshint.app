import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getAllPuzzles, getAvailableMonths } from "@/lib/connections-data";
import {
  formatPatternLabel,
  getGroupPattern,
  getPrimaryPuzzlePattern,
  getPuzzleDifficultyScore,
  type PuzzlePattern,
} from "@/lib/connections-insights";
import {
  breadcrumbSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import type { ConnectionsPuzzle } from "@/types/connections";
import dayjs from "dayjs";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  Flame,
  Hash,
  Lightbulb,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

/* ------------------------------------------------------------------ */
/*  Stat builders                                                      */
/* ------------------------------------------------------------------ */

function buildOverallStats(puzzles: ConnectionsPuzzle[]) {
  const totalWords = puzzles.length * 16;
  const totalGroups = puzzles.length * 4;

  // Unique words
  const wordSet = new Set<string>();
  for (const p of puzzles) {
    for (const g of p.answers) {
      for (const m of g.members) {
        wordSet.add(m.toUpperCase());
      }
    }
  }

  // Unique group names
  const groupNameSet = new Set<string>();
  for (const p of puzzles) {
    for (const g of p.answers) {
      groupNameSet.add(g.group);
    }
  }

  return {
    totalPuzzles: puzzles.length,
    totalWords,
    uniqueWords: wordSet.size,
    totalGroups,
    uniqueGroupNames: groupNameSet.size,
    firstDate: puzzles[puzzles.length - 1]?.date,
    latestDate: puzzles[0]?.date,
  };
}

function buildHardestPuzzles(puzzles: ConnectionsPuzzle[], count: number) {
  return puzzles
    .map((p) => ({
      puzzle: p,
      score: getPuzzleDifficultyScore(p),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

function buildEasiestPuzzles(puzzles: ConnectionsPuzzle[], count: number) {
  return puzzles
    .map((p) => ({
      puzzle: p,
      score: getPuzzleDifficultyScore(p),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

function buildMonthlyDifficulty(puzzles: ConnectionsPuzzle[]) {
  const monthMap = new Map<string, { total: number; count: number }>();

  for (const p of puzzles) {
    const month = p.date.slice(0, 7);
    const score = getPuzzleDifficultyScore(p);
    const existing = monthMap.get(month) || { total: 0, count: 0 };
    existing.total += score;
    existing.count += 1;
    monthMap.set(month, existing);
  }

  return Array.from(monthMap.entries())
    .map(([month, { total, count }]) => ({
      month,
      label: dayjs(`${month}-01`).format("MMM YYYY"),
      avg: Number((total / count).toFixed(2)),
      count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function buildPatternDistribution(puzzles: ConnectionsPuzzle[]) {
  const counts: Record<PuzzlePattern, number> = {
    category: 0,
    "fill-in-the-blank": 0,
    wordplay: 0,
    "structured-set": 0,
  };

  for (const p of puzzles) {
    for (const g of p.answers) {
      counts[getGroupPattern(g)]++;
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return Object.entries(counts)
    .map(([pattern, count]) => ({
      pattern: pattern as PuzzlePattern,
      label: formatPatternLabel(pattern as PuzzlePattern),
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

function buildWordFrequency(puzzles: ConnectionsPuzzle[], topN: number) {
  const freq = new Map<string, number>();

  for (const p of puzzles) {
    for (const g of p.answers) {
      for (const m of g.members) {
        const word = m.toUpperCase();
        freq.set(word, (freq.get(word) || 0) + 1);
      }
    }
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word, count]) => ({ word, count }));
}

function buildLongestGroupNames(puzzles: ConnectionsPuzzle[], topN: number) {
  const names = new Set<string>();
  for (const p of puzzles) {
    for (const g of p.answers) {
      names.add(g.group);
    }
  }
  return Array.from(names)
    .sort((a, b) => b.length - a.length)
    .slice(0, topN);
}

function buildShortestGroupNames(puzzles: ConnectionsPuzzle[], topN: number) {
  const names = new Set<string>();
  for (const p of puzzles) {
    for (const g of p.answers) {
      names.add(g.group);
    }
  }
  return Array.from(names)
    .filter((n) => n.length > 0)
    .sort((a, b) => a.length - b.length)
    .slice(0, topN);
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS = [
  {
    question: "How are difficulty scores calculated?",
    answer:
      "Our difficulty scoring system analyzes each puzzle's group labels for structural patterns. Groups with fill-in-the-blank phrases, wordplay indicators, or structural sets score higher than simple category matches. The purple group's pattern type adds extra weight. The final score is a composite that reflects how much the board relies on non-obvious thinking.",
  },
  {
    question: "Why do some months have higher average difficulty?",
    answer:
      "NYT editors occasionally cluster harder puzzle types within specific periods. Months with more fill-in-the-blank and wordplay-heavy boards will naturally have higher average difficulty scores. There is also a general trend toward slightly more complex boards as the puzzle has matured.",
  },
  {
    question: "What does 'most reused word' mean?",
    answer:
      "Some words appear in multiple puzzles across the archive. These tend to be versatile words with many meanings — which is exactly what makes them useful for Connections. Knowing the most reused words helps you anticipate potential red herrings.",
  },
  {
    question: "How often are these stats updated?",
    answer:
      "Statistics are calculated from the full puzzle archive and update whenever new puzzles are added. The archive currently includes every NYT Connections puzzle since launch.",
  },
];

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "Stats",
    title: "Connections Puzzle Statistics & Trends",
    description:
      "Explore data-driven statistics from every NYT Connections puzzle. Difficulty trends, hardest boards, most common patterns, word frequency, and fun facts from the full archive.",
    keywords: [
      "connections statistics",
      "connections puzzle stats",
      "nyt connections difficulty trends",
      "hardest connections puzzles",
      "connections word frequency",
      "connections data analysis",
    ],
    locale: locale as Locale,
    path: `/connections-stats`,
    canonicalUrl: `/connections-stats`,
  });
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function ConnectionsStatsPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const allPuzzles = await getAllPuzzles();

  const overall = buildOverallStats(allPuzzles);
  const hardest = buildHardestPuzzles(allPuzzles, 10);
  const easiest = buildEasiestPuzzles(allPuzzles, 5);
  const monthlyDifficulty = buildMonthlyDifficulty(allPuzzles);
  const patternDist = buildPatternDistribution(allPuzzles);
  const topWords = buildWordFrequency(allPuzzles, 20);
  const longestNames = buildLongestGroupNames(allPuzzles, 5);
  const shortestNames = buildShortestGroupNames(allPuzzles, 5);

  // Compute max avg for bar chart scaling
  const maxAvg = Math.max(...monthlyDifficulty.map((m) => m.avg), 1);
  // Hardest and easiest months
  const hardestMonth = [...monthlyDifficulty].sort((a, b) => b.avg - a.avg)[0];
  const easiestMonth = [...monthlyDifficulty].sort((a, b) => a.avg - b.avg)[0];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Statistics",
            url: `${BASE_URL}/connections-stats`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <BarChart3 className="h-4 w-4" />
          <span>Statistics & Trends</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Connections Puzzle Statistics & Trends
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Data from every NYT Connections puzzle since launch. Difficulty
          trends, pattern frequency, word reuse, and the hardest boards of all
          time — all in one place.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/connections-hint-today"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Today&apos;s Puzzle
          </Link>
          <Link
            href="/connections-difficulty"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Difficulty Guide
          </Link>
          <Link
            href="/connections-practice"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Practice Mode
          </Link>
        </div>
      </header>

      {/* Overview Cards */}
      <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-8">
        {[
          { label: "Total Puzzles", value: overall.totalPuzzles.toLocaleString(), icon: Hash },
          { label: "Total Words Used", value: overall.totalWords.toLocaleString(), icon: Zap },
          { label: "Unique Words", value: overall.uniqueWords.toLocaleString(), icon: Sparkles },
          { label: "Total Groups", value: overall.totalGroups.toLocaleString(), icon: Target },
          { label: "Unique Group Names", value: overall.uniqueGroupNames.toLocaleString(), icon: Star },
          { label: "Days of Puzzles", value: overall.totalPuzzles.toLocaleString(), icon: Calendar },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4 text-center"
          >
            <stat.icon className="h-5 w-5 text-blue-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Monthly Difficulty Trend */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <h2 className="font-heading text-xl font-bold text-foreground">
            Difficulty Trends Over Time
          </h2>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          Average difficulty score by month. Higher scores indicate months with
          more wordplay, fill-in-the-blank, and structural pattern boards.
        </p>

        {/* Bar chart */}
        <div className="overflow-x-auto">
          <div className="flex items-end gap-1 min-w-[600px] h-48">
            {monthlyDifficulty.map((m) => {
              const heightPct = (m.avg / maxAvg) * 100;
              const isHardest = m.month === hardestMonth?.month;
              const isEasiest = m.month === easiestMonth?.month;
              return (
                <div
                  key={m.month}
                  className="flex flex-col items-center flex-1 gap-1"
                >
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {m.avg}
                  </span>
                  <div
                    className={`w-full rounded-t transition-colors ${
                      isHardest
                        ? "bg-red-400 dark:bg-red-500"
                        : isEasiest
                          ? "bg-emerald-400 dark:bg-emerald-500"
                          : "bg-blue-400 dark:bg-blue-500"
                    }`}
                    style={{ height: `${heightPct}%`, minHeight: "4px" }}
                  />
                  <span className="text-[9px] text-muted-foreground -rotate-45 origin-top-left whitespace-nowrap">
                    {dayjs(`${m.month}-01`).format("MMM 'YY")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Month highlights */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {hardestMonth && (
            <div className="rounded-xl border border-red-100 bg-card p-4 dark:border-red-900/30">
              <p className="text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
                Hardest Month
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {hardestMonth.label}
              </p>
              <p className="text-sm text-muted-foreground">
                Average difficulty score of {hardestMonth.avg} across{" "}
                {hardestMonth.count} puzzles
              </p>
            </div>
          )}
          {easiestMonth && (
            <div className="rounded-xl border border-emerald-100 bg-card p-4 dark:border-emerald-900/30">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                Easiest Month
              </p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {easiestMonth.label}
              </p>
              <p className="text-sm text-muted-foreground">
                Average difficulty score of {easiestMonth.avg} across{" "}
                {easiestMonth.count} puzzles
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          {/* Hardest Puzzles */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-red-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Top 10 Hardest Puzzles of All Time
              </h2>
            </div>
            <div className="space-y-3">
              {hardest.map(({ puzzle, score }, i) => (
                <Link
                  key={puzzle.id}
                  href={`/connections-hint/${puzzle.date}`}
                  className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:hover:border-blue-700 dark:hover:bg-blue-950/10"
                >
                  <span className="text-lg font-bold text-muted-foreground w-6 text-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">
                      Puzzle #{puzzle.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dayjs(puzzle.date).format("MMMM D, YYYY")}
                    </p>
                  </div>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    {score}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Pattern Distribution */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-purple-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Group Pattern Distribution
              </h2>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">
              How all {overall.totalGroups.toLocaleString()} groups break down
              by pattern type across the full archive.
            </p>
            <div className="space-y-4">
              {patternDist.map((item) => (
                <div key={item.pattern}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {item.count.toLocaleString()}{" "}
                      <span className="font-normal text-muted-foreground">
                        ({item.pct}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.pattern === "category"
                          ? "bg-emerald-400"
                          : item.pattern === "structured-set"
                            ? "bg-blue-400"
                            : item.pattern === "fill-in-the-blank"
                              ? "bg-amber-400"
                              : "bg-purple-400"
                      }`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Word Frequency */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="h-5 w-5 text-amber-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Most Reused Words in Connections
              </h2>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">
              Words that appear in the most puzzles. These versatile words have
              multiple meanings — which is exactly why editors keep using them.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {topWords.map((item, i) => (
                <div
                  key={item.word}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  <span className="text-xs font-bold text-muted-foreground w-5 text-center">
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-foreground flex-1">
                    {item.word}
                  </span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {item.count}×
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Easiest Puzzles */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h3 className="font-heading text-sm font-bold text-foreground mb-3">
              Easiest Puzzles
            </h3>
            <div className="space-y-1">
              {easiest.map(({ puzzle, score }) => (
                <Link
                  key={puzzle.id}
                  href={`/connections-hint/${puzzle.date}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <span className="font-medium text-foreground">
                    #{puzzle.id}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {score}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Fun Facts */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h3 className="font-heading text-sm font-bold text-foreground mb-3">
              Fun Facts
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Longest Group Name
                </p>
                <p className="mt-1 font-medium text-foreground">
                  &ldquo;{longestNames[0]}&rdquo;
                </p>
                <p className="text-xs text-muted-foreground">
                  {longestNames[0]?.length} characters
                </p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Shortest Group Name
                </p>
                <p className="mt-1 font-medium text-foreground">
                  &ldquo;{shortestNames[0]}&rdquo;
                </p>
                <p className="text-xs text-muted-foreground">
                  {shortestNames[0]?.length} characters
                </p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Archive Span
                </p>
                <p className="mt-1 font-medium text-foreground">
                  {dayjs(overall.firstDate).format("MMM D, YYYY")} —{" "}
                  {dayjs(overall.latestDate).format("MMM D, YYYY")}
                </p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Word Reuse Rate
                </p>
                <p className="mt-1 font-medium text-foreground">
                  {overall.uniqueWords.toLocaleString()} unique out of{" "}
                  {overall.totalWords.toLocaleString()} total
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(
                    (1 - overall.uniqueWords / overall.totalWords) * 100
                  )}
                  % of words have appeared more than once
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h3 className="font-heading text-sm font-bold text-foreground mb-3">
              Explore More
            </h3>
            <div className="space-y-1">
              {[
                { href: "/connections-practice", label: "Practice Mode" },
                { href: "/connections-categories", label: "Category Explorer" },
                { href: "/connections-patterns", label: "Pattern Library" },
                { href: "/connections-hint", label: "Full Archive" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <span className="font-medium text-foreground">
                    {link.label}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ── SEO Content ── */}

      {/* Understanding the Data */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Understanding Connections Puzzle Data
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            NYT Connections has been running daily since June 2023, producing
            a rich dataset of puzzles that reveals clear patterns in how the
            game is designed. By analyzing every board in the archive, we can
            see which category types appear most often, how difficulty has
            evolved over time, and which words editors return to repeatedly.
          </p>
          <p>
            The statistics on this page are not opinions — they are calculated
            directly from puzzle data. Difficulty scores are based on the
            structural properties of each group label: boards with
            fill-in-the-blank phrases and wordplay patterns score higher than
            boards with straightforward category matches, because those
            structural patterns are what cause the most failed solves.
          </p>
          <p>
            Understanding these trends helps you anticipate what kind of board
            you are likely to face on any given day. If recent months have
            trended harder, you know to expect more abstract groups. If
            category-match boards are dominant, you can focus on topic
            recognition. The data informs your preparation.
          </p>
        </div>
      </section>

      {/* What the Trends Tell Us */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          What the Difficulty Trends Tell Us
        </h2>
        <p className="mt-2 text-muted-foreground">
          Monthly difficulty averages reveal the editorial direction of
          Connections over time.
        </p>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border-l-4 border-l-blue-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Early Months Were More Accessible
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The first months of Connections leaned toward straightforward
              category matches, giving new players a chance to learn the format
              before complexity ramped up. Boards during this period were
              dominated by direct topic labels with minimal wordplay.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-amber-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Complexity Gradually Increased
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              As the player base grew, editors introduced more
              fill-in-the-blank patterns, cultural references, and purple
              groups that depend on structural logic rather than topic
              knowledge. This is a natural evolution — the puzzle has to stay
              challenging for experienced solvers.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-purple-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Purple Groups Drive the Hardest Months
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Months with the highest difficulty scores almost always
              correspond to periods where purple groups featured heavy
              wordplay, hidden words, or fill-in-the-blank phrases. The purple
              group is the single biggest determinant of puzzle difficulty.
            </p>
          </div>
        </div>
      </section>

      {/* How to Use Stats */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          How to Use These Statistics to Improve
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/40">
            <Lightbulb className="h-5 w-5 text-blue-500 mb-2" />
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Study the Hardest Boards
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Click any puzzle in the Top 10 to review its hints and answers.
              Understanding what made these specific boards hard gives you a
              framework for recognizing difficulty early in future solves.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/40">
            <BookOpen className="h-5 w-5 text-blue-500 mb-2" />
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Learn the Most Reused Words
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Words that appear repeatedly across puzzles have multiple viable
              meanings. When you see these words on a board, immediately
              consider all possible categories they could belong to.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/40">
            <Target className="h-5 w-5 text-blue-500 mb-2" />
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Know the Pattern Balance
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The pattern distribution shows that most groups are category
              matches, but the hardest groups are not. When you have solved the
              obvious categories and are stuck, the remaining group is likely
              structural — shift your thinking accordingly.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/40">
            <Trophy className="h-5 w-5 text-blue-500 mb-2" />
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Track Month-over-Month Trends
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              If the recent trend is upward, expect harder boards in the
              coming weeks. Adjust your approach — take more time before
              submitting, use hints strategically, and focus on the purple
              group.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground text-center">
          Statistics FAQ
        </h2>
        <div className="mt-6 space-y-4 max-w-3xl mx-auto">
          {FAQ_ITEMS.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <h3 className="font-heading text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">
                {item.question}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Keep Exploring
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/connections-practice", title: "Practice Mode", desc: "Play unlimited puzzles", icon: Sparkles },
            { href: "/connections-categories", title: "Category Explorer", desc: "Browse by theme", icon: Target },
            { href: "/connections-difficulty", title: "Difficulty Guide", desc: "What makes puzzles hard", icon: Flame },
            { href: "/connections-hint", title: "Full Archive", desc: "Every past puzzle", icon: BookOpen },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 rounded-xl border border-blue-100 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-blue-900/40 dark:hover:border-blue-700/60"
            >
              <link.icon className="h-5 w-5 text-blue-500 shrink-0" />
              <div className="min-w-0">
                <span className="block text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {link.title}
                </span>
                <span className="text-xs text-muted-foreground">{link.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

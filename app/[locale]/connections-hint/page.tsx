import { MonthSection } from "@/components/connections/MonthSection";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getAllPuzzles,
  getAvailableMonths,
  getLatestPuzzle,
  getPuzzleCount,
} from "@/lib/connections-data";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const TAG_LINKS = [
  { label: "Today's Hint", href: "/connections-hint-today" },
  { label: "How to Play", href: "/how-to-play-connections" },
  { label: "Puzzle Strategies", href: "/blog/connections-strategies-guide" },
  { label: "Common Patterns", href: "/blog/common-connections-patterns" },
  { label: "Beginner Guide", href: "/blog/beginners-guide-connections" },
  { label: "FAQ", href: "/connections-hint-faq" },
  { label: "Full Archive", href: "/connections-hint-archive" },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const count = await getPuzzleCount();

  return constructMetadata({
    page: "Archive",
    title: `All NYT Connections Hints & Answers (Updated Daily)`,
    description: `Browse all ${count} NYT Connections puzzle hints and answers, updated daily. Find progressive hints, group themes, and solutions organized by date.`,
    keywords: [
      "connections hint",
      "nyt connections hint",
      "connections hints and answers",
      "connections puzzle hints",
      "nyt connections answers",
      "connections hint today",
      "connections hint archive",
    ],
    locale: locale as Locale,
    path: `/connections-hint`,
    canonicalUrl: `/connections-hint`,
  });
}

export default async function ConnectionsHintPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const allPuzzles = await getAllPuzzles();
  const months = await getAvailableMonths();
  const totalCount = await getPuzzleCount();
  const latestPuzzle = await getLatestPuzzle();

  // Group puzzles by month
  const puzzlesByMonth = new Map<string, typeof allPuzzles>();
  for (const puzzle of allPuzzles) {
    const month = puzzle.date.slice(0, 7);
    if (!puzzlesByMonth.has(month)) {
      puzzlesByMonth.set(month, []);
    }
    puzzlesByMonth.get(month)!.push(puzzle);
  }

  return (
    <div className="w-full grid-bg">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", url: BASE_URL },
            {
              name: "Connections Hint",
              url: `${BASE_URL}/connections-hint`,
            },
          ])}
        />

        {/* Header */}
        <header className="text-center py-6">
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            All NYT Connections Hints (Updated Daily)
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Welcome to ConnectionsHint! Here you can find hints and answers for
            all {totalCount} NYT Connections puzzles, updated daily. This archive
            helps you review past puzzles, check today&apos;s challenge, and
            improve your puzzle-solving skills.
          </p>

          <div className="mx-auto mt-6 max-w-3xl border-t border-border" />
        </header>

        {/* Tag cloud */}
        <nav className="py-6">
          <p className="text-center text-sm text-muted-foreground mb-3">
            Discover more
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {TAG_LINKS.map((tag) => (
              <Link
                key={tag.label}
                href={tag.href}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Monthly sections */}
        <div className="mt-8 space-y-14">
          {months.map((month) => {
            const puzzles = puzzlesByMonth.get(month) || [];
            return (
              <MonthSection
                key={month}
                month={month}
                puzzles={puzzles}
                latestId={latestPuzzle?.id}
              />
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center py-8 border-t border-border">
          <p className="text-muted-foreground">
            Looking for today&apos;s Connections hint?
          </p>
          <Link
            href="/connections-hint-today"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700"
          >
            View Today&apos;s Connections Hint
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

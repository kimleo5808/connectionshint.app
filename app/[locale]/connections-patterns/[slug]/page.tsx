import { PuzzleCardCompact } from "@/components/connections/PuzzleCard";
import { BASE_URL } from "@/config/site";
import { getGuideBySlug } from "@/data/guides";
import {
  getPatternPageConfig,
  PATTERN_PAGE_CONFIGS,
  PatternPageSlug,
} from "@/data/pattern-pages";
import { Locale, LOCALES } from "@/i18n/routing";
import { getAllPuzzles } from "@/lib/connections-data";
import {
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
  FolderOpen,
  Lightbulb,
  Search,
  TriangleAlert,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; slug: string }>;

function getExamplePuzzles(
  slug: PatternPageSlug,
  puzzles: Awaited<ReturnType<typeof getAllPuzzles>>
) {
  const recent = puzzles.slice(0, 120);

  if (slug === "fill-in-the-blank") {
    return recent
      .filter((puzzle) => getPrimaryPuzzlePattern(puzzle) === "fill-in-the-blank")
      .slice(0, 8);
  }

  if (slug === "wordplay") {
    return recent
      .filter((puzzle) => getPrimaryPuzzlePattern(puzzle) === "wordplay")
      .slice(0, 8);
  }

  return recent
    .map((puzzle) => ({
      puzzle,
      score: getPuzzleDifficultyScore(puzzle),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => item.puzzle);
}

function getStudySummary(slug: PatternPageSlug) {
  if (slug === "fill-in-the-blank") {
    return "These boards hide the real connection inside a shared phrase, so the solve usually opens up after the most literal category is removed.";
  }

  if (slug === "wordplay") {
    return "These boards are strongest when they force a shift away from plain meaning and into spelling, sound, or phrase structure.";
  }

  return "Trap-heavy boards are the best examples of why vague category matching is not enough. You need precise group logic, especially after a one-away message.";
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getPatternPageConfig(slug);

  if (!page) {
    return {};
  }

  return constructMetadata({
    page: "Guides",
    title: page.metaTitle,
    description: page.description,
    keywords: [
      `connections ${page.slug}`,
      page.slug === "common-traps"
        ? "connections red herrings"
        : `connections ${page.slug} patterns`,
      "connections puzzle patterns",
      "nyt connections strategy",
    ],
    locale: locale as Locale,
    path: `/connections-patterns/${page.slug}`,
    canonicalUrl: `/connections-patterns/${page.slug}`,
  });
}

export default async function ConnectionsPatternDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const page = getPatternPageConfig(slug);

  if (!page) {
    notFound();
  }

  const allPuzzles = await getAllPuzzles();
  const examples = getExamplePuzzles(page.slug, allPuzzles);
  const relatedGuides = page.relatedGuideSlugs
    .map((guideSlug) => getGuideBySlug(guideSlug))
    .filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Connections Patterns",
            url: `${BASE_URL}/connections-patterns`,
          },
          {
            name: page.title,
            url: `${BASE_URL}/connections-patterns/${page.slug}`,
          },
        ])}
      />

      <header className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>Pattern Detail</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {page.title}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {page.hero}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/connections-patterns"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Pattern Library
          </Link>
          <Link
            href="/connections-difficulty"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Difficulty Guide
          </Link>
          <Link
            href="/connections-hint"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Full Archive
          </Link>
        </div>
      </header>

      <section className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          What This Pattern Looks Like
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {page.intro}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {getStudySummary(page.slug)}
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Signals to Watch For
              </h2>
            </div>
            <ul className="mt-4 space-y-3">
              {page.signals.map((signal, index) => (
                <li key={signal} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {signal}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-amber-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Common Wrong Turns
              </h2>
            </div>
            <ul className="mt-4 space-y-3">
              {page.mistakes.map((mistake, index) => (
                <li key={mistake} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {mistake}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-purple-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                How to Test the Pattern Before You Submit
              </h2>
            </div>
            <ul className="mt-4 space-y-3">
              {page.process.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Real Puzzle Examples
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Use these historical boards as study reps. Open the full puzzle
              page, review the hints and group logic, and compare the solve note
              to the pattern you are trying to learn.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {examples.map((puzzle) => (
                <Link
                  key={puzzle.date}
                  href={`/connections-hint/${puzzle.date}`}
                  className="rounded-xl border border-border p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:hover:border-blue-700 dark:hover:bg-blue-950/10"
                >
                  <p className="text-sm font-bold text-foreground">
                    Puzzle #{puzzle.id}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {dayjs(puzzle.date).format("MMMM D, YYYY")}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {getPuzzleDifficultyNote(puzzle)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-heading text-sm font-bold text-foreground">
              Quick Examples
            </h2>
            <div className="mt-3 space-y-1">
              {examples.slice(0, 5).map((puzzle) => (
                <PuzzleCardCompact key={puzzle.date} puzzle={puzzle} />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-heading text-sm font-bold text-foreground">
              Related Guides
            </h2>
            <div className="mt-3 space-y-2">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide!.slug}
                  href={`/guides/${guide!.slug}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <span className="font-medium text-foreground">
                    {guide!.title}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-heading text-sm font-bold text-foreground">
              Keep Moving
            </h2>
            <div className="mt-3 space-y-2">
              <Link
                href="/connections-difficulty"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <span className="font-medium text-foreground">
                  Difficulty Guide
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
  const params: { locale: string; slug: string }[] = [];

  for (const locale of LOCALES) {
    for (const page of PATTERN_PAGE_CONFIGS) {
      params.push({ locale, slug: page.slug });
    }
  }

  return params;
}

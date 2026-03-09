import { PuzzleCardCompact } from "@/components/connections/PuzzleCard";
import { BASE_URL } from "@/config/site";
import { GUIDES } from "@/data/guides";
import { PATTERN_PAGE_CONFIGS } from "@/data/pattern-pages";
import { Locale, LOCALES } from "@/i18n/routing";
import { getAllPuzzles } from "@/lib/connections-data";
import {
  getPuzzlesByPrimaryPattern,
} from "@/lib/connections-insights";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  ArrowRight,
  BookOpen,
  Layers3,
  Shapes,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const PATTERN_SECTIONS = [
  {
    id: "fill-in-the-blank",
    title: "Fill in the Blank",
    description:
      "These categories only snap into place after you test the words inside a shared phrase or missing expression.",
    icon: Layers3,
  },
  {
    id: "wordplay",
    title: "Wordplay",
    description:
      "These categories rely on spelling, structure, or phrasing instead of plain topic matching.",
    icon: Sparkles,
  },
  {
    id: "structured-set",
    title: "Structured Sets",
    description:
      "These groups work like clean named sets, lists, or formally related members once you see the category label.",
    icon: Shapes,
  },
  {
    id: "category",
    title: "Category Match",
    description:
      "These are the more direct thematic groups that reward clear subject matching before the harder traps arrive.",
    icon: BookOpen,
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "Guides",
    title: "Connections Patterns and Category Types",
    description:
      "Learn the recurring category styles used in Connections, including fill-in-the-blank groups, wordplay boards, and the patterns worth studying in the archive.",
    keywords: [
      "connections patterns",
      "connections category types",
      "common connections themes",
      "connections wordplay",
    ],
    locale: locale as Locale,
    path: `/connections-patterns`,
    canonicalUrl: `/connections-patterns`,
  });
}

export default async function ConnectionsPatternsPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const allPuzzles = await getAllPuzzles();
  const recentPuzzles = allPuzzles.slice(0, 80);
  const grouped = getPuzzlesByPrimaryPattern(recentPuzzles);
  const guideLinks = GUIDES.slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Connections Patterns",
            url: `${BASE_URL}/connections-patterns`,
          },
        ])}
      />

      <header className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Layers3 className="h-4 w-4" />
          <span>Pattern Library</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Connections Patterns and Category Types
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Connections gets easier when you stop treating every board as totally
          new. Many puzzles reuse familiar structures: fill-in-the-blank logic,
          wordplay, named sets, and plain category matches that hide behind
          believable decoys.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
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
          <Link
            href="/guides"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Strategy Guides
          </Link>
        </div>
      </header>

      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PATTERN_PAGE_CONFIGS.map((page) => (
          <Link
            key={page.slug}
            href={`/connections-patterns/${page.slug}`}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:hover:border-blue-700 dark:hover:bg-blue-950/10"
          >
            <BookOpen className="mb-3 h-7 w-7 text-blue-500" />
            <h2 className="font-heading text-base font-bold text-foreground">
              {page.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {page.description}
            </p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
              Open pattern page
              <ArrowRight className="h-3 w-3" />
            </p>
          </Link>
        ))}
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PATTERN_SECTIONS.map((section) => {
          const Icon = section.icon;
          const exampleCount = grouped[section.id as keyof typeof grouped].length;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:hover:border-blue-700 dark:hover:bg-blue-950/10"
            >
              <Icon className="mb-3 h-7 w-7 text-blue-500" />
              <h2 className="font-heading text-base font-bold text-foreground">
                {section.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {section.description}
              </p>
              <p className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400">
                {exampleCount} recent examples
              </p>
            </a>
          );
        })}
      </section>

      <section className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          How to Use Pattern Study Without Spoiling Too Early
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Pattern study works best after you finish a board or after you get
          stuck. Review the kind of category that blocked you, compare a few
          real examples from the archive, and train yourself to notice the same
          signals earlier on the next puzzle.
        </p>
      </section>

      <div className="space-y-8">
        {PATTERN_SECTIONS.map((section) => {
          const puzzles = grouped[section.id as keyof typeof grouped].slice(0, 6);
          return (
            <section
              key={section.id}
              id={section.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
            >
              <div className="flex items-center gap-2">
                <section.icon className="h-5 w-5 text-blue-500" />
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {section.title}
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {section.description}
              </p>

              <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    What to look for
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {section.id === "fill-in-the-blank"
                      ? "If the words do not feel related on their own, test them before or after the same invisible phrase. This pattern often looks disconnected until the shared wording appears."
                      : section.id === "wordplay"
                        ? "Check spelling, phrasing, sound, and structure. These groups often stay hidden because they refuse to behave like topic-based categories."
                        : section.id === "structured-set"
                          ? "Look for words that belong to a clean named set once the category becomes explicit. These boards often reward identifying two strong anchors first."
                          : "These are the most direct groups on the board. Use them to clear space early, but watch for overlap before you submit too fast."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {section.id !== "category" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        <TriangleAlert className="h-3 w-3" />
                        Common source of one-away mistakes
                      </span>
                    ) : null}
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    Recent Examples
                  </h3>
                  <div className="mt-3 space-y-1">
                    {puzzles.map((puzzle) => (
                      <PuzzleCardCompact key={puzzle.date} puzzle={puzzle} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Keep Learning
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guideLinks.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="rounded-xl border border-border p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:hover:border-blue-700 dark:hover:bg-blue-950/10"
            >
              <p className="font-heading text-sm font-bold text-foreground">
                {guide.title}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {guide.description}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
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
            Archive Index
          </Link>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

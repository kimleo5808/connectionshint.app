import { BASE_URL } from "@/config/site";
import {
  CATEGORY_THEMES,
  getThemeStats,
} from "@/data/categories";
import { Locale, LOCALES } from "@/i18n/routing";
import { getAllPuzzles, getPuzzleCount } from "@/lib/connections-data";
import {
  breadcrumbSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  ArrowRight,
  Brain,
  ChevronRight,
  FolderOpen,
  Grid3X3,
  Lightbulb,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS = [
  {
    question: "What are Connections categories?",
    answer:
      "Every NYT Connections puzzle contains four groups of four words, and each group shares a common theme or connection. These themes range from straightforward topic categories like 'Types of Fish' to abstract structural patterns like fill-in-the-blank phrases. Our category explorer organizes every historical puzzle by the type of theme used.",
  },
  {
    question: "How are puzzles matched to category themes?",
    answer:
      "We analyze the group labels and member words of every puzzle in the archive. When a group's category name or member words match keywords from a specific theme — like food terms, sports terminology, or music vocabulary — that puzzle is included in the theme's collection. Some puzzles appear in multiple themes because they contain groups from different domains.",
  },
  {
    question: "How can category analysis improve my game?",
    answer:
      "By studying which category types appear most often and learning the common traps within each theme, you develop an instinct for recognizing patterns faster during the daily puzzle. For example, knowing that food words frequently double as names or colors helps you avoid committing to a 'food' group too early.",
  },
  {
    question: "Why do some themes have more puzzles than others?",
    answer:
      "NYT editors draw from certain domains more frequently. Themes like food, nature, and colors appear regularly because those words have rich double meanings — which is exactly what makes good Connections puzzles. Niche themes like science or fashion appear less often but are equally valuable for practice.",
  },
];

const RECOGNITION_TIPS = [
  {
    title: "Count Before Committing",
    description:
      "When you spot a potential category, count how many words on the board could fit. If you see six food words but need exactly four, two are misdirection. Identifying which two are fake is the real skill.",
    icon: Search,
  },
  {
    title: "Check for Multiple Readings",
    description:
      "Every word on a Connections board has been chosen because it can plausibly fit more than one group. Before locking a word into a category, ask yourself: what else could this word mean?",
    icon: Lightbulb,
  },
  {
    title: "Start with the Most Specific",
    description:
      "If you see both a broad category ('animals') and a specific one ('animals that are also verbs'), the specific version is more likely correct. Connections rewards precision over breadth.",
    icon: Target,
  },
  {
    title: "Watch for Structural Shifts",
    description:
      "Most boards have 2-3 topic-based groups and 1 structural group (wordplay, compounds, hidden words). If you have solved the topic groups and are stuck, switch your thinking from 'what do these mean?' to 'what do these do?'.",
    icon: Brain,
  },
];

import { Target } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const count = await getPuzzleCount();

  return constructMetadata({
    page: "Categories",
    title: "Connections Categories Explorer — Every Group Type Analyzed",
    description: `Explore every category type across ${count}+ NYT Connections puzzles. Browse by theme — food, sports, movies, wordplay, and more — with strategies and traps for each.`,
    keywords: [
      "connections categories",
      "nyt connections category types",
      "connections group themes",
      "connections food categories",
      "connections sports categories",
      "connections wordplay patterns",
      "connections category analysis",
    ],
    locale: locale as Locale,
    path: `/connections-categories`,
    canonicalUrl: `/connections-categories`,
  });
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function ConnectionsCategoriesPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const allPuzzles = await getAllPuzzles();
  const totalCount = allPuzzles.length;

  // Compute stats for each theme
  const themeStats = CATEGORY_THEMES.map((theme) => ({
    theme,
    ...getThemeStats(allPuzzles, theme),
  })).sort((a, b) => b.puzzleCount - a.puzzleCount);

  // Top 5 themes by puzzle count
  const topThemes = themeStats.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Categories Explorer",
            url: `${BASE_URL}/connections-categories`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <Grid3X3 className="h-4 w-4" />
          <span>Categories Explorer</span>
          <span className="mx-1">&middot;</span>
          <span>{CATEGORY_THEMES.length} Themes</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Connections Categories — Explore Every Group Type
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Browse {totalCount.toLocaleString()}+ historical Connections puzzles
          organized by category theme. Study the traps, strategies, and
          patterns unique to each type to sharpen your daily game.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/connections-hint-today"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Today&apos;s Puzzle
          </Link>
          <Link
            href="/connections-practice"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Practice Mode
          </Link>
          <Link
            href="/connections-difficulty"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Difficulty Guide
          </Link>
          <Link
            href="/connections-patterns"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Pattern Library
          </Link>
        </div>
      </header>

      {/* Theme Grid — Primary section */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-8 mb-8 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-foreground mb-1 text-center">
          Browse by Theme
        </h2>
        <p className="text-center text-sm text-muted-foreground mb-6">
          Each theme page includes matching puzzles, specific strategies, and
          common traps
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {themeStats.map(({ theme, puzzleCount, groupCount }) => (
            <Link
              key={theme.slug}
              href={`/connections-categories/${theme.slug}`}
              className="group rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:hover:border-blue-700/60"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{theme.icon}</span>
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                    {theme.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {puzzleCount} puzzles &middot; {groupCount} groups
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {theme.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SEO Content ── */}

      {/* Most Common Categories */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Most Common Category Themes in Connections
        </h2>
        <p className="mt-2 text-muted-foreground">
          After analyzing every puzzle in the archive, these are the themes
          that NYT editors return to most often. Understanding their frequency
          helps you anticipate what kind of board you are likely to face.
        </p>
        <div className="mt-6 space-y-3">
          {topThemes.map(({ theme, puzzleCount, groupCount }, index) => (
            <div
              key={theme.slug}
              className={`rounded-xl border-l-4 ${theme.accent} border border-border bg-card p-5`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-muted-foreground">
                  #{index + 1}
                </span>
                <span className="text-xl">{theme.icon}</span>
                <div className="flex-1">
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {theme.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Found in {puzzleCount} puzzles ({groupCount} total groups)
                  </p>
                </div>
                <Link
                  href={`/connections-categories/${theme.slug}`}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
                >
                  Explore →
                </Link>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {theme.strategyIntro.slice(0, 200)}...
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How to Recognize Categories Faster */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          How to Recognize Categories Faster
        </h2>
        <p className="mt-2 text-muted-foreground">
          Speed in Connections comes from pattern recognition, not rushing.
          These principles apply across all category types and help you read
          boards more efficiently.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {RECOGNITION_TIPS.map((tip) => (
            <div
              key={tip.title}
              className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/40"
            >
              <div className="flex items-center gap-2 mb-2">
                <tip.icon className="h-4 w-4 text-blue-500" />
                <h3 className="font-heading text-sm font-bold text-foreground">
                  {tip.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Difficulty Breakdown */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Category Difficulty by Theme
        </h2>
        <p className="mt-2 text-muted-foreground">
          Not all category themes are equally hard. Topic-based categories
          (food, sports, movies) tend to be yellow or green groups, while
          structural categories (wordplay, compounds) are more likely to be
          blue or purple.
        </p>
        <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-4 bg-muted/30 p-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <span className="col-span-2">Category Type</span>
            <span className="text-center">Typical Color</span>
            <span className="text-center">Trap Density</span>
          </div>
          {[
            { label: "Direct Topic (animals, countries)", color: "🟡 Yellow / 🟢 Green", trap: "Low" },
            { label: "Specific Topic (90s films, Olympic sports)", color: "🟢 Green / 🔵 Blue", trap: "Medium" },
            { label: "Named Sets (parts of, types of)", color: "🟢 Green / 🔵 Blue", trap: "Medium" },
            { label: "Cultural References (pop culture, memes)", color: "🔵 Blue / 🟣 Purple", trap: "High" },
            { label: "Fill-in-the-Blank (___ word)", color: "🔵 Blue / 🟣 Purple", trap: "High" },
            { label: "Wordplay (hidden, prefix, rhyme)", color: "🟣 Purple", trap: "Very High" },
          ].map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-4 border-t border-border p-3 text-sm"
            >
              <span className="col-span-2 font-medium text-foreground">
                {row.label}
              </span>
              <span className="text-center text-muted-foreground">
                {row.color}
              </span>
              <span className="text-center text-muted-foreground">
                {row.trap}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Why Categories Matter */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Why Studying Categories Improves Your Game
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Every Connections puzzle is, at its core, a category assignment
            problem. You are given 16 words and must assign each one to
            exactly one of four groups. The difficulty comes from the fact that
            most words could plausibly belong to more than one group.
          </p>
          <p>
            By studying historical categories, you learn which themes NYT
            editors use most often and how they construct overlap. A player who
            has seen 50 food-themed puzzles will immediately notice when a
            &ldquo;food&rdquo; word is being used as misdirection — because they have
            been burned by it before.
          </p>
          <p>
            This is not about memorization. It is about developing intuition.
            When you have studied enough boards from a specific theme, you stop
            guessing and start recognizing. That shift from guessing to
            recognition is what separates consistent solvers from players who
            win one day and lose the next.
          </p>
          <p>
            The category explorer is designed to accelerate this process. Each
            theme page shows you every relevant puzzle, the specific traps
            unique to that theme, and strategies that work within that domain.
            Use it as a study tool — not a cheat sheet.
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mt-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-center text-white sm:p-8">
        <h2 className="font-heading text-lg font-bold">
          Put Your Knowledge to the Test
        </h2>
        <p className="mt-2 text-sm text-blue-100">
          After studying category patterns, practice with puzzles from a
          specific theme or jump into today&apos;s daily challenge.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/connections-practice"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Practice Mode
          </Link>
          <Link
            href="/connections-hint-today"
            className="rounded-lg border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-blue-700"
          >
            Today&apos;s Puzzle
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground text-center">
          Frequently Asked Questions
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

      {/* Related Pages */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Explore More
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "/connections-practice",
              title: "Practice Mode",
              desc: "Play unlimited puzzles",
              icon: Sparkles,
            },
            {
              href: "/connections-difficulty",
              title: "Difficulty Guide",
              desc: "See what makes puzzles hard",
              icon: TrendingUp,
            },
            {
              href: "/connections-patterns",
              title: "Pattern Library",
              desc: "Structural patterns analysis",
              icon: Tag,
            },
            {
              href: "/connections-hint",
              title: "Full Archive",
              desc: "Browse every past puzzle",
              icon: FolderOpen,
            },
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
                <span className="text-xs text-muted-foreground">
                  {link.desc}
                </span>
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

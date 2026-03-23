import ConnectionsGame from "@/components/connections/ConnectionsGame";
import { BASE_URL } from "@/config/site";
import {
  CATEGORY_THEMES,
  getPuzzlesForTheme,
  getThemeStats,
  groupMatchesTheme,
} from "@/data/categories";
import { Locale, LOCALES } from "@/i18n/routing";
import { getAllPuzzles } from "@/lib/connections-data";
import { getPuzzleDifficultyScore } from "@/lib/connections-insights";
import {
  breadcrumbSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import dayjs from "dayjs";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Flame,
  Grid3X3,
  Lightbulb,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; theme: string }>;

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, theme: themeSlug } = await params;
  const theme = CATEGORY_THEMES.find((t) => t.slug === themeSlug);
  if (!theme) return {};

  return constructMetadata({
    page: "Categories",
    title: theme.title,
    description: theme.description,
    keywords: theme.seoKeywords,
    locale: locale as Locale,
    path: `/connections-categories/${theme.slug}`,
    canonicalUrl: `/connections-categories/${theme.slug}`,
  });
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function CategoryThemePage({
  params,
}: {
  params: Params;
}) {
  const { theme: themeSlug } = await params;
  const theme = CATEGORY_THEMES.find((t) => t.slug === themeSlug);
  if (!theme) return notFound();

  const allPuzzles = await getAllPuzzles();
  const themePuzzles = getPuzzlesForTheme(allPuzzles, theme);
  const { puzzleCount, groupCount } = getThemeStats(allPuzzles, theme);

  // Get featured puzzles (most recent 5 from this theme)
  const featuredPuzzles = themePuzzles.slice(0, 5);

  // Pick a playable puzzle (the most recent one from this theme)
  const playablePuzzle = featuredPuzzles[0];

  // Get matching groups for display
  const exampleGroups = themePuzzles
    .slice(0, 20)
    .flatMap((puzzle) =>
      puzzle.answers
        .filter((group) => groupMatchesTheme(group, theme))
        .map((group) => ({
          puzzleId: puzzle.id,
          puzzleDate: puzzle.date,
          group: group.group,
          level: group.level,
          members: group.members,
        }))
    )
    .slice(0, 12);

  // Level distribution
  const levelCounts = [0, 0, 0, 0];
  for (const puzzle of themePuzzles) {
    for (const group of puzzle.answers) {
      if (groupMatchesTheme(group, theme)) {
        levelCounts[group.level]++;
      }
    }
  }
  const levelLabels = ["Yellow (Easy)", "Green (Moderate)", "Blue (Tricky)", "Purple (Hard)"];
  const levelColors = [
    "bg-yellow-400 text-yellow-950",
    "bg-emerald-400 text-emerald-950",
    "bg-blue-400 text-blue-950",
    "bg-purple-400 text-purple-950",
  ];

  // Related themes (exclude current)
  const relatedThemes = CATEGORY_THEMES.filter(
    (t) => t.slug !== theme.slug
  ).slice(0, 6);

  // FAQ for this theme
  const themeFaqItems = [
    {
      question: `How many ${theme.label} puzzles are in the archive?`,
      answer: `We found ${puzzleCount} puzzles containing ${theme.label.toLowerCase()}-related groups across the entire Connections archive. These puzzles collectively contain ${groupCount} individual groups that match ${theme.label.toLowerCase()} keywords.`,
    },
    {
      question: `What difficulty are ${theme.label} categories usually?`,
      answer: `${theme.label} categories appear across all difficulty levels, but the distribution tells an important story. ${levelCounts[0] + levelCounts[1] > levelCounts[2] + levelCounts[3] ? `Most ${theme.label.toLowerCase()} groups land in yellow or green, meaning they are often among the easier categories to spot.` : `A significant portion of ${theme.label.toLowerCase()} groups appear in blue or purple, meaning they are frequently used as harder, more deceptive categories.`} Check the difficulty breakdown on this page for exact numbers.`,
    },
    {
      question: `What are the biggest traps in ${theme.label} categories?`,
      answer: `The most common traps involve words that look like they belong in a ${theme.label.toLowerCase()} group but actually connect through a different theme. ${theme.commonTraps[0]?.description || "Double-meaning words are the primary challenge."} See the 'Common Traps' section on this page for a complete breakdown.`,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Categories",
            url: `${BASE_URL}/connections-categories`,
          },
          {
            name: theme.label,
            url: `${BASE_URL}/connections-categories/${theme.slug}`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(themeFaqItems)} />

      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <Grid3X3 className="h-4 w-4" />
          <Link
            href="/connections-categories"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Categories
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span>{theme.label}</span>
        </div>
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-4xl">{theme.icon}</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {theme.title}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          {theme.heroDescription}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {puzzleCount} puzzles
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {groupCount} groups
          </span>
        </div>
      </header>

      {/* Playable Puzzle */}
      {playablePuzzle && (
        <section className="rounded-2xl border border-border bg-card p-5 sm:p-8 mb-8 shadow-sm">
          <h2 className="text-center font-heading text-lg font-bold text-foreground mb-1">
            Try a {theme.label} Puzzle
          </h2>
          <p className="text-center text-xs text-muted-foreground mb-5">
            Puzzle #{playablePuzzle.id} from{" "}
            {dayjs(playablePuzzle.date).format("MMMM D, YYYY")} — contains{" "}
            {theme.label.toLowerCase()}-related groups
          </p>
          <ConnectionsGame groups={playablePuzzle.answers} />
        </section>
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Strategy Section */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-blue-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Strategy for {theme.label} Puzzles
              </h2>
            </div>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              {theme.strategyIntro}
            </p>
            <div className="space-y-4">
              {theme.strategyTips.map((tip) => (
                <div
                  key={tip.title}
                  className={`rounded-xl border-l-4 ${theme.accent} border border-border bg-card p-4`}
                >
                  <h3 className="font-heading text-sm font-bold text-foreground mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {tip.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Common Traps */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-red-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Common {theme.label} Traps and Red Herrings
              </h2>
            </div>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              These are the misdirection patterns that appear most often in{" "}
              {theme.label.toLowerCase()} categories. Knowing them in advance
              saves you mistakes.
            </p>
            <div className="space-y-3">
              {theme.commonTraps.map((trap) => (
                <div
                  key={trap.title}
                  className="rounded-xl border border-red-100 bg-card p-4 dark:border-red-900/30"
                >
                  <h3 className="font-heading text-sm font-bold text-red-600 dark:text-red-400 mb-2">
                    {trap.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {trap.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Difficulty Distribution */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                {theme.label} Difficulty Distribution
              </h2>
            </div>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
              How {theme.label.toLowerCase()} groups are distributed across
              Connections difficulty levels, based on {groupCount} matched
              groups.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {levelLabels.map((label, i) => {
                const pct =
                  groupCount > 0
                    ? Math.round((levelCounts[i] / groupCount) * 100)
                    : 0;
                return (
                  <div
                    key={label}
                    className="rounded-xl border border-border bg-muted/20 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {label}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${levelColors[i]}`}
                      >
                        {levelCounts[i]}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${levelColors[i].split(" ")[0]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {pct}% of {theme.label.toLowerCase()} groups
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Example Groups */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">
              Recent {theme.label} Groups from the Archive
            </h2>
            <p className="mb-5 text-sm text-muted-foreground">
              These are actual group labels and member words from recent
              puzzles that match the {theme.label.toLowerCase()} theme.
            </p>
            <div className="space-y-3">
              {exampleGroups.map((eg, i) => (
                <Link
                  key={`${eg.puzzleId}-${eg.group}-${i}`}
                  href={`/connections-hint/${eg.puzzleDate}`}
                  className="block rounded-xl border border-border p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:hover:border-blue-700 dark:hover:bg-blue-950/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${levelColors[eg.level]}`}
                    >
                      {levelLabels[eg.level].split(" ")[0]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Puzzle #{eg.puzzleId}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {eg.group}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {eg.members.join(", ")}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          {/* More Puzzles */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sticky top-24">
            <h3 className="font-heading text-sm font-bold text-foreground mb-3">
              {theme.label} Puzzles
            </h3>
            <div className="space-y-1">
              {featuredPuzzles.map((p) => (
                <Link
                  key={p.date}
                  href={`/connections-hint/${p.date}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <span className="font-medium text-foreground">
                    #{p.id} · {dayjs(p.date).format("MMM D")}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Link>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <Link
                href="/connections-hint"
                className="block text-center text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
              >
                View Full Archive →
              </Link>
            </div>
          </div>

          {/* Related Themes */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h3 className="font-heading text-sm font-bold text-foreground mb-3">
              Other Themes
            </h3>
            <div className="space-y-1">
              {relatedThemes.map((t) => (
                <Link
                  key={t.slug}
                  href={`/connections-categories/${t.slug}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                >
                  <span>{t.icon}</span>
                  <span className="font-medium text-foreground">
                    {t.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ── SEO Content ── */}

      {/* How to Approach Theme Puzzles */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          How to Approach {theme.label} Boards
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            When you open a Connections board and notice{" "}
            {theme.label.toLowerCase()}-related words, your first instinct
            might be to group them immediately. Resist that urge. The presence
            of {theme.label.toLowerCase()} vocabulary on the board is not
            proof that a {theme.label.toLowerCase()} category exists — it
            might be misdirection.
          </p>
          <p>
            Start by counting how many words could fit a{" "}
            {theme.label.toLowerCase()} category. If you see exactly four,
            you may have found a group. If you see five or six, at least one
            or two are red herrings designed to waste your guesses.
          </p>
          <p>
            Next, check each {theme.label.toLowerCase()} word for alternative
            meanings. Can the word function as a verb, a proper name, or part
            of a compound phrase? The word with the strongest non-
            {theme.label.toLowerCase()} reading is your most likely red
            herring.
          </p>
          <p>
            Finally, consider the group specificity. Connections rarely uses
            broad categories. Instead of &ldquo;{theme.label.toLowerCase()} words&rdquo;,
            the actual group is more likely to be a precise subcategory. The
            more specific your grouping, the more likely it is correct.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground text-center">
          {theme.label} Category FAQ
        </h2>
        <div className="mt-6 space-y-4 max-w-3xl mx-auto">
          {themeFaqItems.map((item) => (
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
          Continue Exploring
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "/connections-categories",
              title: "All Categories",
              desc: "Browse every theme",
              icon: Grid3X3,
            },
            {
              href: "/connections-practice",
              title: "Practice Mode",
              desc: "Play unlimited puzzles",
              icon: Sparkles,
            },
            {
              href: "/connections-difficulty",
              title: "Difficulty Guide",
              desc: "Understand puzzle scoring",
              icon: Flame,
            },
            {
              href: "/connections-hint-today",
              title: "Today's Puzzle",
              desc: "Play the daily challenge",
              icon: Lightbulb,
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
  const params: { locale: string; theme: string }[] = [];
  for (const locale of LOCALES) {
    for (const theme of CATEGORY_THEMES) {
      params.push({ locale, theme: theme.slug });
    }
  }
  return params;
}

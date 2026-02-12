import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  CheckCircle2,
  Grid3X3,
  Lightbulb,
  Target,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HowToPlay" });

  return constructMetadata({
    page: "HowToPlay",
    title: t("title"),
    description: t("description"),
    keywords: [
      "how to play connections",
      "connections rules",
      "nyt connections guide",
      "connections game rules",
      "connections tips",
      "connections strategy",
    ],
    locale: locale as Locale,
    path: `/how-to-play-connections`,
    canonicalUrl: `/how-to-play-connections`,
  });
}

const DIFFICULTY_GROUPS = [
  {
    color: "Yellow",
    bg: "bg-yellow-400",
    textBg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    label: "Straightforward",
    description:
      "The easiest category. The connection is usually obvious once you see it. Think of direct, common groupings.",
  },
  {
    color: "Green",
    bg: "bg-emerald-500",
    textBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    label: "Moderate",
    description:
      "Requires a bit more thought. The connection exists but may not be immediately obvious. Could involve less common knowledge.",
  },
  {
    color: "Blue",
    bg: "bg-blue-400",
    textBg: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    label: "Tricky",
    description:
      "The connections are less obvious. May involve secondary meanings of words, cultural references, or less intuitive groupings.",
  },
  {
    color: "Purple",
    bg: "bg-blue-500",
    textBg: "bg-blue-100 text-purple-800 dark:bg-blue-900/40 dark:text-purple-300",
    label: "Challenging",
    description:
      "The hardest category. Often involves wordplay, puns, hidden patterns, or abstract connections. This is where most mistakes happen.",
  },
];

const STRATEGIES = [
  {
    icon: Target,
    title: "Start with the Obvious",
    description:
      "Scan all 16 words first. Look for a Yellow (easy) group — words that clearly belong together. Solving the easiest group first narrows down your options.",
  },
  {
    icon: Brain,
    title: "Think About Word Meanings",
    description:
      "Many words have multiple meanings. \"BASS\" could be a fish, a musical term, or a type of guitar. The puzzle loves to exploit these double meanings.",
  },
  {
    icon: AlertTriangle,
    title: "Watch for Red Herrings",
    description:
      "The puzzle intentionally includes words that seem to fit multiple categories. If four words seem too obvious, one might be a trap designed to mislead you.",
  },
  {
    icon: Zap,
    title: "Save Purple for Last",
    description:
      "The Purple group is always the trickiest. By solving the other three groups first, the Purple group reveals itself through elimination.",
  },
  {
    icon: Lightbulb,
    title: "Look for Patterns",
    description:
      "Common connection types include: things that follow a word (e.g., ___ BALL), things that precede a word (e.g., FIRE ___), or words with hidden words inside them.",
  },
  {
    icon: CheckCircle2,
    title: "Use Process of Elimination",
    description:
      "Once you're fairly sure about 3 words in a group, look at what remains. The 4th word must be whatever completes the group from the remaining options.",
  },
];

export default async function HowToPlayPage({ params }: { params: Params }) {
  await params;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "How to Play",
            url: `${BASE_URL}/how-to-play-connections`,
          },
        ])}
      />

      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 sm:p-8 dark:border-blue-900/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-950/30">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Guide
            </span>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            How to Play NYT Connections
          </h1>
          <p className="mt-2 text-muted-foreground">
            Learn the rules, understand the difficulty levels, and master
            strategies to solve the puzzle every day.
          </p>
        </div>
      </header>

      <div className="mt-8 space-y-8">
        {/* Basic Rules */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <Grid3X3 className="h-5 w-5 text-blue-500" />
            The Rules
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              NYT Connections is a daily word puzzle by The New York Times. Each
              day, you&apos;re presented with <strong>16 words</strong> arranged
              in a 4x4 grid.
            </p>
            <p>
              Your goal is to find <strong>four groups of four words</strong>{" "}
              that share a common connection. The groups are color-coded by
              difficulty from Yellow (easiest) to Purple (hardest).
            </p>
            <p>
              You can make up to <strong>4 mistakes</strong> before the game
              ends. Each incorrect guess (selecting 4 words that don&apos;t form
              a valid group) counts as one mistake.
            </p>
            <p>
              A new puzzle is released every day at midnight Eastern Time. The
              puzzle is the same for everyone worldwide.
            </p>
          </div>
        </section>

        {/* Difficulty Levels */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Difficulty Levels
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Each puzzle has exactly four groups, one of each difficulty level:
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {DIFFICULTY_GROUPS.map((group) => (
              <div
                key={group.color}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${group.bg}`}
                  />
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold ${group.textBg}`}
                  >
                    {group.color} — {group.label}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {group.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Strategies */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Strategies & Tips
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {STRATEGIES.map((strategy) => (
              <div
                key={strategy.title}
                className="rounded-xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-sm dark:hover:border-purple-800"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-purple-900/30 dark:text-blue-400">
                    <strategy.icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {strategy.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {strategy.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 sm:p-8 text-center text-white">
          <h2 className="font-heading text-2xl font-bold">
            Ready to Play?
          </h2>
          <p className="mt-2 text-blue-100">
            Check out today&apos;s puzzle hints or browse our archive.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/connections-hint-today"
              className="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-blue-700 transition-all hover:bg-blue-50"
            >
              Today&apos;s Hints
            </Link>
            <Link
              href="/connections-hint"
              className="rounded-xl border-2 border-white/30 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10"
            >
              Browse Archive
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

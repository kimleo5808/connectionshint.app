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
    textBg:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    label: "Straightforward",
    description:
      "The cleanest category on the board. Yellow groups are usually the most literal and are the safest place to start.",
  },
  {
    color: "Green",
    bg: "bg-emerald-500",
    textBg:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    label: "Moderate",
    description:
      "Still fairly direct, but more likely to overlap with a tempting decoy or a less common shared trait.",
  },
  {
    color: "Blue",
    bg: "bg-blue-400",
    textBg: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    label: "Tricky",
    description:
      "Often relies on secondary meanings, less obvious references, or a connection that only becomes clear after other groups are removed.",
  },
  {
    color: "Purple",
    bg: "bg-purple-500",
    textBg:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    label: "Challenging",
    description:
      "The hardest category. Purple groups often depend on wordplay, phrasing, or a connection that feels non-literal until the end.",
  },
];

const STRATEGIES = [
  {
    icon: Target,
    title: "Start with the Obvious",
    description:
      "Scan all 16 words before submitting anything. A reliable yellow group gives you the best chance to clear space without wasting mistakes.",
  },
  {
    icon: Brain,
    title: "Think About Word Meanings",
    description:
      "Do not lock onto the first definition you see. Many Connections traps work because one word can belong to two believable categories.",
  },
  {
    icon: AlertTriangle,
    title: "Watch for Red Herrings",
    description:
      "The board is built to create overlap. If four words feel almost right, one of them may be bait that belongs in a different category.",
  },
  {
    icon: Zap,
    title: "Save Purple for Last",
    description:
      "Purple is usually easier after the board is smaller. Clear the direct categories first, then test the final connection with more confidence.",
  },
  {
    icon: Lightbulb,
    title: "Look for Patterns",
    description:
      "Watch for recurring category styles such as fill-in-the-blank phrases, shared prefixes or suffixes, hidden word structure, or named sets.",
  },
  {
    icon: CheckCircle2,
    title: "Use Process of Elimination",
    description:
      "If you strongly believe three words belong together, pause and scan the whole board for the fourth. The final fit often stands out only after comparison.",
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
            Learn the rules, understand what the color levels actually mean, and
            build solving habits that help you make fewer forced guesses.
          </p>
        </div>
      </header>

      <div className="mt-8 space-y-8">
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
            <Grid3X3 className="h-5 w-5 text-blue-500" />
            The Rules
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              NYT Connections is a daily word puzzle by The New York Times. Each
              board gives you <strong>16 words</strong> arranged in a 4x4 grid.
            </p>
            <p>
              Your job is to find <strong>four groups of four words</strong> that
              belong together. Each solved set is tagged by difficulty from
              Yellow (easiest) to Purple (hardest).
            </p>
            <p>
              You can make up to <strong>4 mistakes</strong> before the game
              ends. Every incorrect four-word submission costs one life, so it
              is usually better to confirm a group than to guess fast.
            </p>
            <p>
              A new puzzle is released every day at midnight Eastern Time, and
              the same board appears for everyone.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Difficulty Levels
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every board contains one group at each color level, from the most
            direct idea to the least literal:
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {DIFFICULTY_GROUPS.map((group) => (
              <div
                key={group.color}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${group.bg}`} />
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold ${group.textBg}`}
                  >
                    {group.color} - {group.label}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {group.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Strategies & Tips
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The goal is not to guess faster. It is to separate the reliable
            categories from the overlaps before you spend mistakes.
          </p>
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
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {strategy.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-center text-white sm:p-8">
          <h2 className="font-heading text-2xl font-bold">Ready to Play?</h2>
          <p className="mt-2 text-blue-100">
            Open today&apos;s hint page if you want a light nudge, or use the
            archive to review how past boards were put together.
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

import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getAllPuzzles } from "@/lib/connections-data";
import {
  breadcrumbSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  ArrowRight,
  BookOpen,
  Brain,
  ChevronRight,
  Flame,
  HelpCircle,
  Lightbulb,
  Search,
  Shield,
  Sparkles,
  Target,
  Wrench,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import ConnectionsSolver from "@/components/connections/ConnectionsSolver";

type Params = Promise<{ locale: string }>;

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const WHEN_TO_USE = [
  {
    icon: HelpCircle,
    title: "Stuck on the Last Group",
    description:
      "You have solved two or three groups but cannot figure out the remaining words. The solver can confirm which puzzle you are playing and give you a targeted hint for just the group you are stuck on.",
  },
  {
    icon: Brain,
    title: "Learning New Patterns",
    description:
      "After using the solver, review the category names to understand the editor's logic. This is how you learn to recognize fill-in-the-blank, wordplay, and structural patterns for future puzzles.",
  },
  {
    icon: Shield,
    title: "Verifying Your Solution",
    description:
      "Already solved the puzzle but want to check if you got the right groups? Enter the words and reveal the answers to compare against your result.",
  },
  {
    icon: Target,
    title: "Avoiding Complete Frustration",
    description:
      "Sometimes a puzzle is just too hard. Rather than giving up entirely, use progressive hints to get a nudge in the right direction without seeing the full answer immediately.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Enter Your 16 Words",
    description:
      "Type or paste the 16 words from your Connections board into the grid. You can paste a comma-separated list into the first field to auto-fill all words at once.",
  },
  {
    step: "2",
    title: "We Match Your Puzzle",
    description:
      "The solver instantly searches our archive of 1000+ historical puzzles to find the exact board you are playing. No AI needed — we match against real puzzle data.",
  },
  {
    step: "3",
    title: "Reveal Hints Progressively",
    description:
      "Once matched, each of the four groups has three hint levels. Start with a vague clue, then reveal the category name, and finally see the full answer. Stop at whatever level you need.",
  },
];

const SOLVING_WITHOUT_TOOL = [
  {
    title: "The Elimination Method",
    description:
      "Start with the group you are most confident about. Once solved, the remaining 12 words become easier to sort. Each correct group simplifies the board by removing four words from consideration. By the time you reach the last group, it solves itself.",
  },
  {
    title: "Start with Confidence, Not Speed",
    description:
      "Scan all 16 words before submitting anything. Identify the group where you can name all four members with high certainty. Submitting a high-confidence group first is always better than guessing a probable group — one mistake on an uncertain group wastes a valuable guess.",
  },
  {
    title: "Look for Structural Patterns",
    description:
      "If no four words share an obvious topic, switch your thinking from 'what do these words mean?' to 'what do these words do?' Check for hidden words inside the letters, common prefixes or suffixes, or fill-in-the-blank phrases. The purple group often lives in this structural space.",
  },
];

const CONNECTION_TYPES = [
  {
    type: "Semantic Connections",
    description:
      "Words that share a meaning or belong to the same real-world category. Examples: types of fish, Olympic sports, shades of blue. These are usually yellow or green groups and the easiest to spot.",
    examples: "BASS, TROUT, SALMON, COD → Types of Fish",
  },
  {
    type: "Structural Connections",
    description:
      "Words connected by their spelling, sound, or position in a phrase rather than their meaning. Examples: words that start with 'SH', words hidden inside other words, fill-in-the-blank patterns. These are usually blue or purple groups.",
    examples: "___ BREAK: LUNCH, DAY, HEART, JAIL",
  },
  {
    type: "Cultural Connections",
    description:
      "Words connected through pop culture, brand names, famous people, or shared references. Examples: Marvel characters, 90s sitcoms, or words that are also car brands. These require specific knowledge and are medium difficulty.",
    examples: "FOCUS, EXPLORER, MUSTANG, ESCAPE → Ford Models",
  },
  {
    type: "Deceptive Connections",
    description:
      "Words that look like they belong together by meaning but are actually connected by a completely different logic. This is the editor's favorite trick — the obvious grouping is wrong, and the real connection is hidden. Almost always the purple group.",
    examples: "JACK, QUEEN, KING, ACE → might be cards OR names that are also royalty",
  },
];

const FAQ_ITEMS = [
  {
    question: "How does the Connections solver work?",
    answer:
      "The solver matches the 16 words you enter against our complete archive of NYT Connections puzzles. When it finds a match, it provides progressive hints for each of the four groups — starting with vague clues and building to full answers. It does not use AI or guessing; it uses actual puzzle data.",
  },
  {
    question: "Will the solver work for today's puzzle?",
    answer:
      "Yes, as long as today's puzzle has been added to our database. Our puzzle updater runs daily, so today's puzzle should be available shortly after it goes live at midnight ET. If the solver cannot find a match, the puzzle may not have been indexed yet — try again in a few hours.",
  },
  {
    question: "What if I have a typo in one of my words?",
    answer:
      "The solver has some tolerance for errors — it can match your puzzle even if 1-2 words are slightly different. However, for best results, double-check your spelling against the words shown on the NYT Connections board.",
  },
  {
    question: "Is using a solver cheating?",
    answer:
      "That depends on your goals. If you are playing competitively, using a solver defeats the purpose. But if you are stuck, frustrated, or trying to learn, progressive hints are a better alternative than giving up entirely. The solver is designed to help you learn — use the vague hints first and only reveal answers as a last resort.",
  },
  {
    question: "Can I use this for past puzzles?",
    answer:
      "Absolutely. The solver searches the entire archive, so you can enter words from any historical puzzle. This is useful for reviewing old boards, practicing, or helping someone who is playing a past puzzle.",
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
    page: "Solver",
    title: "Connections Solver — Get Help Grouping Your 16 Words",
    description:
      "Enter your 16 Connections words and get progressive hints for each group. Matches against 1000+ puzzles in our archive. Reveal as little or as much as you need.",
    keywords: [
      "connections solver",
      "connections puzzle solver",
      "nyt connections solver",
      "connections help tool",
      "connections word grouper",
      "connections answer finder",
      "solve connections puzzle",
    ],
    locale: locale as Locale,
    path: `/connections-solver`,
    canonicalUrl: `/connections-solver`,
  });
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function ConnectionsSolverPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const allPuzzles = await getAllPuzzles();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Connections Solver",
            url: `${BASE_URL}/connections-solver`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <Wrench className="h-4 w-4" />
          <span>Puzzle Solver Tool</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Connections Solver
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Enter your 16 words and get progressive hints for each group. Start
          with a vague clue, reveal the category name, or see the full
          answer — you control how much help you get.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/connections-hint-today"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Today&apos;s Hints
          </Link>
          <Link
            href="/connections-practice"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Practice Mode
          </Link>
          <Link
            href="/connections-hint"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Browse Archive
          </Link>
        </div>
      </header>

      {/* Solver Tool */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-8 mb-8 shadow-sm">
        <h2 className="text-center font-heading text-lg font-bold text-foreground mb-1">
          Enter Your Puzzle Words
        </h2>
        <p className="text-center text-xs text-muted-foreground mb-6">
          Type the 16 words from your Connections board, then click &ldquo;Find
          My Puzzle&rdquo; for progressive hints
        </p>
        <ConnectionsSolver puzzles={allPuzzles} />
      </section>

      {/* ── SEO Content ── */}

      {/* How It Works */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          How the Connections Solver Works
        </h2>
        <p className="mt-2 text-muted-foreground">
          Three simple steps from stuck to solved — or at least, un-stuck.
        </p>
        <div className="mt-6 space-y-4">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {item.step}
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* When to Use */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          When to Use a Solver
        </h2>
        <p className="mt-2 text-muted-foreground">
          A solver is a tool, not a crutch. Here are the scenarios where it
          adds the most value to your experience.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {WHEN_TO_USE.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/40"
            >
              <item.icon className="h-5 w-5 text-blue-500 mb-2" />
              <h3 className="font-heading text-sm font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Solving Without a Tool */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Solving Connections Without a Tool
        </h2>
        <p className="mt-2 text-muted-foreground">
          Before reaching for the solver, try these strategies that
          experienced players use to work through difficult boards.
        </p>
        <div className="mt-6 space-y-4">
          {SOLVING_WITHOUT_TOOL.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border-l-4 border-l-blue-500 border border-border bg-card p-5"
            >
              <h3 className="font-heading text-sm font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Understanding Connection Types */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Understanding Connection Types
        </h2>
        <p className="mt-2 text-muted-foreground">
          Knowing the four types of connections that NYT uses helps you
          approach each board more systematically.
        </p>
        <div className="mt-6 space-y-4">
          {CONNECTION_TYPES.map((item) => (
            <div
              key={item.type}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h3 className="font-heading text-base font-bold text-foreground mb-2">
                {item.type}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-3">
                {item.description}
              </p>
              <div className="rounded-lg bg-muted/30 px-4 py-2.5 text-xs font-medium text-muted-foreground">
                Example: {item.examples}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-center text-white sm:p-8">
        <h2 className="font-heading text-lg font-bold">
          Want to Solve Without Help?
        </h2>
        <p className="mt-2 text-sm text-blue-100">
          Build your skills with practice mode or study category patterns to
          become a more independent solver.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/connections-practice"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Practice Mode
          </Link>
          <Link
            href="/connections-categories"
            className="rounded-lg border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-blue-700"
          >
            Study Categories
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground text-center">
          Solver FAQ
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
          More Tools & Resources
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/connections-hint-today", title: "Today's Hints", desc: "Progressive daily hints", icon: Lightbulb },
            { href: "/connections-practice", title: "Practice Mode", desc: "Unlimited puzzles", icon: Sparkles },
            { href: "/connections-categories", title: "Category Explorer", desc: "Browse by theme", icon: Target },
            { href: "/connections-stats", title: "Puzzle Stats", desc: "Data & trends", icon: Flame },
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

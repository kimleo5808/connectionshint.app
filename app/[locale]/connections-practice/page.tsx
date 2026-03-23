import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { Link as I18nLink } from "@/i18n/routing";
import { getAllPuzzles, getPuzzleCount } from "@/lib/connections-data";
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
  Dices,
  Flame,
  Lightbulb,
  Repeat,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import PracticeGame from "@/components/connections/PracticeGame";

type Params = Promise<{ locale: string }>;

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const PRACTICE_BENEFITS = [
  {
    icon: Brain,
    title: "Train Pattern Recognition",
    description:
      "Repeated exposure to past boards builds an intuitive feel for category types, red herrings, and the way NYT editors structure overlap between groups.",
  },
  {
    icon: Target,
    title: "Reduce Guesswork",
    description:
      "Players who practice regularly develop a sharper instinct for which group to tackle first and when to hold back on a risky purple guess.",
  },
  {
    icon: Trophy,
    title: "Track Your Improvement",
    description:
      "Monitor your win rate and see real improvement over time. Practice turns occasional lucky solves into repeatable skill.",
  },
];

const STRATEGY_CARDS = [
  {
    title: "The Warm-Up Routine",
    items: [
      "Start each session with one easy puzzle to calibrate your reading speed",
      "Move to a medium puzzle and focus on identifying the trickiest group before submitting",
      "Finish with a hard puzzle where fill-in-the-blank or wordplay is the primary obstacle",
    ],
  },
  {
    title: "Focus on Weaknesses",
    items: [
      "If you struggle with purple groups, play hard mode repeatedly to build tolerance for abstract connections",
      "If you often get 'one away' messages, slow down and look for words that could belong to two groups",
      "If you lose early, practice easy mode to develop a reliable process for clearing yellow and green first",
    ],
  },
  {
    title: "Review After Every Game",
    items: [
      "Check which group you got wrong and ask why that word seemed to fit elsewhere",
      "Look at the group names to understand the editor's intended logic",
      "Visit the hint page for the puzzle to see progressive clues and compare your thought process",
    ],
  },
];

const DIFFICULTY_GUIDE = [
  {
    level: "Easy",
    color: "border-l-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    description:
      "Easy puzzles are boards where all four groups use straightforward category labels. Think 'Types of Fish', 'Olympic Sports', or 'Shades of Blue'. There is minimal wordplay and the overlap between groups stays manageable. These puzzles are ideal for beginners who want to learn the basic rhythm of Connections: scan the full board, pick the cleanest group, lock it in, and work down from there.",
  },
  {
    level: "Medium",
    color: "border-l-amber-500",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    description:
      "Medium puzzles introduce at least one group that uses a structural pattern — a named set, a 'things that can follow ___' category, or a group where the connection is less immediately obvious. The real challenge in medium boards is usually the overlap: two or three words look like they could belong to more than one group, and you have to decide which reading is cleaner. This is where the habit of starting with your most confident group pays off.",
  },
  {
    level: "Hard",
    color: "border-l-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    description:
      "Hard puzzles are the boards that made social media groan. They feature fill-in-the-blank phrases, wordplay-based groups, or purple categories that depend on letter patterns, hidden words, or cultural references with multiple meanings. The key to hard puzzles is recognizing early that the board is not rewarding topic matching — once you shift your mindset from 'what do these words mean?' to 'what do these words do?', the path forward becomes clearer.",
  },
];

const FAQ_ITEMS = [
  {
    question: "How are practice puzzles selected?",
    answer:
      "Practice puzzles are drawn from the full ConnectionsHint archive of 1000+ historical NYT Connections boards. When you choose a difficulty, the puzzles are filtered using a heuristic that analyzes group labels for patterns like fill-in-the-blank, wordplay, and structural sets. Easy puzzles have mostly direct category labels, while hard puzzles feature multiple abstract or language-based groups.",
  },
  {
    question: "Does practice mode track my stats?",
    answer:
      "Yes, during your current session. The practice tracker shows your total games played, wins, and win rate. This data stays in your browser session so you can monitor improvement within a practice session. For long-term tracking, we recommend keeping a simple note of your daily results.",
  },
  {
    question: "Can I replay the same puzzle?",
    answer:
      "Each time you click 'Skip to Next' or start a new game, a random puzzle is selected from the chosen difficulty pool. You may occasionally see the same puzzle again, which is actually useful — solving a previously-failed board is one of the best ways to reinforce pattern recognition.",
  },
  {
    question: "What's the best way to use practice mode?",
    answer:
      "Start with 2-3 easy puzzles as a warm-up, then move to medium. When you feel comfortable clearing medium boards with 0-1 mistakes, switch to hard mode. Focus on understanding why you got words wrong, not just whether you won or lost.",
  },
  {
    question: "How is difficulty determined?",
    answer:
      "Our difficulty system analyzes the group labels (category names) of each puzzle. Boards with fill-in-the-blank phrases ('___ of the World'), wordplay indicators ('starts with', 'hidden', 'anagram'), or structural patterns score higher difficulty. Boards with simple thematic labels ('Types of Pasta') score lower. The purple group's pattern type adds extra weight since it's usually where solves break down.",
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
  const count = await getPuzzleCount();

  return constructMetadata({
    page: "Practice",
    title: "Practice Connections — Play Unlimited Puzzles by Difficulty",
    description: `Practice NYT Connections with ${count}+ historical puzzles sorted by difficulty. Choose easy, medium, or hard mode to sharpen your pattern recognition and improve your daily solve streak.`,
    keywords: [
      "connections practice",
      "practice connections game",
      "connections unlimited",
      "play connections online",
      "connections puzzle practice",
      "nyt connections practice mode",
      "connections game training",
    ],
    locale: locale as Locale,
    path: `/connections-practice`,
    canonicalUrl: `/connections-practice`,
  });
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function ConnectionsPracticePage({
  params,
}: {
  params: Params;
}) {
  await params;
  const allPuzzles = await getAllPuzzles();
  const totalCount = allPuzzles.length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Practice Connections",
            url: `${BASE_URL}/connections-practice`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <Dices className="h-4 w-4" />
          <span>Practice Mode</span>
          <span className="mx-1">&middot;</span>
          <span>{totalCount.toLocaleString()} Puzzles Available</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Practice Connections — Play Unlimited Puzzles
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Pick a difficulty level and play random puzzles from the full
          archive. Build your pattern recognition, reduce guesswork, and turn
          daily Connections into a reliable win.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/connections-hint-today"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Today&apos;s Puzzle
          </Link>
          <Link
            href="/connections-hint"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Browse Archive
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
            Study Patterns
          </Link>
        </div>
      </header>

      {/* Game Area */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-8 mb-8 shadow-sm">
        <h2 className="text-center font-heading text-lg font-bold text-foreground mb-1">
          Choose Your Difficulty
        </h2>
        <p className="text-center text-xs text-muted-foreground mb-6">
          Select a level below to start practicing with a random puzzle from
          the archive
        </p>
        <PracticeGame puzzles={allPuzzles} />
      </section>

      {/* ── SEO Content Sections ── */}

      {/* Why Practice */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Why Practice Mode Makes You a Better Player
        </h2>
        <p className="mt-3 text-muted-foreground">
          Playing one puzzle a day gives you exposure, but targeted practice
          gives you skill. Here is why dedicated practice sessions change the
          way you approach each board.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {PRACTICE_BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/40"
            >
              <benefit.icon className="h-6 w-6 text-blue-500 mb-3" />
              <h3 className="font-heading text-sm font-bold text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Difficulty Guide */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Understanding Difficulty Levels
        </h2>
        <p className="mt-2 text-muted-foreground">
          Not all Connections puzzles are equal. Our practice mode sorts the
          full archive into three difficulty tiers based on what makes boards
          genuinely hard to solve.
        </p>
        <div className="mt-6 space-y-4">
          {DIFFICULTY_GUIDE.map((item) => (
            <div
              key={item.level}
              className={`rounded-xl border-l-4 ${item.color} border border-border bg-card p-5`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${item.badge}`}
                >
                  {item.level}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Practice Strategy */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          How to Practice Effectively
        </h2>
        <p className="mt-2 text-muted-foreground">
          Random playing helps, but structured practice helps more. Use these
          frameworks to get the most out of each session.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {STRATEGY_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h3 className="font-heading text-base font-bold text-foreground mb-3">
                {card.title}
              </h3>
              <ul className="space-y-2.5">
                {card.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Practice vs Daily Play */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Practice Mode vs. Daily Puzzle
        </h2>
        <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-3 bg-muted/30 p-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <span>Feature</span>
            <span className="text-center">Practice Mode</span>
            <span className="text-center">Daily Puzzle</span>
          </div>
          {[
            ["Puzzle selection", "Choose by difficulty", "One puzzle per day"],
            ["Time pressure", "None — play at your pace", "New puzzle at midnight ET"],
            ["Attempts", "Unlimited replays", "One shot per day"],
            ["Best for", "Building skill", "Testing skill"],
            ["Hints available", "Via hint page link", "Progressive hints"],
          ].map(([feature, practice, daily]) => (
            <div
              key={feature}
              className="grid grid-cols-3 border-t border-border p-3 text-sm"
            >
              <span className="font-medium text-foreground">{feature}</span>
              <span className="text-center text-muted-foreground">
                {practice}
              </span>
              <span className="text-center text-muted-foreground">
                {daily}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Common Mistakes in Practice */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Common Practice Mistakes to Avoid
        </h2>
        <p className="mt-2 text-muted-foreground">
          Practice only helps if you practice well. Avoid these habits that
          feel productive but do not actually improve your game.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-red-100 bg-card p-5 dark:border-red-900/30">
            <h3 className="font-heading text-sm font-bold text-red-600 dark:text-red-400 mb-2">
              Rushing Through Puzzles
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Speed matters less than accuracy. If you are clicking random
              groups without reading the full board first, you are training bad
              habits. Slow down, scan all 16 words, and pick your most
              confident group before submitting.
            </p>
          </div>
          <div className="rounded-xl border border-red-100 bg-card p-5 dark:border-red-900/30">
            <h3 className="font-heading text-sm font-bold text-red-600 dark:text-red-400 mb-2">
              Only Playing Easy Mode
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Easy puzzles build confidence, but they do not prepare you for
              the boards that actually cause losses. Once you can clear easy
              boards consistently, push into medium and hard to grow.
            </p>
          </div>
          <div className="rounded-xl border border-red-100 bg-card p-5 dark:border-red-900/30">
            <h3 className="font-heading text-sm font-bold text-red-600 dark:text-red-400 mb-2">
              Skipping the Review
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Finishing a puzzle and immediately jumping to the next one means
              you miss the learning step. Take 30 seconds to look at the
              groups you got wrong and understand why those words belonged
              together.
            </p>
          </div>
          <div className="rounded-xl border border-red-100 bg-card p-5 dark:border-red-900/30">
            <h3 className="font-heading text-sm font-bold text-red-600 dark:text-red-400 mb-2">
              Ignoring the Purple Group
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Many players solve yellow, green, and blue by process of
              elimination and never study what made the purple group work. Hard
              puzzles are decided by the purple group — pay attention to it
              even when you get it right.
            </p>
          </div>
        </div>
      </section>

      {/* From Practice to Mastery */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          From Practice to Mastery
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          There is a clear progression path for Connections players, and
          practice mode is designed to accelerate each stage.
        </p>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border-l-4 border-l-emerald-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Stage 1: Learn the Rules (Easy Mode)
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              New players should start here. The goal is not speed — it is
              understanding the basic flow: scan, identify, submit, eliminate.
              Easy boards build the muscle memory for starting with yellow and
              working down.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-amber-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Stage 2: Handle Overlap (Medium Mode)
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Intermediate players hit a wall when words start fitting multiple
              groups. Medium mode forces you to develop the skill of
              distinguishing a plausible connection from the correct one. This
              is where real improvement happens.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-red-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Stage 3: Decode Wordplay (Hard Mode)
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Advanced players need to practice recognizing when a board stops
              rewarding topic matching and starts rewarding phrasing, spelling,
              or structural logic. Hard mode is the only way to build this
              instinct before the daily puzzle tests it.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-blue-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Stage 4: Stay Sharp (Random Mode)
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Once you can handle all three difficulty levels, random mode
              simulates the real daily experience — you never know what is
              coming. Use this to maintain your edge and keep your reading
              speed high.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mt-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-center text-white sm:p-8">
        <h2 className="font-heading text-lg font-bold">
          Ready to Improve Your Daily Game?
        </h2>
        <p className="mt-2 text-sm text-blue-100">
          Start with a few easy puzzles, then push into medium and hard. The
          best players treat practice as part of their daily routine.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/connections-hint-today"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Play Today&apos;s Puzzle
          </Link>
          <Link
            href="/guides/beginner-guide"
            className="rounded-lg border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-blue-700"
          >
            Read the Beginner Guide
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground text-center">
          Practice Mode FAQ
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
          Continue Learning
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              href: "/connections-difficulty",
              title: "Difficulty Guide",
              desc: "See what makes puzzles hard",
              icon: Flame,
            },
            {
              href: "/connections-patterns",
              title: "Pattern Library",
              desc: "Study recurring category types",
              icon: Sparkles,
            },
            {
              href: "/guides/advanced-techniques",
              title: "Advanced Techniques",
              desc: "Expert-level strategies",
              icon: Lightbulb,
            },
            {
              href: "/connections-hint",
              title: "Full Archive",
              desc: "Browse every past puzzle",
              icon: BookOpen,
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

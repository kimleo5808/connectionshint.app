import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  breadcrumbSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Lightbulb,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import StreakTracker from "@/components/connections/StreakTracker";

type Params = Promise<{ locale: string }>;

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const STREAK_TIPS = [
  {
    icon: Clock,
    title: "Play at the Same Time Every Day",
    description:
      "Building a habit around a consistent time — morning coffee, lunch break, or evening wind-down — makes it much harder to forget a day. Streaks break more often from missed days than from losses.",
  },
  {
    icon: Target,
    title: "Use Hints Before Wasting Guesses",
    description:
      "There is no shame in using progressive hints. A win with hints still counts, and it is better than a loss from blind guessing. Preserve your streak by playing smart, not fast.",
  },
  {
    icon: Lightbulb,
    title: "Review Every Loss Immediately",
    description:
      "After a loss, spend 30 seconds looking at the groups you missed. Understanding why you got a word wrong is the single fastest way to avoid repeating the same mistake tomorrow.",
  },
  {
    icon: Zap,
    title: "Start with Your Strongest Group",
    description:
      "Do not guess randomly. Scan all 16 words, find the group you are most confident about, and submit that first. Each correct group reduces the board and makes the remaining groups easier to see.",
  },
];

const MILESTONE_LEVELS = [
  {
    days: 7,
    title: "One Week",
    description: "You have established a daily routine. The habit is forming.",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    days: 30,
    title: "One Month",
    description:
      "A full month of daily Connections. Your pattern recognition is meaningfully sharper than when you started.",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    days: 100,
    title: "Century Club",
    description:
      "100 consecutive days. You have seen enough boards to recognize most category types on sight. Purple groups are no longer a surprise — they are a familiar challenge.",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    days: 365,
    title: "Full Year",
    description:
      "365 days of Connections. You are in the top fraction of a percent of all players. Every pattern, trap, and editorial tendency is familiar territory.",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
];

const FAQ_ITEMS = [
  {
    question: "Where is my streak data stored?",
    answer:
      "Your streak data is stored entirely in your browser's localStorage. It never leaves your device and is not sent to any server. This means your data is private, but it also means clearing your browser data or switching devices will reset your tracker.",
  },
  {
    question: "How do I mark a day's result?",
    answer:
      "Click any day on the calendar to cycle through the result types: Perfect (0 mistakes, shown as green with a star), Win (1+ mistakes, shown as blue with a checkmark), Loss (shown as red with an X), and Clear (removes the entry). Click the same day multiple times to cycle through all options.",
  },
  {
    question: "What counts as a 'perfect' game?",
    answer:
      "A perfect game means you solved all four groups without making any mistakes — zero wrong guesses. This is the highest achievement in Connections and is tracked separately from regular wins.",
  },
  {
    question: "Does my streak break if I lose?",
    answer:
      "In our tracker, only wins (perfect or regular) count toward your streak. A loss breaks the streak. This is intentional — the goal is to build consistent solving ability, not just consistent playing.",
  },
  {
    question: "Can I edit past days?",
    answer:
      "Yes. Navigate to any month using the arrow buttons and click on any day to add or change its result. This lets you backfill results if you started using the tracker after you had already been playing.",
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
    page: "Streak",
    title: "Connections Streak Tracker — Track Your Daily Solve Record",
    description:
      "Track your NYT Connections daily results with an interactive calendar. Monitor your win streak, perfect games, and win rate. All data stored locally in your browser.",
    keywords: [
      "connections streak tracker",
      "connections win streak",
      "nyt connections tracker",
      "connections daily record",
      "connections score tracker",
      "connections game history",
    ],
    locale: locale as Locale,
    path: `/connections-streak`,
    canonicalUrl: `/connections-streak`,
  });
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function ConnectionsStreakPage({
  params,
}: {
  params: Params;
}) {
  await params;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Streak Tracker",
            url: `${BASE_URL}/connections-streak`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <Flame className="h-4 w-4" />
          <span>Streak Tracker</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Connections Streak Tracker
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Track your daily Connections results, build your win streak, and
          watch your improvement over time. Click any day to log your result.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/connections-hint-today"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Play Today&apos;s Puzzle
          </Link>
          <Link
            href="/connections-practice"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Practice Mode
          </Link>
          <Link
            href="/connections-stats"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Puzzle Statistics
          </Link>
        </div>
      </header>

      {/* Tracker */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-8 mb-8 shadow-sm">
        <h2 className="text-center font-heading text-lg font-bold text-foreground mb-1">
          Your Daily Record
        </h2>
        <p className="text-center text-xs text-muted-foreground mb-6">
          Click any day to mark your result — data stays in your browser
        </p>
        <StreakTracker />
      </section>

      {/* ── SEO Content ── */}

      {/* Why Track */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Why Tracking Your Streak Matters
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Consistency is the difference between a player who sometimes wins
            Connections and a player who almost always wins. Tracking your
            daily results creates accountability — when you can see your streak
            on a calendar, you are more motivated to play carefully and less
            likely to rush through guesses.
          </p>
          <p>
            The streak tracker also reveals patterns in your own performance.
            Do you tend to lose more on certain days of the week? Are your
            losses clustered around specific months when puzzle difficulty
            spikes? This self-awareness helps you adjust your approach and use
            resources like hints and practice mode more strategically.
          </p>
          <p>
            Most importantly, seeing improvement over time is motivating. When
            your win rate climbs from 60% to 80%, or your perfect game
            frequency doubles, you have proof that your practice is paying off.
          </p>
        </div>
      </section>

      {/* Tips to Maintain */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Tips to Maintain Your Streak
        </h2>
        <p className="mt-2 text-muted-foreground">
          Building a long streak requires both skill and habits. These
          strategies help with both.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {STREAK_TIPS.map((tip) => (
            <div
              key={tip.title}
              className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/40"
            >
              <tip.icon className="h-5 w-5 text-blue-500 mb-2" />
              <h3 className="font-heading text-sm font-bold text-foreground mb-2">
                {tip.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What Top Players Do */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          What Consistent Winners Do Differently
        </h2>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border-l-4 border-l-emerald-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              They Scan Before Selecting
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Strong players read all 16 words before touching anything. This
              initial scan takes 15-30 seconds but prevents the most common
              mistakes — committing to a group too early based on the first
              few words you notice.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-blue-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              They Save Purple for Last
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Instead of trying to figure out the hardest group, experienced
              players clear the easier groups first. This reduces the board to
              fewer words, making the purple group&apos;s logic much easier to see
              through elimination.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-amber-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              They Learn from Every Loss
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              After a loss, top players check which words they got wrong and
              ask why. Was it a double-meaning word they did not consider? A
              structural pattern they missed? This post-game review is what
              converts losses into future wins.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-purple-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              They Use Resources Strategically
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Using hints is not cheating — it is strategy. If you are down to
              two guesses and stuck, checking a progressive hint can save your
              streak. The goal is learning, and learning sometimes means
              getting a nudge in the right direction.
            </p>
          </div>
        </div>
      </section>

      {/* Streak Milestones */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Streak Milestones
        </h2>
        <p className="mt-2 text-muted-foreground">
          Set your sights on these goals. Each one represents a meaningful
          level of commitment and skill.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {MILESTONE_LEVELS.map((milestone) => (
            <div
              key={milestone.days}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${milestone.badge}`}
                >
                  {milestone.days} days
                </span>
                <h3 className="font-heading text-sm font-bold text-foreground">
                  {milestone.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-center text-white sm:p-8">
        <h2 className="font-heading text-lg font-bold">
          Start Building Your Streak Today
        </h2>
        <p className="mt-2 text-sm text-blue-100">
          Play today&apos;s puzzle, log your result above, and come back
          tomorrow to keep the chain going.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/connections-hint-today"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Play Today&apos;s Puzzle
          </Link>
          <Link
            href="/connections-practice"
            className="rounded-lg border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-blue-700"
          >
            Practice First
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground text-center">
          Streak Tracker FAQ
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
          More Tools
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/connections-practice", title: "Practice Mode", desc: "Play unlimited puzzles", icon: Sparkles },
            { href: "/connections-stats", title: "Puzzle Stats", desc: "Archive data & trends", icon: Target },
            { href: "/connections-categories", title: "Category Explorer", desc: "Browse by theme", icon: BookOpen },
            { href: "/connections-difficulty", title: "Difficulty Guide", desc: "What makes puzzles hard", icon: Flame },
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

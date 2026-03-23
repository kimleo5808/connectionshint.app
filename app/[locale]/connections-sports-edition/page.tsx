import SportsConnectionsGame from "@/components/connections/SportsConnectionsGame";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getLatestPuzzle } from "@/lib/connections-data";
import {
  getLatestSportsPuzzle,
  getRecentSportsPuzzles,
  getSportsPuzzleCount,
} from "@/lib/sports-data";
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
  Lightbulb,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const STRATEGY_TIPS = [
  {
    title: "Think in Sports Domains",
    icon: Target,
    description:
      "Sports Edition categories often span multiple sports. A group might not be 'basketball terms' specifically, but 'positions in multiple sports' — like Guard (basketball), Forward (soccer/hockey), Wing (hockey), and Striker (soccer). Train yourself to think across sports, not within one.",
  },
  {
    title: "Watch for Cross-Sport Traps",
    icon: Zap,
    description:
      "Words like 'Eagle' could be a golf score, a NFL team, or a bird. 'Match' works in tennis, soccer, boxing, and wrestling. The most common trap in Sports Edition is assuming a word belongs to one sport when it actually belongs to a different category entirely.",
  },
  {
    title: "Team Names Are Double-Edged",
    icon: Flame,
    description:
      "Team mascots are animals, colors, and occupations. 'Bears' (animal or Chicago), 'Reds' (color or Cincinnati), 'Packers' (occupation or Green Bay). The category might group them by what the mascots literally are, not which league they play in.",
  },
  {
    title: "Numbers and Positions Matter",
    icon: Trophy,
    description:
      "Jersey numbers, field positions, and scoring terms are favorite Sports Edition categories. If you see numbers or positional words on the board, check whether four of them share a specific sports context.",
  },
];

const SPORTS_CATEGORIES = [
  {
    type: "Team Name Themes",
    description:
      "Groups based on what team names represent — animals (Bears, Eagles, Dolphins), colors (Reds, Blues, Whites), or professions (Packers, Steelers, 49ers). The trick is recognizing the secondary meaning.",
    examples: "BEARS, EAGLES, DOLPHINS, TIGERS → Animals (not NFL teams)",
  },
  {
    type: "Cross-Sport Terminology",
    description:
      "Words used in multiple sports with different meanings. 'Set' works in tennis, volleyball, and weightlifting. 'Drive' works in golf, basketball, and football. The group connects words through shared vocabulary.",
    examples: "SET, MATCH, SERVE, ACE → Tennis terms",
  },
  {
    type: "Athlete Last Names",
    description:
      "Surnames of famous athletes that are also common English words. 'Rice' (Jerry), 'Green' (Draymond), 'Young' (Steve), 'Brown' (Jim). The connection might be the word meaning, not the athlete.",
    examples: "RICE, BROWN, GREEN, YOUNG → Colors/Common words (not athletes)",
  },
  {
    type: "Equipment and Gear",
    description:
      "Sports equipment that crosses categories. A 'club' is golf equipment and a type of team. A 'bat' is baseball equipment and an animal. These dual-meaning equipment words are favorite Sports Edition material.",
    examples: "CLUB, IRON, WEDGE, DRIVER → Golf equipment",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is NYT Connections Sports Edition?",
    answer:
      "NYT Connections Sports Edition is a daily variant of the classic Connections puzzle, focused entirely on sports-related vocabulary. Like the original, you must sort 16 words into four groups of four, but every word relates to sports — team names, athlete surnames, equipment, positions, scoring terms, and more.",
  },
  {
    question: "How is Sports Edition different from regular Connections?",
    answer:
      "The format is identical — 16 words, four groups, four mistakes allowed. The difference is the vocabulary domain. Every word on the board has a sports context, which means the traps and misdirection are sports-specific. A word like 'Driver' could be a golf club or a NASCAR role, and knowing both meanings is essential.",
  },
  {
    question: "When does the Sports Edition puzzle come out?",
    answer:
      "NYT Connections Sports Edition is released daily alongside the regular Connections puzzle, typically available at midnight Eastern Time. Our hints and answers are updated automatically when new puzzles become available.",
  },
  {
    question: "Do I need sports knowledge to play?",
    answer:
      "Basic sports awareness helps, but deep expertise is not required. Many Sports Edition categories are about word meanings rather than sports trivia — team mascots that are animals, equipment names that are everyday objects, or scoring terms used metaphorically. General vocabulary skills still matter most.",
  },
  {
    question: "Where can I play Sports Edition?",
    answer:
      "NYT Connections Sports Edition is available on the New York Times Games website and app. Our site provides hints, answers, and strategy guides to help you solve each day's sports puzzle. When we have the puzzle data, you can also play it directly on this page.",
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
    page: "SportsEdition",
    title: "NYT Connections Sports Edition — Today's Hints & Answers",
    description:
      "Get hints and answers for today's NYT Connections Sports Edition puzzle. Progressive clues for all four sports-themed groups plus strategies for cross-sport vocabulary traps.",
    keywords: [
      "connections sports edition",
      "nyt connections sports",
      "connections sports edition answers",
      "connections sports hints today",
      "nyt sports connections",
      "connections sports edition hints",
    ],
    locale: locale as Locale,
    path: `/connections-sports-edition`,
    canonicalUrl: `/connections-sports-edition`,
  });
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function ConnectionsSportsEditionPage({
  params,
}: {
  params: Params;
}) {
  await params;

  const sportsPuzzle = await getLatestSportsPuzzle();
  const recentSports = await getRecentSportsPuzzles(8);
  const sportsCount = await getSportsPuzzleCount();

  // Use regular puzzle as playable demo when no sports data is available
  const regularPuzzle = await getLatestPuzzle();
  const displayPuzzle = sportsPuzzle || regularPuzzle || null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Sports Edition",
            url: `${BASE_URL}/connections-sports-edition`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <span className="text-lg">⚽</span>
          <span>Sports Edition</span>
          {sportsPuzzle && (
            <>
              <span className="mx-1">&middot;</span>
              <span>
                {dayjs(sportsPuzzle.date).format("MMMM D, YYYY")}
              </span>
            </>
          )}
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Connections Sports Edition — Today&apos;s Hints & Answers
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          The sports variant of NYT Connections. Sort 16 sports-related words
          into four groups. Every word has a sports context — but not always
          the one you expect.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/connections-hint-today"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Classic Connections
          </Link>
          <Link
            href="/connections-practice"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Practice Mode
          </Link>
          <Link
            href="/connections-categories/sports"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Sports Categories
          </Link>
        </div>
      </header>

      {/* Game Area — dark themed like NYT Athletic */}
      {displayPuzzle ? (
        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5 sm:p-8 mb-8 shadow-sm">
          <h2 className="text-center font-heading text-lg font-bold text-white mb-1">
            {sportsPuzzle
              ? "Play Today's Sports Edition"
              : "Try the Sports Edition Format"}
          </h2>
          <p className="text-center text-xs text-slate-400 mb-1">
            Create four groups of four!
          </p>
          <p className="text-center text-[10px] text-slate-500 mb-5">
            {sportsPuzzle
              ? `Sports Edition Puzzle #${displayPuzzle.id} — ${dayjs(displayPuzzle.date).format("MMMM D, YYYY")}`
              : `Demo using Puzzle #${displayPuzzle.id} — Sports data loading daily`}
          </p>
          <SportsConnectionsGame groups={displayPuzzle.answers} />
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-8 mb-8 shadow-sm text-center">
          <span className="text-4xl mb-4 block">🏟️</span>
          <h2 className="font-heading text-lg font-bold text-white mb-2">
            Sports Edition Loading
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Today&apos;s Sports Edition puzzle will appear here when available.
            In the meantime, try the classic version.
          </p>
          <Link
            href="/connections-hint-today"
            className="mt-4 inline-block rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Play Classic Connections →
          </Link>
        </section>
      )}

      {/* Recent Sports Puzzles Sidebar */}
      {recentSports.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm mb-8">
          <h2 className="font-heading text-base font-bold text-foreground mb-3">
            Recent Sports Edition Puzzles
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            {recentSports.map((p) => (
              <div
                key={p.date}
                className="rounded-lg border border-border p-3 text-center"
              >
                <p className="text-sm font-bold text-foreground">
                  #{p.id}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dayjs(p.date).format("MMM D, YYYY")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SEO Content ── */}

      {/* Strategy Tips */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Sports Edition Strategy Guide
        </h2>
        <p className="mt-2 text-muted-foreground">
          Sports Edition requires a different mindset than classic
          Connections. These strategies are specific to sports vocabulary
          puzzles.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {STRATEGY_TIPS.map((tip) => (
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

      {/* What Is Sports Edition */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          What Is Connections Sports Edition?
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            NYT Connections Sports Edition launched as a daily variant of the
            original Connections puzzle, designed specifically for sports
            fans. The format is identical — 16 words, four groups, four
            mistakes allowed — but every word on the board relates to the
            world of sports.
          </p>
          <p>
            What makes Sports Edition uniquely challenging is the density of
            cross-sport vocabulary. A single word can be relevant to multiple
            sports: &ldquo;Drive&rdquo; is a golf shot, a basketball play, and a
            football offensive strategy. &ldquo;Match&rdquo; is a tennis contest, a
            soccer game, and a wrestling bout. The puzzle exploits these
            overlaps to create misdirection that catches even dedicated sports
            fans.
          </p>
          <p>
            The difficulty colors work the same way — yellow is easiest,
            purple is hardest. But in Sports Edition, the purple group often
            hides behind an unexpected connection type: athlete last names
            that are common words, team names grouped by their literal
            meaning rather than their league, or equipment that crosses
            sports.
          </p>
        </div>
      </section>

      {/* How It Differs */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          How Sports Edition Differs from Classic Connections
        </h2>
        <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-3 bg-muted/30 p-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <span>Aspect</span>
            <span className="text-center">Classic</span>
            <span className="text-center">Sports Edition</span>
          </div>
          {[
            ["Vocabulary", "Any English words", "Sports-related only"],
            ["Knowledge needed", "General/pop culture", "Sports awareness"],
            ["Common traps", "Double-meaning words", "Cross-sport terms"],
            ["Purple group", "Wordplay/structural", "Unexpected sports connection"],
            ["Target audience", "Word puzzle fans", "Sports + puzzle fans"],
            ["Difficulty source", "Language complexity", "Sports domain overlap"],
          ].map(([aspect, classic, sports]) => (
            <div
              key={aspect}
              className="grid grid-cols-3 border-t border-border p-3 text-sm"
            >
              <span className="font-medium text-foreground">{aspect}</span>
              <span className="text-center text-muted-foreground">
                {classic}
              </span>
              <span className="text-center text-muted-foreground">
                {sports}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Common Category Types */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Common Sports Edition Category Types
        </h2>
        <p className="mt-2 text-muted-foreground">
          These are the recurring category patterns you will encounter in
          Sports Edition. Familiarizing yourself with these types gives you a
          significant advantage.
        </p>
        <div className="mt-6 space-y-4">
          {SPORTS_CATEGORIES.map((cat) => (
            <div
              key={cat.type}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h3 className="font-heading text-base font-bold text-foreground mb-2">
                {cat.type}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground mb-3">
                {cat.description}
              </p>
              <div className="rounded-lg bg-muted/30 px-4 py-2.5 text-xs font-medium text-muted-foreground">
                Example: {cat.examples}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who Should Play */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Who Should Play Sports Edition?
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-100 bg-card p-5 dark:border-emerald-900/30">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Sports Fans Who Love Puzzles
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              If you follow multiple sports and enjoy word games, Sports
              Edition is designed for you. Your sports knowledge becomes a
              puzzle-solving superpower.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/30">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Classic Connections Players
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              If you play daily Connections and want a second puzzle, Sports
              Edition provides a fresh challenge with the same satisfying
              format. Your categorization skills transfer directly.
            </p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-card p-5 dark:border-amber-900/30">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Casual Sports Fans
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              You do not need encyclopedic sports knowledge. Many categories
              are about word meanings (team names as animals, equipment as
              objects) rather than deep trivia. Basic awareness is enough.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-center text-white sm:p-8">
        <h2 className="font-heading text-lg font-bold">
          Looking for More Challenges?
        </h2>
        <p className="mt-2 text-sm text-blue-100">
          Play classic Connections, practice with historical puzzles, or
          explore sports categories across the archive.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/connections-hint-today"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Classic Connections
          </Link>
          <Link
            href="/connections-practice"
            className="rounded-lg border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-blue-700"
          >
            Practice Mode
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground text-center">
          Sports Edition FAQ
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
          Explore More
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/connections-hint-today", title: "Classic Hints", desc: "Today's regular puzzle", icon: Lightbulb },
            { href: "/connections-categories/sports", title: "Sports Categories", desc: "Sports in the archive", icon: Target },
            { href: "/connections-practice", title: "Practice Mode", desc: "Unlimited puzzles", icon: Sparkles },
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

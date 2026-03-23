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
  Brain,
  Clock,
  Flame,
  Gamepad2,
  Grid3X3,
  Lightbulb,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const COMPARISON_TABLE = [
  { feature: "Format", connections: "16 words → 4 groups of 4", wordle: "Guess a 5-letter word in 6 tries" },
  { feature: "Skill Type", connections: "Pattern recognition & categorization", wordle: "Vocabulary & letter deduction" },
  { feature: "Time to Play", connections: "5–15 minutes", wordle: "2–5 minutes" },
  { feature: "Difficulty Range", connections: "Varies widely (easy → extremely hard)", wordle: "Consistent (moderate)" },
  { feature: "Mistakes Allowed", connections: "4 wrong guesses", wordle: "6 attempts" },
  { feature: "Hardest Element", connections: "Purple group misdirection", wordle: "Uncommon letter combinations" },
  { feature: "Strategy Depth", connections: "High (elimination, overlap, structural)", wordle: "Moderate (letter frequency, positioning)" },
  { feature: "Social Sharing", connections: "Color grid showing solve order", wordle: "Colored square grid" },
  { feature: "Available Since", connections: "June 2023", wordle: "October 2021 (NYT: Feb 2022)" },
  { feature: "Daily Reset", connections: "Midnight ET", wordle: "Midnight ET" },
];

const FAQ_ITEMS = [
  {
    question: "Which game is harder — Connections or Wordle?",
    answer:
      "Connections has a wider difficulty range. On easy days, both games are straightforward. But on hard days, Connections is significantly more challenging because of purple group wordplay, fill-in-the-blank patterns, and deliberate misdirection between groups. Wordle difficulty is more consistent because it depends primarily on the chosen word.",
  },
  {
    question: "Should I play Connections or Wordle first?",
    answer:
      "Many players start with Wordle as a warm-up because it is quicker and lower-stakes. Then they move to Connections with their brain already engaged. Others prefer to tackle Connections first when they are freshest. Try both orders and see which feels better for your routine.",
  },
  {
    question: "Do Connections and Wordle use the same skills?",
    answer:
      "They share some overlap — both require strong vocabulary and word awareness. But Connections emphasizes lateral thinking, categorization, and pattern recognition, while Wordle emphasizes letter-position deduction and elimination. Players who excel at one do not automatically excel at the other.",
  },
  {
    question: "Can playing Wordle help me get better at Connections?",
    answer:
      "Yes, indirectly. Wordle builds vocabulary awareness and forces you to think about words from multiple angles. This broader word awareness helps when Connections uses double-meaning words or structural patterns. Our site also offers Wordle-style games in different word lengths to help you practice.",
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
    page: "Comparison",
    title: "Connections vs Wordle — Which NYT Game Is Right for You?",
    description:
      "Compare NYT Connections and Wordle side by side. Difficulty, time investment, strategy depth, and which game suits your play style. Includes tips for excelling at both.",
    keywords: [
      "connections vs wordle",
      "nyt connections or wordle",
      "connections wordle comparison",
      "which nyt game is harder",
      "connections vs wordle difficulty",
      "nyt word games compared",
    ],
    locale: locale as Locale,
    path: `/connections-vs-wordle`,
    canonicalUrl: `/connections-vs-wordle`,
  });
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function ConnectionsVsWordlePage({
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
            name: "Connections vs Wordle",
            url: `${BASE_URL}/connections-vs-wordle`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <Gamepad2 className="h-4 w-4" />
          <span>Game Comparison</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Connections vs Wordle
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Two daily word games from the New York Times, two very different
          challenges. Here is how they compare and which one suits your play
          style.
        </p>
      </header>

      {/* Side-by-Side Hero Cards */}
      <section className="grid gap-4 sm:grid-cols-2 mb-8">
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 dark:border-blue-900/40 dark:from-blue-950/20 dark:to-transparent">
          <div className="flex items-center gap-2 mb-3">
            <Grid3X3 className="h-6 w-6 text-blue-600" />
            <h2 className="font-heading text-xl font-bold text-blue-700 dark:text-blue-400">
              Connections
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sort 16 words into four groups of four. Each group shares a hidden
            connection. Difficulty ranges from straightforward categories to
            abstract wordplay. Four mistakes allowed.
          </p>
          <Link
            href="/connections-hint-today"
            className="mt-4 inline-block rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Play Connections →
          </Link>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-transparent">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-6 w-6 text-emerald-600" />
            <h2 className="font-heading text-xl font-bold text-emerald-700 dark:text-emerald-400">
              Wordle
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Guess a five-letter word in six attempts. Each guess shows which
            letters are correct (green), present but misplaced (yellow), or
            absent (gray). One word per day.
          </p>
          <Link
            href="/5-letters"
            className="mt-4 inline-block rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Play Wordle →
          </Link>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm mb-8">
        <h2 className="font-heading text-xl font-bold text-foreground mb-4">
          Connections vs Wordle at a Glance
        </h2>
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="grid grid-cols-3 bg-muted/30 p-3 rounded-t-lg text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <span>Feature</span>
              <span className="text-center text-blue-600 dark:text-blue-400">
                Connections
              </span>
              <span className="text-center text-emerald-600 dark:text-emerald-400">
                Wordle
              </span>
            </div>
            {COMPARISON_TABLE.map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-3 border-t border-border p-3 text-sm"
              >
                <span className="font-medium text-foreground">
                  {row.feature}
                </span>
                <span className="text-center text-muted-foreground">
                  {row.connections}
                </span>
                <span className="text-center text-muted-foreground">
                  {row.wordle}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO Content ── */}

      {/* Key Differences */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Key Differences Between Connections and Wordle
        </h2>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border-l-4 border-l-blue-500 border border-border bg-card p-5">
            <h3 className="font-heading text-base font-bold text-foreground mb-2">
              Skill Type: Categorization vs. Deduction
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Connections is fundamentally a categorization game. You need to
              see relationships between words, recognize patterns, and handle
              deliberate misdirection. Wordle is a deduction game — you
              eliminate letter positions systematically until you find the
              answer. These are genuinely different cognitive skills, which is
              why some players dominate one game but struggle with the other.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-amber-500 border border-border bg-card p-5">
            <h3 className="font-heading text-base font-bold text-foreground mb-2">
              Time Investment
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Wordle is a 2-5 minute commitment. You can play it waiting for
              coffee to brew. Connections demands more — a typical solve takes
              5-15 minutes, and hard boards can take longer if you are using
              progressive hints or doing post-game review. If you only have a
              few minutes, Wordle fits better. If you want a deeper challenge,
              Connections delivers.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-purple-500 border border-border bg-card p-5">
            <h3 className="font-heading text-base font-bold text-foreground mb-2">
              Difficulty Curve
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Wordle difficulty is relatively consistent — some words are
              harder to guess than others, but the format does not change.
              Connections has massive difficulty swings. An easy board with
              four direct topic categories feels trivial, while a hard board
              with fill-in-the-blank phrases and wordplay-driven purple groups
              can stump even experienced players. This variance is what makes
              Connections addictive for competitive players.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-emerald-500 border border-border bg-card p-5">
            <h3 className="font-heading text-base font-bold text-foreground mb-2">
              Social Sharing
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Both games have spoiler-free sharing formats. Wordle&apos;s colored
              grid shows your guess path. Connections shows the order you
              solved the groups and your mistake count. Connections results
              tend to generate more discussion because the groups themselves
              are debatable — &ldquo;I would never have grouped those
              together&rdquo; is a common reaction that Wordle does not produce.
            </p>
          </div>
        </div>
      </section>

      {/* Which Game Should You Play */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Which Game Should You Play?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Your ideal game depends on what you enjoy most about word puzzles.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/40">
            <Brain className="h-6 w-6 text-blue-500 mb-3" />
            <h3 className="font-heading text-base font-bold text-foreground mb-2">
              Play Connections If...
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>You enjoy lateral thinking and pattern recognition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>You like puzzles with variable difficulty</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>You want a deeper, longer daily challenge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>You enjoy debating answers with friends</span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-card p-5 dark:border-emerald-900/40">
            <Zap className="h-6 w-6 text-emerald-500 mb-3" />
            <h3 className="font-heading text-base font-bold text-foreground mb-2">
              Play Wordle If...
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>You love words and vocabulary building</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>You prefer quick, predictable daily puzzles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>You enjoy systematic elimination logic</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>You only have a few minutes per day</span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-purple-100 bg-card p-5 dark:border-purple-900/40">
            <Trophy className="h-6 w-6 text-purple-500 mb-3" />
            <h3 className="font-heading text-base font-bold text-foreground mb-2">
              Play Both If...
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                <span>You want the full NYT games experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                <span>You like training different word skills daily</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                <span>You enjoy competing with friends on both</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                <span>You can dedicate 10-20 minutes to puzzles daily</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tips for Both */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Tips for Excelling at Both Games
        </h2>
        <p className="mt-2 text-muted-foreground">
          While the games test different skills, these cross-game strategies
          improve your performance in both.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/40">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Expand Your Vocabulary Actively
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Read widely and pay attention to words with multiple meanings.
              In Wordle, a larger vocabulary means more guess options. In
              Connections, it means recognizing double-meaning traps faster.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/40">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Think Before You Act
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              In Wordle, your first guess matters. In Connections, your first
              submitted group matters. In both cases, impulsive action leads
              to wasted attempts. Train the habit of pausing before committing.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/40">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Use Elimination Strategically
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Wordle is explicit about elimination (gray letters). Connections
              is implicit — once you solve a group, the remaining words narrow
              down. In both games, using what you have already learned to
              constrain future guesses is the path to consistency.
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-card p-5 dark:border-blue-900/40">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Review Your Results Daily
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              After each game, ask what you could have done differently. In
              Wordle, was there a better starting word? In Connections, did
              you miss a pattern? This 30-second review compounds over weeks
              into real skill improvement.
            </p>
          </div>
        </div>
      </section>

      {/* Recommended Daily Routine */}
      <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          The Ideal Daily Puzzle Routine
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          If you want to play both games daily, this order maximizes your
          performance and enjoyment.
        </p>
        <div className="space-y-4">
          {[
            { step: "1", title: "Wordle (2-3 min)", desc: "Quick warm-up. Gets your word brain active without heavy cognitive load." },
            { step: "2", title: "Connections (5-15 min)", desc: "Main challenge. Play while your mind is fresh and primed from Wordle." },
            { step: "3", title: "Review (2 min)", desc: "Check what you missed in both games. This is where improvement happens." },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {item.step}
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
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

      {/* CTA */}
      <section className="mt-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-center text-white sm:p-8">
        <h2 className="font-heading text-lg font-bold">
          Ready to Play?
        </h2>
        <p className="mt-2 text-sm text-blue-100">
          Jump into today&apos;s puzzle or practice with historical boards.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/connections-hint-today"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Play Connections
          </Link>
          <Link
            href="/5-letters"
            className="rounded-lg border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-blue-700"
          >
            Play Wordle
          </Link>
        </div>
      </section>

      {/* Related */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Explore More
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/connections-practice", title: "Practice Connections", desc: "Unlimited puzzles", icon: Sparkles },
            { href: "/5-letters", title: "5-Letter Wordle", desc: "Classic word game", icon: Zap },
            { href: "/connections-stats", title: "Puzzle Stats", desc: "Data & trends", icon: Target },
            { href: "/guides/beginner-guide", title: "Beginner Guide", desc: "Learn the basics", icon: BookOpen },
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

import { AnswerReveal } from "@/components/connections/AnswerReveal";
import { HintCardList } from "@/components/connections/HintCard";
import { BASE_URL } from "@/config/site";
import { GUIDES } from "@/data/guides";
import { Locale, LOCALES } from "@/i18n/routing";
import { Link as I18nLink } from "@/i18n/routing";
import { getLatestPuzzle, getRecentPuzzles } from "@/lib/connections-data";
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
  Calendar,
  ChevronRight,
  Lightbulb,
  Target,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

const STRATEGY_TIPS = [
  {
    title: "Start with Obvious Groups",
    description:
      "Begin by identifying the most apparent connections — usually the Yellow category contains the most straightforward relationships.",
    icon: Target,
  },
  {
    title: "Look for Wordplay",
    description:
      "Purple categories often involve clever wordplay, compound words, or words that can be prefixed/suffixed with the same term.",
    icon: Zap,
  },
  {
    title: "Process of Elimination",
    description:
      "Once you've identified 2–3 groups, the remaining words often become clearer by elimination.",
    icon: ChevronRight,
  },
  {
    title: "Consider Multiple Meanings",
    description:
      "Many words have double meanings. A \"bark\" could be a dog's sound or tree covering — context matters!",
    icon: BookOpen,
  },
];

const FAQ_ITEMS = [
  {
    question: "When does the new Connections puzzle come out?",
    answer:
      "The new NYT Connections puzzle is released every day at 12:00 AM ET (midnight Eastern Time). We update our hints page within minutes of the new puzzle going live, ensuring you have access to fresh hints and strategies as soon as possible!",
  },
  {
    question: "Should I use hints or try without help?",
    answer:
      "This is completely personal preference! Our progressive hint system is designed to give you just enough help without spoiling the entire puzzle. We recommend trying to solve on your own first, then using gentle hints if you get stuck, and only viewing full answers if you're completely stumped or have used all four mistakes. The goal is to maintain the fun and satisfaction of solving!",
  },
  {
    question: "What's the best strategy for solving quickly?",
    answer:
      "Start with the yellow category — it's designed to be most obvious. Look for clear groupings of four words that share an unmistakable connection. Avoid guessing on purple early; instead, solve the other three categories first and let the final four words reveal themselves through elimination. Always consider multiple meanings of words, and don't rush your guesses. Remember: you only get four mistakes!",
  },
  {
    question: "Why do I keep getting \"one away\" messages?",
    answer:
      "The \"one away\" message means three of your words are correct, but one belongs to a different category. This often happens with red herring words that could plausibly fit multiple groups. When you see this message, carefully reconsider each word — think about alternate meanings and whether any word might better fit elsewhere. Don't just swap one word and resubmit; take time to reassess the entire group.",
  },
  {
    question: "How are the difficulty colors determined?",
    answer:
      "The four colors indicate increasing difficulty: Yellow is the easiest with obvious, straightforward connections. Green is medium difficulty with moderately clear relationships. Blue is hard with less apparent connections or subtle wordplay. Purple is the trickiest with abstract, creative connections that often involve clever wordplay or unexpected relationships. The puzzle creators intentionally design purple categories to make you say \"I never would have thought of that!\"",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "ConnectionsHintToday",
  });
  const puzzle = await getLatestPuzzle();
  const dateStr = puzzle
    ? dayjs(puzzle.date).format("MMMM D, YYYY")
    : "Today";

  return constructMetadata({
    page: "ConnectionsHintToday",
    title: `${t("title")} — ${dateStr}`,
    description: t("description"),
    keywords: [
      "connections hint today",
      "nyt connections hint",
      "connections answers today",
      "connections puzzle today",
      "nyt connections answers",
      "connections help today",
    ],
    locale: locale as Locale,
    path: `/connections-hint-today`,
    canonicalUrl: `/connections-hint-today`,
  });
}

export default async function ConnectionsHintTodayPage({
  params,
}: {
  params: Params;
}) {
  await params;
  const puzzle = await getLatestPuzzle();
  const recentPuzzles = await getRecentPuzzles(7);

  if (!puzzle) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-bold">No Puzzle Available</h1>
        <p className="mt-4 text-muted-foreground">
          Today&apos;s puzzle hasn&apos;t been loaded yet. Check back soon!
        </p>
      </div>
    );
  }

  const formattedDate = dayjs(puzzle.date).format("MMMM D, YYYY");
  const dayOfWeek = dayjs(puzzle.date).format("dddd");

  // All words scrambled
  const allWords = [...puzzle.answers.flatMap((g) => g.members)].sort(
    () => 0.5 - Math.random()
  );

  const guides = GUIDES.slice(0, 6);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Today's Hints",
            url: `${BASE_URL}/connections-hint-today`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* Title */}
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>
            {dayOfWeek}, {formattedDate}
          </span>
          <span className="mx-1">&middot;</span>
          <span>Puzzle #{puzzle.id}</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Connections Hint Today
        </h1>
        <p className="mt-2 text-muted-foreground">
          Progressive hints for today&apos;s NYT Connections puzzle. Reveal one
          hint at a time to keep the challenge!
        </p>
      </header>

      {/* Blue banner with word chips */}
      <section className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 sm:p-8 mb-8">
        <h2 className="text-center font-heading text-lg font-bold text-white mb-4">
          Today&apos;s 16 Words
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {allWords.map((word) => (
            <span
              key={word}
              className="rounded-lg bg-blue-600/20 border border-blue-500/30 px-4 py-2 text-sm font-mono font-bold text-blue-200 uppercase tracking-wide"
            >
              {word}
            </span>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Hints section */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Progressive Hints
              </h2>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">
              Click each group to reveal hints one at a time. Try to solve with
              as few hints as possible!
            </p>
            <HintCardList groups={puzzle.answers} />
          </section>

          {/* Full answers */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <AnswerReveal puzzle={puzzle} />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sticky top-24">
            <h3 className="font-heading text-sm font-bold text-foreground mb-3">
              Recent Puzzles
            </h3>
            <div className="space-y-2">
              {recentPuzzles
                .filter((p) => p.date !== puzzle.date)
                .slice(0, 6)
                .map((p) => (
                  <Link
                    key={p.date}
                    href={`/connections-hint/${p.date}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  >
                    <span className="font-medium text-foreground">
                      #{p.id} — {dayjs(p.date).format("MMM D")}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ─── SEO Content Sections ─── */}

      {/* Strategy Tips */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Today&apos;s Strategy Tips
        </h2>
        <p className="mt-2 text-muted-foreground">
          Master today&apos;s Connections puzzle with these expert strategies:
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

      {/* How Connections Works */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          How Connections Works
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            NYT Connections presents you with 16 words that must be sorted into
            four groups of four. Each group shares a common theme, connection, or
            relationship. The difficulty increases from Yellow (easiest) to
            Purple (trickiest).
          </p>
          <p>
            <strong className="font-semibold text-foreground">
              Scoring System:
            </strong>{" "}
            You have four mistakes allowed before the game ends. Perfect games
            are rare and worthy of celebration!
          </p>
        </div>
      </section>

      {/* Difficulty Analysis */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Today&apos;s Puzzle Difficulty Analysis
        </h2>
        <p className="mt-2 text-muted-foreground">
          Understanding why today&apos;s puzzle was challenging helps you improve
          for tomorrow. Here&apos;s our expert analysis:
        </p>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border-l-4 border-l-blue-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Overall Difficulty Rating
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This puzzle is rated as medium difficulty based on the complexity
              of category relationships and the presence of red herrings. The
              purple category was particularly tricky today!
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-amber-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              What Made It Challenging?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Key challenge factors include: multiple words with double meanings,
              a clever fill-in-the-blank category that requires lateral thinking,
              and strategic red herrings designed to mislead solvers. The purple
              category involves wordplay that only becomes obvious in retrospect.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-emerald-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Recommended Solving Approach
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Start by identifying the yellow category, which should be the most
              straightforward. Avoid rushing into purple — instead, solve green
              and blue first to narrow down your options through elimination.
              Watch out for words that could fit multiple categories, and always
              consider alternate meanings before committing to a guess.
            </p>
          </div>
        </div>
      </section>

      {/* Guide Navigation */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Strategy Guides
        </h2>
        <p className="mt-2 text-muted-foreground">
          Deep-dive into proven strategies and expert techniques:
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <I18nLink
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              prefetch={false}
              className="group flex items-center gap-3 rounded-xl border border-blue-100 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-blue-900/40 dark:hover:border-blue-700/60"
            >
              <span className="text-xl">{guide.icon}</span>
              <div className="min-w-0">
                <span className="block text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                  {guide.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {guide.readTime}
                </span>
              </div>
            </I18nLink>
          ))}
        </div>

        {/* Guides callout */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-center text-white sm:p-8">
          <h3 className="font-heading text-lg font-bold">
            Struggling with Today&apos;s Puzzle?
          </h3>
          <p className="mt-2 text-sm text-blue-100">
            Don&apos;t worry! Even experts get stuck. Check out our proven
            strategies or learn about common mistakes that might be holding you
            back.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <I18nLink
              href="/guides/beginner-guide"
              prefetch={false}
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
            >
              Start Learning
            </I18nLink>
            <I18nLink
              href="/guides/advanced-techniques"
              prefetch={false}
              className="rounded-lg border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-blue-700"
            >
              Expert Techniques
            </I18nLink>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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

      {/* About Today's Puzzle */}
      <section className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
          About Today&apos;s Connections Puzzle
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Today&apos;s NYT Connections puzzle continues the tradition of
            challenging word association gameplay that has made this one of the
            most popular daily puzzles. Each puzzle is carefully crafted by Wyna
            Liu, the associate puzzle editor at The New York Times, to provide a
            perfect balance of solvable challenge and satisfying &ldquo;aha!&rdquo;
            moments.
          </p>
          <p>
            The beauty of Connections lies in its accessibility — anyone can
            start playing immediately — combined with surprising depth that keeps
            expert solvers engaged. Whether you&apos;re solving during your
            morning coffee or taking an evening puzzle break, today&apos;s puzzle
            offers four distinct categories that will test your vocabulary,
            lateral thinking, and pattern recognition skills.
          </p>
          <p>
            Remember: every puzzle is solvable with careful thought and strategy.
            If you&apos;re stuck, our progressive hint system above will guide
            you toward the solution without completely spoiling the satisfaction
            of solving. Come back tomorrow for a fresh puzzle and new hints!
          </p>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

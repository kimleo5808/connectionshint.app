import { AnswerReveal } from "@/components/connections/AnswerReveal";
import ConnectionsGame from "@/components/connections/ConnectionsGame";
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
      "Start with the cleanest category you can defend. Yellow groups are usually the best place to begin because they clear space without forcing risky guesses.",
    icon: Target,
  },
  {
    title: "Look for Wordplay",
    description:
      "Save room for the purple set. Harder boards often hide a group in phrasing, word structure, or a less literal reading of familiar words.",
    icon: Zap,
  },
  {
    title: "Process of Elimination",
    description:
      "Once two categories are confidently solved, stop and reevaluate the remaining words together. The last overlap usually becomes clearer when the board is smaller.",
    icon: ChevronRight,
  },
  {
    title: "Consider Multiple Meanings",
    description:
      "Do not lock onto the first definition you see. Connections regularly uses alternate meanings, so a word that feels wrong literally may still fit the category.",
    icon: BookOpen,
  },
];

const FAQ_ITEMS = [
  {
    question: "When does the new Connections puzzle come out?",
    answer:
      "A new NYT Connections puzzle is released every day at 12:00 AM ET. This page is updated shortly after the board goes live so the hints and answer reveal match the current puzzle.",
  },
  {
    question: "Should I use hints or try without help?",
    answer:
      "Try the board on your own first, then open the first hint layer only when you need direction. The answer reveal works best as a final check after you have either solved the puzzle or reached a dead end.",
  },
  {
    question: "What's the best strategy for solving quickly?",
    answer:
      "Start with the most literal category on the board, usually yellow. Avoid forcing a purple-style guess early; clearing the direct sets first makes the final overlap much easier to read.",
  },
  {
    question: "Why do I keep getting \"one away\" messages?",
    answer:
      "A \"one away\" message means three words belong together and one does not. That usually points to a red herring, so reassess the whole set instead of swapping a single word at random.",
  },
  {
    question: "How are the difficulty colors determined?",
    answer:
      "The colors move from easiest to hardest: yellow, green, blue, then purple. Yellow categories tend to be the most direct, while purple groups usually rely on less literal associations or wordplay.",
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
    title: `${t("title")} - ${dateStr}`,
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
          Start with light clues, reveal more only when needed, and use the full
          answer as a review tool after you have taken your own shot at the
          board.
        </p>
      </header>

      {/* Playable Connections Game */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-8 mb-8 shadow-sm">
        <h2 className="text-center font-heading text-lg font-bold text-foreground mb-1">
          Play Today&apos;s Puzzle
        </h2>
        <p className="text-center text-xs text-muted-foreground mb-5">
          Sort the 16 words into four groups before you check the hints below
        </p>
        <ConnectionsGame groups={puzzle.answers} />
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
              More Connections Hints
            </h3>
            <div className="space-y-1">
              {recentPuzzles
                .filter((p) => p.date !== puzzle.date)
                .slice(0, 8)
                .map((p) => (
                  <Link
                    key={p.date}
                    href={`/connections-hint/${p.date}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  >
                    <span className="font-medium text-foreground">
                      Connections Hints #{p.id}
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
                View All Hint Pages {"->"}
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* 鈹€鈹€鈹€ SEO Content Sections 鈹€鈹€鈹€ */}

      {/* Strategy Tips */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Today&apos;s Strategy Tips
        </h2>
        <p className="mt-2 text-muted-foreground">
          Use these habits to stay in the solve longer and avoid giving away the
          board too early.
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

      {/* Hint usage guide */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          How to Use Today&apos;s Hints
        </h2>
        <p className="mt-2 text-muted-foreground">
          Use the sections above in order so you can stay in the solve and only
          reveal as much help as you need.
        </p>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border-l-4 border-l-blue-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Start with progressive hints
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Open the gentle clues first. They are designed to point you toward
              a category without giving away the board too quickly.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-amber-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Use the full answer as a check
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              If you have already played the puzzle, the answer reveal works
              best as a verification step and a way to study missed groups.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-emerald-500 border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Review old boards to improve
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The archive and guides are where longer-term improvement happens.
              Looking at repeated category styles is often more useful than
              reading a generic difficulty label.
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
          Go deeper if you want to study repeated trap types, board structure,
          and better guessing discipline.
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
            If this board still feels noisy, switch from hints to review mode.
            The guides below focus on category habits, common traps, and how to
            clean up late-board guesses.
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
            Each daily Connections board asks for the same core skill: reading
            16 words, spotting one reliable category, and resisting the urge to
            force the rest too early. The boards change every day, but the
            solving rhythm stays consistent.
          </p>
          <p>
            What makes the puzzle interesting is the overlap. Several words on
            the board often look like they belong in more than one group, so the
            challenge is not just finding a connection but proving that a set of
            four is cleaner than the alternatives.
          </p>
          <p>
            That is why this page is structured in layers. Try the board first,
            use progressive hints when you need direction, and save the answer
            reveal for verification or post-game review. Then use the archive to
            compare today&apos;s category styles with older boards.
          </p>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}



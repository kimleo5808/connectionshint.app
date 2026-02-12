import { ClickToReveal } from "@/components/connections/ClickToReveal";
import { CountdownTimer } from "@/components/connections/CountdownTimer";
import { getLatestPuzzle, getRecentPuzzles } from "@/lib/connections-data";
import dayjs from "dayjs";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Clock,
  Grid3X3,
  Lightbulb,
  Puzzle,
  Search,
  Shield,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const FEATURE_ICONS = [Lightbulb, Grid3X3, Clock, Puzzle, Shield, Sparkles];

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-border bg-card transition-colors open:bg-blue-50/30 dark:open:bg-blue-950/10">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-foreground transition-colors hover:text-blue-600 dark:hover:text-blue-400 [&::-webkit-details-marker]:hidden">
        <h3 className="text-[0.95rem] leading-snug">{question}</h3>
        <ChevronDown className="h-4 w-4 shrink-0 text-blue-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {answer}
        </p>
      </div>
    </details>
  );
}

export default async function HomeComponent() {
  const t = await getTranslations("HomePage");
  const latestPuzzle = await getLatestPuzzle();
  const recentPuzzles = await getRecentPuzzles(9);

  const todayDate = latestPuzzle
    ? dayjs(latestPuzzle.date).format("MMMM D, YYYY")
    : "";

  // Scramble words for display
  const allWords = latestPuzzle
    ? [...latestPuzzle.answers.flatMap((g) => g.members)].sort(() => 0.5 - Math.random())
    : [];

  return (
    <div className="w-full grid-bg">
      {/* Hero Section - Dark blue */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-lg text-slate-300 sm:text-xl">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/connections-hint-today"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-blue-600/30"
            >
              {t("hero.ctaHints")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/connections-hint"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-600 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-slate-800"
            >
              {t("hero.ctaArchive")}
              <Search className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Today's Clues Section */}
      {latestPuzzle && (
        <section className="bg-slate-800 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-white">
                Today&apos;s Connections Words
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Puzzle #{latestPuzzle.id} — {todayDate}
              </p>
            </div>

            {/* Word chips */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {allWords.map((word) => (
                <span
                  key={word}
                  className="rounded-lg bg-blue-600/20 border border-blue-500/30 px-4 py-2 text-sm font-mono font-bold text-blue-200 uppercase tracking-wide"
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Click to reveal */}
            <div className="mt-8 flex justify-center">
              <ClickToReveal puzzle={latestPuzzle} />
            </div>

            {/* Link to full hints */}
            <div className="mt-4 text-center">
              <Link
                href="/connections-hint-today"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Need progressive hints? Click here for step-by-step clues →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Countdown Timer */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-lg font-bold text-foreground">
            {t("hero.countdown")}
          </h2>
          <div className="mt-5">
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* Recent Puzzles Grid */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Recent Connections Answers
            </h2>
            <Link
              href="/connections-hint"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400"
            >
              {t("recentPuzzles.viewAll")}
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPuzzles.map((puzzle) => {
              const sorted = [...puzzle.answers].sort((a, b) => a.level - b.level);
              return (
                <Link
                  key={puzzle.date}
                  href={`/connections-hint/${puzzle.date}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:hover:border-blue-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-md bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                      Puzzle #{puzzle.id}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {dayjs(puzzle.date).format("MMM D, YYYY")}
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-foreground">
                    Connections #{puzzle.id} Answer & Hints
                  </h3>
                  <div className="mt-2 space-y-1">
                    {sorted.slice(0, 2).map((g) => (
                      <p key={g.level} className="truncate text-xs text-muted-foreground">
                        {g.members.join(", ")}
                      </p>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:text-blue-700 dark:text-blue-400">
                    Read Analysis
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* What is NYT Connections? */}
      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            What is NYT Connections?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            NYT Connections is a daily word puzzle by The New York Times where you sort 16 words into four groups of four, each sharing a hidden connection. Groups are color-coded by difficulty: yellow (easiest), green, blue, and purple (hardest).
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Grid3X3 className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">16 Words</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Sort them into four groups of four connected words.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Puzzle className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">4 Groups</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Each group shares a hidden connection or theme.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">Daily Puzzle</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A new puzzle is released every day at midnight ET.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Why Use ConnectionsHint?
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const Icon = FEATURE_ICONS[index];
              return (
                <div
                  key={index}
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:hover:border-blue-700"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-900/30 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-foreground">
                    {t(`features.${index}.title`)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {t(`features.${index}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ - 2 column */}
      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground text-center">
            {t("faq.title")}
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            {t("faq.description")}
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <FaqAccordionItem
                key={index}
                question={t(`faqItems.${index}.question`)}
                answer={t(`faqItems.${index}.answer`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Ready to Solve Today&apos;s Puzzle?
          </h2>
          <p className="mt-3 text-blue-100">
            Get progressive hints without spoiling the fun. Start with a gentle nudge and reveal more only when you need it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/connections-hint-today"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition-all hover:bg-blue-50"
            >
              Get Today&apos;s Hints
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/how-to-play-connections"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              How to Play
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

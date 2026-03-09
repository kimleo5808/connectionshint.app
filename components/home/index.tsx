import { ClickToReveal } from "@/components/connections/ClickToReveal";
import { CountdownTimer } from "@/components/connections/CountdownTimer";
import { GUIDES } from "@/data/guides";
import { LETTER_GAMES } from "@/data/letter-games";
import { getLatestPuzzle, getRecentPuzzles } from "@/lib/connections-data";
import dayjs from "dayjs";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Clock,
  Gamepad2,
  Grid3X3,
  Lightbulb,
  Map,
  Puzzle,
  Search,
  Shield,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const FEATURE_ICONS = [Lightbulb, Grid3X3, Clock, Puzzle, Shield, Sparkles];

function FaqAccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
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

  const allWords = latestPuzzle
    ? [...latestPuzzle.answers.flatMap((g) => g.members)].sort(
        () => 0.5 - Math.random()
      )
    : [];

  return (
    <div className="w-full grid-bg">
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-lg text-slate-300 sm:text-xl">
            Use progressive clues for today&apos;s board, then move into the
            archive and guides when you want to review patterns instead of
            spoiling the solve too early.
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

      {latestPuzzle && (
        <section className="bg-slate-800 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-white">
                Today&apos;s Connections Words
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Puzzle #{latestPuzzle.id} - {todayDate}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {allWords.map((word) => (
                <span
                  key={word}
                  className="rounded-lg border border-blue-500/30 bg-blue-600/20 px-4 py-2 text-sm font-mono font-bold uppercase tracking-wide text-blue-200"
                >
                  {word}
                </span>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <ClickToReveal puzzle={latestPuzzle} />
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/connections-hint-today"
                className="text-sm text-blue-400 transition-colors hover:text-blue-300"
              >
                Need progressive hints? Click here for step-by-step clues {"->"}
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="bg-background py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-lg font-bold text-foreground">
            {t("hero.countdown")}
          </h2>
          <div className="mt-5">
            <CountdownTimer />
          </div>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Recent Connections Answers
            </h2>
            <Link
              href="/connections-hint"
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
            >
              {t("recentPuzzles.viewAll")}
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPuzzles.map((puzzle) => {
              const sorted = [...puzzle.answers].sort(
                (a, b) => a.level - b.level
              );

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
                    Connections #{puzzle.id} Answer &amp; Hints
                  </h3>
                  <div className="mt-2 space-y-1">
                    {sorted.slice(0, 2).map((g) => (
                      <p
                        key={g.level}
                        className="truncate text-xs text-muted-foreground"
                      >
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

      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            What is NYT Connections?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            NYT Connections is a daily word puzzle by The New York Times where
            you sort 16 words into four groups of four, each sharing a hidden
            connection. Groups are color-coded by difficulty: yellow
            (easiest), green, blue, and purple (hardest).
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Grid3X3 className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">
                16 Words
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Sort them into four groups of four connected words.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Puzzle className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">
                4 Groups
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Each group shares a hidden connection or theme.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">
                Daily Puzzle
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A new puzzle is released every day at midnight ET.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-12">
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

      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-2xl font-bold text-foreground">
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

      <section className="bg-background py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              <Gamepad2 className="h-4 w-4" />
              Word Games
            </div>
            <h2 className="mt-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Play Wordle - Choose Your Word Length
            </h2>
            <p className="mt-2 text-muted-foreground">
              Challenge yourself with word puzzles from 4 to 11 letters
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {LETTER_GAMES.map((g) => (
              <Link
                key={g.slug}
                href={`/${g.slug}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 text-center transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:hover:border-blue-700"
              >
                <div className="font-heading text-3xl font-bold text-blue-600 transition-transform group-hover:scale-110 dark:text-blue-400">
                  {g.wordLength}
                </div>
                <h3 className="mt-1 text-sm font-bold text-foreground">
                  {g.wordLength} Letter Words
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {g.wordLength <= 5
                    ? g.wordLength === 4
                      ? "Quick and easy"
                      : "Classic Wordle"
                    : g.wordLength <= 7
                      ? "Advanced challenge"
                      : g.wordLength <= 9
                        ? "Expert level"
                        : "Ultimate difficulty"}
                </p>
                <div className="mt-2 text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
                  Play Now {"->"}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              <Map className="h-4 w-4" />
              Strategy Guides
            </div>
            <h2 className="mt-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Master Connections with Expert Guides
            </h2>
            <p className="mt-2 text-muted-foreground">
              Take your puzzle-solving skills to the next level with our comprehensive strategy guides
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:hover:border-blue-700"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg transition-transform group-hover:scale-110 dark:bg-blue-900/30">
                  {guide.icon}
                </div>
                <h3 className="mt-3 text-sm font-bold text-foreground">
                  {guide.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {guide.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:text-blue-700 dark:text-blue-400">
                  Read Guide
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-blue-200/60 bg-blue-50/50 p-4 text-center text-sm text-muted-foreground dark:border-blue-900/30 dark:bg-blue-950/10">
            <strong className="text-foreground">Pro Tip:</strong>{" "}
            Start with the{" "}
            <Link
              href="/guides/beginner-guide"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Beginner&apos;s Guide
            </Link>{" "}
            if you&apos;re new, or jump to{" "}
            <Link
              href="/guides/strategy-tips"
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Strategy Tips
            </Link>{" "}
            to improve your current approach!
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            How ConnectionsHint Helps You Solve Better
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            ConnectionsHint works best as a puzzle companion, not a shortcut to
            the finished grid. The homepage is meant to point you to the right
            kind of help for the moment you are in: a gentle nudge for today, a
            review path through older boards, or a guide when you want to get
            better at the game itself.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            The Daily Page Is Built For Three Moments
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            A good hint page should be useful before the solve, during the solve,
            and after the solve. That is why each daily page combines the word
            list, progressive hints, answer reveal controls, and links to nearby
            puzzle dates in one place.
          </p>
          <ul className="mt-3 space-y-2">
            {[
              [
                "Before the solve:",
                "Use the word list and first hint layer to test your own theory without exposing the full board.",
              ],
              [
                "During the solve:",
                "Open stronger hints only when you need a push, not when you just want confirmation.",
              ],
              [
                "After the solve:",
                "Review the finished groups and compare them with the way you approached the puzzle.",
              ],
            ].map(([title, desc]) => (
              <li key={title} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>
                  <strong className="text-foreground">{title}</strong> {desc}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            Why The Archive Matters
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Most improvement in Connections does not come from one puzzle. It
            comes from seeing category styles repeat across many puzzles:
            fill-in-the-blank themes, proper-noun clusters, misleading synonyms,
            and purple groups that depend on structure instead of meaning.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The archive helps with that kind of learning. Instead of treating old
            pages as disposable answers, you can use them to notice what kinds
            of traps keep showing up and where your own guesses usually go wrong.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            A Practical Way To Use Hints
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Hints are most useful when you already have a partial idea of the
            board. If you reveal too much too early, the puzzle stops teaching
            you anything. If you wait until you are frustrated, you usually stop
            noticing the pattern altogether.
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            {[
              "Read all 16 words and make at least one tentative grouping on your own.",
              "Open the first hint level only when you need direction, not certainty.",
              "Use the full answer as a review tool after the solve, not as your first move.",
              "Look at one or two recent boards if you notice a pattern you keep missing.",
            ].map((item) => (
              <li key={item} className="text-sm leading-relaxed text-muted-foreground">
                {item}
              </li>
            ))}
          </ol>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            How Word Games Fit Into The Same Habit
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The Wordle-style pages on this site work on a different skill set,
            but they still complement the broader puzzle habit. Word guessing
            strengthens vocabulary range, endings, and letter placement. Connections
            leans more on category logic, alternate meanings, and elimination.
            Both reward careful observation.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            What Makes A Good Review Page
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            A useful puzzle page should do more than answer a search query. It
            should help a player understand what happened on the board, move to
            related puzzles, and come away with one idea that improves the next
            solve. That is the standard this project is aiming for.
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Ready to Solve Today&apos;s Puzzle?
          </h2>
          <p className="mt-3 text-blue-100">
            Get progressive hints without spoiling the fun. Start with a gentle
            nudge and reveal more only when you need it.
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




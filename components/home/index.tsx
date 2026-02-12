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

      {/* Word Games Grid */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              <Gamepad2 className="h-4 w-4" />
              Word Games
            </div>
            <h2 className="mt-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Play Wordle — Choose Your Word Length
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
                  Play Now →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Promotion */}
      <section className="py-12 bg-muted/30">
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
            <Link href="/guides/beginner-guide" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Beginner&apos;s Guide
            </Link>{" "}
            if you&apos;re new, or jump to{" "}
            <Link href="/guides/strategy-tips" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Strategy Tips
            </Link>{" "}
            to improve your current approach!
          </div>
        </div>
      </section>

      {/* Long-form SEO Article */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Your Ultimate Guide to Connections Hint and Wordle Solutions
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Welcome to the premier destination for <strong className="text-foreground">connections hint</strong> enthusiasts and Wordle players! Whether you&apos;re seeking today&apos;s puzzle solutions or looking to sharpen your word-guessing skills, you&apos;ve found the perfect resource.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            What is Connections Hint?
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            A <strong className="text-foreground">connections hint today</strong> refers to the subtle clues and strategies that help players identify patterns and relationships between words in puzzle games. The New York Times Connections game has revolutionized how we think about word associations, making <strong className="text-foreground">NYT connections hints</strong> an essential tool for puzzle enthusiasts worldwide.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Our platform combines the classic Wordle experience with comprehensive guidance for various word puzzles. By understanding the connections between letters, words, and meanings, players can significantly improve their puzzle-solving abilities.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            Mastering Wordle with Strategic Hints
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Every <strong className="text-foreground">wordle hint</strong> serves a specific purpose in guiding players toward the solution. The five-letter word format of Wordle creates unique opportunities for strategic thinking. Here&apos;s how to leverage hints effectively:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              ["Letter frequency analysis:", "Focus on common letters like E, A, R, I, O, T, N, and S in your initial guesses"],
              ["Vowel placement:", "Identify vowel positions early to narrow down possibilities"],
              ["Consonant patterns:", "Recognize common consonant combinations and endings"],
              ["Word structure:", "Consider prefixes, suffixes, and root words"],
            ].map(([title, desc]) => (
              <li key={title} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span><strong className="text-foreground">{title}</strong> {desc}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            NYT Connections Hints: Advanced Strategies
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The <strong className="text-foreground">NYT connections hints</strong> system relies on understanding thematic relationships between seemingly unrelated words. Successful players develop pattern recognition skills that extend far beyond simple word knowledge.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Categories in Connections often include:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              ["Synonyms and related concepts:", "Words sharing similar meanings or contexts"],
              ["Compound word components:", "Words that can combine with a common term"],
              ["Pop culture references:", "Entertainment, sports, or historical connections"],
              ["Wordplay categories:", "Puns, rhymes, or linguistic tricks"],
            ].map(([title, desc]) => (
              <li key={title} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span><strong className="text-foreground">{title}</strong> {desc}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            Daily Puzzle Strategy and Connections Hint Today
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Finding the right <strong className="text-foreground">connections hint today</strong> requires a systematic approach. Start by scanning for obvious connections — often the easiest category reveals itself first. Look for proper nouns, specific terminology, or words that immediately suggest a theme.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Advanced players recommend the &quot;process of elimination&quot; strategy: identify the most challenging category first, then work backwards. This approach prevents accidental groupings that might use up your limited mistakes.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            Building Your Puzzle-Solving Toolkit
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Successful puzzle solvers combine multiple skills and resources. A comprehensive <strong className="text-foreground">wordle hint</strong> strategy involves:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            {[
              ["Vocabulary expansion:", "Regularly learn new words and their meanings"],
              ["Pattern recognition:", "Study common letter combinations and word structures"],
              ["Cultural awareness:", "Stay informed about current events and popular culture"],
              ["Practice consistency:", "Daily engagement improves intuitive pattern recognition"],
            ].map(([title, desc]) => (
              <li key={title} className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">{title}</strong> {desc}
              </li>
            ))}
          </ol>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            The Psychology Behind Puzzle Hints
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Understanding why certain <strong className="text-foreground">connections hint</strong> strategies work reveals the cognitive processes underlying puzzle-solving success. The brain naturally seeks patterns and relationships, making connections between disparate pieces of information.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Effective hint systems leverage this natural tendency by providing just enough information to guide thinking without revealing solutions outright. The best <strong className="text-foreground">NYT connections hints</strong> activate existing knowledge while encouraging creative thinking.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            Community and Competition
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The puzzle-solving community thrives on shared strategies and collective problem-solving. Social media platforms buzz daily with discussions about the latest <strong className="text-foreground">connections hint today</strong>, creating a global network of enthusiasts who support each other&apos;s puzzle journey.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            This collaborative approach extends to Wordle, where sharing results has become a cultural phenomenon. The color-coded grid system allows players to communicate their solving experience without spoiling the answer for others.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            Technology and Puzzle Evolution
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Modern puzzle platforms have transformed how we interact with word games. Digital formats allow for immediate feedback, statistical tracking, and adaptive difficulty levels. Today&apos;s <strong className="text-foreground">wordle hint</strong> systems can analyze player performance and provide personalized guidance.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The integration of AI and machine learning in puzzle design creates more sophisticated hint systems. These technologies can generate <strong className="text-foreground">connections hint</strong> suggestions that adapt to individual playing styles and skill levels.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            Educational Benefits of Puzzle Solving
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Regular engagement with word puzzles provides significant cognitive benefits. Studies suggest that consistent puzzle-solving activity can improve vocabulary, enhance pattern recognition, and strengthen analytical thinking skills.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The strategic thinking required for effective use of <strong className="text-foreground">NYT connections hints</strong> translates to improved problem-solving abilities in other contexts. Players develop patience, methodical thinking, and the ability to consider multiple perspectives simultaneously.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            Future of Word Puzzles
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            As word puzzles continue to evolve, the role of hints and guidance will become increasingly sophisticated. Future platforms may incorporate personalized learning algorithms, adaptive difficulty systems, and collaborative solving features.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The enduring popularity of games requiring <strong className="text-foreground">connections hint today</strong> strategies demonstrates the fundamental human love for intellectual challenges. These puzzles satisfy our desire for accomplishment while providing daily mental exercise in an increasingly digital world.
          </p>

          <h3 className="mt-8 font-heading text-lg font-semibold text-foreground">
            Getting Started: Your First Steps
          </h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Begin your puzzle-solving journey with our integrated Wordle game above. Practice identifying letter patterns and word structures while building your confidence. Remember, every expert puzzle solver started with simple <strong className="text-foreground">wordle hint</strong> strategies before developing advanced techniques.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Join our community of puzzle enthusiasts and share your progress. Whether you&apos;re seeking today&apos;s <strong className="text-foreground">connections hint</strong> or celebrating a perfect Wordle solve, you&apos;ll find support and encouragement here.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Ready to challenge yourself? Start with today&apos;s puzzle and discover how strategic thinking and the right hints can transform your solving experience. Welcome to the world of connections, patterns, and the satisfaction of puzzle mastery!
          </p>
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

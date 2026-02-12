import { AnswerReveal } from "@/components/connections/AnswerReveal";
import { HintCardList } from "@/components/connections/HintCard";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getAllPuzzles,
  getPuzzleByDate,
  getRecentPuzzles,
} from "@/lib/connections-data";
import { articleSchema, breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { ConnectionsGroup } from "@/types/connections";
import dayjs from "dayjs";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  BookOpen,
  Lightbulb,
  Puzzle,
  Target,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string; date: string }>;

/* ── colour helpers ─────────────────────────────────────── */
const GROUP_DOT: Record<number, string> = {
  0: "bg-yellow-400",
  1: "bg-emerald-500",
  2: "bg-blue-400",
  3: "bg-purple-500",
};
const GROUP_BG: Record<number, string> = {
  0: "bg-yellow-100 dark:bg-yellow-900/30",
  1: "bg-emerald-100 dark:bg-emerald-900/30",
  2: "bg-blue-100 dark:bg-blue-900/30",
  3: "bg-purple-100 dark:bg-purple-900/30",
};
const GROUP_TEXT: Record<number, string> = {
  0: "text-yellow-900 dark:text-yellow-200",
  1: "text-emerald-900 dark:text-emerald-200",
  2: "text-blue-900 dark:text-blue-200",
  3: "text-purple-900 dark:text-purple-200",
};
const GROUP_BORDER: Record<number, string> = {
  0: "border-yellow-300 dark:border-yellow-700",
  1: "border-emerald-300 dark:border-emerald-700",
  2: "border-blue-300 dark:border-blue-700",
  3: "border-purple-300 dark:border-purple-700",
};
const LEVEL_EMOJI: Record<number, string> = {
  0: "🟡",
  1: "🟢",
  2: "🔵",
  3: "🟣",
};
const LEVEL_NAME: Record<number, string> = {
  0: "Straightforward",
  1: "Moderate",
  2: "Tricky",
  3: "Challenging",
};

/* ── auto-generated analysis helpers ────────────────────── */
function generateOverview(
  id: number,
  date: string,
  groups: ConnectionsGroup[]
) {
  const sorted = [...groups].sort((a, b) => a.level - b.level);
  const themes = sorted.map((g) => `"${g.group}"`).join(", ");
  const formattedDate = dayjs(date).format("MMMM D, YYYY");
  return `NYT Connections puzzle #${id} (${formattedDate}) features four groups spanning themes of ${themes}. The yellow (easiest) category is "${sorted[0].group}", while the purple (hardest) category is "${sorted[3].group}". Below you'll find a full breakdown of each group, how the words connect, and strategies to help you solve similar puzzles in the future.`;
}

function generateGroupAnalysis(group: ConnectionsGroup) {
  const words = group.members.join(", ");
  return `The category "${group.group}" contains the words ${words}. All four words share a common thread related to the theme "${group.group}". ${
    group.level <= 1
      ? "This group is relatively straightforward once you spot the connection."
      : "This group requires deeper thinking — the connection may not be immediately obvious."
  }`;
}

function generateStrategyTips(groups: ConnectionsGroup[]) {
  const tips = [
    "Start with the yellow group — it's always the most straightforward category. Look for words that obviously belong together.",
    "Watch out for words that could fit multiple groups. These \"red herrings\" are intentionally placed to mislead you.",
    "If you're stuck, try sorting all 16 words into potential pairs or clusters. Patterns often emerge when you group similar-looking words.",
    "The purple group is always the trickiest. It often involves wordplay, hidden meanings, or less common associations.",
  ];

  const hasTrickyGroup = groups.some(
    (g) => g.group.includes("___") || g.group.includes("...")
  );
  if (hasTrickyGroup) {
    tips.push(
      'Look for fill-in-the-blank patterns (like "___ WORD") — these are common in harder categories and require thinking about word prefixes or suffixes.'
    );
  }

  return tips;
}

function generateFAQ(
  id: number,
  date: string,
  groups: ConnectionsGroup[]
) {
  const formattedDate = dayjs(date).format("MMMM D, YYYY");
  const sorted = [...groups].sort((a, b) => a.level - b.level);
  return [
    {
      q: `What is the answer to NYT Connections #${id}?`,
      a: `Connections #${id} (${formattedDate}) has four groups: ${sorted.map((g) => `${LEVEL_EMOJI[g.level]} ${g.group} (${g.members.join(", ")})`).join("; ")}.`,
    },
    {
      q: `What are the four groups in Connections #${id}?`,
      a: `The four categories are: ${sorted.map((g) => `"${g.group}" (${LEVEL_NAME[g.level]})`).join(", ")}. Each group contains exactly four words that share a common theme or connection.`,
    },
    {
      q: `How hard is Connections puzzle #${id}?`,
      a: `The difficulty varies by group. The yellow group ("${sorted[0].group}") is the easiest, while the purple group ("${sorted[3].group}") is the most challenging. We recommend starting with the yellow and green groups to build momentum.`,
    },
    {
      q: "How do I play NYT Connections?",
      a: "NYT Connections presents 16 words that need to be sorted into four groups of four. Each group shares a common theme. You get four mistakes before the game ends. Start with the most obvious connections first and work your way to the harder ones.",
    },
  ];
}

/* ── metadata ───────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const puzzle = await getPuzzleByDate(date);
  if (!puzzle) return {};

  const formattedDate = dayjs(date).format("MMMM D, YYYY");

  return constructMetadata({
    page: "Daily",
    title: `Connections Hint ${formattedDate} — Puzzle #${puzzle.id} Answer & Analysis`,
    description: `Complete hints, answers, and analysis for NYT Connections puzzle #${puzzle.id} on ${formattedDate}. Progressive hints for all four groups, full solution breakdown, and solving strategies.`,
    keywords: [
      `connections hint ${date}`,
      `connections answers ${formattedDate}`,
      `nyt connections ${formattedDate}`,
      `connections puzzle #${puzzle.id}`,
      "connections puzzle answers",
      "nyt connections hints today",
    ],
    locale: locale as Locale,
    path: `/connections-hint/${date}`,
    canonicalUrl: `/connections-hint/${date}`,
  });
}

/* ── page ────────────────────────────────────────────────── */
export default async function DailyPuzzlePage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;
  const puzzle = await getPuzzleByDate(date);

  if (!puzzle) {
    notFound();
  }

  const allPuzzles = await getAllPuzzles();
  const currentIndex = allPuzzles.findIndex((p) => p.date === date);
  const prevPuzzle =
    currentIndex < allPuzzles.length - 1 ? allPuzzles[currentIndex + 1] : null;
  const nextPuzzle =
    currentIndex > 0 ? allPuzzles[currentIndex - 1] : null;
  const recentPuzzles = await getRecentPuzzles(10);

  const formattedDate = dayjs(puzzle.date).format("MMMM D, YYYY");
  const dayOfWeek = dayjs(puzzle.date).format("dddd");

  const sorted = [...puzzle.answers].sort((a, b) => a.level - b.level);
  const allWords = [...puzzle.answers.flatMap((g) => g.members)].sort(
    () => 0.5 - Math.random()
  );

  const faqItems = generateFAQ(puzzle.id, puzzle.date, puzzle.answers);
  const strategyTips = generateStrategyTips(puzzle.answers);
  const overview = generateOverview(puzzle.id, puzzle.date, puzzle.answers);

  // Related puzzles (3 closest, excluding current)
  const relatedPuzzles = recentPuzzles
    .filter((p) => p.date !== puzzle.date)
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Connections Hint",
            url: `${BASE_URL}/connections-hint`,
          },
          {
            name: `Puzzle #${puzzle.id}`,
            url: `${BASE_URL}/connections-hint/${date}`,
          },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: `Connections #${puzzle.id} Answer & Analysis — ${formattedDate}`,
          description: `Complete hints, answers, and analysis for NYT Connections puzzle #${puzzle.id} on ${formattedDate}.`,
          url: `${BASE_URL}/connections-hint/${date}`,
          datePublished: puzzle.date,
          dateModified: puzzle.date,
        })}
      />
      <JsonLd
        data={faqPageSchema(
          faqItems.map((f) => ({ question: f.q, answer: f.a }))
        )}
      />

      {/* ── Prev / Next nav ──────────────────────────────── */}
      <nav className="flex items-center justify-between mb-6">
        {prevPuzzle ? (
          <Link
            href={`/connections-hint/${prevPuzzle.date}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Link>
        ) : (
          <span />
        )}
        {nextPuzzle ? (
          <Link
            href={`/connections-hint/${nextPuzzle.date}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-blue-600 transition-colors"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>

      {/* ── Title ────────────────────────────────────────── */}
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>
            {dayOfWeek}, {formattedDate}
          </span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Connections #{puzzle.id} Answer &amp; Analysis
        </h1>
        <p className="mt-2 text-muted-foreground">({formattedDate})</p>
        <p className="mt-4 text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          What connects{" "}
          {sorted.map((g, i) => (
            <span key={g.level}>
              <strong className="text-foreground">{g.group}</strong>
              {i < sorted.length - 1 ? ", " : ""}
            </span>
          ))}
          ? Find progressive hints and the complete answer for Connections #
          {puzzle.id} below.
        </p>
      </header>

      {/* ── 3-column highlight cards ─────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <Lightbulb className="mx-auto h-8 w-8 text-amber-500 mb-3" />
          <h3 className="font-heading text-sm font-bold text-foreground">
            Progressive Hints
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Start with gentle clues, reveal more only when you need them
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <Target className="mx-auto h-8 w-8 text-blue-500 mb-3" />
          <h3 className="font-heading text-sm font-bold text-foreground">
            Full Answer
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Complete solution with all four groups color-coded by difficulty
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-center">
          <Zap className="mx-auto h-8 w-8 text-purple-500 mb-3" />
          <h3 className="font-heading text-sm font-bold text-foreground">
            Strategy Tips
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Learn the patterns and strategies behind today&apos;s puzzle
          </p>
        </div>
      </section>

      {/* ── Word chips banner ────────────────────────────── */}
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

      {/* ── Main content + Sidebar ───────────────────────── */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Spoiler / answer reveal */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <AnswerReveal puzzle={puzzle} />
          </section>

          {/* Progressive hints */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Progressive Hints
              </h2>
            </div>
            <HintCardList groups={puzzle.answers} />
          </section>

          {/* ── Answer & Full Analysis ────────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Puzzle className="h-5 w-5 text-blue-500" />
              <h2 className="font-heading text-xl font-bold text-foreground">
                Connections #{puzzle.id} Answer &amp; Full Analysis
              </h2>
            </div>

            {/* Overview */}
            <p className="text-sm leading-relaxed text-muted-foreground mb-8">
              {overview}
            </p>

            {/* Groups breakdown */}
            <h3 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Groups Breakdown
            </h3>
            <div className="space-y-4 mb-8">
              {sorted.map((group) => (
                <div
                  key={group.level}
                  className={`rounded-xl border ${GROUP_BORDER[group.level]} overflow-hidden`}
                >
                  <div
                    className={`${GROUP_BG[group.level]} px-5 py-3 flex items-center gap-3`}
                  >
                    <span
                      className={`h-3 w-3 rounded-full ${GROUP_DOT[group.level]}`}
                    />
                    <span
                      className={`font-heading text-sm font-bold uppercase tracking-wide ${GROUP_TEXT[group.level]}`}
                    >
                      {LEVEL_EMOJI[group.level]} {group.group}
                    </span>
                    <span
                      className={`ml-auto text-xs font-medium ${GROUP_TEXT[group.level]} opacity-70`}
                    >
                      {LEVEL_NAME[group.level]}
                    </span>
                  </div>
                  <div className="px-5 py-4 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {group.members.map((word) => (
                        <span
                          key={word}
                          className={`rounded-md px-2.5 py-1 text-xs font-mono font-bold ${GROUP_BG[group.level]} ${GROUP_TEXT[group.level]}`}
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {generateGroupAnalysis(group)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Word reference table */}
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              📚 Word Reference Table
            </h3>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2.5 text-left font-heading font-bold text-foreground">
                      Word
                    </th>
                    <th className="px-4 py-2.5 text-left font-heading font-bold text-foreground">
                      Group
                    </th>
                    <th className="px-4 py-2.5 text-left font-heading font-bold text-foreground">
                      Difficulty
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.flatMap((group) =>
                    group.members.map((word) => (
                      <tr
                        key={word}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-mono font-bold text-foreground">
                          {word}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          {group.group}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className={`h-2 w-2 rounded-full ${GROUP_DOT[group.level]}`}
                            />
                            <span className="text-muted-foreground">
                              {LEVEL_NAME[group.level]}
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Strategy tips */}
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              🧠 Strategy Tips for Connections #{puzzle.id}
            </h3>
            <ul className="space-y-3 mb-8">
              {strategyTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {tip}
                  </p>
                </li>
              ))}
            </ul>

            {/* FAQ */}
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              ❓ Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqItems.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-muted/20 p-4"
                >
                  <h4 className="text-sm font-bold text-foreground mb-2">
                    {faq.q}
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Related Puzzles ───────────────────────────── */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              📌 Related Connections Puzzles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedPuzzles.map((p) => {
                const pSorted = [...p.answers].sort(
                  (a, b) => a.level - b.level
                );
                return (
                  <Link
                    key={p.date}
                    href={`/connections-hint/${p.date}`}
                    className="group rounded-xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:hover:border-blue-700"
                  >
                    <span className="inline-block rounded-md bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
                      Puzzle #{p.id}
                    </span>
                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                      {dayjs(p.date).format("MMMM D, YYYY")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground truncate">
                      {pSorted.map((g) => g.group).join(" · ")}
                    </p>
                    <span className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:text-blue-700 dark:text-blue-400">
                      View Hints
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/connections-hint"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                View All Connections Hints &amp; Answers →
              </Link>
            </div>
          </section>

          {/* ── Bottom prev/next navigation ───────────────── */}
          <nav className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            {prevPuzzle ? (
              <Link
                href={`/connections-hint/${prevPuzzle.date}`}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>
                  #{prevPuzzle.id} — {dayjs(prevPuzzle.date).format("MMM D")}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {nextPuzzle ? (
              <Link
                href={`/connections-hint/${nextPuzzle.date}`}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors"
              >
                <span>
                  #{nextPuzzle.id} — {dayjs(nextPuzzle.date).format("MMM D")}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>

        {/* ── Sidebar ────────────────────────────────────── */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sticky top-24">
            <h3 className="font-heading text-sm font-bold text-foreground mb-3">
              Recent Connections Answers
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
                      #{p.id} — {dayjs(p.date).format("MMM D")}
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
                View All Puzzles →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const allPuzzles = await getAllPuzzles();
  const params: { locale: string; date: string }[] = [];

  for (const locale of LOCALES) {
    for (const puzzle of allPuzzles.slice(0, 60)) {
      params.push({ locale, date: puzzle.date });
    }
  }

  return params;
}

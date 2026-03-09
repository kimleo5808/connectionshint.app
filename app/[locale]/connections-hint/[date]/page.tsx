import { AnswerReveal } from "@/components/connections/AnswerReveal";
import { HintCardList } from "@/components/connections/HintCard";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  getAllPuzzles,
  getPuzzleByDate,
  getRecentPuzzles,
} from "@/lib/connections-data";
import { getSuggestedStudyLinks } from "@/lib/connections-insights";
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

/* 鈹€鈹€ colour helpers 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€ */
const GROUP_DOT: Record<number, string> = {
  0: "Yellow",
  1: "Green",
  2: "Blue",
  3: "Purple",
};
const GROUP_BG: Record<number, string> = {
  0: "Yellow",
  1: "Green",
  2: "Blue",
  3: "Purple",
};
const GROUP_TEXT: Record<number, string> = {
  0: "Yellow",
  1: "Green",
  2: "Blue",
  3: "Purple",
};
const GROUP_BORDER: Record<number, string> = {
  0: "Yellow",
  1: "Green",
  2: "Blue",
  3: "Purple",
};
const LEVEL_EMOJI: Record<number, string> = {
  0: "Yellow",
  1: "Green",
  2: "Blue",
  3: "Purple",
};
const LEVEL_NAME: Record<number, string> = {
  0: "Yellow",
  1: "Green",
  2: "Blue",
  3: "Purple",
};

/* 鈹€鈹€ auto-generated analysis helpers 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€ */
function getGroupPattern(group: ConnectionsGroup) {
  const label = group.group.toUpperCase();

  if (label.includes("___") || label.includes("...")) {
    return "fill-in-the-blank";
  }

  if (
    [
      "PALINDROME",
      "ANAGRAM",
      "HOMOPHONE",
      "RHYME",
      "PREFIX",
      "SUFFIX",
      "STARTS WITH",
      "ENDS WITH",
      "BEGINNING WITH",
      "ENDING WITH",
      "BEFORE",
      "AFTER",
      "HIDDEN",
      "SPELL",
      "LETTER",
      "INITIAL",
      "ABBREVIATION",
    ].some((token) => label.includes(token))
  ) {
    return "wordplay";
  }

  if (
    [
      "PARTS OF",
      "TYPES OF",
      "KINDS OF",
      "THINGS",
      "ITEMS",
      "SIGNS",
      "WAYS TO",
      "GROUP OF",
      "MEMBERS OF",
    ].some((token) => label.includes(token))
  ) {
    return "structured set";
  }

  return "category";
}

function describeWordLengths(words: string[]) {
  const lengths = words.map((word) => word.replace(/[^A-Za-z]/g, "").length);
  const uniqueLengths = [...new Set(lengths)];

  if (uniqueLengths.length === 1) {
    return `All four entries are ${uniqueLengths[0]} letters long, which can be a useful confirmation once the set starts to come together.`;
  }

  return `The word lengths vary from ${Math.min(...lengths)} to ${Math.max(...lengths)} letters, so the connection depends more on meaning or phrasing than on a visible format match.`;
}

function getDifficultyNote(level: number) {
  if (level === 0) {
    return "This is the cleanest entry point on the board, so solving it early usually makes the rest of the puzzle easier to separate.";
  }

  if (level === 1) {
    return "This group is still fairly direct, but it can overlap with nearby decoys until a couple of other words are cleared away.";
  }

  if (level === 2) {
    return "This is where Connections usually starts to hide overlap, so it helps to test the full four-word set before you commit.";
  }

  return "This is the purple-style trap on the board: the connection is real, but it is usually phrased or interpreted in a less literal way.";
}

function generateOverview(
  id: number,
  date: string,
  groups: ConnectionsGroup[]
) {
  const sorted = [...groups].sort((a, b) => a.level - b.level);
  const formattedDate = dayjs(date).format("MMMM D, YYYY");
  const patternLabels = new Set(sorted.map(getGroupPattern));
  const patternNote = patternLabels.has("fill-in-the-blank")
    ? "At least one category depends on phrase-completion rather than plain subject matching, so this board rewards testing words inside familiar expressions."
    : patternLabels.has("wordplay")
      ? "One of the tougher categories leans on spelling or language structure, so the puzzle gets harder as you move away from the obvious subject-area set."
      : "Most of the board is solved through careful categorization, so the main challenge is separating near-matches rather than decoding heavy wordplay.";

  return `Connections #${id} for ${formattedDate} moves from the straightforward yellow group "${sorted[0].group}" to the harder purple group "${sorted[3].group}". The four categories are ${sorted.map((group) => `"${group.group}"`).join(", ")}. ${patternNote} Use the hint ladder first if you still want to preserve the solve, then check the full breakdown below to see how each set fits together.`;
}

function generateGroupAnalysis(group: ConnectionsGroup) {
  const words = group.members.join(", ");
  return `The category "${group.group}" contains the words ${words}. All four words share a common thread related to the theme "${group.group}". ${
    group.level <= 1
      ? "This group is relatively straightforward once you spot the connection."
      : "This group requires deeper thinking - the connection may not be immediately obvious."
  }`;
}

function generateStrategyTips(groups: ConnectionsGroup[]) {
  const tips = [
    "Start with the yellow group - it's usually the most straightforward category. Look for words that clearly belong together.",
    "Watch out for words that could fit multiple groups. These \"red herrings\" are intentionally placed to mislead you.",
    "If you're stuck, try sorting all 16 words into potential pairs or clusters. Patterns often emerge when you group similar-looking words.",
    "The purple group is always the trickiest. It often involves wordplay, hidden meanings, or less common associations.",
  ];

  const hasTrickyGroup = groups.some(
    (g) => g.group.includes("___") || g.group.includes("...")
  );
  if (hasTrickyGroup) {
    tips.push(
      'Look for fill-in-the-blank patterns (like "___ WORD") - these are common in harder categories and require thinking about word prefixes or suffixes.'
    );
  }

  return tips;
}

function generateEditorialOverview(
  id: number,
  date: string,
  groups: ConnectionsGroup[]
) {
  const sorted = [...groups].sort((a, b) => a.level - b.level);
  const formattedDate = dayjs(date).format("MMMM D, YYYY");
  const patternLabels = new Set(sorted.map(getGroupPattern));
  const patternNote = patternLabels.has("fill-in-the-blank")
    ? "At least one category depends on phrase-completion rather than plain subject matching, so this board rewards testing words inside familiar expressions."
    : patternLabels.has("wordplay")
      ? "One of the tougher categories leans on spelling or language structure, so the puzzle gets harder as you move away from the obvious subject-area set."
      : "Most of the board is solved through careful categorization, so the main challenge is separating near-matches rather than decoding heavy wordplay.";

  return `Connections #${id} for ${formattedDate} moves from the straightforward yellow group "${sorted[0].group}" to the harder purple group "${sorted[3].group}". The four categories are ${sorted.map((group) => `"${group.group}"`).join(", ")}. ${patternNote} Use the hint ladder first if you still want to preserve the solve, then check the full breakdown below to see how each set fits together.`;
}

function generateEditorialGroupAnalysis(group: ConnectionsGroup) {
  const words = group.members.join(", ");
  const pattern = getGroupPattern(group);

  const patternNote =
    pattern === "fill-in-the-blank"
      ? "This category works like a phrase template, so the fastest way to verify it is to test each word inside the missing expression."
      : pattern === "wordplay"
        ? "This set is built around a language pattern rather than a simple topic label, which is why it can stay hidden until late in the solve."
        : pattern === "structured set"
          ? "This is a tidy named set, so once two words click, the remaining pair usually becomes much easier to spot."
          : "This is a standard thematic group, so the challenge is mostly avoiding words that feel adjacent but belong elsewhere.";

  return `The category "${group.group}" includes ${words}. ${patternNote} ${describeWordLengths(group.members)} ${getDifficultyNote(group.level)}`;
}

function generateEditorialStrategyTips(groups: ConnectionsGroup[]) {
  const sorted = [...groups].sort((a, b) => a.level - b.level);
  const tips = [
    `Start with "${sorted[0].group}" if it jumps out. Yellow groups are usually the safest way to clear space and expose the real overlaps on the board.`,
    "Do not submit a set just because two words seem related. Connections often places believable decoys next to the correct category, especially in the green and blue slots.",
    "If you can identify three words that belong together, pause and scan all 16 options before locking the guess. The fourth word is usually where the trap reveals itself.",
    `Save "${sorted[3].group}" for later if needed. Purple categories become much easier once the obvious subject-based groups have been removed.`,
  ];

  if (sorted.some((group) => getGroupPattern(group) === "fill-in-the-blank")) {
    tips.push(
      "Watch for fill-in-the-blank phrasing. Try reading each candidate before or after a shared word pattern instead of treating the set as a literal topic."
    );
  }

  if (sorted.some((group) => getGroupPattern(group) === "wordplay")) {
    tips.push(
      "Check the spelling and structure of the words, not just their definitions. Harder boards often hide one category in palindromes, prefixes, endings, or other language tricks."
    );
  }

  if (
    sorted.some(
      (group) => new Set(group.members.map((word) => word.length)).size === 1
    )
  ) {
    tips.push(
      "Use visual signals as a tiebreaker. When a suspected group shares a similar word length or format, that pattern can help confirm the set after you notice the theme."
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
  const patternLabels = new Set(sorted.map(getGroupPattern));
  const difficultySummary = patternLabels.has("fill-in-the-blank")
    ? `The yellow group "${sorted[0].group}" should give you the cleanest start, while the purple group "${sorted[3].group}" is harder because it relies more on phrase recognition than straight topic matching.`
    : patternLabels.has("wordplay")
      ? `The yellow group "${sorted[0].group}" is the easiest foothold, while the purple group "${sorted[3].group}" is tougher because it leans more on language structure or a less literal read.`
      : `The yellow group "${sorted[0].group}" is the easiest foothold, while the purple group "${sorted[3].group}" is the hardest because it is easier to confuse with nearby decoys.`;

  const solvingSummary = patternLabels.has("fill-in-the-blank")
    ? "Start with the clearest subject-based set, then test the remaining candidates inside familiar phrases before you submit a harder guess."
    : patternLabels.has("wordplay")
      ? "Start with the most literal category first, then check spelling, phrasing, and word structure before locking in the hardest group."
      : "Start with the most obvious theme, clear one group at a time, and use the remaining words to confirm the harder categories.";

  return [
    {
      q: `What is the answer to NYT Connections #${id}?`,
      a: `Connections #${id} (${formattedDate}) has four groups: ${sorted.map((g) => `${LEVEL_EMOJI[g.level]} ${g.group} (${g.members.join(", ")})`).join("; ")}.`,
    },
    {
      q: `What are the four groups in Connections #${id}?`,
      a: `The four categories are: ${sorted.map((g) => `"${g.group}" (${LEVEL_NAME[g.level]})`).join(", ")}. Each group contains four words, but the board mixes direct categories with less obvious traps so you usually need to confirm the full set before submitting.`,
    },
    {
      q: `How hard is Connections puzzle #${id}?`,
      a: `The difficulty varies by group. ${difficultySummary}`,
    },
    {
      q: "How do I play NYT Connections?",
      a: `NYT Connections presents 16 words that need to be sorted into four groups of four, with only four mistakes allowed. ${solvingSummary}`,
    },
  ];
}

/* 鈹€鈹€ metadata 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€ */
function getPuzzleStyleSummary(groups: ConnectionsGroup[]) {
  const patternLabels = new Set(groups.map(getGroupPattern));

  if (patternLabels.has("fill-in-the-blank")) {
    return "today's board leans on phrase-completion and careful pattern checking";
  }

  if (patternLabels.has("wordplay")) {
    return "today's board hides at least one group behind wordplay or language structure";
  }

  return "today's board is more about separating close thematic matches than decoding wordplay";
}

function generateMetadataTitle(
  id: number,
  date: string,
  groups: ConnectionsGroup[]
) {
  const formattedDate = dayjs(date).format("MMMM D, YYYY");
  const patternLabels = new Set(groups.map(getGroupPattern));
  const suffix = patternLabels.has("fill-in-the-blank")
    ? "Hints, Answers, and Phrase Clues"
    : patternLabels.has("wordplay")
      ? "Hints, Answers, and Wordplay Notes"
      : "Hints, Answers, and Group Notes";

  return `Connections #${id} for ${formattedDate}: ${suffix}`;
}

function generateMetadataDescription(
  id: number,
  date: string,
  groups: ConnectionsGroup[]
) {
  const formattedDate = dayjs(date).format("MMMM D, YYYY");
  const sorted = [...groups].sort((a, b) => a.level - b.level);

  return `Review Connections #${id} for ${formattedDate}, from "${sorted[0].group}" to "${sorted[3].group}". Includes progressive hints, full answers, and solve notes explaining why ${getPuzzleStyleSummary(groups)}.`;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const puzzle = await getPuzzleByDate(date);
  if (!puzzle) return {};
  const formattedDate = dayjs(date).format("MMMM D, YYYY");
  const metadataTitle = generateMetadataTitle(
    puzzle.id,
    puzzle.date,
    puzzle.answers
  );
  const metadataDescription = generateMetadataDescription(
    puzzle.id,
    puzzle.date,
    puzzle.answers
  );
  return constructMetadata({
    page: "Daily",
    title: metadataTitle,
    description: metadataDescription,
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
  const monthPath = `/connections-hint/${puzzle.date.slice(0, 4)}/${puzzle.date.slice(5, 7)}`;

  const sorted = [...puzzle.answers].sort((a, b) => a.level - b.level);
  const allWords = [...puzzle.answers.flatMap((g) => g.members)].sort(
    () => 0.5 - Math.random()
  );

  const faqItems = generateFAQ(puzzle.id, puzzle.date, puzzle.answers);
  const strategyTips = generateEditorialStrategyTips(puzzle.answers);
  const studyLinks = getSuggestedStudyLinks(puzzle.answers);
  const overview = generateEditorialOverview(
    puzzle.id,
    puzzle.date,
    puzzle.answers
  );
  const articleTitle = generateMetadataTitle(
    puzzle.id,
    puzzle.date,
    puzzle.answers
  );
  const articleDescription = generateMetadataDescription(
    puzzle.id,
    puzzle.date,
    puzzle.answers
  );

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
          title: articleTitle,
          description: articleDescription,
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

      {/* 鈹€鈹€ Prev / Next nav 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€ */}
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

      {/* 鈹€鈹€ Title 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€ */}
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
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href={`/connections-number/${puzzle.id}`}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Puzzle #{puzzle.id} Lookup
          </Link>
          <Link
            href={monthPath}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Browse {dayjs(puzzle.date).format("MMMM YYYY")}
          </Link>
          <Link
            href="/connections-hint-yesterday"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Review Yesterday
          </Link>
          <Link
            href="/connections-difficulty"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Difficulty Guide
          </Link>
        </div>
      </header>

      {/* 鈹€鈹€ 3-column highlight cards 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€ */}
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

      {/* 鈹€鈹€ Word chips banner 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€ */}
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

      {/* 鈹€鈹€ Main content + Sidebar 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€ */}
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

          {/* 鈹€鈹€ Answer & Full Analysis 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€ */}
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
                      {generateEditorialGroupAnalysis(group)}
                    </p>
                    {(getGroupPattern(group) === "fill-in-the-blank" ||
                      getGroupPattern(group) === "wordplay") && (
                      <Link
                        href={`/connections-patterns/${getGroupPattern(group) === "fill-in-the-blank" ? "fill-in-the-blank" : "wordplay"}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Study this {getGroupPattern(group) === "fill-in-the-blank" ? "phrase pattern" : "wordplay pattern"}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Word reference table */}
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              Word Reference Table
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
              Strategy Tips for Connections #{puzzle.id}
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

            <div className="mb-8 rounded-xl border border-border bg-muted/20 p-4">
              <h4 className="font-heading text-sm font-bold text-foreground">
                Study the Pattern Behind This Board
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                If this puzzle felt sticky, jump straight to the pattern page
                that matches the board instead of only rereading the answer.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {studyLinks.map((link) => (
                  <Link
                    key={link.slug}
                    href={`/connections-patterns/${link.slug}`}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              Frequently Asked Questions
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

          {/* 鈹€鈹€ Related Puzzles 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€ */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              Related Connections Puzzles
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
                      {pSorted.map((g) => g.group).join(" / ")}
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
                View All Connections Hints &amp; Answers {"->"}
              </Link>
            </div>
          </section>

          {/* 鈹€鈹€ Bottom prev/next navigation 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€ */}
          <nav className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            {prevPuzzle ? (
              <Link
                href={`/connections-hint/${prevPuzzle.date}`}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>
                  #{prevPuzzle.id} - {dayjs(prevPuzzle.date).format("MMM D")}
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
                  #{nextPuzzle.id} - {dayjs(nextPuzzle.date).format("MMM D")}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>

        {/* 鈹€鈹€ Sidebar 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€ */}
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
                View All Hints {"->"}
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




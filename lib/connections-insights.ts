import type { ConnectionsGroup, ConnectionsPuzzle } from "@/types/connections";

export type PuzzlePattern =
  | "fill-in-the-blank"
  | "wordplay"
  | "structured-set"
  | "category";

export type StudyPatternSlug =
  | "fill-in-the-blank"
  | "wordplay"
  | "common-traps";

const WORDPLAY_TOKENS = [
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
];

const STRUCTURED_SET_TOKENS = [
  "PARTS OF",
  "TYPES OF",
  "KINDS OF",
  "THINGS",
  "ITEMS",
  "SIGNS",
  "WAYS TO",
  "GROUP OF",
  "MEMBERS OF",
];

export function getGroupPattern(group: ConnectionsGroup): PuzzlePattern {
  const label = group.group.toUpperCase();

  if (label.includes("___") || label.includes("...")) {
    return "fill-in-the-blank";
  }

  if (WORDPLAY_TOKENS.some((token) => label.includes(token))) {
    return "wordplay";
  }

  if (STRUCTURED_SET_TOKENS.some((token) => label.includes(token))) {
    return "structured-set";
  }

  return "category";
}

export function getPuzzlePatterns(
  puzzleOrGroups: ConnectionsPuzzle | ConnectionsGroup[]
): PuzzlePattern[] {
  const groups = Array.isArray(puzzleOrGroups)
    ? puzzleOrGroups
    : puzzleOrGroups.answers;

  return [...new Set(groups.map(getGroupPattern))];
}

export function formatPatternLabel(pattern: PuzzlePattern): string {
  switch (pattern) {
    case "fill-in-the-blank":
      return "Fill in the Blank";
    case "wordplay":
      return "Wordplay";
    case "structured-set":
      return "Structured Set";
    default:
      return "Category Match";
  }
}

export function getPatternStudyLink(pattern: PuzzlePattern): {
  slug: StudyPatternSlug;
  label: string;
} | null {
  if (pattern === "fill-in-the-blank") {
    return { slug: "fill-in-the-blank", label: "Fill-in-the-Blank" };
  }

  if (pattern === "wordplay") {
    return { slug: "wordplay", label: "Wordplay" };
  }

  return null;
}

export function getSuggestedStudyLinks(
  puzzleOrGroups: ConnectionsPuzzle | ConnectionsGroup[]
) {
  const patterns = getPuzzlePatterns(puzzleOrGroups);
  const links = patterns
    .map(getPatternStudyLink)
    .filter(Boolean) as { slug: StudyPatternSlug; label: string }[];

  if (!links.some((link) => link.slug === "common-traps")) {
    links.push({ slug: "common-traps", label: "Common Traps" });
  }

  return links.slice(0, 3);
}

export function getPrimaryPuzzlePattern(
  puzzleOrGroups: ConnectionsPuzzle | ConnectionsGroup[]
): PuzzlePattern {
  const patterns = getPuzzlePatterns(puzzleOrGroups);

  if (patterns.includes("fill-in-the-blank")) {
    return "fill-in-the-blank";
  }

  if (patterns.includes("wordplay")) {
    return "wordplay";
  }

  if (patterns.includes("structured-set")) {
    return "structured-set";
  }

  return "category";
}

export function getPuzzleDifficultyScore(puzzle: ConnectionsPuzzle): number {
  const groups = [...puzzle.answers].sort((a, b) => a.level - b.level);
  let score = 0;

  for (const group of groups) {
    const pattern = getGroupPattern(group);

    if (pattern === "fill-in-the-blank") {
      score += 2.5;
    } else if (pattern === "wordplay") {
      score += 2.25;
    } else if (pattern === "structured-set") {
      score += 1.5;
    } else {
      score += 1;
    }

    if (group.level === 3 && pattern !== "category") {
      score += 0.75;
    }
  }

  const specialGroupCount = groups.filter(
    (group) => getGroupPattern(group) !== "category"
  ).length;

  if (specialGroupCount >= 2) {
    score += 0.75;
  }

  return Number(score.toFixed(2));
}

export function getPuzzleDifficultyNote(puzzle: ConnectionsPuzzle): string {
  const primaryPattern = getPrimaryPuzzlePattern(puzzle);

  if (primaryPattern === "fill-in-the-blank") {
    return "This board gets harder once you have to test words inside shared phrases instead of grouping them by topic.";
  }

  if (primaryPattern === "wordplay") {
    return "This board gets harder when the solve shifts from plain meaning to spelling, phrasing, or language structure.";
  }

  if (primaryPattern === "structured-set") {
    return "This board is manageable once the named sets become clear, but overlap can still make the middle of the solve sticky.";
  }

  return "This board is more about separating close thematic matches than decoding heavy wordplay.";
}

export function getMonthSummary(puzzles: ConnectionsPuzzle[]) {
  const patternCounts = new Map<PuzzlePattern, number>();

  for (const puzzle of puzzles) {
    for (const pattern of getPuzzlePatterns(puzzle)) {
      patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
    }
  }

  const topPatterns = [...patternCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([pattern, count]) => ({
      pattern,
      label: formatPatternLabel(pattern),
      count,
    }));

  const hardestPuzzles = [...puzzles]
    .sort((a, b) => getPuzzleDifficultyScore(b) - getPuzzleDifficultyScore(a))
    .slice(0, 3)
    .map((puzzle) => ({
      puzzle,
      score: getPuzzleDifficultyScore(puzzle),
      note: getPuzzleDifficultyNote(puzzle),
    }));

  return {
    count: puzzles.length,
    firstId: puzzles[puzzles.length - 1]?.id,
    lastId: puzzles[0]?.id,
    topPatterns,
    hardestPuzzles,
  };
}

export function getPuzzlesByPrimaryPattern(puzzles: ConnectionsPuzzle[]) {
  return puzzles.reduce(
    (acc, puzzle) => {
      const pattern = getPrimaryPuzzlePattern(puzzle);
      acc[pattern].push(puzzle);
      return acc;
    },
    {
      "fill-in-the-blank": [] as ConnectionsPuzzle[],
      wordplay: [] as ConnectionsPuzzle[],
      "structured-set": [] as ConnectionsPuzzle[],
      category: [] as ConnectionsPuzzle[],
    }
  );
}

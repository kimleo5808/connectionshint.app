"use client";

import type { ConnectionsGroup, ConnectionsPuzzle } from "@/types/connections";
import { useCallback, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Lightbulb,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SolverProps {
  puzzles: ConnectionsPuzzle[];
}

type HintLevel = 0 | 1 | 2 | 3; // 0=none, 1=vague, 2=category, 3=full

const LEVEL_COLORS = [
  { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", border: "border-yellow-300 dark:border-yellow-800", label: "Yellow (Easy)" },
  { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-300 dark:border-emerald-800", label: "Green (Moderate)" },
  { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-300 dark:border-blue-800", label: "Blue (Tricky)" },
  { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", border: "border-purple-300 dark:border-purple-800", label: "Purple (Hard)" },
];

/* ------------------------------------------------------------------ */
/*  Matching logic                                                     */
/* ------------------------------------------------------------------ */

function findMatchingPuzzle(
  words: string[],
  puzzles: ConnectionsPuzzle[]
): ConnectionsPuzzle | null {
  const inputSet = new Set(words.map((w) => w.toUpperCase().trim()));
  if (inputSet.size < 16) return null;

  for (const puzzle of puzzles) {
    const puzzleWords = new Set(
      puzzle.answers.flatMap((g) => g.members.map((m) => m.toUpperCase()))
    );

    // Count matches
    let matches = 0;
    for (const w of inputSet) {
      if (puzzleWords.has(w)) matches++;
    }

    // Allow some tolerance for typos (14/16 = 87.5%)
    if (matches >= 14) return puzzle;
  }

  return null;
}

function generateVagueHint(group: ConnectionsGroup): string {
  const members = group.members;
  // Give a vague hint using first letters
  const firstLetters = members
    .map((m) => m[0])
    .sort()
    .join(", ");
  return `This group's words start with the letters: ${firstLetters}`;
}

function generateMediumHint(group: ConnectionsGroup): string {
  const members = group.members;
  return `Two of the words in this group are: ${members[0]} and ${members[1]}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ConnectionsSolver({ puzzles }: SolverProps) {
  const [inputWords, setInputWords] = useState<string[]>(
    Array(16).fill("")
  );
  const [matchedPuzzle, setMatchedPuzzle] = useState<ConnectionsPuzzle | null>(
    null
  );
  const [hintLevels, setHintLevels] = useState<HintLevel[]>([0, 0, 0, 0]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleWordChange = useCallback((index: number, value: string) => {
    setInputWords((prev) => {
      const next = [...prev];
      next[index] = value.toUpperCase();
      return next;
    });
    setError(null);
    setHasSearched(false);
    setMatchedPuzzle(null);
    setHintLevels([0, 0, 0, 0]);
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent, index: number) => {
    const text = e.clipboardData.getData("text");
    // Check if pasting multiple words (comma or space separated)
    const words = text
      .split(/[,\n\t]+/)
      .map((w) => w.trim().toUpperCase())
      .filter(Boolean);

    if (words.length > 1) {
      e.preventDefault();
      setInputWords((prev) => {
        const next = [...prev];
        for (let i = 0; i < words.length && index + i < 16; i++) {
          next[index + i] = words[i];
        }
        return next;
      });
    }
  }, []);

  const handleSearch = useCallback(() => {
    const filledWords = inputWords.filter((w) => w.trim().length > 0);

    if (filledWords.length < 16) {
      setError(`Enter all 16 words. You have ${filledWords.length} so far.`);
      return;
    }

    const match = findMatchingPuzzle(filledWords, puzzles);
    setHasSearched(true);
    setMatchedPuzzle(match);
    setHintLevels([0, 0, 0, 0]);

    if (!match) {
      setError(
        "Could not match these words to a puzzle in our archive. Check for typos and try again."
      );
    } else {
      setError(null);
    }
  }, [inputWords, puzzles]);

  const handleRevealHint = useCallback((groupIndex: number) => {
    setHintLevels((prev) => {
      const next = [...prev] as HintLevel[];
      next[groupIndex] = Math.min(next[groupIndex] + 1, 3) as HintLevel;
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setInputWords(Array(16).fill(""));
    setMatchedPuzzle(null);
    setHintLevels([0, 0, 0, 0]);
    setError(null);
    setHasSearched(false);
  }, []);

  const handleFillToday = useCallback(() => {
    if (puzzles.length === 0) return;
    const latest = puzzles[0];
    const words = latest.answers.flatMap((g) => g.members);
    // Shuffle
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setInputWords(shuffled.map((w) => w.toUpperCase()));
    setError(null);
    setHasSearched(false);
    setMatchedPuzzle(null);
    setHintLevels([0, 0, 0, 0]);
  }, [puzzles]);

  const sortedGroups = matchedPuzzle
    ? [...matchedPuzzle.answers].sort((a, b) => a.level - b.level)
    : [];

  return (
    <div className="w-full space-y-6">
      {/* Word Input Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-foreground">
            Enter the 16 words from your puzzle
          </p>
          <button
            onClick={handleFillToday}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
          >
            Fill today&apos;s words →
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {inputWords.map((word, i) => (
            <input
              key={i}
              type="text"
              value={word}
              onChange={(e) => handleWordChange(i, e.target.value)}
              onPaste={(e) => handlePaste(e, i)}
              placeholder={`Word ${i + 1}`}
              className="rounded-lg border border-border bg-card px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-foreground placeholder:text-muted-foreground/40 placeholder:font-normal placeholder:normal-case focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30 transition-colors"
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Tip: Paste a comma-separated list into the first field to auto-fill
          all 16 words
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleSearch}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700"
        >
          <Search className="h-4 w-4" />
          Find My Puzzle
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-950/20">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Match Found */}
      {matchedPuzzle && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              <strong>Match found!</strong> This is Puzzle #{matchedPuzzle.id}{" "}
              from {matchedPuzzle.date}. Reveal hints below at your own pace.
            </p>
          </div>

          {/* Progressive Hints */}
          <div className="space-y-3">
            {sortedGroups.map((group, groupIdx) => {
              const level = hintLevels[groupIdx];
              const colors = LEVEL_COLORS[group.level];

              return (
                <div
                  key={group.level}
                  className={`rounded-xl border ${colors.border} overflow-hidden`}
                >
                  {/* Group header */}
                  <div
                    className={`flex items-center justify-between p-4 ${colors.bg}`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${colors.text} ${colors.bg}`}
                      >
                        {colors.label}
                      </span>
                      {level >= 3 && (
                        <span className={`text-sm font-bold ${colors.text}`}>
                          {group.group}
                        </span>
                      )}
                    </div>
                    {level < 3 ? (
                      <button
                        onClick={() => handleRevealHint(groupIdx)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-current/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/50 dark:hover:bg-black/20"
                      >
                        <Lightbulb className="h-3 w-3" />
                        {level === 0
                          ? "Show Hint"
                          : level === 1
                            ? "More Help"
                            : "Reveal Answer"}
                      </button>
                    ) : (
                      <Eye className={`h-4 w-4 ${colors.text}`} />
                    )}
                  </div>

                  {/* Hint content */}
                  {level >= 1 && (
                    <div className="p-4 bg-card space-y-2">
                      {/* Level 1: Vague hint */}
                      <div className="flex items-start gap-2">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground shrink-0">
                          Hint 1
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {generateVagueHint(group)}
                        </p>
                      </div>

                      {/* Level 2: Category name */}
                      {level >= 2 && (
                        <div className="flex items-start gap-2">
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground shrink-0">
                            Hint 2
                          </span>
                          <p className="text-sm text-foreground font-medium">
                            Category: &ldquo;{group.group}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Level 3: Full answer */}
                      {level >= 3 && (
                        <div className="flex items-start gap-2">
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground shrink-0">
                            Answer
                          </span>
                          <p className="text-sm text-foreground">
                            {group.members.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No match but searched */}
      {hasSearched && !matchedPuzzle && !error && (
        <div className="text-center text-sm text-muted-foreground">
          No matching puzzle found. Make sure all words are spelled correctly.
        </div>
      )}
    </div>
  );
}

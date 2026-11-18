"use client";

import { HintCardList } from "./HintCard";
import type { ConnectionsPuzzle } from "@/types/connections";
import { useCallback, useState } from "react";
import { AlertCircle, CheckCircle2, RotateCcw, Search } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SolverProps {
  puzzles: ConnectionsPuzzle[];
  today: string;
}

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

export default function ConnectionsSolver({ puzzles, today }: SolverProps) {
  const [inputWords, setInputWords] = useState<string[]>(
    Array(16).fill("")
  );
  const [matchedPuzzle, setMatchedPuzzle] = useState<ConnectionsPuzzle | null>(
    null
  );
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
      setError(null);
      setHasSearched(false);
      setMatchedPuzzle(null);
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

    if (!match) {
      setError(
        "Could not match these words to a puzzle in our archive. Check for typos and try again."
      );
    } else {
      setError(null);
    }
  }, [inputWords, puzzles]);

  const handleReset = useCallback(() => {
    setInputWords(Array(16).fill(""));
    setMatchedPuzzle(null);
    setError(null);
    setHasSearched(false);
  }, []);

  const current = puzzles.find(puzzle => puzzle.date === today);
  const handleFillToday = useCallback(() => {
    if (!current) return;
    const words = current.answers.flatMap((g) => g.members);
    // Shuffle
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setInputWords(shuffled.map((w) => w.toUpperCase()));
    setError(null);
    setHasSearched(false);
    setMatchedPuzzle(null);
  }, [current]);

  return (
    <div className="w-full space-y-6">
      {/* Word Input Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-foreground">
            Enter the 16 words from your puzzle
          </p>
          <button
            disabled={!current}
            onClick={handleFillToday}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
          >
            {current ? "Fill today's words →" : "Today's board is pending"}
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
              aria-label={`Word ${i + 1}`}
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

          <HintCardList date={matchedPuzzle.date} groups={matchedPuzzle.answers} />
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

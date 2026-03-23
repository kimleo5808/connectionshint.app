"use client";

import type { ConnectionsGroup, ConnectionsPuzzle } from "@/types/connections";
import { useCallback, useMemo, useState } from "react";
import ConnectionsGame from "./ConnectionsGame";
import { Dices, Flame, Sparkles, Target, Trophy, Zap } from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type PracticeDifficulty = "easy" | "medium" | "hard" | "random";

interface PracticeGameProps {
  /** All puzzles, newest-first, pre-sorted by the server */
  puzzles: ConnectionsPuzzle[];
}

/* ------------------------------------------------------------------ */
/*  Difficulty classification                                          */
/* ------------------------------------------------------------------ */

function classifyPuzzle(
  puzzle: ConnectionsPuzzle
): "easy" | "medium" | "hard" {
  const groups = puzzle.answers;
  // Simple heuristic: count non-category patterns
  let specialCount = 0;
  for (const group of groups) {
    const label = group.group.toUpperCase();
    if (label.includes("___") || label.includes("...")) {
      specialCount += 2;
    } else if (
      [
        "PALINDROME", "ANAGRAM", "HOMOPHONE", "RHYME", "PREFIX", "SUFFIX",
        "STARTS WITH", "ENDS WITH", "BEFORE", "AFTER", "HIDDEN", "SPELL",
        "LETTER", "ABBREVIATION",
      ].some((t) => label.includes(t))
    ) {
      specialCount += 2;
    } else if (
      ["PARTS OF", "TYPES OF", "KINDS OF", "THINGS"].some((t) =>
        label.includes(t)
      )
    ) {
      specialCount += 1;
    }
  }

  if (specialCount >= 3) return "hard";
  if (specialCount >= 1) return "medium";
  return "easy";
}

const DIFFICULTY_CONFIG = {
  easy: {
    label: "Easy",
    description: "Straightforward category matches — great for warm-ups",
    icon: Target,
    color: "border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/20",
    activeColor: "border-emerald-500 bg-emerald-100 ring-2 ring-emerald-500/30 dark:border-emerald-500 dark:bg-emerald-950/40",
    badge: "text-emerald-700 dark:text-emerald-400",
  },
  medium: {
    label: "Medium",
    description: "Some tricky overlaps and structural patterns mixed in",
    icon: Zap,
    color: "border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/20",
    activeColor: "border-amber-500 bg-amber-100 ring-2 ring-amber-500/30 dark:border-amber-500 dark:bg-amber-950/40",
    badge: "text-amber-700 dark:text-amber-400",
  },
  hard: {
    label: "Hard",
    description: "Wordplay, fill-in-the-blank, and purple-group pressure",
    icon: Flame,
    color: "border-red-300 bg-red-50/60 dark:border-red-800 dark:bg-red-950/20",
    activeColor: "border-red-500 bg-red-100 ring-2 ring-red-500/30 dark:border-red-500 dark:bg-red-950/40",
    badge: "text-red-700 dark:text-red-400",
  },
  random: {
    label: "Random",
    description: "Any puzzle from the full archive — test your real skill",
    icon: Dices,
    color: "border-blue-300 bg-blue-50/60 dark:border-blue-800 dark:bg-blue-950/20",
    activeColor: "border-blue-500 bg-blue-100 ring-2 ring-blue-500/30 dark:border-blue-500 dark:bg-blue-950/40",
    badge: "text-blue-700 dark:text-blue-400",
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PracticeGame({ puzzles }: PracticeGameProps) {
  const [difficulty, setDifficulty] = useState<PracticeDifficulty>("random");
  const [currentPuzzle, setCurrentPuzzle] = useState<ConnectionsPuzzle | null>(
    null
  );
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);

  // Classify all puzzles once
  const classified = useMemo(() => {
    const easy: ConnectionsPuzzle[] = [];
    const medium: ConnectionsPuzzle[] = [];
    const hard: ConnectionsPuzzle[] = [];

    for (const puzzle of puzzles) {
      const level = classifyPuzzle(puzzle);
      if (level === "easy") easy.push(puzzle);
      else if (level === "medium") medium.push(puzzle);
      else hard.push(puzzle);
    }

    return { easy, medium, hard, random: puzzles };
  }, [puzzles]);

  const pickRandom = useCallback(
    (diff: PracticeDifficulty) => {
      const pool = classified[diff];
      if (pool.length === 0) return;
      const idx = Math.floor(Math.random() * pool.length);
      setCurrentPuzzle(pool[idx]);
      setGamesPlayed((prev) => prev + 1);
    },
    [classified]
  );

  const handleStart = useCallback(
    (diff: PracticeDifficulty) => {
      setDifficulty(diff);
      pickRandom(diff);
    },
    [pickRandom]
  );

  const handleNextPuzzle = useCallback(() => {
    pickRandom(difficulty);
  }, [pickRandom, difficulty]);

  return (
    <div className="w-full">
      {/* Difficulty selector — shown when no puzzle is active */}
      {!currentPuzzle && (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              Object.entries(DIFFICULTY_CONFIG) as [
                PracticeDifficulty,
                (typeof DIFFICULTY_CONFIG)[PracticeDifficulty],
              ][]
            ).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => handleStart(key)}
                  className={`group rounded-xl border-2 p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${config.color}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${config.badge}`} />
                    <span
                      className={`font-heading text-base font-bold ${config.badge}`}
                    >
                      {config.label}
                    </span>
                    <span className="ml-auto rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground dark:bg-black/20">
                      {classified[key].length} puzzles
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {config.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Stats summary if they've played before */}
          {gamesPlayed > 0 && (
            <div className="flex items-center justify-center gap-6 rounded-xl border border-border bg-card p-4">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">
                  {gamesPlayed}
                </p>
                <p className="text-xs text-muted-foreground">Played</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {gamesWon}
                </p>
                <p className="text-xs text-muted-foreground">Won</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">
                  {gamesPlayed > 0
                    ? Math.round((gamesWon / gamesPlayed) * 100)
                    : 0}
                  %
                </p>
                <p className="text-xs text-muted-foreground">Win Rate</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active puzzle */}
      {currentPuzzle && (
        <div className="space-y-4">
          {/* Puzzle info bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${DIFFICULTY_CONFIG[difficulty].badge} bg-white/80 dark:bg-black/20 border border-current/10`}
              >
                {DIFFICULTY_CONFIG[difficulty].label}
              </span>
              <span className="text-sm text-muted-foreground">
                Puzzle #{currentPuzzle.id}
              </span>
            </div>
            <Link
              href={`/connections-hint/${currentPuzzle.date}`}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
            >
              View hints →
            </Link>
          </div>

          {/* Game */}
          <ConnectionsGame groups={currentPuzzle.answers} />

          {/* Controls below game */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleNextPuzzle}
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Skip to Next
            </button>
            <button
              onClick={() => setCurrentPuzzle(null)}
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Change Difficulty
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

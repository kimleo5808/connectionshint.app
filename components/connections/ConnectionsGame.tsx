"use client";

import type { ConnectionsGroup, ConnectionsLevel } from "@/types/connections";
import Link from "next/link";
import type { ReactNode } from "react";
import { colorCodes } from "@/lib/result-grid.mjs";
import { useCallback, useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORY_BG: Record<ConnectionsLevel, string> = {
  0: "bg-yellow-400 dark:bg-yellow-500",
  1: "bg-emerald-400 dark:bg-emerald-500",
  2: "bg-blue-400 dark:bg-blue-500",
  3: "bg-purple-400 dark:bg-purple-500",
};

const CATEGORY_TEXT: Record<ConnectionsLevel, string> = {
  0: "text-yellow-950",
  1: "text-emerald-950",
  2: "text-blue-950",
  3: "text-purple-950",
};

type GameStatus = "playing" | "won" | "lost";

interface WordTile {
  word: string;
  groupLevel: ConnectionsLevel;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface ConnectionsGameProps {
  groups: (ConnectionsGroup & { hint?: string; explanation?: string })[];
  learningMode?: boolean;
  customPuzzle?: boolean;
  mini?: boolean;
  completionNote?: string;
  renderTile?: (word: string) => ReactNode;
  renderProgress?: (rows: string[], restart: () => void) => ReactNode;
  onGuess?: (group: ConnectionsGroup | null, status: GameStatus) => void;
  onReplay?: () => void;
}

export default function ConnectionsGame({ groups, customPuzzle = false, mini = false, learningMode = false, completionNote, renderTile, renderProgress, onGuess, onReplay }: ConnectionsGameProps) {
  const groupSize = mini ? 3 : 4;
  const mistakeLimit = mini ? 3 : 4;
  // Build flat tile list once
  const allTiles = useMemo<WordTile[]>(() => {
    return groups.flatMap((g) =>
      g.members.map((word) => ({ word, groupLevel: g.level }))
    );
  }, [groups]);

  const [tiles, setTiles] = useState<WordTile[]>(() => customPuzzle
    ? shuffleArray(allTiles)
    : [...allTiles].sort((a, b) => a.word < b.word ? -1 : a.word > b.word ? 1 : 0));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [solvedLevels, setSolvedLevels] = useState<ConnectionsLevel[]>([]);
  const [mistakes, setMistakes] = useState(mistakeLimit);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [message, setMessage] = useState<{
    text: string;
    type: "correct" | "oneaway" | "wrong";
  } | null>(null);
  const [shaking, setShaking] = useState(false);
  const [guessHistory, setGuessHistory] = useState<{ key: string; row: string }[]>([]);
  const [seenOneAway, setSeenOneAway] = useState(false);
  const [hintStep, setHintStep] = useState(0);
  const hintGroup = learningMode ? groups.find(group => !solvedLevels.includes(group.level)) : undefined;

  // Sorted solved groups for display
  const solvedGroups = useMemo(
    () =>
      [...groups]
        .filter((g) => solvedLevels.includes(g.level))
        .sort((a, b) => a.level - b.level),
    [groups, solvedLevels]
  );

  // Remaining unsolved tiles
  const unsolvedTiles = useMemo(
    () => tiles.filter((t) => !solvedLevels.includes(t.groupLevel)),
    [tiles, solvedLevels]
  );

  // Clear message after delay
  useEffect(() => {
    if (!message || learningMode) return;
    const timer = setTimeout(() => setMessage(null), 2000);
    return () => clearTimeout(timer);
  }, [message, learningMode]);

  /* ---- Actions ---- */

  const handleTileClick = useCallback(
    (word: string) => {
      if (status !== "playing") return;
      if (learningMode) setMessage(null);
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(word)) {
          next.delete(word);
        } else if (next.size < groupSize) {
          next.add(word);
        }
        return next;
      });
    },
    [status, groupSize, learningMode]
  );

  const handleShuffle = useCallback(() => {
    setTiles((prev) => shuffleArray(prev));
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelected(new Set());
    if (learningMode) setMessage(null);
  }, [learningMode]);

  const handleSubmit = useCallback(() => {
    if (selected.size !== groupSize || status !== "playing") return;

    const selectedWords = [...selected];

    // Prevent duplicate guess
    const sortedGuess = JSON.stringify([...selectedWords].sort());
    if (guessHistory.some(guess => guess.key === sortedGuess)) {
      setMessage({ text: "Already guessed!", type: "wrong" });
      return;
    }
    const row = selectedWords.map(word => colorCodes[groups.find(g => g.members.includes(word))!.level]).join("");
    setGuessHistory((prev) => [...prev, { key: sortedGuess, row }]);

    // Check the submitted set against the board's groups.
    const matchedGroup = groups.find((g) =>
      selectedWords.every((w) => g.members.includes(w))
    );

    if (matchedGroup) {
      // Correct!
      const newSolved = [...solvedLevels, matchedGroup.level];
      setSolvedLevels(newSolved);
      if (matchedGroup === hintGroup) setHintStep(0);
      setSelected(new Set());
      setMessage({ text: "Correct!", type: "correct" });

      if (newSolved.length === groups.length) {
        setStatus("won");
      }
      onGuess?.(matchedGroup, newSolved.length === groups.length ? "won" : "playing");
    } else {
      // Wrong — check "one away"
      const oneAway = groups.some((g) => {
        const matchCount = selectedWords.filter((w) =>
          g.members.includes(w)
        ).length;
        return matchCount === groupSize - 1;
      });

      setShaking(true);
      setTimeout(() => setShaking(false), 600);

      if (oneAway) {
        setSeenOneAway(true);
        setMessage({ text: learningMode ? "Three fit together. Tap one to swap it." : "One away...", type: "oneaway" });
      } else {
        setMessage({ text: learningMode ? "Try another group. Tap any selected word to change it." : "Incorrect", type: "wrong" });
      }

      if (learningMode) {
        onGuess?.(null, "playing");
        return;
      }
      const newMistakes = mistakes - 1;
      setMistakes(newMistakes);
      setSelected(new Set());
      if (newMistakes <= 0) {
        // Reveal all remaining
        setSolvedLevels(groups.map(group => group.level));
        setStatus("lost");
      }
      onGuess?.(null, newMistakes <= 0 ? "lost" : "playing");
    }
  }, [selected, status, groups, solvedLevels, mistakes, guessHistory, groupSize, learningMode, hintGroup, onGuess]);

  const handlePlayAgain = useCallback(() => {
    setTiles(shuffleArray(allTiles));
    setSelected(new Set());
    setSolvedLevels([]);
    setMistakes(mistakeLimit);
    setStatus("playing");
    setMessage(null);
    setGuessHistory([]);
    setSeenOneAway(false);
    setHintStep(0);
  }, [allTiles, mistakeLimit]);

  /* ---- Render ---- */

  const messageColor =
    message?.type === "correct"
      ? "text-emerald-600 dark:text-emerald-400"
      : message?.type === "oneaway"
        ? "text-blue-600 dark:text-blue-400"
        : "text-red-500 dark:text-red-400";

  return (
    <div className="w-full max-w-lg mx-auto">
      {renderProgress?.(guessHistory.map(guess => guess.row), handlePlayAgain)}
      {/* Solved categories */}
      {solvedGroups.length > 0 && (
        <div className="space-y-2 mb-3">
          {solvedGroups.map((g) => (
            <div
              key={g.level}
              className={`rounded-lg p-3 text-center ${CATEGORY_BG[g.level]} animate-in slide-in-from-top-2 duration-300`}
            >
              <p
                className={`text-xs font-bold uppercase tracking-wider ${CATEGORY_TEXT[g.level]}`}
              >
                {g.group}
              </p>
              <p
                className={`mt-0.5 text-sm font-semibold ${CATEGORY_TEXT[g.level]} opacity-80`}
              >
                {g.members.join(", ")}
              </p>
              {learningMode && <p className={`mt-1 text-sm ${CATEGORY_TEXT[g.level]}`}>{g.explanation}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Word grid */}
      {unsolvedTiles.length > 0 && (
        <div
          className={`grid ${mini ? "grid-cols-3" : "grid-cols-4"} gap-2 ${shaking ? "animate-shake" : ""}`}
        >
          {unsolvedTiles.map((tile) => {
            const isSelected = selected.has(tile.word);
            return (
              <button
                key={tile.word}
                onClick={() => handleTileClick(tile.word)}
                aria-pressed={isSelected}
                disabled={status !== "playing"}
                className={`
                  rounded-lg px-1 py-3 text-center text-xs font-bold uppercase tracking-wide
                  transition-all duration-150 select-none cursor-pointer
                  sm:text-sm sm:py-4
                  ${
                    isSelected
                      ? "bg-slate-700 text-white scale-[0.97] dark:bg-slate-200 dark:text-slate-900"
                      : "bg-stone-200 text-stone-800 hover:bg-stone-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                  }
                  disabled:cursor-default disabled:opacity-60
                `}
              >
                {renderTile ? renderTile(tile.word) : tile.word}
              </button>
            );
          })}
        </div>
      )}

      {/* Mistakes remaining */}
      {!learningMode && <div className="mt-4 flex items-center justify-center gap-1.5">
        <span className="text-xs text-muted-foreground mr-1">
          Mistakes remaining:
          <span className="sr-only"> {mistakes}</span>
        </span>
        {Array.from({ length: mistakeLimit }).map((_, i) => (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i < mistakes
                ? "bg-slate-700 dark:bg-slate-200"
                : "bg-slate-300 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>}

      {/* Status message */}
      {message && (
        <p role="status"
          className={`mt-3 text-center text-sm font-bold ${messageColor} animate-in fade-in duration-200`}
        >
          {message.text}
        </p>
      )}

      {/* Controls */}
      {seenOneAway && !mini && !learningMode && <p className="mt-2 text-center text-sm"><Link className="text-primary underline underline-offset-4" href="/guides/connections-one-away">How to read a One Away guess</Link></p>}
      {status === "playing" && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={handleShuffle}
            className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Shuffle
          </button>
          <button
            onClick={handleDeselectAll}
            disabled={selected.size === 0}
            className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-default"
          >
            {learningMode ? "Clear" : "Deselect All"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={selected.size !== groupSize}
            className="rounded-full bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-40 disabled:cursor-default dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {learningMode ? "Check group" : "Submit"}
          </button>
        </div>
      )}
      {hintGroup && <div className="mt-3 border-t border-border pt-2 text-sm">
        {hintStep < 2 && <button type="button" className="min-h-11 font-semibold text-primary underline underline-offset-4"
          onClick={() => setHintStep(step => Math.min(2, step + 1))}>{hintStep ? "Show two starter words" : "Give me a hint"}</button>}
        <div aria-live="polite">{hintStep >= 1 && <p>{hintGroup.hint}</p>}
          {hintStep === 2 && <p className="mt-1">Start with <strong>{hintGroup.members[0]}</strong> and <strong>{hintGroup.members[1]}</strong>.</p>}
        </div>
      </div>}

      {/* Win / Loss overlay */}
      {(status === "won" || status === "lost") && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6 text-center shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="font-heading text-lg font-bold text-foreground">
            {status === "won" ? "Congratulations!" : "Better Luck Next Time!"}
          </h3>
          {status === "won" && !learningMode && (
            <p className="mt-1 text-sm text-muted-foreground">
              You solved it with {mistakes} mistake
              {mistakes !== 1 ? "s" : ""} remaining!
            </p>
          )}
          {status === "lost" && !completionNote && (
            <p className="mt-1 text-sm text-muted-foreground">
              {customPuzzle ? "Read the four groups above, then replay the board to try the connections again." : "Check the hints below for strategy tips!"}
            </p>
          )}
          {completionNote && <p className="mx-auto mt-2 max-w-prose text-sm leading-relaxed">{completionNote}</p>}
          <button
            onClick={onReplay ?? handlePlayAgain}
            className="mt-4 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700"
          >
            Play Again
          </button>
          {!mini && !learningMode && <Link className="ml-3 inline-block py-2 text-sm text-primary underline underline-offset-4"
            href={"/connections-results#grid=" + guessHistory.map(guess => guess.row).join(".")}>
            Read my result grid
          </Link>}
        </div>
      )}

      {/* Shake animation style */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-4px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

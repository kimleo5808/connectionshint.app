"use client";

import type { ConnectionsGroup, ConnectionsLevel } from "@/types/connections";
import { useCallback, useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const MAX_MISTAKES = 4;
const MAX_SELECTION = 4;

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
  groups: ConnectionsGroup[];
}

export default function ConnectionsGame({ groups }: ConnectionsGameProps) {
  // Build flat tile list once
  const allTiles = useMemo<WordTile[]>(() => {
    return groups.flatMap((g) =>
      g.members.map((word) => ({ word, groupLevel: g.level }))
    );
  }, [groups]);

  const [tiles, setTiles] = useState<WordTile[]>(() => shuffleArray(allTiles));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [solvedLevels, setSolvedLevels] = useState<ConnectionsLevel[]>([]);
  const [mistakes, setMistakes] = useState(MAX_MISTAKES);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [message, setMessage] = useState<{
    text: string;
    type: "correct" | "oneaway" | "wrong";
  } | null>(null);
  const [shaking, setShaking] = useState(false);
  const [guessHistory, setGuessHistory] = useState<string[]>([]);

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
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  /* ---- Actions ---- */

  const handleTileClick = useCallback(
    (word: string) => {
      if (status !== "playing") return;
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(word)) {
          next.delete(word);
        } else if (next.size < MAX_SELECTION) {
          next.add(word);
        }
        return next;
      });
    },
    [status]
  );

  const handleShuffle = useCallback(() => {
    setTiles((prev) => shuffleArray(prev));
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  const handleSubmit = useCallback(() => {
    if (selected.size !== MAX_SELECTION || status !== "playing") return;

    const selectedWords = [...selected];

    // Prevent duplicate guess
    const sortedGuess = [...selectedWords].sort().join(",");
    if (guessHistory.includes(sortedGuess)) {
      setMessage({ text: "Already guessed!", type: "wrong" });
      return;
    }
    setGuessHistory((prev) => [...prev, sortedGuess]);

    // Check if all 4 words belong to same group
    const matchedGroup = groups.find((g) =>
      selectedWords.every((w) => g.members.includes(w))
    );

    if (matchedGroup) {
      // Correct!
      const newSolved = [...solvedLevels, matchedGroup.level];
      setSolvedLevels(newSolved);
      setSelected(new Set());
      setMessage({ text: "Correct!", type: "correct" });

      if (newSolved.length === 4) {
        setStatus("won");
      }
    } else {
      // Wrong — check "one away"
      const oneAway = groups.some((g) => {
        const matchCount = selectedWords.filter((w) =>
          g.members.includes(w)
        ).length;
        return matchCount === 3;
      });

      setShaking(true);
      setTimeout(() => setShaking(false), 600);

      const newMistakes = mistakes - 1;
      setMistakes(newMistakes);
      setSelected(new Set());

      if (oneAway) {
        setMessage({ text: "One away...", type: "oneaway" });
      } else {
        setMessage({ text: "Incorrect", type: "wrong" });
      }

      if (newMistakes <= 0) {
        // Reveal all remaining
        setTimeout(() => {
          setSolvedLevels([0, 1, 2, 3]);
          setStatus("lost");
        }, 800);
      }
    }
  }, [selected, status, groups, solvedLevels, mistakes, guessHistory]);

  const handlePlayAgain = useCallback(() => {
    setTiles(shuffleArray(allTiles));
    setSelected(new Set());
    setSolvedLevels([]);
    setMistakes(MAX_MISTAKES);
    setStatus("playing");
    setMessage(null);
    setGuessHistory([]);
  }, [allTiles]);

  /* ---- Render ---- */

  const messageColor =
    message?.type === "correct"
      ? "text-emerald-600 dark:text-emerald-400"
      : message?.type === "oneaway"
        ? "text-blue-600 dark:text-blue-400"
        : "text-red-500 dark:text-red-400";

  return (
    <div className="w-full max-w-lg mx-auto">
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
            </div>
          ))}
        </div>
      )}

      {/* Word grid */}
      {unsolvedTiles.length > 0 && (
        <div
          className={`grid grid-cols-4 gap-2 ${shaking ? "animate-shake" : ""}`}
        >
          {unsolvedTiles.map((tile) => {
            const isSelected = selected.has(tile.word);
            return (
              <button
                key={tile.word}
                onClick={() => handleTileClick(tile.word)}
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
                {tile.word}
              </button>
            );
          })}
        </div>
      )}

      {/* Mistakes remaining */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        <span className="text-xs text-muted-foreground mr-1">
          Mistakes remaining:
        </span>
        {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i < mistakes
                ? "bg-slate-700 dark:bg-slate-200"
                : "bg-slate-300 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>

      {/* Status message */}
      {message && (
        <p
          className={`mt-3 text-center text-sm font-bold ${messageColor} animate-in fade-in duration-200`}
        >
          {message.text}
        </p>
      )}

      {/* Controls */}
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
            Deselect All
          </button>
          <button
            onClick={handleSubmit}
            disabled={selected.size !== MAX_SELECTION}
            className="rounded-full bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-40 disabled:cursor-default dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Submit
          </button>
        </div>
      )}

      {/* Win / Loss overlay */}
      {(status === "won" || status === "lost") && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6 text-center shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="font-heading text-lg font-bold text-foreground">
            {status === "won" ? "Congratulations!" : "Better Luck Next Time!"}
          </h3>
          {status === "won" && (
            <p className="mt-1 text-sm text-muted-foreground">
              You solved it with {mistakes} mistake
              {mistakes !== 1 ? "s" : ""} remaining!
            </p>
          )}
          {status === "lost" && (
            <p className="mt-1 text-sm text-muted-foreground">
              Don&apos;t worry — check the hints below for strategy tips!
            </p>
          )}
          <button
            onClick={handlePlayAgain}
            className="mt-4 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700"
          >
            Play Again
          </button>
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

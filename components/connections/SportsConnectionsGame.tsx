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

interface SportsConnectionsGameProps {
  groups: ConnectionsGroup[];
}

export default function SportsConnectionsGame({
  groups,
}: SportsConnectionsGameProps) {
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

  const solvedGroups = useMemo(
    () =>
      [...groups]
        .filter((g) => solvedLevels.includes(g.level))
        .sort((a, b) => a.level - b.level),
    [groups, solvedLevels]
  );

  const unsolvedTiles = useMemo(
    () => tiles.filter((t) => !solvedLevels.includes(t.groupLevel)),
    [tiles, solvedLevels]
  );

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 2000);
    return () => clearTimeout(timer);
  }, [message]);

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
    const sortedGuess = [...selectedWords].sort().join(",");
    if (guessHistory.includes(sortedGuess)) {
      setMessage({ text: "Already guessed!", type: "wrong" });
      return;
    }
    setGuessHistory((prev) => [...prev, sortedGuess]);

    const matchedGroup = groups.find((g) =>
      selectedWords.every((w) => g.members.includes(w))
    );

    if (matchedGroup) {
      const newSolved = [...solvedLevels, matchedGroup.level];
      setSolvedLevels(newSolved);
      setSelected(new Set());
      setMessage({ text: "Correct!", type: "correct" });
      if (newSolved.length === 4) setStatus("won");
    } else {
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

  const messageColor =
    message?.type === "correct"
      ? "text-emerald-400"
      : message?.type === "oneaway"
        ? "text-blue-400"
        : "text-red-400";

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

      {/* Word grid — circular dark tiles */}
      {unsolvedTiles.length > 0 && (
        <div
          className={`grid grid-cols-4 gap-2.5 ${shaking ? "animate-shake" : ""}`}
        >
          {unsolvedTiles.map((tile) => {
            const isSelected = selected.has(tile.word);
            return (
              <button
                key={tile.word}
                onClick={() => handleTileClick(tile.word)}
                disabled={status !== "playing"}
                className={`
                  aspect-square rounded-full flex items-center justify-center
                  text-center text-[10px] font-bold uppercase tracking-wide leading-tight
                  transition-all duration-150 select-none cursor-pointer
                  sm:text-xs
                  ${
                    isSelected
                      ? "bg-slate-500 text-white scale-[0.95] ring-2 ring-white/40"
                      : "bg-slate-700 text-slate-100 hover:bg-slate-600"
                  }
                  disabled:cursor-default disabled:opacity-60
                `}
              >
                <span className="px-1">{tile.word}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mistakes remaining */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        <span className="text-xs text-slate-400 mr-1">
          Mistakes remaining:
        </span>
        {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i < mistakes ? "bg-slate-200" : "bg-slate-600"
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
            className="rounded-full border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700"
          >
            Shuffle
          </button>
          <button
            onClick={handleDeselectAll}
            disabled={selected.size === 0}
            className="rounded-full border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700 disabled:opacity-40 disabled:cursor-default"
          >
            Deselect
          </button>
          <button
            onClick={handleSubmit}
            disabled={selected.size !== MAX_SELECTION}
            className="rounded-full bg-slate-200 px-5 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-white disabled:opacity-40 disabled:cursor-default"
          >
            Submit
          </button>
        </div>
      )}

      {/* Win / Loss */}
      {(status === "won" || status === "lost") && (
        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/80 p-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h3 className="font-heading text-lg font-bold text-white">
            {status === "won" ? "Congratulations!" : "Better Luck Next Time!"}
          </h3>
          {status === "won" && (
            <p className="mt-1 text-sm text-slate-300">
              You solved it with {mistakes} mistake
              {mistakes !== 1 ? "s" : ""} remaining!
            </p>
          )}
          {status === "lost" && (
            <p className="mt-1 text-sm text-slate-300">
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

      {/* Shake animation */}
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

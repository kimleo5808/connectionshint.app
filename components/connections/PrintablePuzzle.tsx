"use client";

import type { ConnectionsPuzzle } from "@/types/connections";
import { Printer } from "lucide-react";
import { useCallback, useState } from "react";

interface PrintablePuzzleProps {
  puzzles: ConnectionsPuzzle[];
}

type PrintMode = "puzzle-only" | "with-hints" | "with-answers";

export default function PrintablePuzzle({ puzzles }: PrintablePuzzleProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [printMode, setPrintMode] = useState<PrintMode>("puzzle-only");

  const puzzle = puzzles[selectedIndex];
  if (!puzzle) return null;

  const allWords = puzzle.answers.flatMap((g) => g.members).sort();
  // Shuffle deterministically by puzzle id
  const shuffled = [...allWords].sort(
    (a, b) => ((a.charCodeAt(0) * puzzle.id) % 17) - ((b.charCodeAt(0) * puzzle.id) % 17)
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Select Puzzle
          </label>
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
          >
            {puzzles.map((p, i) => (
              <option key={p.id} value={i}>
                Puzzle #{p.id} — {p.date}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Print Format
          </label>
          <select
            value={printMode}
            onChange={(e) => setPrintMode(e.target.value as PrintMode)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
          >
            <option value="puzzle-only">Puzzle Only (No Answers)</option>
            <option value="with-hints">Puzzle with Category Hints</option>
            <option value="with-answers">Puzzle with Full Answers</option>
          </select>
        </div>
        <div className="pt-4">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      {/* Printable Preview */}
      <div
        id="printable-area"
        className="rounded-xl border border-border bg-white p-6 dark:bg-card print:border-none print:p-0 print:shadow-none"
      >
        {/* Header */}
        <div className="text-center mb-6 print:mb-8">
          <h2 className="text-xl font-bold text-foreground print:text-black">
            NYT Connections — Puzzle #{puzzle.id}
          </h2>
          <p className="text-sm text-muted-foreground print:text-gray-600">
            {puzzle.date} • connectionshint.app
          </p>
        </div>

        {/* Word Grid */}
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto mb-6">
          {shuffled.map((word) => (
            <div
              key={word}
              className="rounded-lg bg-stone-200 p-3 text-center text-xs font-bold uppercase tracking-wide text-stone-800 print:border print:border-gray-300 print:bg-gray-100"
            >
              {word}
            </div>
          ))}
        </div>

        {/* Hints (if mode selected) */}
        {printMode === "with-hints" && (
          <div className="mt-6 border-t border-border pt-4 print:border-gray-300">
            <h3 className="text-sm font-bold text-foreground mb-3 print:text-black">
              Category Hints
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {puzzle.answers
                .sort((a, b) => a.level - b.level)
                .map((group) => {
                  const colors = ["Yellow", "Green", "Blue", "Purple"];
                  return (
                    <div
                      key={group.level}
                      className="rounded-lg border border-border p-3 print:border-gray-300"
                    >
                      <p className="text-xs font-bold text-muted-foreground">
                        {colors[group.level]} Group
                      </p>
                      <p className="text-sm font-medium text-foreground mt-1">
                        Hint: Think about &ldquo;{group.group.split(" ")[0]}...&rdquo;
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Full Answers (if mode selected) */}
        {printMode === "with-answers" && (
          <div className="mt-6 border-t border-border pt-4 print:border-gray-300">
            <h3 className="text-sm font-bold text-foreground mb-3 print:text-black">
              Answers
            </h3>
            <div className="space-y-2">
              {puzzle.answers
                .sort((a, b) => a.level - b.level)
                .map((group) => {
                  const colors = ["🟡", "🟢", "🔵", "🟣"];
                  return (
                    <div
                      key={group.level}
                      className="rounded-lg border border-border p-3 print:border-gray-300"
                    >
                      <p className="text-sm font-bold text-foreground">
                        {colors[group.level]} {group.group}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {group.members.join(", ")}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body > *:not(#printable-area) {
            display: none !important;
          }
          header, footer, nav, aside {
            display: none !important;
          }
          .grid-bg {
            background: none !important;
          }
          #printable-area {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

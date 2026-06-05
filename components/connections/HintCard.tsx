"use client";

import type { ConnectionsGroup } from "@/types/connections";
import { LEVEL_LABELS } from "@/types/connections";
import { ChevronDown, Eye, EyeOff, Lightbulb } from "lucide-react";
import { useState } from "react";

const COLOR_STYLES: Record<
  number,
  { badge: string; border: string; hoverBg: string; dot: string }
> = {
  0: {
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    border: "border-yellow-200 dark:border-yellow-800/40",
    hoverBg: "hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10",
    dot: "bg-yellow-400",
  },
  1: {
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800/40",
    hoverBg: "hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10",
    dot: "bg-emerald-500",
  },
  2: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800/40",
    hoverBg: "hover:bg-blue-50/50 dark:hover:bg-blue-900/10",
    dot: "bg-blue-400",
  },
  3: {
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800/40",
    hoverBg: "hover:bg-purple-50/50 dark:hover:bg-purple-900/10",
    dot: "bg-purple-500",
  },
};

/** Difficulty-based framing that nudges toward the theme without naming it */
const LEVEL_DIRECTION: Record<number, string> = {
  0: "the most direct group on the board, with a clear and literal theme",
  1: "a fairly direct group, though a word or two may look like it belongs elsewhere",
  2: "a trickier group where the real link is easy to confuse with a decoy",
  3: "the hardest group, so expect a less literal or more lateral connection",
};

/**
 * Generate progressive hints that reveal in true layers:
 *  1. Direction only — frame the theme without naming it or any word
 *  2. The category name
 *  3. A single example word
 * The full answer is revealed separately after these three layers.
 */
function generateHints(group: ConnectionsGroup): string[] {
  const { members, group: categoryName } = group;
  const label = categoryName.toUpperCase();

  const isBlank = label.includes("___") || label.includes("...");
  const isWordplay =
    /PALINDROME|ANAGRAM|HOMOPHONE|RHYME|PREFIX|SUFFIX|STARTS WITH|ENDS WITH|BEGINNING WITH|ENDING WITH|HIDDEN|SPELL|LETTER|INITIAL|ABBREVIATION/.test(
      label
    );

  const direction = LEVEL_DIRECTION[group.level] ?? LEVEL_DIRECTION[0];
  const hint1 = isBlank
    ? `These four words all complete the same common phrase. This is ${direction}.`
    : isWordplay
      ? `Focus on how these words are built or spelled, not just what they mean. This is ${direction}.`
      : `This is ${direction}. Try to name the theme yourself before revealing it.`;

  const hint2 = `The connection is "${categoryName}". Now work out which four words fit.`;
  const hint3 = `One of the words in this group is "${members[0]}". Can you find the other three?`;

  return [hint1, hint2, hint3];
}

interface HintCardProps {
  group: ConnectionsGroup;
  defaultExpanded?: boolean;
}

export function HintCard({ group, defaultExpanded = false }: HintCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [revealLevel, setRevealLevel] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const style = COLOR_STYLES[group.level] || COLOR_STYLES[0];
  const hints = generateHints(group);
  const levelLabel = LEVEL_LABELS[group.level] || "Unknown";

  return (
    <div className={`rounded-xl border ${style.border} bg-card overflow-hidden transition-shadow hover:shadow-md`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors ${style.hoverBg}`}
      >
        <div className="flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full ${style.dot}`} />
          <div>
            <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ${style.badge}`}>
              {levelLabel}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Hint content */}
      {expanded && (
        <div className="border-t border-border px-5 pb-5 pt-4 space-y-3">
          {hints.map((hint, i) => (
            <div key={i}>
              {i < revealLevel ? (
                <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <p className="text-sm leading-relaxed text-foreground">
                    {hint}
                  </p>
                </div>
              ) : i === revealLevel ? (
                <button
                  onClick={() => setRevealLevel(revealLevel + 1)}
                  className="flex w-full items-center gap-2 rounded-lg border border-dashed border-muted-foreground/30 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400"
                >
                  <Eye className="h-4 w-4" />
                  Reveal Hint {i + 1} of 3
                </button>
              ) : null}
            </div>
          ))}

          {/* Answer reveal */}
          {revealLevel >= 3 && (
            <div className="mt-2 pt-2 border-t border-border">
              {showAnswer ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Full Answer
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {group.group}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.members.map((word) => (
                      <span
                        key={word}
                        className={`rounded-md px-2 py-1 text-xs font-mono font-bold ${style.badge}`}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <EyeOff className="h-4 w-4" />
                  Show Full Answer
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface HintCardListProps {
  groups: ConnectionsGroup[];
}

export function HintCardList({ groups }: HintCardListProps) {
  const sorted = [...groups].sort((a, b) => a.level - b.level);
  return (
    <div className="space-y-3">
      {sorted.map((group) => (
        <HintCard key={group.level} group={group} />
      ))}
    </div>
  );
}

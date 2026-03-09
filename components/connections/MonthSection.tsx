"use client";

import type { ConnectionsPuzzle } from "@/types/connections";
import dayjs from "dayjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface MonthSectionProps {
  month: string;
  puzzles: ConnectionsPuzzle[];
  latestId?: number;
}

export function MonthSection({ month, puzzles, latestId }: MonthSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const monthLabel = dayjs(`${month}-01`).format("MMMM YYYY");
  const monthPath = `/connections-hint/${month.slice(0, 4)}/${month.slice(5, 7)}`;
  const firstId = puzzles[puzzles.length - 1]?.id;
  const lastId = puzzles[0]?.id;

  const displayed = showAll ? puzzles : puzzles.slice(0, 6);
  const hasMore = puzzles.length > 6;

  return (
    <section>
      <div className="mb-6 text-center">
        <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
          Connections #{firstId}-{lastId} Hints ({monthLabel})
        </h2>
        <Link
          href={monthPath}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Open Month Review
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((puzzle) => {
          const sorted = [...puzzle.answers].sort((a, b) => a.level - b.level);
          const isLatest = puzzle.id === latestId;

          return (
            <Link
              key={puzzle.date}
              href={`/connections-hint/${puzzle.date}`}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:hover:border-blue-700"
            >
              <div className="flex items-center gap-2">
                <span className="inline-block rounded-md bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                  Puzzle #{puzzle.id}
                </span>
                {isLatest && (
                  <span className="inline-block rounded-md bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">
                    Latest
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-sm font-bold text-foreground">
                Connections #{puzzle.id} — {sorted.map((g) => g.members[0]).join(", ")}...
              </h3>

              <div className="mt-2 space-y-1">
                {sorted.slice(0, 2).map((g) => (
                  <p key={g.level} className="truncate text-xs text-muted-foreground">
                    {g.members.join(", ")}
                  </p>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {dayjs(puzzle.date).format("YYYY-MM-DD")}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:text-blue-700 dark:text-blue-400">
                  Read Analysis
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && !showAll && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-600 px-6 py-2 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-600 hover:text-white dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white"
          >
            Show More
          </button>
        </div>
      )}
    </section>
  );
}

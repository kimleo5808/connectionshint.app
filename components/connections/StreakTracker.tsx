"use client";

import {
  Calendar,
  CheckCircle2,
  Flame,
  Minus,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types & Helpers                                                    */
/* ------------------------------------------------------------------ */

type DayResult = "perfect" | "win" | "loss" | null;

interface StreakData {
  results: Record<string, DayResult>; // date -> result
}

const STORAGE_KEY = "connections-streak-data";

function loadData(): StreakData {
  if (typeof window === "undefined") return { results: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { results: {} };
    return JSON.parse(raw) as StreakData;
  } catch {
    return { results: {} };
  }
}

function saveData(data: StreakData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function StreakTracker() {
  const [data, setData] = useState<StreakData>({ results: {} });
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // Load from localStorage on mount
  useEffect(() => {
    setData(loadData());
    setMounted(true);
  }, []);

  const handleDayClick = useCallback(
    (dateStr: string) => {
      setData((prev) => {
        const current = prev.results[dateStr];
        let next: DayResult;

        // Cycle: null -> perfect -> win -> loss -> null
        if (current === null || current === undefined) next = "perfect";
        else if (current === "perfect") next = "win";
        else if (current === "win") next = "loss";
        else next = null;

        const updated = {
          ...prev,
          results: { ...prev.results, [dateStr]: next },
        };

        // Clean up nulls
        if (next === null) {
          delete updated.results[dateStr];
        }

        saveData(updated);
        return updated;
      });
    },
    []
  );

  const handleReset = useCallback(() => {
    setData({ results: {} });
    saveData({ results: {} });
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    const entries = Object.entries(data.results).filter(
      ([, v]) => v !== null
    );
    const total = entries.length;
    const wins = entries.filter(([, v]) => v === "perfect" || v === "win").length;
    const perfect = entries.filter(([, v]) => v === "perfect").length;
    const losses = entries.filter(([, v]) => v === "loss").length;

    // Current streak
    let currentStreak = 0;
    const sortedDates = entries
      .filter(([, v]) => v === "perfect" || v === "win")
      .map(([d]) => d)
      .sort()
      .reverse();

    if (sortedDates.length > 0) {
      const today = formatDate(new Date());
      // Check if latest entry is today or yesterday
      const latest = sortedDates[0];
      const latestDate = new Date(latest);
      const todayDate = new Date(today);
      const diffDays = Math.floor(
        (todayDate.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 1) {
        currentStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const prev = new Date(sortedDates[i - 1]);
          const curr = new Date(sortedDates[i]);
          const gap = Math.floor(
            (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (gap === 1) currentStreak++;
          else break;
        }
      }
    }

    // Longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const allSorted = entries
      .filter(([, v]) => v === "perfect" || v === "win")
      .map(([d]) => d)
      .sort();

    for (let i = 0; i < allSorted.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(allSorted[i - 1]);
        const curr = new Date(allSorted[i]);
        const gap = Math.floor(
          (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (gap === 1) tempStreak++;
        else tempStreak = 1;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return {
      total,
      wins,
      perfect,
      losses,
      winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
      perfectRate: total > 0 ? Math.round((perfect / total) * 100) : 0,
      currentStreak,
      longestStreak,
    };
  }, [data]);

  // Calendar grid
  const daysInMonth = getDaysInMonth(currentMonth.year, currentMonth.month);
  const firstDay = getFirstDayOfMonth(currentMonth.year, currentMonth.month);
  const today = mounted ? formatDate(new Date()) : "";

  const calendarDays: (string | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(
      formatDate(new Date(currentMonth.year, currentMonth.month, d))
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Flame className="h-5 w-5 text-orange-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">
            {stats.currentStreak}
          </p>
          <p className="text-xs text-muted-foreground">Current Streak</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Trophy className="h-5 w-5 text-amber-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">
            {stats.longestStreak}
          </p>
          <p className="text-xs text-muted-foreground">Longest Streak</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">
            {stats.winRate}%
          </p>
          <p className="text-xs text-muted-foreground">Win Rate</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Calendar className="h-5 w-5 text-blue-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Days Tracked</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-xl border border-border bg-card p-5">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrevMonth}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            ←
          </button>
          <h3 className="font-heading text-base font-bold text-foreground">
            {MONTH_NAMES[currentMonth.month]} {currentMonth.year}
          </h3>
          <button
            onClick={handleNextMonth}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            →
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_LABELS.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dateStr, i) => {
            if (!dateStr) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }

            const result = data.results[dateStr] || null;
            const isToday = dateStr === today;
            const dayNum = new Date(dateStr).getDate();

            let bgClass = "bg-muted/30 hover:bg-muted/60";
            let textClass = "text-foreground";

            if (result === "perfect") {
              bgClass = "bg-emerald-100 dark:bg-emerald-900/30";
              textClass = "text-emerald-700 dark:text-emerald-300";
            } else if (result === "win") {
              bgClass = "bg-blue-100 dark:bg-blue-900/30";
              textClass = "text-blue-700 dark:text-blue-300";
            } else if (result === "loss") {
              bgClass = "bg-red-100 dark:bg-red-900/30";
              textClass = "text-red-700 dark:text-red-300";
            }

            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(dateStr)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-colors cursor-pointer ${bgClass} ${
                  isToday ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <span className={textClass}>{dayNum}</span>
                {result === "perfect" && (
                  <span className="text-[10px]">⭐</span>
                )}
                {result === "win" && (
                  <span className="text-[10px]">✓</span>
                )}
                {result === "loss" && (
                  <span className="text-[10px]">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-emerald-100 dark:bg-emerald-900/30" />
            Perfect (0 mistakes)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-blue-100 dark:bg-blue-900/30" />
            Win (1+ mistakes)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-red-100 dark:bg-red-900/30" />
            Loss
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-muted/50" />
            Not tracked
          </span>
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Click any day to cycle through: Perfect → Win → Loss → Clear
        </p>
      </div>

      {/* Detailed Stats */}
      {stats.total > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-100 bg-card p-4 dark:border-emerald-900/30">
            <p className="text-sm font-medium text-foreground">
              Perfect Games
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.perfect}
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.perfectRate}% of all games
            </p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-card p-4 dark:border-blue-900/30">
            <p className="text-sm font-medium text-foreground">Total Wins</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.wins}
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.winRate}% win rate
            </p>
          </div>
          <div className="rounded-xl border border-red-100 bg-card p-4 dark:border-red-900/30">
            <p className="text-sm font-medium text-foreground">Losses</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.losses}
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? Math.round((stats.losses / stats.total) * 100)
                : 0}
              % loss rate
            </p>
          </div>
        </div>
      )}

      {/* Reset */}
      {stats.total > 0 && (
        <div className="text-center">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset All Data
          </button>
        </div>
      )}
    </div>
  );
}

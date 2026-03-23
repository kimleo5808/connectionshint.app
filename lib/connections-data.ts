import type { ConnectionsPuzzle } from "@/types/connections";
import { getKV } from "@/lib/kv";
import { cache } from "react";

/**
 * Lightweight index stored in KV under "meta:index"
 */
interface PuzzleIndex {
  lastUpdated: string;
  count: number;
  latestDate: string;
  dates: string[]; // newest-first
  months: string[]; // newest-first
}

// ── Static JSON fallback for build time ──────────────────────────────

import puzzlesData from "@/data/connections/puzzles.json";
import type { ConnectionsDataFile } from "@/types/connections";

const staticData = puzzlesData as ConnectionsDataFile;

// ── Data access functions ────────────────────────────────────────────

/** Fetch the lightweight index from KV */
const getIndex = cache(async (): Promise<PuzzleIndex | null> => {
  const kv = await getKV();
  if (!kv) return null;
  return kv.get<PuzzleIndex>("meta:index", "json");
});

/** Get a puzzle by its date string (YYYY-MM-DD) */
export const getPuzzleByDate = cache(
  async (date: string): Promise<ConnectionsPuzzle | undefined> => {
    const kv = await getKV();
    if (!kv) {
      return staticData.puzzles.find((p) => p.date === date);
    }
    const puzzle = await kv.get<ConnectionsPuzzle>(
      `puzzle:date:${date}`,
      "json"
    );
    return puzzle ?? undefined;
  }
);

/** Get a puzzle by its numeric id */
export const getPuzzleById = cache(
  async (id: number): Promise<ConnectionsPuzzle | undefined> => {
    const kv = await getKV();
    if (!kv) {
      return staticData.puzzles.find((p) => p.id === id);
    }
    const puzzle = await kv.get<ConnectionsPuzzle>(
      `puzzle:id:${id}`,
      "json"
    );
    return puzzle ?? undefined;
  }
);

/** Get the latest/today's puzzle */
export const getLatestPuzzle = cache(
  async (): Promise<ConnectionsPuzzle | undefined> => {
    const kv = await getKV();
    if (!kv) {
      if (staticData.puzzles.length === 0) return undefined;
      return staticData.puzzles[staticData.puzzles.length - 1];
    }
    const index = await getIndex();
    if (!index || index.dates.length === 0) return undefined;
    return getPuzzleByDate(index.latestDate);
  }
);

/** Get the puzzle immediately before the latest board */
export const getYesterdayPuzzle = cache(
  async (): Promise<ConnectionsPuzzle | undefined> => {
    const kv = await getKV();
    if (!kv) {
      if (staticData.puzzles.length < 2) return undefined;
      return staticData.puzzles[staticData.puzzles.length - 2];
    }
    const index = await getIndex();
    if (!index || index.dates.length < 2) return undefined;
    return getPuzzleByDate(index.dates[1]);
  }
);

/** Get all puzzles, newest first */
export const getAllPuzzles = cache(
  async (): Promise<ConnectionsPuzzle[]> => {
    const kv = await getKV();
    if (!kv) {
      return [...staticData.puzzles].reverse();
    }
    const puzzles = await kv.get<ConnectionsPuzzle[]>(
      "meta:all-puzzles",
      "json"
    );
    if (!puzzles) return [];
    return [...puzzles].reverse();
  }
);

/** Get recent N puzzles, newest first */
export const getRecentPuzzles = cache(
  async (count: number = 7): Promise<ConnectionsPuzzle[]> => {
    const kv = await getKV();
    if (!kv) {
      return [...staticData.puzzles].reverse().slice(0, count);
    }
    const index = await getIndex();
    if (!index) return [];
    const recentDates = index.dates.slice(0, count);
    const puzzles = await Promise.all(
      recentDates.map((date) => getPuzzleByDate(date))
    );
    return puzzles.filter((p): p is ConnectionsPuzzle => p !== undefined);
  }
);

/** Get puzzles for a specific month (YYYY-MM) */
export const getPuzzlesByMonth = cache(
  async (yearMonth: string): Promise<ConnectionsPuzzle[]> => {
    const kv = await getKV();
    if (!kv) {
      return staticData.puzzles
        .filter((p) => p.date.startsWith(yearMonth))
        .reverse();
    }
    const index = await getIndex();
    if (!index) return [];
    const monthDates = index.dates.filter((d) => d.startsWith(yearMonth));
    const puzzles = await Promise.all(
      monthDates.map((date) => getPuzzleByDate(date))
    );
    return puzzles.filter((p): p is ConnectionsPuzzle => p !== undefined);
  }
);

/** Get all unique year-month strings available */
export const getAvailableMonths = cache(
  async (): Promise<string[]> => {
    const kv = await getKV();
    if (!kv) {
      const months = new Set(staticData.puzzles.map((p) => p.date.slice(0, 7)));
      return Array.from(months).sort().reverse();
    }
    const index = await getIndex();
    if (!index) return [];
    return index.months;
  }
);

/** Get total puzzle count */
export const getPuzzleCount = cache(
  async (): Promise<number> => {
    const kv = await getKV();
    if (!kv) return staticData.puzzles.length;
    const index = await getIndex();
    return index?.count ?? 0;
  }
);

/** Get the last updated timestamp */
export const getLastUpdated = cache(
  async (): Promise<string> => {
    const kv = await getKV();
    if (!kv) return staticData.lastUpdated;
    const index = await getIndex();
    return index?.lastUpdated ?? "";
  }
);

/** Get the previous chronologically older puzzle for a date */
export const getPreviousPuzzleByDate = cache(
  async (date: string): Promise<ConnectionsPuzzle | undefined> => {
    const kv = await getKV();
    if (!kv) {
      const idx = staticData.puzzles.findIndex((p) => p.date === date);
      if (idx <= 0) return undefined;
      return staticData.puzzles[idx - 1];
    }
    const index = await getIndex();
    if (!index) return undefined;
    const idx = index.dates.indexOf(date);
    // dates are newest-first, so previous (older) is idx + 1
    if (idx === -1 || idx >= index.dates.length - 1) return undefined;
    return getPuzzleByDate(index.dates[idx + 1]);
  }
);

/** Get the next chronologically newer puzzle for a date */
export const getNextPuzzleByDate = cache(
  async (date: string): Promise<ConnectionsPuzzle | undefined> => {
    const kv = await getKV();
    if (!kv) {
      const idx = staticData.puzzles.findIndex((p) => p.date === date);
      if (idx === -1 || idx >= staticData.puzzles.length - 1) return undefined;
      return staticData.puzzles[idx + 1];
    }
    const index = await getIndex();
    if (!index) return undefined;
    const idx = index.dates.indexOf(date);
    // dates are newest-first, so next (newer) is idx - 1
    if (idx <= 0) return undefined;
    return getPuzzleByDate(index.dates[idx - 1]);
  }
);

/** Get the previous puzzle by numeric id */
export const getPreviousPuzzleById = cache(
  async (id: number): Promise<ConnectionsPuzzle | undefined> => {
    return getPuzzleById(id - 1);
  }
);

/** Get the next puzzle by numeric id */
export const getNextPuzzleById = cache(
  async (id: number): Promise<ConnectionsPuzzle | undefined> => {
    return getPuzzleById(id + 1);
  }
);

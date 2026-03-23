import type { ConnectionsPuzzle } from "@/types/connections";
import { getKV } from "@/lib/kv";
import { cache } from "react";

/**
 * Sports Edition data access layer.
 * Uses the shared KV namespace with "sports:" prefix keys.
 */

interface SportsIndex {
  lastUpdated: string;
  count: number;
  latestDate: string;
  dates: string[]; // newest-first
}

/** Fetch sports index */
const getSportsIndex = cache(async (): Promise<SportsIndex | null> => {
  const kv = await getKV();
  if (!kv) return null;
  return kv.get<SportsIndex>("sports:index", "json");
});

/** Get latest sports puzzle */
export const getLatestSportsPuzzle = cache(
  async (): Promise<ConnectionsPuzzle | undefined> => {
    const kv = await getKV();
    if (!kv) return undefined;
    const index = await getSportsIndex();
    if (!index || index.dates.length === 0) return undefined;
    const puzzle = await kv.get<ConnectionsPuzzle>(
      `sports:puzzle:date:${index.latestDate}`,
      "json"
    );
    return puzzle ?? undefined;
  }
);

/** Get a sports puzzle by date */
export const getSportsPuzzleByDate = cache(
  async (date: string): Promise<ConnectionsPuzzle | undefined> => {
    const kv = await getKV();
    if (!kv) return undefined;
    const puzzle = await kv.get<ConnectionsPuzzle>(
      `sports:puzzle:date:${date}`,
      "json"
    );
    return puzzle ?? undefined;
  }
);

/** Get all sports puzzles (newest first) */
export const getAllSportsPuzzles = cache(
  async (): Promise<ConnectionsPuzzle[]> => {
    const kv = await getKV();
    if (!kv) return [];
    const puzzles = await kv.get<ConnectionsPuzzle[]>(
      "sports:all-puzzles",
      "json"
    );
    if (!puzzles) return [];
    return [...puzzles].reverse();
  }
);

/** Get recent N sports puzzles */
export const getRecentSportsPuzzles = cache(
  async (count: number = 7): Promise<ConnectionsPuzzle[]> => {
    const kv = await getKV();
    if (!kv) return [];
    const index = await getSportsIndex();
    if (!index) return [];
    const recentDates = index.dates.slice(0, count);
    const puzzles = await Promise.all(
      recentDates.map((date) => getSportsPuzzleByDate(date))
    );
    return puzzles.filter((p): p is ConnectionsPuzzle => p !== undefined);
  }
);

/** Get sports puzzle count */
export const getSportsPuzzleCount = cache(
  async (): Promise<number> => {
    const kv = await getKV();
    if (!kv) return 0;
    const index = await getSportsIndex();
    return index?.count ?? 0;
  }
);

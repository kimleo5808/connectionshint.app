import type {
  ConnectionsDataFile,
  ConnectionsPuzzle,
} from "@/types/connections";
import puzzlesData from "@/data/connections/puzzles.json";

const data = puzzlesData as ConnectionsDataFile;

/** Get a puzzle by its date string (YYYY-MM-DD) */
export async function getPuzzleByDate(
  date: string
): Promise<ConnectionsPuzzle | undefined> {
  return data.puzzles.find((p) => p.date === date);
}

/** Get the latest/today's puzzle */
export async function getLatestPuzzle(): Promise<ConnectionsPuzzle | undefined> {
  if (data.puzzles.length === 0) return undefined;
  return data.puzzles[data.puzzles.length - 1];
}

/** Get all puzzles, newest first */
export async function getAllPuzzles(): Promise<ConnectionsPuzzle[]> {
  return [...data.puzzles].reverse();
}

/** Get recent N puzzles, newest first */
export async function getRecentPuzzles(
  count: number = 7
): Promise<ConnectionsPuzzle[]> {
  return [...data.puzzles].reverse().slice(0, count);
}

/** Get puzzles for a specific month (YYYY-MM) */
export async function getPuzzlesByMonth(
  yearMonth: string
): Promise<ConnectionsPuzzle[]> {
  return data.puzzles
    .filter((p) => p.date.startsWith(yearMonth))
    .reverse();
}

/** Get all unique year-month strings available */
export async function getAvailableMonths(): Promise<string[]> {
  const months = new Set(data.puzzles.map((p) => p.date.slice(0, 7)));
  return Array.from(months).sort().reverse();
}

/** Get total puzzle count */
export async function getPuzzleCount(): Promise<number> {
  return data.puzzles.length;
}

/** Get the last updated timestamp */
export async function getLastUpdated(): Promise<string> {
  return data.lastUpdated;
}

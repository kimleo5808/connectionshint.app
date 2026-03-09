import type {
  ConnectionsDataFile,
  ConnectionsPuzzle,
} from "@/types/connections";
import puzzlesData from "@/data/connections/puzzles.json";
import { cache } from "react";

const data = puzzlesData as ConnectionsDataFile;

/** Get a puzzle by its date string (YYYY-MM-DD) */
export const getPuzzleByDate = cache(
  async (date: string): Promise<ConnectionsPuzzle | undefined> => {
    return data.puzzles.find((p) => p.date === date);
  }
);

/** Get a puzzle by its numeric id */
export const getPuzzleById = cache(
  async (id: number): Promise<ConnectionsPuzzle | undefined> => {
    return data.puzzles.find((p) => p.id === id);
  }
);

/** Get the latest/today's puzzle */
export const getLatestPuzzle = cache(
  async (): Promise<ConnectionsPuzzle | undefined> => {
    if (data.puzzles.length === 0) return undefined;
    return data.puzzles[data.puzzles.length - 1];
  }
);

/** Get the puzzle immediately before the latest board */
export const getYesterdayPuzzle = cache(
  async (): Promise<ConnectionsPuzzle | undefined> => {
    if (data.puzzles.length < 2) return undefined;
    return data.puzzles[data.puzzles.length - 2];
  }
);

/** Get all puzzles, newest first */
export const getAllPuzzles = cache(
  async (): Promise<ConnectionsPuzzle[]> => {
    return [...data.puzzles].reverse();
  }
);

/** Get recent N puzzles, newest first */
export const getRecentPuzzles = cache(
  async (count: number = 7): Promise<ConnectionsPuzzle[]> => {
    return [...data.puzzles].reverse().slice(0, count);
  }
);

/** Get puzzles for a specific month (YYYY-MM) */
export const getPuzzlesByMonth = cache(
  async (yearMonth: string): Promise<ConnectionsPuzzle[]> => {
    return data.puzzles
      .filter((p) => p.date.startsWith(yearMonth))
      .reverse();
  }
);

/** Get all unique year-month strings available */
export const getAvailableMonths = cache(
  async (): Promise<string[]> => {
    const months = new Set(data.puzzles.map((p) => p.date.slice(0, 7)));
    return Array.from(months).sort().reverse();
  }
);

/** Get total puzzle count */
export const getPuzzleCount = cache(
  async (): Promise<number> => {
    return data.puzzles.length;
  }
);

/** Get the last updated timestamp */
export const getLastUpdated = cache(
  async (): Promise<string> => {
    return data.lastUpdated;
  }
);

/** Get the previous chronologically older puzzle for a date */
export const getPreviousPuzzleByDate = cache(
  async (date: string): Promise<ConnectionsPuzzle | undefined> => {
    const index = data.puzzles.findIndex((p) => p.date === date);
    if (index <= 0) return undefined;
    return data.puzzles[index - 1];
  }
);

/** Get the next chronologically newer puzzle for a date */
export const getNextPuzzleByDate = cache(
  async (date: string): Promise<ConnectionsPuzzle | undefined> => {
    const index = data.puzzles.findIndex((p) => p.date === date);
    if (index === -1 || index >= data.puzzles.length - 1) return undefined;
    return data.puzzles[index + 1];
  }
);

/** Get the previous puzzle by numeric id */
export const getPreviousPuzzleById = cache(
  async (id: number): Promise<ConnectionsPuzzle | undefined> => {
    return data.puzzles.find((p) => p.id === id - 1);
  }
);

/** Get the next puzzle by numeric id */
export const getNextPuzzleById = cache(
  async (id: number): Promise<ConnectionsPuzzle | undefined> => {
    return data.puzzles.find((p) => p.id === id + 1);
  }
);

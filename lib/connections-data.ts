import puzzlesData from "@/data/connections/puzzles.json";
import { getKV } from "@/lib/kv";
import { dateForPuzzleNumber, editionDate, publicPuzzleNumber } from "@/lib/puzzle-archive.mjs";
import type { ConnectionsDataFile, ConnectionsPuzzle } from "@/types/connections";
import { cache } from "react";

const snapshot = puzzlesData as ConnectionsDataFile;
const local = new Map(snapshot.puzzles.map(p => [p.date, p]));

interface PuzzleIndex {
  lastUpdated: string;
  dates: string[];
}

const getIndex = cache(async () => {
  const kv = await getKV();
  return kv?.get<PuzzleIndex>("meta:index", "json");
});

const getRecentUpdates = cache(async () => {
  const kv = await getKV();
  const boards = await kv?.get<ConnectionsPuzzle[]>("classic:recent", "json");
  return new Map((boards ?? []).map(p => [p.date, p]));
});

const getDates = cache(async () => {
  const [index, updates] = await Promise.all([getIndex(), getRecentUpdates()]);
  const today = editionDate();
  return [...new Set([...local.keys(), ...(index?.dates ?? []), ...updates.keys()])]
    .filter(date => date <= today).sort().reverse();
});

function withPublicNumber(puzzle: ConnectionsPuzzle) {
  const id = publicPuzzleNumber(puzzle.date);
  return puzzle.id === id ? puzzle : { ...puzzle, id };
}

export const getPuzzleByDate = cache(async (date: string): Promise<ConnectionsPuzzle | undefined> => {
  if (!publicPuzzleNumber(date) || date > editionDate()) return undefined;
  const updates = await getRecentUpdates();
  const verified = local.get(date);
  if (verified?.imageTiles) return verified;
  const kv = await getKV();
  const puzzle = updates.get(date) ?? await kv?.get<ConnectionsPuzzle>(`puzzle:date:${date}`, "json") ?? verified;
  return puzzle && withPublicNumber(puzzle);
});

export const getPuzzleById = cache(async (id: number) => {
  const date = dateForPuzzleNumber(id);
  return date ? getPuzzleByDate(date) : undefined;
});

export const getTodayPuzzle = cache(() => getPuzzleByDate(editionDate()));
export const getYesterdayPuzzle = cache(() => getPuzzleById(publicPuzzleNumber(editionDate()) - 1));
export const getLatestPuzzle = cache(async () => {
  const [latest] = await getDates();
  return latest ? getPuzzleByDate(latest) : undefined;
});

export const getAllPuzzles = cache(async (): Promise<ConnectionsPuzzle[]> => {
  const kv = await getKV();
  const [stored, updates] = await Promise.all([
    kv?.get<ConnectionsPuzzle[]>("meta:all-puzzles", "json"),
    getRecentUpdates(),
  ]);
  const boards = new Map(local);
  for (const puzzle of [...(stored ?? []), ...updates.values()]) {
    if (!boards.get(puzzle.date)?.imageTiles) boards.set(puzzle.date, withPublicNumber(puzzle));
  }
  const today = editionDate();
  return [...boards.values()].filter(p => p.date <= today).sort((a, b) => b.id - a.id);
});

async function puzzlesForDates(dates: string[]) {
  const boards = await Promise.all(dates.map(date => getPuzzleByDate(date)));
  return boards.filter((p): p is ConnectionsPuzzle => p !== undefined);
}

export const getRecentPuzzles = cache(async (count = 7) => puzzlesForDates((await getDates()).slice(0, count)));
export const getPuzzlesByMonth = cache(async (month: string) => puzzlesForDates((await getDates()).filter(d => d.startsWith(month))));
export const getAvailableMonths = cache(async () => [...new Set((await getDates()).map(d => d.slice(0, 7)))]);
export const getPuzzleCount = cache(async () => (await getDates()).length);
export const getLastUpdated = cache(async () => (await getIndex())?.lastUpdated ?? snapshot.lastUpdated);

async function adjacent(date: string, offset: number) {
  const dates = await getDates();
  const i = dates.indexOf(date);
  return i >= 0 && dates[i + offset] ? getPuzzleByDate(dates[i + offset]) : undefined;
}
export const getPreviousPuzzleByDate = cache((date: string) => adjacent(date, 1));
export const getNextPuzzleByDate = cache((date: string) => adjacent(date, -1));
export const getPreviousPuzzleById = cache((id: number) => getPuzzleById(id - 1));
export const getNextPuzzleById = cache((id: number) => getPuzzleById(id + 1));

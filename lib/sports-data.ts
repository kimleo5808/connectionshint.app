import snapshot from "@/data/sports/puzzles.json";
import { getKV } from "@/lib/kv";
import { editionDate } from "@/lib/puzzle-archive.mjs";
import type { ConnectionsPuzzle } from "@/types/connections";
import { cache } from "react";

const local = new Map((snapshot.puzzles as ConnectionsPuzzle[]).map(board => [board.date, board]));

const getDates = cache(async () => {
  const kv = await getKV();
  const index = await kv?.get<{ dates: string[] }>("sports:index", "json");
  const today = editionDate();
  return [...new Set([...local.keys(), ...(index?.dates ?? [])])]
    .filter(date => date <= today).sort().reverse();
});

export const getSportsPuzzleByDate = cache(async (date: string) => {
  if (!(await getDates()).includes(date)) return undefined;
  const kv = await getKV();
  return await kv?.get<ConnectionsPuzzle>(`sports:puzzle:date:${date}`, "json") ?? local.get(date);
});

export const getLatestSportsPuzzle = cache(async () => {
  const [date] = await getDates();
  return date ? getSportsPuzzleByDate(date) : undefined;
});

export const getRecentSportsPuzzles = cache(async (count = 7) => {
  const dates = (await getDates()).slice(0, count);
  const boards = await Promise.all(dates.map(date => getSportsPuzzleByDate(date)));
  return boards.filter((p): p is ConnectionsPuzzle => p !== undefined);
});

export const getSportsPuzzleCount = cache(async () => (await getDates()).length);

export const getAllSportsPuzzles = cache(async () => {
  const kv = await getKV();
  const live = await kv?.get<ConnectionsPuzzle[]>("sports:all-puzzles", "json");
  const boards = new Map(local);
  for (const puzzle of live ?? []) boards.set(puzzle.date, puzzle);
  const today = editionDate();
  return [...boards.values()].filter(p => p.date <= today).sort((a, b) => b.date.localeCompare(a.date));
});

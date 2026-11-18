import snapshot from "@/data/sports/puzzles.json";
import { getKV } from "@/lib/kv";
import { editionDate } from "@/lib/puzzle-archive.mjs";
import { isPlayableSportsBoard } from "@/lib/sports-archive.mjs";
import type { ConnectionsPuzzle } from "@/types/connections";
import { cache } from "react";

export const getAllSportsPuzzles = cache(async () => {
  const kv = await getKV();
  const [legacy, recent] = await Promise.all([
    kv?.get<ConnectionsPuzzle[]>("sports:all-puzzles", "json"),
    kv?.get<ConnectionsPuzzle[]>("sports:recent", "json"),
  ]);
  const today = editionDate();
  const boards = new Map<string, ConnectionsPuzzle>();
  for (const source of [legacy ?? [], snapshot.puzzles as ConnectionsPuzzle[], recent ?? []]) {
    for (const board of source) {
      if (isPlayableSportsBoard(board) && board.date <= today) boards.set(board.date, board);
    }
  }
  return [...boards.values()].sort((a, b) => b.date.localeCompare(a.date));
});

export const getSportsPuzzleByDate = cache(async (date: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date > editionDate()) return undefined;
  const board = (await getAllSportsPuzzles()).find(p => p.date === date);
  if (board) return board;
  const kv = await getKV();
  const older = await kv?.get<ConnectionsPuzzle>(`sports:puzzle:date:${date}`, "json");
  return older?.date === date && isPlayableSportsBoard(older) ? older : undefined;
});

export const getLatestSportsPuzzle = cache(async () => (await getAllSportsPuzzles())[0]);
export const getRecentSportsPuzzles = cache(async (count = 7) => (await getAllSportsPuzzles()).slice(0, count));
export const getSportsPuzzleCount = cache(async () => (await getAllSportsPuzzles()).length);

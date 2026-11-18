import type { ConnectionsLevel, ConnectionsPuzzle } from "@/types/connections";

export function normalizeArchiveWord(word: string) {
  return word.normalize("NFKC").trim().replace(/\s+/g, " ").replace(/[‘’]/g, "'").toUpperCase();
}

const containsLetter = new RegExp("\\p{L}", "u");

export function getWordBoards(boards: ConnectionsPuzzle[], today: string) {
  return boards.filter(board => board.date < today && !board.imageTiles &&
    board.answers.some(group => group.members.some(word => containsLetter.test(word))));
}

type Appearance = { date: string; id: number; level: ConnectionsLevel; group: string };

export type FrequencyRow = {
  word: string;
  count: number;
  colors: [number, number, number, number];
  latest: Appearance[];
  rank: number;
};

export function rankWords(boards: ConnectionsPuzzle[], level?: ConnectionsLevel) {
  const byWord = new Map<string, FrequencyRow>();
  // Limit the inline evidence to three recent dates per word.
  for (const board of [...boards].sort((a, b) => b.date.localeCompare(a.date))) {
    const seen = new Set<string>();
    for (const group of board.answers) {
      if (level !== undefined && group.level !== level) continue;
      for (const member of group.members) {
        const word = normalizeArchiveWord(member);
        if (seen.has(word) || !containsLetter.test(word)) continue;
        seen.add(word);
        let row = byWord.get(word);
        if (!row) {
          row = { word, count: 0, colors: [0, 0, 0, 0], latest: [], rank: 0 };
          byWord.set(word, row);
        }
        row.count++;
        row.colors[group.level]++;
        if (row.latest.length < 3) row.latest.push({ date: board.date, id: board.id, level: group.level, group: group.group });
      }
    }
  }

  const rows = [...byWord.values()].filter(row => row.count >= 2)
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word, "en"));
  rows.forEach((row, index) => {
    row.rank = index && row.count === rows[index - 1].count ? rows[index - 1].rank : index + 1;
  });
  return rows;
}

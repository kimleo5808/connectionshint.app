export interface BoardSource {
  id: string;
  label: string;
  dateLabel: string;
  words: string[];
}

export interface Draft {
  words: string[];
  labels: string[];
}

export const rowLetters = ["A", "B", "C", "D"];
export const labelLimit = 52;
const storagePrefix = "connections-scratchpad-v1:";
export const lastBoardKey = storagePrefix + "active";
export const draftKey = (id: string) => storagePrefix + id;

export function freshDraft(words: string[]): Draft {
  return { words, labels: ["", "", "", ""] };
}

const wordKey = (word: string) => word.trim().normalize("NFKC").toUpperCase();

export function wordProblem(words: string[]) {
  if (words.length !== 16) return `Enter 16 tiles. Your list contains ${words.length}.`;
  if (words.some(word => !word.trim() || word.length > 80)) return "Use 1 to 80 characters for each tile.";
  const seen = new Set<string>();
  for (const word of words) {
    const key = wordKey(word);
    if (seen.has(key)) return `“${word}” appears twice. Give each tile a different name.`;
    seen.add(key);
  }
  return "";
}

export function readDraft(id: string, expectedWords?: string[]): Draft | null {
  try {
    const value = JSON.parse(localStorage.getItem(draftKey(id)) ?? "null");
    if (!value || !Array.isArray(value.words) || !value.words.every((w: unknown) => typeof w === "string") ||
        wordProblem(value.words) || !Array.isArray(value.labels) || value.labels.length !== 4 ||
        !value.labels.every((n: unknown) => typeof n === "string" && n.length <= labelLimit)) return null;
    if (expectedWords && !expectedWords.every(word => value.words.includes(word))) return null;
    return { words: value.words, labels: value.labels };
  } catch {
    return null;
  }
}

export function swapWords(words: string[], first: number, second: number) {
  const next = [...words];
  [next[first], next[second]] = [next[second], next[first]];
  return next;
}

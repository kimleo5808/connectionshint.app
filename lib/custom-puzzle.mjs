/** @typedef {{name: string, words: string[]}} MakerGroup */
/** @typedef {{title: string, groups: MakerGroup[]}} MakerDraft */

export const colorNames = ["Yellow", "Green", "Blue", "Purple"];
export const titleLimit = 64;
export const nameLimit = 64;
export const wordLimit = 28;

/** @returns {MakerDraft} */
export function emptyDraft() {
  return { title: "", groups: colorNames.map(() => ({ name: "", words: ["", "", "", ""] })) };
}

export const exampleDraft = {
  title: "The Sunday Set",
  groups: [
    { name: "Freshwater fish", words: ["Bass", "Carp", "Perch", "Pike"] },
    { name: "Singing voices", words: ["Alto", "Baritone", "Soprano", "Tenor"] },
    { name: "Parts of a hardcover book", words: ["Spine", "Jacket", "Endpaper", "Title page"] },
    { name: "Words before CASE", words: ["Pillow", "Show", "Stair", "Suit"] },
  ],
};

function shortString(value, limit) {
  return typeof value === "string" && value.length <= limit;
}

export function hasDraftShape(value) {
  return value && shortString(value.title, titleLimit) &&
    Array.isArray(value.groups) && value.groups.length === 4 &&
    value.groups.every(g => g && shortString(g.name, nameLimit) && Array.isArray(g.words) &&
      g.words.length === 4 && g.words.every(w => shortString(w, wordLimit)));
}

const clean = value => value.trim().replace(/\s+/gu, " ");
const key = value => clean(value).normalize("NFKC").toUpperCase();

/** @param {MakerDraft} draft */
export function firstIssue(draft) {
  const words = new Map();
  const names = new Set();
  for (const [index, group] of draft.groups.entries()) {
    const name = key(group.name);
    const color = colorNames[index];
    if (!name) return { index, field: "name", message: `Name the ${color.toLowerCase()} group.` };
    if (names.has(name)) return { index, field: "name", message: "Give each group a different name." };
    names.add(name);
    for (const [position, value] of group.words.entries()) {
      const word = key(value);
      const field = "tile-" + position;
      if (!word) return { index, field, message: `Add tile ${position + 1} to the ${color.toLowerCase()} group.` };
      if (words.has(word)) return { index, field, message: `“${clean(value)}” already appears in ${words.get(word)}. Choose a different tile.` };
      words.set(word, color);
    }
  }
  return null;
}

/** @param {MakerDraft} draft */
export function encodePuzzle(draft) {
  if (!hasDraftShape(draft) || firstIssue(draft)) throw new Error("Incomplete puzzle");
  const rows = draft.groups.map(g => [clean(g.name), ...g.words.map(clean)]);
  const bytes = new TextEncoder().encode(JSON.stringify([clean(draft.title), ...rows]));
  return "p1." + btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** @returns {MakerDraft | null} */
export function decodePuzzle(fragment) {
  if (typeof fragment !== "string" || fragment.length > 12000 || !/^p1\.[\w-]+$/.test(fragment)) return null;
  try {
    const base64 = fragment.slice(3).replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(base64), char => char.charCodeAt(0));
    const rows = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!Array.isArray(rows) || rows.length !== 5) return null;
    const groups = [];
    for (const row of rows.slice(1)) {
      if (!Array.isArray(row) || row.length !== 5) return null;
      groups.push({ name: row[0], words: row.slice(1) });
    }
    const draft = { title: rows[0], groups };
    return hasDraftShape(draft) && !firstIssue(draft) ? draft : null;
  } catch {
    return null;
  }
}

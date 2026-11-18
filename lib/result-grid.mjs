export const colorCodes = ["Y", "G", "B", "P"];
export const colorNames = { Y: "Yellow", G: "Green", B: "Blue", P: "Purple" };
export const squares = { Y: "🟨", G: "🟩", B: "🟦", P: "🟪" };

export const sampleGrids = [
  { label: "One away", rows: ["YYYB", "GGGG", "YYYY", "PPPP", "BBBB"] },
  { label: "Perfect", rows: ["PPPP", "BBBB", "GGGG", "YYYY"] },
  { label: "Four misses", rows: ["YGBP", "BBGP", "YYGG", "BBBG"] },
];

export function emojiRow(row) {
  return [...row].map(code => squares[code]).join("");
}

function toCodes(line) {
  let codes = line.replace(/[\s\uFE0E\uFE0F]/gu, "").toUpperCase();
  for (const code of colorCodes) codes = codes.replaceAll(squares[code], code);
  return codes;
}

export function analyzeGrid(input) {
  if (typeof input !== "string" || input.length > 3000) return { error: "Paste the rows from one result, up to seven guesses." };
  const lines = input.trim().split(/\r\n|[\n\r\u2028\u2029]/u);
  const entries = [];
  let hasHeading = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^(?:NYT\s+)?Connections\b(?:\s*[:–-]?\s*Sports Edition)?(?:\s*[-–·:]?\s*(?:Puzzle\s*)?#\s*[\d,]+)?[.!]?$/i.test(line) ||
        /^(?:Puzzle\s*)?#\s*[\d,]+$/i.test(line)) {
      if (entries.length) return { error: "A second heading follows the guesses. Paste one grid at a time." };
      hasHeading = true;
      continue;
    }
    if (/^https?:\/\/\S+$/i.test(line)) continue;
    const codes = toCodes(line);
    if (!/^[YGBP]+$/.test(codes)) return { error: "Use yellow, green, blue or purple squares, or the letters Y, G, B and P. Remove commentary and other game results." };
    entries.push(codes);
  }
  if (!entries.length) return { error: hasHeading ? "The heading came through. Paste the colored guess rows below it." : "Paste some colored squares or choose an example." };
  let rows = entries;
  if (entries.length === 1 && entries[0].length > 4 && entries[0].length % 4 === 0) rows = entries[0].match(/.{4}/g);
  if (rows.length > 7) return { error: "A standard game has at most seven guesses. Check for a second grid." };
  const order = [];
  const guesses = [];
  let mistakes = 0;
  let nearMisses = 0;
  for (const [index, row] of rows.entries()) {
    const prefix = "Row " + (index + 1);
    if (row.length !== 4) return { error: prefix + " needs four squares. Keep one complete guess on each line." };
    if (mistakes === 4 || order.length === 4) return { error: prefix + " appears after the game ended. Remove extra rows and try again." };
    const removed = order.find(code => row.includes(code));
    if (removed) return { error: prefix + " reuses " + colorNames[removed].toLowerCase() + " after it was solved. Check the order of your rows." };
    const counts = new Map();
    for (const code of row) counts.set(code, (counts.get(code) ?? 0) + 1);
    const [top, amount] = [...counts].sort((a,b) => b[1] - a[1])[0];
    const pattern = [...counts.values()].sort((a,b) => b-a).join("+");
    let label;
    if (amount === 4) {
      order.push(top);
      label = colorNames[top] + " solved";
    } else {
      mistakes++;
      if (amount === 3) nearMisses++;
      label = amount === 3 ? "One away from " + colorNames[top].toLowerCase()
        : pattern === "2+2" ? "Two pairs" : pattern === "2+1+1" ? "One pair and two singles" : "Four different groups";
    }
    guesses.push({ row, pattern, label });
  }
  const outcome = order.length === 4 ? (mistakes ? "Solved" : "Perfect solve") : mistakes === 4 ? "Out of mistakes" : "Partial grid";
  return { outcome, order, mistakes, nearMisses, guesses };
}

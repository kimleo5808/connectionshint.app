// Classic Connections publishes one numbered puzzle per calendar date.
// The NYT API id and the community archive's row number are different IDs.
const firstDate = Date.UTC(2023, 5, 12);
const day = 86_400_000;

const easternDate = new Intl.DateTimeFormat("en-CA", {
  year: "numeric", month: "2-digit", day: "2-digit", timeZone: "America/New_York",
});

export function editionDate(now = new Date()) {
  return easternDate.format(now);
}

export function nextEditionTime(now = new Date()) {
  const nextDate = dateForPuzzleNumber(publicPuzzleNumber(editionDate(now)) + 1);
  const daylightMidnight = Date.parse(`${nextDate}T04:00:00Z`);
  return editionDate(new Date(daylightMidnight)) === nextDate ? daylightMidnight : daylightMidnight + 3_600_000;
}

export function publicPuzzleNumber(date) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return 0;
  const time = Date.parse(date);
  if (!Number.isFinite(time) || time < firstDate || new Date(time).toISOString().slice(0, 10) !== date) return 0;
  return (time - firstDate) / day + 1;
}

export function dateForPuzzleNumber(id) {
  if (!Number.isSafeInteger(id) || id < 1 || id > publicPuzzleNumber("9999-12-31")) return null;
  return new Date(firstDate + (id - 1) * day).toISOString().slice(0, 10);
}

export function normalizePuzzle(raw) {
  const id = publicPuzzleNumber(raw?.date);
  if (!id || !Array.isArray(raw.answers) || raw.answers.length !== 4) return null;
  const answers = [];
  for (const [index, group] of raw.answers.entries()) {
    if (typeof group?.group !== "string" || !group.group.trim() ||
        !Array.isArray(group.members) || group.members.length !== 4 ||
        !group.members.every(word => typeof word === "string" && word.trim() && word !== "UNDEFINED")) return null;
    const level = [0, 1, 2, 3].includes(group.level) ? group.level : index;
    answers.push({ level, group: group.group, members: group.members.map(word => word.trim().toUpperCase()) });
  }
  if (new Set(answers.map(group => group.level)).size !== 4) return null;
  answers.sort((a, b) => a.level - b.level);
  return { id, date: raw.date, answers, ...(raw.imageTiles ? { imageTiles: true } : {}) };
}

export function readOfficialPuzzle(data, date) {
  if (data?.print_date !== date || !Array.isArray(data.categories)) return null;
  let imageTiles = false;
  const answers = data.categories.map((category, level) => ({
    level,
    group: category?.title,
    members: Array.isArray(category?.cards) && category.cards.map(card => {
      if (card?.content) return card.content;
      imageTiles = true;
      return card?.image_alt_text;
    }),
  }));
  return normalizePuzzle({ date, answers, imageTiles });
}

// An omitted upstream date must never remove a verified board. Preserve the
// official text labels on picture boards even if a partial text feed appears.
export function mergePuzzles(...sources) {
  const byDate = new Map();
  for (const records of sources) {
    for (const raw of records) {
      const puzzle = normalizePuzzle(raw);
      if (puzzle && (!byDate.get(puzzle.date)?.imageTiles || puzzle.imageTiles)) {
        byDate.set(puzzle.date, puzzle);
      }
    }
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

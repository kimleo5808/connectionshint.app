const launch = Date.UTC(2024, 8, 24);
const day = 86_400_000;
const query = `query SportsByDate($date: String!) {
  getPuzzleByIdOrDate(date: $date, puzzle_type: "sports-connections") {
    id print_date hint_url categories { title cards { content } }
  }
}`;

export function sportsNumber(date) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const time = Date.parse(date);
  if (!Number.isFinite(time) || time < launch || new Date(time).toISOString().slice(0, 10) !== date) return null;
  return 1 + (time - launch) / day;
}

export function sportsDate(number) {
  if (!Number.isSafeInteger(number) || number < 1 || number > 2_000_000) return null;
  return new Date(launch + (number - 1) * day).toISOString().slice(0, 10);
}

export function isPlayableSportsBoard(board) {
  if (!board || !Number.isSafeInteger(board.id) || board.id <= 0 ||
      typeof board.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(board.date) ||
      !Array.isArray(board.answers) || board.answers.length !== 4) return false;
  const time = Date.parse(board.date);
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== board.date) return false;
  const words = new Set();
  for (const [level, group] of board.answers.entries()) {
    if (group?.level !== level || typeof group.group !== "string" || !group.group.trim() ||
        !Array.isArray(group.members) || group.members.length !== 4) return false;
    for (const word of group.members) {
      if (typeof word !== "string" || !word.trim() || /^(undefined|null)$/i.test(word.trim())) return false;
      words.add(word.trim().toUpperCase());
    }
  }
  return words.size === 16;
}

export function readSportsBoard(data, date) {
  if (!data || !Array.isArray(data.categories)) return null;
  // Some editions have a placeholder print date. The publisher also returns
  // its dated companion article on the same puzzle record.
  if (data.print_date !== date) {
    const article = /^https:\/\/www\.nytimes\.com\/athletic\/\d+\/(\d{4})\/(\d{2})\/(\d{2})\/connections-sports-edition-[\w-]+\/?$/.exec(data.hint_url);
    if (data.print_date !== "YYYY-MM-DD" || !article || article.slice(1).join("-") !== date) return null;
  }
  const board = { id: Number(data.id), date, answers: data.categories.map((category, level) => ({
    level, group: category?.title, members: Array.isArray(category?.cards) && category.cards.map(card =>
      typeof card?.content === "string" ? card.content.trim().toUpperCase() : null),
  })) };
  return isPlayableSportsBoard(board) ? board : null;
}

export async function fetchSportsBoard(date) {
  const res = await fetch("https://api-prd-nyt.theathletic.com/graphql", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { date } }), signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Sports source returned HTTP ${res.status}`);
  const payload = await res.json();
  if (payload.errors?.length) throw new Error(payload.errors[0].message);
  return readSportsBoard(payload.data?.getPuzzleByIdOrDate, date);
}

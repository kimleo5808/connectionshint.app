import { editionDate, mergePuzzles, readOfficialPuzzle } from "../../lib/puzzle-archive.mjs";

/**
 * Standalone Cloudflare Worker for daily puzzle data updates via Cron Trigger.
 * Shares the same KV namespace (PUZZLES_KV) as the main Next.js worker.
 *
 * Deploy separately:
 *   wrangler deploy -c workers/puzzle-updater/wrangler.jsonc
 */

// Community-maintained source with all historical puzzles
const COMMUNITY_SOURCE =
  "https://raw.githubusercontent.com/Eyefyre/NYT-Connections-Answers/refs/heads/main/connections.json";

// NYT official API
const NYT_API_BASE = "https://www.nytimes.com/svc/connections/v2";

// The Athletic GraphQL API for Sports Edition
const SPORTS_GRAPHQL_URL = "https://api-prd-nyt.theathletic.com/graphql";
const SPORTS_QUERY = `query GetPuzzleById($puzzleId: String!) {
  getPuzzleById(puzzleId: $puzzleId) {
    categories { title cards { content } }
    printDate: print_date
    id
  }
}`;

interface Env {
  PUZZLES_KV: KVNamespace;
}

interface PuzzleIndex {
  lastUpdated: string;
  count: number;
  latestDate: string;
  dates: string[];
  months: string[];
}

interface ConnectionsGroup {
  level: number;
  group: string;
  members: string[];
}

interface ConnectionsPuzzle {
  id: number;
  date: string;
  answers: ConnectionsGroup[];
}

async function fetchJSON(url: string, retries = 3): Promise<unknown | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; ConnectionsHint/1.0; +https://connectionshint.app)",
          Accept: "application/json",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Attempt ${attempt}/${retries} failed for ${url}: ${message}`);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
  }
  return null;
}

function isValidPuzzle(puzzle: unknown): puzzle is ConnectionsPuzzle {
  if (!puzzle || typeof puzzle !== "object") return false;
  const p = puzzle as Record<string, unknown>;
  if (typeof p.id !== "number" || typeof p.date !== "string") return false;
  if (!Array.isArray(p.answers) || p.answers.length !== 4) return false;
  return (p.answers as unknown[]).every((a: unknown) => {
    if (!a || typeof a !== "object") return false;
    const g = a as Record<string, unknown>;
    return (
      typeof g.level === "number" &&
      typeof g.group === "string" &&
      Array.isArray(g.members) &&
      g.members.length === 4
    );
  });
}

function normalizePuzzle(puzzle: ConnectionsPuzzle): ConnectionsPuzzle {
  const answers = puzzle.answers
    .map((a, idx) => ({
      level: a.level >= 0 && a.level <= 3 ? a.level : idx,
      group: a.group,
      members: a.members.map((m) => String(m).toUpperCase()),
    }))
    .sort((a, b) => a.level - b.level);
  return { id: puzzle.id, date: puzzle.date, answers };
}

export default {
  async fetch(): Promise<Response> {
    return new Response("Puzzle updater worker. Use cron trigger.", { status: 200 });
  },

  async scheduled(
    _controller: ScheduledController,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<void> {
    const kv = env.PUZZLES_KV;
    const today = editionDate();
    // CI publishes the durable archive. Only this worker writes the recent
    // boards, so a concurrent archive rebuild cannot overwrite today's update.
    const [index, recent, community] = await Promise.all([
      kv.get<PuzzleIndex>("meta:index", "json"),
      kv.get<ConnectionsPuzzle[]>("classic:recent", "json"),
      fetchJSON(COMMUNITY_SOURCE),
    ]);
    const published = new Set(index?.dates ?? []);
    const cutoff = new Date(Date.now() - 7 * 86400_000).toISOString().slice(0, 10);
    const incoming = Array.isArray(community)
      ? community.filter(p => isValidPuzzle(p) && p.date <= today && (!published.has(p.date) || p.date >= cutoff))
      : [];
    const boards = mergePuzzles(recent ?? [], incoming)
      .filter(p => !published.has(p.date) || p.date >= cutoff);
    if (!boards.some(p => p.date === today)) {
      const official = readOfficialPuzzle(await fetchJSON(`${NYT_API_BASE}/${today}.json`, 2), today);
      if (official) boards.push(official);
    }
    const sorted = boards.sort((a, b) => a.date.localeCompare(b.date));
    if (JSON.stringify(sorted) !== JSON.stringify(recent ?? [])) {
      await kv.put("classic:recent", JSON.stringify(sorted));
    }

    await updateSportsEdition(kv, today);
  },
};

/* ------------------------------------------------------------------ */
/*  Sports Edition fetcher                                             */
/* ------------------------------------------------------------------ */

interface SportsIndex {
  lastUpdated: string;
  count: number;
  latestDate: string;
  dates: string[];
}

async function fetchSportsFromGraphQL(dateStr: string): Promise<ConnectionsPuzzle | null> {
  try {
    const res = await fetch(SPORTS_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; ConnectionsHint/1.0; +https://connectionshint.app)",
      },
      body: JSON.stringify({
        query: SPORTS_QUERY,
        variables: { puzzleId: dateStr },
      }),
    });

    if (!res.ok) {
      console.error(`Sports GraphQL HTTP ${res.status}`);
      return null;
    }

    const json = (await res.json()) as {
      data?: {
        getPuzzleById?: {
          id: string | number;
          printDate: string;
          categories: Array<{
            title: string;
            cards: Array<{ content: string }>;
          }>;
        };
      };
    };

    const data = json?.data?.getPuzzleById;
    if (!data || data.printDate !== dateStr || !data.categories || data.categories.length !== 4) return null;

    const puzzle: ConnectionsPuzzle = {
      id: Number(data.id),
      date: data.printDate || dateStr,
      answers: data.categories.map((cat, idx) => ({
        level: idx,
        group: cat.title,
        members: cat.cards.map((c) => String(c.content).toUpperCase()),
      })),
    };

    if (isValidPuzzle(puzzle)) return normalizePuzzle(puzzle);
    return null;
  } catch (err) {
    console.error(`Sports GraphQL error: ${err}`);
    return null;
  }
}

async function updateSportsEdition(kv: KVNamespace, today: string): Promise<void> {
  console.log("🏀 Checking Sports Edition...");

  const currentIndex = await kv.get<SportsIndex>("sports:index", "json");
  const existingDates = new Set(currentIndex?.dates ?? []);

  // Try fetching today's sports puzzle
  if (existingDates.has(today)) {
    console.log("Sports edition already up to date");
    return;
  }

  const sportsPuzzle = await fetchSportsFromGraphQL(today);
  if (!sportsPuzzle) {
    console.log("No sports puzzle available for today");
    return;
  }

  console.log(`Got sports puzzle for ${today}`);
  existingDates.add(today);

  // Write to KV with sports: prefix
  await Promise.all([
    kv.put(`sports:puzzle:date:${sportsPuzzle.date}`, JSON.stringify(sportsPuzzle)),
    kv.put(`sports:puzzle:id:${sportsPuzzle.id}`, JSON.stringify(sportsPuzzle)),
  ]);

  // Update sports index
  const allDates = Array.from(existingDates).sort().reverse();
  await kv.put(
    "sports:index",
    JSON.stringify({
      lastUpdated: new Date().toISOString(),
      count: allDates.length,
      latestDate: allDates[0],
      dates: allDates,
    } satisfies SportsIndex)
  );

  // Update all-puzzles blob
  const existingPuzzles =
    (await kv.get<ConnectionsPuzzle[]>("sports:all-puzzles", "json")) ?? [];
  const allPuzzles = [...existingPuzzles, sportsPuzzle].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  await kv.put("sports:all-puzzles", JSON.stringify(allPuzzles));

  console.log(`🏀 Sports update complete. Total: ${allPuzzles.length}`);
}

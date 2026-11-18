import { fetchSportsBoard } from "../../lib/sports-archive.mjs";
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

async function updateSportsEdition(kv: KVNamespace, today: string): Promise<void> {
  const board = await fetchSportsBoard(today);
  if (!board) return;
  const previous = await kv.get<ConnectionsPuzzle[]>("sports:recent", "json") ?? [];
  const recent = previous.filter(p => p.date !== today && p.date < today);
  recent.sort((a, b) => a.date.localeCompare(b.date));
  const updated = [...recent.slice(-30), board];
  if (JSON.stringify(previous) !== JSON.stringify(updated)) {
    await kv.put("sports:recent", JSON.stringify(updated));
  }
}

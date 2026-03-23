#!/usr/bin/env node

/**
 * One-time migration: fetch recent Sports Edition puzzles from
 * The Athletic GraphQL API and bulk-write them to Cloudflare KV.
 *
 * Usage:
 *   node scripts/migrate-sports-to-kv.mjs
 *
 * Fetches the 400 most recent puzzles (backwards from today).
 * Uses "sports:" key prefix in the same PUZZLES_KV namespace.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GRAPHQL_URL = "https://api-prd-nyt.theathletic.com/graphql";
const QUERY = `query GetPuzzleById($puzzleId: String!) {
  getPuzzleById(puzzleId: $puzzleId) {
    categories {
      title
      cards {
        content
      }
    }
    printDate: print_date
    id
  }
}`;

const PUZZLES_TO_FETCH = 400;
const FETCH_DELAY_MS = 100; // polite delay between requests

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchSportsPuzzle(dateStr) {
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; ConnectionsHint/1.0)",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { puzzleId: dateStr },
      }),
    });

    if (!res.ok) return null;

    const json = await res.json();
    const data = json?.data?.getPuzzleById;
    if (!data || !data.categories || data.categories.length !== 4) return null;

    return {
      id: Number(data.id),
      date: data.printDate || dateStr,
      answers: data.categories.map((cat, idx) => ({
        level: idx,
        group: cat.title,
        members: cat.cards.map((c) => String(c.content).toUpperCase()),
      })),
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  console.log("🏀 Sports Edition Migration");
  console.log(`   Fetching up to ${PUZZLES_TO_FETCH} recent puzzles...\n`);

  const puzzles = [];
  const today = new Date();
  let consecutiveFails = 0;

  for (let i = 0; i < PUZZLES_TO_FETCH + 60; i++) {
    // Stop if we have enough or too many consecutive failures
    if (puzzles.length >= PUZZLES_TO_FETCH) break;
    if (consecutiveFails > 14) {
      console.log(`   Stopping: ${consecutiveFails} consecutive misses (likely reached start of series)`);
      break;
    }

    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);

    const puzzle = await fetchSportsPuzzle(dateStr);

    if (puzzle) {
      puzzles.push(puzzle);
      consecutiveFails = 0;
      if (puzzles.length % 50 === 0) {
        console.log(`   Fetched ${puzzles.length} puzzles (latest: ${dateStr})`);
      }
    } else {
      consecutiveFails++;
    }

    await sleep(FETCH_DELAY_MS);
  }

  console.log(`\n✅ Fetched ${puzzles.length} Sports Edition puzzles`);

  if (puzzles.length === 0) {
    console.error("❌ No puzzles fetched. Check API access.");
    process.exit(1);
  }

  // Sort oldest to newest (same as regular puzzles blob)
  puzzles.sort((a, b) => a.date.localeCompare(b.date));

  const firstPuzzle = puzzles[0];
  const lastPuzzle = puzzles[puzzles.length - 1];
  console.log(`   Range: ${firstPuzzle.date} (#${firstPuzzle.id}) → ${lastPuzzle.date} (#${lastPuzzle.id})\n`);

  // Build KV entries with sports: prefix
  const entries = [];

  for (const p of puzzles) {
    entries.push({ key: `sports:puzzle:date:${p.date}`, value: JSON.stringify(p) });
    entries.push({ key: `sports:puzzle:id:${p.id}`, value: JSON.stringify(p) });
  }

  // Sports index
  const dates = puzzles.map((p) => p.date).sort().reverse();
  const sportsIndex = {
    lastUpdated: new Date().toISOString(),
    count: puzzles.length,
    latestDate: dates[0],
    dates,
  };
  entries.push({ key: "sports:index", value: JSON.stringify(sportsIndex) });

  // Full puzzles blob
  entries.push({ key: "sports:all-puzzles", value: JSON.stringify(puzzles) });

  console.log(`📝 Total KV entries: ${entries.length}`);
  console.log(`   (${puzzles.length} date keys + ${puzzles.length} id keys + 2 meta keys)\n`);

  // Also save raw data to a local JSON file for reference
  const dataDir = path.join(__dirname, "..", "data", "sports");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const localFile = path.join(dataDir, "puzzles.json");
  fs.writeFileSync(
    localFile,
    JSON.stringify({ lastUpdated: sportsIndex.lastUpdated, puzzles }, null, 2),
    "utf-8"
  );
  console.log(`💾 Saved local copy to data/sports/puzzles.json\n`);

  // Write to KV via wrangler bulk put
  const tmpFile = path.join(__dirname, "..", "kv-sports-migration-data.json");
  fs.writeFileSync(tmpFile, JSON.stringify(entries, null, 2), "utf-8");

  console.log(`🚀 Uploading ${entries.length} entries to KV...`);
  try {
    execSync(`npx wrangler kv bulk put "${tmpFile}" --binding PUZZLES_KV --remote`, {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    });
    console.log(`\n✅ Migration complete! ${puzzles.length} sports puzzles written to KV`);
  } catch (err) {
    console.error(`\n❌ Upload failed:`, err.message);
    console.log("   The local JSON file is saved. You can retry the upload later.");
    process.exit(1);
  }

  // Cleanup
  fs.unlinkSync(tmpFile);
}

main();

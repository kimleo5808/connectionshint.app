#!/usr/bin/env node

/**
 * Connections Puzzle Data Updater
 *
 * Fetches puzzle data from the community-maintained Eyefyre/NYT-Connections-Answers
 * GitHub repository and merges it into our local data file.
 *
 * Run manually:   node scripts/update-connections.mjs
 * Via npm script:  pnpm run update:connections
 * Automated:       GitHub Actions cron (see .github/workflows/deploy-cloudflare.yml)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "..", "data", "connections");
const DATA_FILE = path.join(DATA_DIR, "puzzles.json");

// Community-maintained source with all historical puzzles
const COMMUNITY_SOURCE =
  "https://raw.githubusercontent.com/Eyefyre/NYT-Connections-Answers/refs/heads/main/connections.json";

// NYT official API (may require auth / cookies for some requests)
const NYT_API_BASE = "https://www.nytimes.com/svc/connections/v2";

/**
 * Fetch JSON from a URL with retries
 */
async function fetchJSON(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; ConnectionsHint/1.0; +https://connectionshint.app)",
          Accept: "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      console.error(
        `  Attempt ${attempt}/${retries} failed for ${url}: ${err.message}`
      );
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
  }
  return null;
}

/**
 * Load existing puzzle data from disk
 */
function loadExistingData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Could not load existing data:", err.message);
  }
  return { lastUpdated: "", puzzles: [] };
}

/**
 * Save puzzle data to disk
 */
function saveData(data) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Validate a puzzle entry has the expected shape
 */
function isValidPuzzle(puzzle) {
  if (!puzzle || typeof puzzle.id !== "number" || typeof puzzle.date !== "string")
    return false;
  if (!Array.isArray(puzzle.answers) || puzzle.answers.length !== 4) return false;
  return puzzle.answers.every(
    (a) =>
      typeof a.level === "number" &&
      typeof a.group === "string" &&
      Array.isArray(a.members) &&
      a.members.length === 4
  );
}

/**
 * Normalize a puzzle entry to our expected format
 */
function normalizePuzzle(puzzle) {
  const answers = puzzle.answers
    .map((a, idx) => ({
      // If level is -1 or missing, assign sequentially 0-3
      level: a.level >= 0 && a.level <= 3 ? a.level : idx,
      group: a.group,
      members: a.members.map((m) => String(m).toUpperCase()),
    }))
    .sort((a, b) => a.level - b.level);

  return {
    id: puzzle.id,
    date: puzzle.date,
    answers,
  };
}

/**
 * Try to fetch today's puzzle from the NYT API directly
 */
async function fetchFromNYT(dateStr) {
  console.log(`  Trying NYT API for ${dateStr}...`);
  const data = await fetchJSON(`${NYT_API_BASE}/${dateStr}.json`, 2);
  if (!data) return null;

  // NYT API v2 returns a different structure - normalize it
  try {
    if (data.categories) {
      // V2 format: { id, print_date, categories: [{title, cards: [{content, position}]}] }
      // NYT's `id` is an internal identifier, NOT the public puzzle number —
      // the caller assigns a provisional sequential id instead.
      const puzzle = {
        id: 0,
        date: data.print_date || dateStr,
        answers: data.categories.map((cat, idx) => ({
          level: idx,
          group: cat.title,
          members: cat.cards.map((c) => c.content),
        })),
      };
      if (isValidPuzzle(puzzle)) {
        console.log(`  ✓ Got puzzle from NYT API`);
        return normalizePuzzle(puzzle);
      }
    } else if (data.answers) {
      // Direct format matching community source
      if (isValidPuzzle(data)) {
        console.log(`  ✓ Got puzzle from NYT API`);
        return normalizePuzzle(data);
      }
    }
  } catch (err) {
    console.warn(`  NYT API parse error: ${err.message}`);
  }
  return null;
}

/**
 * Main update function
 */
async function main() {
  console.log("🔄 Connections Puzzle Data Updater");
  console.log("==================================\n");

  // 1. Load existing data
  const existing = loadExistingData();
  const existingDates = new Set(existing.puzzles.map((p) => p.date));
  console.log(
    `📦 Existing data: ${existing.puzzles.length} puzzles (last updated: ${existing.lastUpdated || "never"})`
  );

  // 2. Fetch from community source
  console.log(`\n📡 Fetching from community source...`);
  const communityData = await fetchJSON(COMMUNITY_SOURCE);

  let newPuzzles = [];
  if (communityData && Array.isArray(communityData)) {
    console.log(`  ✓ Got ${communityData.length} total puzzles from community source`);

    for (const puzzle of communityData) {
      if (isValidPuzzle(puzzle) && !existingDates.has(puzzle.date)) {
        newPuzzles.push(normalizePuzzle(puzzle));
        existingDates.add(puzzle.date);
      }
    }
    console.log(`  → ${newPuzzles.length} new puzzles from community source`);
  } else {
    console.warn("  ✗ Could not fetch community data");
  }

  // 3. Try NYT API for today if we don't have it yet
  const today = new Date().toISOString().split("T")[0];
  if (!existingDates.has(today)) {
    const nytPuzzle = await fetchFromNYT(today);
    if (nytPuzzle) {
      // Provisional id: next number in sequence; the community source (and
      // scripts/reconcile-kv.mjs) corrects it later if it was wrong.
      const maxId = Math.max(
        0,
        ...existing.puzzles.map((p) => p.id),
        ...newPuzzles.map((p) => p.id)
      );
      newPuzzles.push({ ...nytPuzzle, id: maxId + 1 });
      existingDates.add(today);
    }
  } else {
    console.log(`\n📅 Today's puzzle (${today}) already in data`);
  }

  // 4. Merge and save
  if (newPuzzles.length > 0) {
    const allPuzzles = [...existing.puzzles, ...newPuzzles].sort(
      (a, b) => a.date.localeCompare(b.date)
    );

    const updatedData = {
      lastUpdated: new Date().toISOString(),
      puzzles: allPuzzles,
    };

    saveData(updatedData);
    console.log(
      `\n✅ Saved ${allPuzzles.length} total puzzles (${newPuzzles.length} new)`
    );
  } else {
    console.log(`\n✅ No new puzzles to add. Data is up to date.`);
    // Update timestamp even if no new data
    existing.lastUpdated = new Date().toISOString();
    saveData(existing);
  }

  // 5. Summary
  const finalData = loadExistingData();
  const dates = finalData.puzzles.map((p) => p.date).sort();
  console.log(`\n📊 Summary:`);
  console.log(`   Total puzzles: ${finalData.puzzles.length}`);
  if (dates.length > 0) {
    console.log(`   Date range: ${dates[0]} → ${dates[dates.length - 1]}`);
  }
  console.log(`   Last updated: ${finalData.lastUpdated}`);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});

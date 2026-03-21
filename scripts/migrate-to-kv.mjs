#!/usr/bin/env node

/**
 * One-time migration script: bulk-write puzzles.json data into Cloudflare KV.
 *
 * Usage:
 *   1. Create the KV namespace:
 *      wrangler kv namespace create PUZZLES_KV
 *   2. Update wrangler.jsonc with the returned namespace ID
 *   3. Run this script:
 *      node scripts/migrate-to-kv.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "..", "data", "connections", "puzzles.json");
const BATCH_SIZE = 10000; // KV bulk put max per call

function main() {
  console.log("📦 Loading puzzles.json...");
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const data = JSON.parse(raw);
  const puzzles = data.puzzles;

  console.log(`   Found ${puzzles.length} puzzles\n`);

  // Build KV entries
  const entries = [];

  // Individual puzzle keys (by date and by id)
  for (const p of puzzles) {
    entries.push({ key: `puzzle:date:${p.date}`, value: JSON.stringify(p) });
    entries.push({ key: `puzzle:id:${p.id}`, value: JSON.stringify(p) });
  }

  // Meta index (lightweight)
  const dates = puzzles.map((p) => p.date).sort().reverse();
  const months = [...new Set(dates.map((d) => d.slice(0, 7)))].sort().reverse();
  const index = {
    lastUpdated: data.lastUpdated,
    count: puzzles.length,
    latestDate: dates[0],
    dates,
    months,
  };
  entries.push({ key: "meta:index", value: JSON.stringify(index) });

  // Full puzzles blob for getAllPuzzles (archive, sitemap)
  entries.push({ key: "meta:all-puzzles", value: JSON.stringify(puzzles) });

  console.log(`📝 Total KV entries: ${entries.length}`);
  console.log(`   (${puzzles.length} date keys + ${puzzles.length} id keys + 2 meta keys)\n`);

  // Write to temp file for wrangler bulk put
  const tmpFile = path.join(__dirname, "..", "kv-migration-data.json");

  // Split into batches if needed
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(entries.length / BATCH_SIZE);

    fs.writeFileSync(tmpFile, JSON.stringify(batch, null, 2), "utf-8");
    console.log(`🚀 Uploading batch ${batchNum}/${totalBatches} (${batch.length} entries)...`);

    try {
      execSync(`npx wrangler kv bulk put "${tmpFile}" --binding PUZZLES_KV --remote`, {
        stdio: "inherit",
        cwd: path.join(__dirname, ".."),
      });
      console.log(`   ✓ Batch ${batchNum} uploaded successfully\n`);
    } catch (err) {
      console.error(`   ✗ Batch ${batchNum} failed:`, err.message);
      process.exit(1);
    }
  }

  // Cleanup temp file
  fs.unlinkSync(tmpFile);

  console.log("✅ Migration complete!");
  console.log(`   ${puzzles.length} puzzles written to KV`);

  // Also generate the static index file for build-time use
  generateStaticIndex(puzzles, data.lastUpdated);
}

function generateStaticIndex(puzzles, lastUpdated) {
  const indexFile = path.join(__dirname, "..", "data", "connections", "puzzle-index.json");
  const index = {
    lastUpdated,
    puzzles: puzzles
      .map((p) => ({ id: p.id, date: p.date }))
      .sort((a, b) => b.date.localeCompare(a.date)),
  };

  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2), "utf-8");
  console.log(`\n📄 Generated puzzle-index.json (${index.puzzles.length} entries)`);
}

main();

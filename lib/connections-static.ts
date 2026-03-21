/**
 * Build-time only data access for generateStaticParams.
 * Uses the lightweight puzzle-index.json (dates + IDs only)
 * so that builds don't require KV access.
 */
import indexData from "@/data/connections/puzzle-index.json";

interface PuzzleIndexEntry {
  id: number;
  date: string;
}

interface PuzzleIndexFile {
  lastUpdated: string;
  puzzles: PuzzleIndexEntry[];
}

const data = indexData as PuzzleIndexFile;

/** Get all puzzle dates and IDs (newest first) for static generation */
export function getStaticPuzzles(): PuzzleIndexEntry[] {
  return data.puzzles;
}

/** Get all available months from the static index */
export function getStaticAvailableMonths(): string[] {
  const months = new Set(data.puzzles.map((p) => p.date.slice(0, 7)));
  return Array.from(months).sort().reverse();
}

/** Difficulty levels for Connections puzzle groups */
export type ConnectionsLevel = 0 | 1 | 2 | 3;

/** Color names mapped to difficulty levels */
export const LEVEL_COLORS: Record<ConnectionsLevel, string> = {
  0: "yellow",
  1: "green",
  2: "blue",
  3: "purple",
};

/** Display labels for difficulty levels */
export const LEVEL_LABELS: Record<ConnectionsLevel, string> = {
  0: "Straightforward",
  1: "Moderate",
  2: "Tricky",
  3: "Challenging",
};

/** A single group/category within a Connections puzzle */
export interface ConnectionsGroup {
  /** Difficulty level: 0=Yellow, 1=Green, 2=Blue, 3=Purple */
  level: ConnectionsLevel;
  /** Category name / description */
  group: string;
  /** The 4 words belonging to this group */
  members: string[];
}

/** A complete Connections puzzle for a single day */
export interface ConnectionsPuzzle {
  /** Image cards are displayed using the original puzzle's text labels. */
  imageTiles?: boolean;
  /** Puzzle number (sequential since first puzzle) */
  id: number;
  /** Date string in YYYY-MM-DD format */
  date: string;
  /** The 4 groups that make up this puzzle */
  answers: ConnectionsGroup[];
}

/** Hint for a single group (progressive reveal) */
export interface ConnectionsHint {
  level: ConnectionsLevel;
  /** Vague thematic hint */
  hint1: string;
  /** More specific hint */
  hint2: string;
  /** Near-giveaway hint */
  hint3: string;
}

/** Full hint set for a puzzle */
export interface PuzzleHints {
  date: string;
  puzzleId: number;
  hints: ConnectionsHint[];
}

/** Data file structure stored in data/connections/puzzles.json */
export interface ConnectionsDataFile {
  lastUpdated: string;
  puzzles: ConnectionsPuzzle[];
}

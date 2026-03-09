export type PatternPageSlug =
  | "fill-in-the-blank"
  | "wordplay"
  | "common-traps";

export type PatternPageConfig = {
  slug: PatternPageSlug;
  title: string;
  metaTitle: string;
  description: string;
  hero: string;
  intro: string;
  signals: string[];
  mistakes: string[];
  process: string[];
  relatedGuideSlugs: string[];
};

export const PATTERN_PAGE_CONFIGS: PatternPageConfig[] = [
  {
    slug: "fill-in-the-blank",
    title: "Fill-in-the-Blank Patterns in Connections",
    metaTitle: "Fill-in-the-Blank Patterns in Connections",
    description:
      "Learn how fill-in-the-blank categories work in Connections, how to spot them early, and which real boards are worth studying.",
    hero:
      "These categories look disconnected until a shared phrase snaps into place.",
    intro:
      "A fill-in-the-blank group often looks unrelated at first because the real connection is hidden in a missing phrase. When four words only make sense after you mentally add the same word before or after them, you are usually dealing with this pattern.",
    signals: [
      "The words do not feel like a normal topic-based category on their own.",
      "Several options become plausible only after you imagine the same missing word around them.",
      "The board gets easier once the most literal group is removed and the phrase logic is easier to see.",
    ],
    mistakes: [
      "Submitting four words that feel vaguely related instead of testing a real phrase.",
      "Treating the category like a normal subject match when the connection is actually structural.",
      "Changing only one word after a one-away result instead of rechecking the whole phrase idea.",
    ],
    process: [
      "Clear the most direct category first to reduce overlap.",
      "Test likely words before or after the same missing phrase.",
      "Confirm that all four words fit the exact same wording, not just a similar theme.",
    ],
    relatedGuideSlugs: ["strategy-tips", "common-mistakes", "advanced-techniques"],
  },
  {
    slug: "wordplay",
    title: "Wordplay Categories in Connections",
    metaTitle: "Wordplay Categories in Connections",
    description:
      "Study the Connections groups that rely on spelling, phrasing, and language structure instead of plain topic matching.",
    hero:
      "These categories punish players who keep grouping by topic after the puzzle has already shifted to language structure.",
    intro:
      "Wordplay groups become hard when the board stops rewarding straightforward meaning. Instead of asking what the words refer to, you need to ask how they sound, how they are spelled, or how they behave inside a phrase pattern.",
    signals: [
      "A likely group feels close but still not exact at the topic level.",
      "The remaining words look unrelated semantically but share a sound, letter pattern, or structural trick.",
      "The purple group only makes sense after you stop looking for a conventional category label.",
    ],
    mistakes: [
      "Forcing the words into a theme when the board has already shifted to structure.",
      "Ignoring prefixes, suffixes, hidden words, or phrase behavior.",
      "Assuming purple always means obscure knowledge instead of clever language design.",
    ],
    process: [
      "Solve the clean thematic groups first.",
      "Look for sound, spelling, and phrase structure among the remaining words.",
      "Check whether the four answers behave the same way, not just whether they look loosely related.",
    ],
    relatedGuideSlugs: ["advanced-techniques", "why-so-hard", "strategy-tips"],
  },
  {
    slug: "common-traps",
    title: "Common Connections Traps and Red Herrings",
    metaTitle: "Common Connections Traps and Red Herrings",
    description:
      "Learn the fake groupings that cause one-away mistakes in Connections and study real historical boards with strong red-herring pressure.",
    hero:
      "The most convincing wrong groups are not random. They are designed to look right one move too early.",
    intro:
      "A trap group usually feels convincing because three of the four words genuinely do belong together, or because all four words share a loose surface similarity. That is why so many failed Connections attempts end in one-away mistakes instead of completely random guesses.",
    signals: [
      "Five or more words seem to fit the same broad category.",
      "One guess feels almost too obvious for a blue or purple group.",
      "A set works loosely, but the category label would still be vague or imprecise.",
    ],
    mistakes: [
      "Submitting the first plausible group without checking alternative homes for each word.",
      "Swapping one word after a one-away message without rethinking the category.",
      "Treating broad similarity as proof instead of asking whether the group has a precise rule.",
    ],
    process: [
      "When a group looks obvious, check whether one or two words also fit somewhere else.",
      "If you get one away, restart the whole set instead of patching it.",
      "Prefer exact group logic over broad association, especially late in the solve.",
    ],
    relatedGuideSlugs: ["common-mistakes", "strategy-tips", "beginner-guide"],
  },
];

export function getPatternPageConfig(slug: string): PatternPageConfig | undefined {
  return PATTERN_PAGE_CONFIGS.find((page) => page.slug === slug);
}

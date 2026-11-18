import { LessonPage } from "@/components/connections/lessons/LessonPage";
import Scratchpad from "@/components/connections/scratchpad/Scratchpad";
import ScratchpadGuide from "@/components/connections/scratchpad/ScratchpadGuide";
import { wordProblem } from "@/components/connections/scratchpad/board";
import type { BoardSource } from "@/components/connections/scratchpad/board";
import { getPuzzleByDate, getTodayPuzzle } from "@/lib/connections-data";
import { constructMetadata } from "@/lib/metadata";
import type { ConnectionsPuzzle } from "@/types/connections";

export const dynamic = "force-dynamic";
const path = "/connections-scratchpad";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return constructMetadata({
    locale: (await params).locale,
    page: "Connections Scratchpad",
    path,
    canonicalUrl: path,
    title: "Connections Scratchpad – Rearrange the 16 Tiles",
    description: "Swap tiles, name your draft groups and undo a move. Arrange today's Connections words, try an archive example or paste your own board without revealing answers.",
    images: ["/images/scratchpad-mustard.webp"],
    keywords: ["Connections scratchpad", "Connections board organizer", "rearrange Connections tiles"],
  });
}

function boardSource(puzzle: ConnectionsPuzzle | undefined, today = false): BoardSource[] {
  if (!puzzle || puzzle.imageTiles) return [];
  const words = puzzle.answers.flatMap(group => group.members).sort();
  if (wordProblem(words)) return [];
  const date = new Date(puzzle.date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  });
  return [{ id: puzzle.date, words, dateLabel: date, label: `${today ? "Today" : "Archive"} #${puzzle.id}` }];
}

export default async function ScratchpadPage() {
  const [today, first, second] = await Promise.all([
    getTodayPuzzle(), getPuzzleByDate("2023-06-16"), getPuzzleByDate("2023-06-19"),
  ]);
  const boards = [...boardSource(today, true), ...boardSource(first), ...boardSource(second)];
  return (
    <LessonPage title="Connections Scratchpad" path={path} tone="archive"
      parent={{ label: "Connections tools", path: "/connections-solver" }}
      intro="Rearrange 16 words into four possible groups."
      guidePreview={{ file: "/images/scratchpad-mustard.webp", label: "The mustard swap", anchor: "mustard" }}>
      <Scratchpad boards={boards}/>
      <ScratchpadGuide/>
    </LessonPage>
  );
}

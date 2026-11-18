import { notFound, redirect } from "next/navigation";
import { LessonPage } from "@/components/connections/lessons/LessonPage";
import TimedRound from "@/components/connections/timed/TimedRound";
import TimedGuide from "@/components/connections/timed/TimedGuide";
import { getPuzzleById } from "@/lib/connections-data";
import { constructMetadata } from "@/lib/metadata";

const path = "/timed-connections";
const boardIds = [44, 68, 143, 224, 327, 545, 625, 826];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return constructMetadata({ locale: (await params).locale, page: "Timed Connections", path, canonicalUrl: path,
    title: "Timed Connections – Play With a Stopwatch and Group Splits",
    description: "Start the clock on eight past Connections puzzles. See your time for each group and keep a personal best for every board you finish in this browser.",
    images: ["/images/timed-connections-stopwatch.webp"], keywords: ["timed Connections", "Connections speedrun", "Connections game with timer"] });
}

export default async function TimedPage({ searchParams }: { searchParams: Promise<{ board?: string | string[] }> }) {
  const { board } = await searchParams;
  const id = board === undefined ? 143 : boardIds.find(candidate => String(candidate) === board);
  if (!id) redirect(path);
  const puzzle = await getPuzzleById(id);
  if (!puzzle) notFound();
  return <LessonPage title="Timed Connections" path={path} tone="swap"
    parent={{ label: "Puzzle practice", path: "/connections-practice" }}
    intro="Start the stopwatch, find four groups and see where your solving time went."
    guidePreview={{ file: "/images/timed-connections-stopwatch.webp", label: "Read the split sheet", anchor: "splits" }}>
    <TimedRound key={id} puzzle={puzzle} boardIds={boardIds} />
    <TimedGuide />
  </LessonPage>;
}

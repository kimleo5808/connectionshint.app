import { notFound, redirect } from "next/navigation";
import { LessonPage } from "@/components/connections/lessons/LessonPage";
import RainbowRound from "@/components/connections/rainbow/RainbowRound";
import RainbowGuide from "@/components/connections/rainbow/RainbowGuide";
import { getPuzzleById } from "@/lib/connections-data";
import { constructMetadata } from "@/lib/metadata";

const path = "/connections-reverse-rainbow";
const boardIds = [9, 13, 32, 50, 73, 90, 200, 555];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return constructMetadata({
    page: "Reverse rainbow practice",
    locale: (await params).locale,
    path,
    canonicalUrl: path,
    title: "Connections Reverse Rainbow – Play the Color-Order Challenge",
    description: "Practice Connections reverse rainbow on eight archive boards. Solve purple, blue, green and yellow in order with a live tracker, then study two worked puzzles.",
    keywords: ["Connections reverse rainbow", "Connections reverse rainbow order", "purple first Connections practice"],
    images: ["/images/reverse-rainbow-cricket.webp"],
  });
}

export default async function RainbowPage({ searchParams }: { searchParams: Promise<{ board?: string | string[] }> }) {
  const { board } = await searchParams;
  const id = board === undefined ? 73 : boardIds.find(number => String(number) === board);
  if (!id) redirect(path);
  const puzzle = await getPuzzleById(id);
  if (!puzzle) notFound();
  return <LessonPage parent={{ label: "Puzzle practice", path: "/connections-practice" }}
    path={path} tone="purple" title="Connections Reverse Rainbow" intro="Solve purple, blue, green and yellow in four guesses."
    guidePreview={{ file: "/images/reverse-rainbow-cricket.webp", label: "The cricket puzzle", anchor: "cricket" }}>
    <RainbowRound key={id} puzzle={puzzle} boardIds={boardIds}/>
    <RainbowGuide/>
  </LessonPage>;
}

import { redirect } from "next/navigation";
import { LessonPage } from "@/components/connections/lessons/LessonPage";
import KidsGame from "@/components/connections/kids/KidsGame";
import KidsGuide from "@/components/connections/kids/KidsGuide";
import { kidsBoards } from "@/data/kids-boards";
import { constructMetadata } from "@/lib/metadata";

const path = "/connections-for-kids";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return constructMetadata({ locale: (await params).locale, page: "Connections for Kids", path, canonicalUrl: path,
    title: "Connections for Kids – Play 12 Word Grouping Puzzles",
    description: "Find four groups of four words in free Connections puzzles for kids. Pick a level, use two-step hints and learn why each group belongs together.",
    keywords: ["connections for kids", "kids word grouping game", "easy connections puzzles for kids"],
    images: ["/images/kids-connections-bat.webp"] });
}

export default async function KidsPage({ searchParams }: { searchParams: Promise<{ board?: string | string[] }> }) {
  const { board } = await searchParams;
  const index = board === undefined ? 0 : typeof board === "string" && /^\d{1,2}$/.test(board) ? Number(board) - 1 : -1;
  if (index < 0 || index >= kidsBoards.length) redirect(path);
  return <LessonPage path={path} title="Connections for Kids" tone="archive"
    parent={{ label: "Puzzle practice", path: "/connections-practice" }}
    intro="Pick four words that belong together. Take a hint anytime and try as often as you like."
    guidePreview={{ file: "/images/kids-connections-bat.webp", label: "Two ways to read BAT", anchor: "bat" }}>
    <KidsGame key={index} board={kidsBoards[index]} index={index}
      choices={kidsBoards.map(({ title, difficulty }) => ({ title, difficulty }))} />
    <KidsGuide />
  </LessonPage>;
}

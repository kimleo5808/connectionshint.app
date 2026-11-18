import { redirect } from "next/navigation";
import { LessonPage } from "@/components/connections/lessons/LessonPage";
import MiniRound from "@/components/connections/mini/MiniRound";
import MiniGuide from "@/components/connections/mini/MiniGuide";
import { miniBoards } from "@/data/mini-boards";
import { constructMetadata } from "@/lib/metadata";

const path = "/mini-connections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return constructMetadata({ locale:(await params).locale, page:"Mini Connections", path, canonicalUrl:path,
    title:"Mini Connections – Play 12 Original 3×3 Word Puzzles",
    description:"Play Mini Connections with nine words and three groups of three. Choose an original practice board, take a hint and see why the tempting word belongs elsewhere.",
    images:["/images/mini-connections-apple.webp"], keywords:["Mini Connections", "3x3 Connections game", "nine word grouping puzzle"] });
}

export default async function MiniPage({ searchParams }: { searchParams: Promise<{ board?: string | string[] }> }) {
  const { board } = await searchParams;
  const number = board === undefined ? 1 : typeof board === "string" && /^\d{1,2}$/.test(board) ? Number(board) : 0;
  if (number < 1 || number > miniBoards.length) redirect(path);
  return <LessonPage path={path} tone="purple" parent={{label:"Puzzle practice",path:"/connections-practice"}}
    title="Mini Connections" intro="Group nine words into three trios. Pick from twelve original ConnectionsHint puzzles."
    guidePreview={{file:"/images/mini-connections-apple.webp",label:"The APPLE puzzle",anchor:"apple"}}>
    <MiniRound key={number} board={miniBoards[number-1]} number={number} total={miniBoards.length}/>
    <MiniGuide/>
  </LessonPage>;
}

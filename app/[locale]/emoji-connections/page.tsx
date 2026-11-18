import { redirect } from "next/navigation";
import { LessonPage } from "@/components/connections/lessons/LessonPage";
import EmojiRound from "@/components/connections/emoji/EmojiRound";
import EmojiGuide from "@/components/connections/emoji/EmojiGuide";
import { emojiBoards } from "@/data/emoji-boards";
import { constructMetadata } from "@/lib/metadata";

const path = "/emoji-connections";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return constructMetadata({
    page: "Emoji Connections", locale: (await params).locale, path, canonicalUrl: path,
    title: "Emoji Connections – Play 6 Picture Grouping Puzzles",
    description: "Sort 16 emoji into four groups. Play six original Emoji Connections puzzles, switch on picture names, and see how an unexpected icon completes each board.",
    keywords: ["Emoji Connections", "emoji grouping game", "picture connections puzzle"],
    images: ["/images/emoji-connections-necks.webp"],
  });
}

export default async function EmojiPage({ searchParams }: { searchParams: Promise<{ board?: string | string[] }> }) {
  const { board } = await searchParams;
  const number = board === undefined ? 1 : Number(board);
  if (board !== undefined && (String(number) !== board || !Number.isInteger(number) || number < 1 || number > emojiBoards.length)) redirect(path);
  return <LessonPage title="Emoji Connections" path={path} tone="swap"
    parent={{ label: "Puzzle practice", path: "/connections-practice" }}
    intro="Find four groups of four pictures. Choose from six original boards."
    guidePreview={{ file: "/images/emoji-connections-necks.webp", label: "Four kinds of neck", anchor: "necks" }}>
    <EmojiRound key={number} board={emojiBoards[number - 1]} number={number} total={emojiBoards.length}/>
    <EmojiGuide/>
  </LessonPage>;
}

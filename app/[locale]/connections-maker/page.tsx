import { LessonPage } from "@/components/connections/lessons/LessonPage";
import PuzzleMaker from "@/components/connections/maker/PuzzleMaker";
import MakerGuide from "@/components/connections/maker/MakerGuide";
import { constructMetadata } from "@/lib/metadata";

const path = "/connections-maker";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return constructMetadata({ locale, page:"Puzzle Maker", path, canonicalUrl:path,
    title:"Connections Puzzle Maker – Create and Share Your Own Game",
    description:"Make a custom Connections puzzle with four groups of four words. Playtest a shuffled board, share it with friends and learn how to write a fair red herring.",
    images:["/images/connections-maker-bass.webp"], keywords:["connections puzzle maker", "create your own connections puzzle", "custom connections game"] });
}

export default function MakerPage() {
  return <LessonPage path={path} tone="purple" parent={{ label:"Puzzle practice", path:"/connections-practice" }}
    title="Connections Puzzle Maker" intro="Write four groups of four words, try the shuffled board, then share a playable link."
    guidePreview={{ file:"/images/connections-maker-bass.webp", label:"The BASS example", anchor:"red-herring" }}>
    <PuzzleMaker/><MakerGuide/>
  </LessonPage>;
}

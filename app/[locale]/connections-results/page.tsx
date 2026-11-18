import { LessonPage } from "@/components/connections/lessons/LessonPage";
import ResultAnalyzer from "@/components/connections/results/ResultAnalyzer";
import ResultsGuide from "@/components/connections/results/ResultsGuide";
import { constructMetadata } from "@/lib/metadata";

const path = "/connections-results";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return constructMetadata({ locale:(await params).locale, page:"Result grid", path, canonicalUrl:path,
    title:"Connections Results Explained – Read Your Emoji Grid",
    description:"Paste your Connections results to see the groups you solved, your mistakes and one-away guesses. Read each emoji row without revealing the puzzle answers.",
    images:["/images/result-grid-loupe.webp"], keywords:["Connections results explained","Connections emoji grid meaning","Connections results analyzer"] });
}

export default function ResultsPage() {
  return <LessonPage path={path} parent={{ label:"Streak tracker", path:"/connections-streak" }} tone="archive"
    title="Connections Results Explained" intro="Paste your colored squares to see solved groups, mistakes and one-away guesses."
    guidePreview={{ file:"/images/result-grid-loupe.webp", label:"Read a one-away row", anchor:"near-miss" }}>
    <ResultAnalyzer/><ResultsGuide/>
  </LessonPage>;
}

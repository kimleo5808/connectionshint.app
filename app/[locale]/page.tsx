import HomeComponent from "@/components/home";
import { Locale, LOCALES } from "@/i18n/routing";
import { getLatestPuzzle } from "@/lib/connections-data";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

function generateHomeTitle() {
  return "Connections Hint Today, Archive, and Puzzle Guides";
}

function generateHomeDescription(latestDate?: string) {
  const dateNote = latestDate
    ? ` Updated through ${latestDate}.`
    : "";

  return `Use ConnectionsHint to get progressive clues for today's NYT Connections board, review past puzzles by date, and study recurring category patterns without jumping straight to spoilers.${dateNote}`;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const latestPuzzle = await getLatestPuzzle();

  return constructMetadata({
    page: "Home",
    title: generateHomeTitle(),
    description: generateHomeDescription(latestPuzzle?.date),
    keywords: [
      "connections hint today",
      "nyt connections hints",
      "connections puzzle archive",
      "connections answers by date",
      "connections strategy guide",
      "connections helper",
    ],
    locale: locale as Locale,
    path: `/`,
    canonicalUrl: `/`,
  });
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function Home() {
  return <HomeComponent />;
}

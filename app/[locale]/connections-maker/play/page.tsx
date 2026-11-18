import { SharedBoard } from "@/components/connections/maker/CustomBoard";
import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return constructMetadata({ locale:(await params).locale, page:"Custom puzzle", path:"/connections-maker/play",
    title:"Play a Custom Connections Puzzle", description:"A friend has made a word puzzle for you. Find four groups of four.", noIndex:true });
}

export default function PlayPage() { return <SharedBoard/>; }

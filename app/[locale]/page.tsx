import HomeComponent from "@/components/home";
import { LOCALES } from "@/i18n/routing";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function Home() {
  return <HomeComponent />;
}

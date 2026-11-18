import SiteDocument from "@/app/SiteDocument";
export { generateMetadata, viewport } from "@/app/SiteDocument";

// A separate root document drops any advertising scripts from a previous page.
export default function KidsLayout(props: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  return <SiteDocument {...props} kids />;
}

import MarkdownContent from "@/components/content/MarkdownContent";
import { BASE_URL } from "@/config/site";
import { STATIC_PAGE_CONTENT } from "@/data/static-content";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Params = Promise<{
  locale: string;
}>;

type MetadataProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return constructMetadata({
    page: "About",
    title: t("title"),
    description: t("description"),
    keywords: [
      "about connectionshint", "connections hint website", "nyt connections help site",
    ],
    locale: locale as Locale,
    path: `/about`,
    canonicalUrl: `/about`,
  });
}

export default async function AboutPage({ params }: { params: Params }) {
  await params;
  const content = STATIC_PAGE_CONTENT.about.body;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "About", url: `${BASE_URL}/about` },
        ])}
      />
      <header className="relative overflow-hidden rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50 p-6 dark:border-blue-900/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-slate-950">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-blue-200/20 blur-3xl" />
        <h1 className="relative font-heading text-3xl font-bold text-foreground sm:text-4xl">
          About ConnectionsHint
        </h1>
        <p className="relative mt-4 text-muted-foreground">
          How we provide daily NYT Connections hints and maintain our puzzle archive.
        </p>
      </header>

      <article className="rounded-2xl border border-blue-100 bg-card p-6 dark:border-blue-900/40 sm:p-8">
        <MarkdownContent markdown={content} />
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({
    locale,
  }));
}

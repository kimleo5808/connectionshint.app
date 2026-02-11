import { forgeRecentSnapshots, forgeSiteFacts } from "@/lib/forge-data";
import {
  ArrowRight,
  CalendarClock,
  ChevronDown,
  CircleDot,
  Flame,
  Gift,
  ListChecks,
  SearchCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

const latestSnapshot = forgeRecentSnapshots[0];
const latestActivePreview = (latestSnapshot?.activeCodes ?? []).slice(0, 8);

/* keywordSignalCards moved to translation files: HomePage.signalCards */

/* homepageSections and faqItems moved to translation files: HomePage.sections / HomePage.faqItems */

type RecentListProps = {
  currentDate?: string;
  labels: {
    liveHub: string;
    history: string;
    recentCodes: string;
    viewAllHistory: string;
    active: string;
    expired: string;
  };
  locale: string;
};

function formatRecentDate(dateText: string, locale: string) {
  const date = new Date(`${dateText}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return dateText;
  }

  const localeMap: Record<string, string> = { en: "en-US", zh: "zh-CN", ja: "ja-JP" };
  return date.toLocaleDateString(localeMap[locale] || "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function RecentCodesList({ currentDate, labels, locale }: RecentListProps) {
  return (
    <aside className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-lg dark:border-indigo-900/40 dark:bg-slate-950">
      <div className="grid grid-cols-2 gap-2 p-4">
        <Link
          href="/the-forge-codes"
          className="rounded-lg bg-indigo-600 px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-indigo-700"
        >
          {labels.liveHub}
        </Link>
        <Link
          href="/the-forge-codes-history"
          className="rounded-lg bg-violet-600 px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-violet-700"
        >
          {labels.history}
        </Link>
      </div>

      <div className="px-4 pb-2">
        <h2 className="font-heading text-2xl text-slate-900 dark:text-slate-100">
          {labels.recentCodes}
        </h2>
      </div>

      <div className="border-t border-indigo-100 dark:border-indigo-900/50">
        {forgeRecentSnapshots.slice(0, 7).map((item) => (
          <Link
            key={item.date}
            href={`/the-forge-codes/${item.date}`}
            className={`block border-b border-indigo-50 px-4 py-3 text-sm transition-colors last:border-b-0 dark:border-indigo-900/30 ${
              currentDate === item.date
                ? "bg-indigo-50 font-semibold text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-200"
                : "text-slate-700 hover:bg-indigo-50/60 dark:text-slate-300 dark:hover:bg-indigo-900/10"
            }`}
          >
            <p>The Forge Codes ({formatRecentDate(item.date, locale)})</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.activeCodes.length}</span> {labels.active} |{" "}
              <span className="font-semibold text-red-500">{item.expiredCodes.length}</span> {labels.expired}
            </p>
          </Link>
        ))}
      </div>

      <div className="border-t border-indigo-100 px-4 py-3 dark:border-indigo-900/50">
        <Link
          href="/the-forge-codes-history"
          className="flex items-center justify-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {labels.viewAllHistory}
        </Link>
      </div>
    </aside>
  );
}

function FaqAccordionItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-indigo-100 transition-colors open:bg-indigo-50/40 dark:border-indigo-900/40 dark:open:bg-indigo-900/10">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-900 transition-colors hover:text-indigo-700 dark:text-slate-100 dark:hover:text-indigo-400 [&::-webkit-details-marker]:hidden">
        <h3 className="text-[0.95rem] leading-snug">{question}</h3>
        <ChevronDown className="h-4 w-4 shrink-0 text-indigo-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-4">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {answer}
        </p>
      </div>
    </details>
  );
}

export default async function HomeComponent() {
  const t = await getTranslations("HomePage");
  const locale = await getLocale();
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="flex flex-col gap-8">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-8 shadow-md dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/50">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-600/10" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-600/10" />

            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:border-indigo-800 dark:bg-slate-900/80 dark:text-indigo-300">
                <Flame className="h-3.5 w-3.5" />
                theforgecodes.app
              </p>
              <h1 className="mt-4 max-w-4xl font-heading text-4xl tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
                {t("hero.title")}
              </h1>
              <p
                className="mt-4 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300 [&_strong]:text-slate-800 dark:[&_strong]:text-slate-100"
                dangerouslySetInnerHTML={{ __html: t("hero.description1") }}
              />
              <p
                className="mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 [&_strong]:text-slate-800 dark:[&_strong]:text-slate-100"
                dangerouslySetInnerHTML={{ __html: t("hero.description2") }}
              />

              <div className="mt-6 overflow-hidden rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
                <Image
                  src="/images/the-forge-roblox-official-artwork.jpg"
                  alt="The Forge Roblox game official artwork showing a blacksmith forging weapons with sparks and the game logo"
                  width={960}
                  height={540}
                  className="w-full object-cover"
                  priority
                />
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/the-forge-codes"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-orange-500/30"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t("hero.openLiveHub")}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Link>
                <Link
                  href="/the-forge-codes-history"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-indigo-200 bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-950/50"
                >
                  {t("hero.browseHistory")}
                  <ListChecks className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Keyword Signal Cards */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <article
                key={index}
                className="rounded-2xl border-l-4 border-l-indigo-500 border-t border-r border-b border-t-slate-100 border-r-slate-100 border-b-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-t-slate-800 dark:border-r-slate-800 dark:border-b-slate-800 dark:bg-slate-950"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                  {t(`signalCards.${index}.label`)}
                </p>
                <p className="mt-1 font-heading text-3xl text-indigo-600 dark:text-indigo-400">
                  {t(`signalCards.${index}.value`)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {t(`signalCards.${index}.note`)}
                </p>
              </article>
            ))}
          </section>

          {/* Quick Active Preview */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="flex items-center gap-2 font-heading text-2xl text-slate-900 dark:text-slate-100">
              <Gift className="h-5 w-5 text-indigo-500" />
              {t("quickPreview.title")}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: t("quickPreview.description") }}>

            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {latestActivePreview.map((item) => (
                <div
                  key={item.code}
                  className="group rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-indigo-800"
                >
                  <div className="flex items-center gap-2">
                    <CircleDot className="h-3 w-3 text-emerald-500" />
                    <p className="font-mono text-sm font-bold text-indigo-700 dark:text-indigo-300">
                      {item.code}
                    </p>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {item.reward}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="/the-forge-codes"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {t("quickPreview.seeFullTables")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Operational Snapshot */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="flex items-center gap-2 font-heading text-2xl text-slate-900 dark:text-slate-100">
              <CalendarClock className="h-5 w-5 text-indigo-500" />
              {t("snapshot.title")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("snapshot.activeCodes")}
                </p>
                <p className="mt-1 font-heading text-3xl text-emerald-600 dark:text-emerald-400">
                  {forgeSiteFacts.activeCount}
                </p>
              </article>
              <article className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("snapshot.expiredTracked")}
                </p>
                <p className="mt-1 font-heading text-3xl text-red-500">
                  {forgeSiteFacts.expiredCount}
                </p>
              </article>
              <article className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("snapshot.latestSnapshot")}
                </p>
                <p className="mt-1 font-heading text-3xl text-indigo-600 dark:text-indigo-400">
                  {forgeSiteFacts.latestSnapshotDate}
                </p>
              </article>
              <article className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("snapshot.avgSearch")}
                </p>
                <p className="mt-1 font-heading text-3xl text-violet-600 dark:text-violet-400">
                  {forgeSiteFacts.monthlySearchEstimate}
                </p>
              </article>
            </div>
          </section>

          {/* SEO Content Sections */}
          {[0, 1, 2, 3, 4].map((sectionIndex) => {
            const sectionId = t(`sections.${sectionIndex}.id`);
            const subsectionKeys = sectionIndex === 0 ? [0, 1, 2] : sectionIndex === 1 ? [0, 1, 2, 3] : [0, 1];
            return (
              <section
                key={sectionId}
                id={sectionId}
                className={`rounded-2xl border border-slate-100 p-6 shadow-sm dark:border-slate-800 ${
                  sectionIndex % 2 === 0
                    ? "bg-white dark:bg-slate-950"
                    : "bg-slate-50/70 dark:bg-slate-900/50"
                }`}
              >
                <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl text-slate-900 dark:text-slate-100">
                  {t(`sections.${sectionIndex}.title`)}
                </h2>
                <div className="mt-5 space-y-5">
                  {subsectionKeys.map((si) => {
                    const h3Key = `sections.${sectionIndex}.subsections.${si}.h3`;
                    const h3Text = t.has(h3Key) ? t(h3Key) : null;
                    return (
                      <div key={si}>
                        {h3Text && (
                          <h3 className="mb-3 text-lg font-bold text-indigo-700 dark:text-indigo-400">
                            {h3Text}
                          </h3>
                        )}
                        {(() => {
                          const paragraphs: string[] = [];
                          for (let pi = 0; pi < 5; pi++) {
                            const pKey = `sections.${sectionIndex}.subsections.${si}.paragraphs.${pi}`;
                            if (t.has(pKey)) paragraphs.push(t(pKey));
                            else break;
                          }
                          return paragraphs.map((paragraph, pi) => (
                            <p
                              key={pi}
                              className="mt-3 text-[0.95rem] leading-relaxed text-slate-600 first:mt-0 dark:text-slate-300"
                            >
                              {paragraph}
                            </p>
                          ));
                        })()}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* Crafting UI Preview */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="flex items-center gap-2 font-heading text-2xl text-slate-900 dark:text-slate-100">
              <Zap className="h-5 w-5 text-indigo-500" />
              {t("crafting.title")}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {t("crafting.description")}
            </p>
            <div className="mt-5 overflow-hidden rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              <Image
                src="/images/the-forge-crafting-interface.webp"
                alt="The Forge crafting interface showing Knight Leggings item with masterwork percentage, materials, defense stats, and price"
                width={800}
                height={450}
                className="w-full object-cover"
              />
            </div>
          </section>

          {/* FAQ Accordion */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="flex items-center gap-2 font-heading text-2xl text-slate-900 dark:text-slate-100">
              <SearchCheck className="h-5 w-5 text-indigo-500" />
              {t("faq.title")}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: t("faq.description") }}>

            </p>
            <div className="mt-5 flex flex-col gap-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <FaqAccordionItem
                  key={index}
                  question={t(`faqItems.${index}.question`)}
                  answer={t(`faqItems.${index}.answer`)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-20">
          <RecentCodesList
            locale={locale}
            labels={{
              liveHub: t("sidebar.liveHub"),
              history: t("sidebar.history"),
              recentCodes: t("sidebar.recentCodes"),
              viewAllHistory: t("sidebar.viewAllHistory"),
              active: t("sidebar.active"),
              expired: t("sidebar.expired"),
            }}
          />
        </div>
      </div>
    </div>
  );
}

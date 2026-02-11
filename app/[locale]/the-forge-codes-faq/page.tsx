import { forgeFaq, forgeTroubleshooting } from "@/lib/forge-data";
import { Locale } from "@/i18n/routing";
import { faqPageSchema, JsonLd, breadcrumbSchema } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { BASE_URL } from "@/config/site";
import { ChevronDown } from "lucide-react";
import { Metadata } from "next";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "FAQ",
    title: "The Forge Codes FAQ: Why Codes Fail and How to Fix",
    description:
      "Common questions about the forge codes roblox, including failed redemptions, expiration behavior, and redeem troubleshooting.",
    keywords: [
      "the forge codes faq", "the forge codes not working", "why are the forge codes not working",
      "the forge roblox codes help", "the forge codes expired", "the forge codes troubleshooting",
    ],
    locale: locale as Locale,
    path: "/the-forge-codes-faq",
    canonicalUrl: "/the-forge-codes-faq",
  });
}

export default function ForgeFaqPage() {
  const allFaqItems = [...forgeFaq, ...forgeTroubleshooting];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd data={faqPageSchema(allFaqItems)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "The Forge Codes FAQ", url: `${BASE_URL}/the-forge-codes-faq` },
        ])}
      />
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 p-6 dark:border-indigo-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-violet-200/30 blur-3xl" />
        <h1 className="relative font-heading text-3xl font-black text-slate-900 dark:text-slate-100 sm:text-4xl">
          The Forge Codes FAQ
        </h1>
        <p className="relative mt-4 text-slate-700 dark:text-slate-300">
          This FAQ is built for the forge codes search intent. It answers why
          codes fail, how expiration works, and what to do before retrying.
        </p>
      </header>

      {/* Core FAQ accordion */}
      <section className="rounded-2xl border border-indigo-100 bg-white p-6 dark:border-indigo-900/40 dark:bg-slate-950">
        <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
          Core FAQ
        </h2>
        <div className="mt-6 space-y-3">
          {forgeFaq.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-indigo-100 dark:border-indigo-900/50"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown className="size-4 shrink-0 text-indigo-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-indigo-50 px-4 py-3 text-sm text-slate-600 dark:border-indigo-900/30 dark:text-slate-300">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Fast failure checklist accordion */}
      <section className="rounded-2xl border border-indigo-100 bg-white p-6 dark:border-indigo-900/40 dark:bg-slate-950">
        <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
          Fast failure checklist
        </h2>
        <div className="mt-6 space-y-3">
          {forgeTroubleshooting.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-indigo-100 dark:border-indigo-900/50"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown className="size-4 shrink-0 text-indigo-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-indigo-50 px-4 py-3 text-sm text-slate-600 dark:border-indigo-900/30 dark:text-slate-300">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

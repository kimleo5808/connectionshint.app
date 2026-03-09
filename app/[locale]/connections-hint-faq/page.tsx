import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FAQ" });

  return constructMetadata({
    page: "FAQ",
    title: t("title"),
    description: t("description"),
    keywords: [
      "connections hint faq",
      "nyt connections questions",
      "connections puzzle help",
      "connections game faq",
      "how does connections work",
    ],
    locale: locale as Locale,
    path: `/connections-hint-faq`,
    canonicalUrl: `/connections-hint-faq`,
  });
}

const FAQ_ITEMS = [
  {
    question: "What is NYT Connections?",
    answer:
      "NYT Connections is a daily word puzzle from The New York Times. You are given 16 words and must separate them into four groups of four based on a shared connection.",
  },
  {
    question: "When does the new Connections puzzle come out?",
    answer:
      "A new puzzle is released every day at midnight Eastern Time. The board is the same for everyone, no matter where they are playing from.",
  },
  {
    question: "How many guesses do I get in Connections?",
    answer:
      "You can make four mistakes before the game ends. Every incorrect four-word submission uses one life, so careful checking matters more than speed.",
  },
  {
    question: "What do the colors mean in Connections?",
    answer:
      "Yellow is the easiest group, followed by green, blue, and purple. Purple is usually the least literal category and is often the one built around wordplay or phrasing.",
  },
  {
    question: "How does ConnectionsHint work?",
    answer:
      "ConnectionsHint is built around progressive help. You can reveal lighter clues first, then stronger hints, and finally the full answer only if you want a final check.",
  },
  {
    question: "Is ConnectionsHint affiliated with The New York Times?",
    answer:
      "No. ConnectionsHint is an independent site and is not affiliated with or endorsed by The New York Times. NYT Connections is a trademark of The New York Times Company.",
  },
  {
    question: "Can I play past Connections puzzles?",
    answer:
      "The official puzzle is only available for the current day. This site focuses on archive pages, hints, and answer breakdowns for older boards so you can review past categories by date.",
  },
  {
    question: "What's the best strategy for solving Connections?",
    answer:
      "Start with the most defensible category on the board, usually yellow. Avoid forcing a purple-style guess too early, and use the remaining words to confirm harder groups by elimination.",
  },
  {
    question: "Why do some words seem to fit multiple groups?",
    answer:
      "That overlap is intentional. Connections often places red herring words next to the real set so that you have to prove a full group of four instead of relying on a loose association.",
  },
  {
    question: "How are the hints generated?",
    answer:
      "The site builds layered hints from the puzzle data so you can choose how much help to reveal. The goal is to preserve the solve where possible and use the full answer as a review step instead of a first move.",
  },
];

export default async function FAQPage({ params }: { params: Params }) {
  await params;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "FAQ", url: `${BASE_URL}/connections-hint-faq` },
        ])}
      />
      <JsonLd
        data={faqPageSchema(
          FAQ_ITEMS.map((item) => ({
            question: item.question,
            answer: item.answer,
          }))
        )}
      />

      <header className="relative overflow-hidden rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 sm:p-8 dark:border-blue-900/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-950/30">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              FAQ
            </span>
          </div>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-muted-foreground">
            Quick answers about the puzzle itself, how this site structures its
            hints, and what to do when a board feels full of overlap.
          </p>
        </div>
      </header>

      <div className="mt-8 space-y-3">
        {FAQ_ITEMS.map((item, index) => (
          <details
            key={index}
            className="group rounded-xl border border-blue-100 bg-card transition-colors open:bg-blue-50/30 dark:border-blue-900/40 dark:open:bg-blue-900/10"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-foreground transition-colors hover:text-blue-700 dark:hover:text-blue-400 [&::-webkit-details-marker]:hidden">
              <h2 className="text-[0.95rem] leading-snug">{item.question}</h2>
              <ChevronDown className="h-4 w-4 shrink-0 text-blue-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-center text-white">
        <h2 className="font-heading text-xl font-bold">Still have questions?</h2>
        <p className="mt-1 text-sm text-blue-100">
          Read the full how-to-play guide or jump straight to today&apos;s board
          if you want to put the ideas into practice.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/how-to-play-connections"
            className="rounded-xl bg-white px-5 py-2 text-sm font-bold text-blue-700 transition-all hover:bg-blue-50"
          >
            How to Play
          </Link>
          <Link
            href="/connections-hint-today"
            className="rounded-xl border-2 border-white/30 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-white/10"
          >
            Today&apos;s Hints
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

import { BASE_URL } from "@/config/site";
import { LETTER_GAMES } from "@/data/letter-games";
import { Locale, LOCALES } from "@/i18n/routing";
import { Link as I18nLink } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { Gamepad2 } from "lucide-react";
import { Metadata } from "next";
import WordleGameLoader from "@/components/wordle/WordleGameLoader";
import SeoContent from "@/components/wordle/SeoContent";

const WORD_LENGTH = 10;

const game = LETTER_GAMES.find((g) => g.wordLength === WORD_LENGTH)!;

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "LetterGame",
    title: game.title,
    description: game.description,
    keywords: game.keywords,
    locale: locale as Locale,
    path: `/${game.slug}`,
    canonicalUrl: `/${game.slug}`,
  });
}

export default async function LetterGamePage({ params }: { params: Params }) {
  await params;

  const otherGames = LETTER_GAMES.filter(
    (g) => g.wordLength !== WORD_LENGTH
  ).slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: game.title, url: `${BASE_URL}/${game.slug}` },
        ])}
      />

      {/* Header */}
      <header className="mb-8 text-center">
        <div className="mx-auto flex items-center justify-center gap-2">
          <Gamepad2 className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Word Game
          </span>
        </div>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {game.title}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {game.description}
        </p>
      </header>

      {/* Game */}
      <section className="flex justify-center rounded-2xl border border-blue-200/70 bg-gradient-to-b from-white to-blue-50/30 p-6 sm:p-8 dark:border-blue-900/40 dark:from-zinc-900 dark:to-zinc-900">
        <WordleGameLoader wordLength={WORD_LENGTH} />
      </section>

      <section className="mt-10 rounded-2xl border border-blue-100 bg-card p-6 dark:border-blue-900/40 sm:p-8">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          What to Focus On in {game.title}
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          {game.intro}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {game.strategies.map((strategy) => (
            <div
              key={strategy.title}
              className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-blue-900/30 dark:bg-blue-950/10"
            >
              <h3 className="font-heading text-sm font-bold text-foreground">
                {strategy.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {strategy.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-heading text-lg font-bold text-foreground">
            Why practice this length?
          </h3>
          <ul className="mt-3 space-y-2">
            {game.benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SEO Content */}
      <SeoContent wordLength={WORD_LENGTH} />

      {/* Other Games */}
      <section className="mt-10 border-t border-blue-100 pt-8 dark:border-blue-900/40">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Try Other Word Lengths
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {otherGames.map((g) => (
            <I18nLink
              key={g.slug}
              href={`/${g.slug}`}
              prefetch={false}
              className="group rounded-xl border border-blue-100 bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-blue-900/40 dark:hover:border-blue-700/60"
            >
              <div className="font-heading text-2xl font-bold text-blue-600 dark:text-blue-400">
                {g.wordLength}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                letters
              </div>
            </I18nLink>
          ))}
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

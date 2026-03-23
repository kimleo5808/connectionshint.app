import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import { getRecentPuzzles, getPuzzleCount } from "@/lib/connections-data";
import {
  breadcrumbSchema,
  faqPageSchema,
  JsonLd,
} from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import {
  BookOpen,
  Flame,
  GraduationCap,
  Printer,
  Sparkles,
  Target,
  Users,
  Plane,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import PrintablePuzzle from "@/components/connections/PrintablePuzzle";

type Params = Promise<{ locale: string }>;

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const USE_CASES = [
  {
    icon: GraduationCap,
    title: "For Classrooms",
    accent: "border-l-blue-500",
    description:
      "Connections puzzles are excellent teaching tools for vocabulary building, critical thinking, and collaborative problem-solving. Print a puzzle for each student or project it on screen and solve as a class. The four difficulty levels naturally differentiate instruction — let advanced students tackle the purple group while others work on yellow and green.",
    tips: [
      "Choose easy puzzles for younger students (direct category matches)",
      "Use medium puzzles for vocabulary enrichment (double-meaning words)",
      "Have students explain their reasoning before submitting answers",
      "Assign puzzle reviews as homework — students write about the traps they noticed",
    ],
  },
  {
    icon: Users,
    title: "For Team Building",
    accent: "border-l-emerald-500",
    description:
      "Printed Connections puzzles work perfectly for team activities, icebreakers, and corporate events. Split teams into groups of 3-4, give each team the same puzzle, and see who solves it first with the fewest mistakes. The collaborative nature of the game encourages communication and diverse perspectives — exactly the skills team building aims to develop.",
    tips: [
      "Print the puzzle-only version so teams cannot peek at answers",
      "Set a 10-minute timer for competitive rounds",
      "Award bonus points for solving yellow → green → blue → purple in order",
      "Debrief afterward: which strategies worked? How did teams divide the work?",
    ],
  },
  {
    icon: Plane,
    title: "For Travel & Offline Play",
    accent: "border-l-amber-500",
    description:
      "No internet? No problem. Print a batch of puzzles before a road trip, flight, or camping trip. Connections works perfectly on paper — all you need is the 16-word grid and a pen to cross off solved groups. The answers-on-back format lets you check your work without spoiling the solve.",
    tips: [
      "Print 5-10 puzzles of mixed difficulty for a long trip",
      "Use the 'with hints' format for casual play",
      "Bring a pencil to circle groups before committing",
      "Great for waiting rooms, airports, and train rides",
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "How do I print a Connections puzzle?",
    answer:
      "Select a puzzle from the dropdown, choose your preferred print format (puzzle only, with hints, or with answers), and click the Print button. Your browser's print dialog will open with a clean, printer-friendly layout.",
  },
  {
    question: "What print formats are available?",
    answer:
      "Three formats: 'Puzzle Only' shows just the 16-word grid with no answers — ideal for challenges and classroom use. 'With Category Hints' adds a partial clue for each group. 'With Full Answers' includes all four group names and their member words.",
  },
  {
    question: "Can I print multiple puzzles at once?",
    answer:
      "Currently, puzzles print one at a time. For bulk printing (classrooms, events), select each puzzle individually and print them in sequence. We show the 50 most recent puzzles in the selector.",
  },
  {
    question: "Is it free to print puzzles?",
    answer:
      "Yes. All printable puzzles on ConnectionsHint are completely free to use for personal, educational, and team building purposes. Please credit connectionshint.app when using printed puzzles in group settings.",
  },
];

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "Printable",
    title: "Printable Connections Puzzles — Print for Classrooms & Offline Play",
    description:
      "Print NYT Connections puzzles for classrooms, team building, or offline play. Choose puzzle-only, with hints, or with full answers. Free and printer-friendly.",
    keywords: [
      "printable connections puzzles",
      "print connections game",
      "connections worksheet",
      "connections classroom",
      "connections team building",
      "offline connections puzzle",
      "connections printout",
    ],
    locale: locale as Locale,
    path: `/connections-printable`,
    canonicalUrl: `/connections-printable`,
  });
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function ConnectionsPrintablePage({
  params,
}: {
  params: Params;
}) {
  await params;
  const recentPuzzles = await getRecentPuzzles(50);
  const totalCount = await getPuzzleCount();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 grid-bg">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          {
            name: "Printable Puzzles",
            url: `${BASE_URL}/connections-printable`,
          },
        ])}
      />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />

      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
          <Printer className="h-4 w-4" />
          <span>Printable Puzzles</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Printable Connections Puzzles
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Print Connections puzzles for classrooms, team building events,
          travel, or any time you want to play offline. Choose from{" "}
          {totalCount}+ puzzles in three print formats.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link
            href="/connections-hint-today"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Play Online Instead
          </Link>
          <Link
            href="/connections-practice"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Practice Mode
          </Link>
          <Link
            href="/connections-hint"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
          >
            Browse Archive
          </Link>
        </div>
      </header>

      {/* Print Tool */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-8 mb-8 shadow-sm">
        <h2 className="text-center font-heading text-lg font-bold text-foreground mb-1">
          Generate Your Printable Puzzle
        </h2>
        <p className="text-center text-xs text-muted-foreground mb-6">
          Select a puzzle and format, then click Print for a clean
          printer-friendly layout
        </p>
        <PrintablePuzzle puzzles={recentPuzzles} />
      </section>

      {/* ── SEO Content ── */}

      {/* Use Cases */}
      <section className="mt-12">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          How to Use Printable Connections Puzzles
        </h2>
        <p className="mt-2 text-muted-foreground">
          Printed puzzles are versatile tools for education, teamwork, and
          recreation. Here are three proven use cases with specific
          implementation tips.
        </p>
        <div className="mt-6 space-y-6">
          {USE_CASES.map((useCase) => (
            <div
              key={useCase.title}
              className={`rounded-xl border-l-4 ${useCase.accent} border border-border bg-card p-5 sm:p-6`}
            >
              <div className="flex items-center gap-2 mb-3">
                <useCase.icon className="h-5 w-5 text-blue-500" />
                <h3 className="font-heading text-base font-bold text-foreground">
                  {useCase.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                {useCase.description}
              </p>
              <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                Implementation Tips
              </h4>
              <ul className="space-y-2">
                {useCase.tips.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Print Format Guide */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Choosing the Right Print Format
        </h2>
        <p className="mt-2 text-muted-foreground">
          Each format serves a different purpose. Pick the one that matches
          your use case.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Puzzle Only
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-3">
              Just the 16-word grid with no answers, hints, or category names.
              This is the purest challenge — exactly how you would see the
              puzzle on the NYT website.
            </p>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Best for: Competitions, classroom tests, experienced players
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              With Category Hints
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-3">
              The word grid plus a partial hint for each of the four groups.
              Hints reveal the first word of the category name, giving a
              gentle nudge without spoiling the full answer.
            </p>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Best for: Casual play, beginners, younger students
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              With Full Answers
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-3">
              The complete puzzle with all four group names and their member
              words. Print this version and fold the answers section behind
              the puzzle — unfold to check when done.
            </p>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Best for: Travel, solo play, answer verification
            </p>
          </div>
        </div>
      </section>

      {/* Best Puzzles to Print */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Recommended Puzzles to Print
        </h2>
        <p className="mt-2 text-muted-foreground">
          Not sure where to start? Here are curated selections for different
          audiences and occasions.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-100 bg-card p-5 dark:border-emerald-900/30">
            <h3 className="font-heading text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-2">
              Great for Beginners
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Puzzles with mostly direct category matches and minimal
              wordplay. Perfect for first-timers and young learners.
            </p>
            <p className="text-xs text-muted-foreground">
              Look for low-numbered puzzles (early in the archive) — they
              tend to be more accessible.
            </p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-card p-5 dark:border-amber-900/30">
            <h3 className="font-heading text-sm font-bold text-amber-700 dark:text-amber-400 mb-2">
              Perfect Challenge
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Mid-difficulty puzzles with a mix of topic categories and one
              structural pattern. Challenging but fair for most players.
            </p>
            <p className="text-xs text-muted-foreground">
              Recent puzzles in the middle difficulty range work well for team
              events.
            </p>
          </div>
          <div className="rounded-xl border border-red-100 bg-card p-5 dark:border-red-900/30">
            <h3 className="font-heading text-sm font-bold text-red-700 dark:text-red-400 mb-2">
              Expert Level
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              The hardest puzzles in the archive — heavy wordplay,
              fill-in-the-blank, and misdirection. Only for experienced
              Connections players.
            </p>
            <p className="text-xs text-muted-foreground">
              Check the{" "}
              <Link
                href="/connections-stats"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                statistics page
              </Link>{" "}
              for the top 10 hardest puzzles.
            </p>
          </div>
          <div className="rounded-xl border border-purple-100 bg-card p-5 dark:border-purple-900/30">
            <h3 className="font-heading text-sm font-bold text-purple-700 dark:text-purple-400 mb-2">
              Party Pack
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Print 5 puzzles of increasing difficulty for a game night or
              party. Start easy and ramp up — it keeps everyone engaged.
            </p>
            <p className="text-xs text-muted-foreground">
              Mix in one very hard puzzle at the end for a dramatic finale.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-center text-white sm:p-8">
        <h2 className="font-heading text-lg font-bold">
          Prefer Playing Online?
        </h2>
        <p className="mt-2 text-sm text-blue-100">
          Play today&apos;s puzzle with progressive hints or practice with
          unlimited historical boards.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/connections-hint-today"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Today&apos;s Puzzle
          </Link>
          <Link
            href="/connections-practice"
            className="rounded-lg border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-blue-700"
          >
            Practice Mode
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="font-heading text-2xl font-bold text-foreground text-center">
          Printable Puzzles FAQ
        </h2>
        <div className="mt-6 space-y-4 max-w-3xl mx-auto">
          {FAQ_ITEMS.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <h3 className="font-heading text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">
                {item.question}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="font-heading text-xl font-bold text-foreground">
          More Ways to Play
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/connections-practice", title: "Practice Mode", desc: "Unlimited online play", icon: Sparkles },
            { href: "/connections-categories", title: "Category Explorer", desc: "Browse by theme", icon: Target },
            { href: "/connections-stats", title: "Puzzle Stats", desc: "Data & trends", icon: Flame },
            { href: "/connections-hint", title: "Full Archive", desc: "Every past puzzle", icon: BookOpen },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 rounded-xl border border-blue-100 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-blue-900/40 dark:hover:border-blue-700/60"
            >
              <link.icon className="h-5 w-5 text-blue-500 shrink-0" />
              <div className="min-w-0">
                <span className="block text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {link.title}
                </span>
                <span className="text-xs text-muted-foreground">{link.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

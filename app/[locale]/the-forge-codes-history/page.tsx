import HistoryMonthGroup, {
  SnapshotCard,
} from "@/components/forge/HistoryMonthGroup";
import { BASE_URL } from "@/config/site";
import { forgeDailySnapshots } from "@/lib/forge-data";
import { Locale } from "@/i18n/routing";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { CalendarClock, Database, Flame } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;

  return constructMetadata({
    page: "History",
    title: "The Forge Codes History: Daily Snapshot Archive and Code Timeline",
    description:
      "Browse every daily snapshot of the forge codes organized by month. Track when codes were added, expired, and compare changes across days.",
    keywords: [
      "the forge codes history", "the forge codes archive", "the forge codes daily snapshot",
      "the forge roblox codes history", "the forge past codes", "the forge expired codes list",
    ],
    locale: locale as Locale,
    path: "/the-forge-codes-history",
    canonicalUrl: "/the-forge-codes-history",
  });
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function ForgeHistoryPage() {
  // Build snapshots sorted newest first
  const allSnapshots = [...forgeDailySnapshots].reverse();
  const latestDate = allSnapshots[0]?.date ?? "";

  // Group by month (YYYY-MM)
  const monthGroups = new Map<string, SnapshotCard[]>();
  for (const snap of allSnapshots) {
    const monthKey = snap.date.slice(0, 7);
    if (!monthGroups.has(monthKey)) {
      monthGroups.set(monthKey, []);
    }
    monthGroups.get(monthKey)!.push({
      date: snap.date,
      activeCount: snap.activeCodes.length,
      expiredCount: snap.expiredCodes.length,
    });
  }

  const monthEntries = [...monthGroups.entries()];

  // Stats
  const totalSnapshots = allSnapshots.length;
  const totalCodesTracked = new Set(
    allSnapshots.flatMap((s) => [
      ...s.activeCodes.map((c) => c.code),
      ...s.expiredCodes.map((c) => c.code),
    ])
  ).size;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "The Forge Codes History", url: `${BASE_URL}/the-forge-codes-history` },
        ])}
      />
      {/* Hero */}
      <header className="relative overflow-hidden rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 p-6 dark:border-indigo-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-violet-200/30 blur-3xl" />
        <h1 className="relative font-heading text-3xl font-black text-slate-900 dark:text-slate-100 sm:text-4xl">
          The Forge Codes History
        </h1>
        <p className="relative mt-4 max-w-3xl text-slate-700 dark:text-slate-300">
          Every daily snapshot of the forge codes, organized by month. Browse
          past days to see when codes were added, when they expired, and compare
          changes across the full archive.
        </p>

        {/* Stats */}
        <div className="relative mt-6 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-indigo-200/60 bg-white/90 p-4 dark:border-indigo-900/40 dark:bg-slate-900/80">
            <CalendarClock className="h-5 w-5 shrink-0 text-indigo-500" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total snapshots
              </p>
              <p className="font-heading text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {totalSnapshots}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-indigo-200/60 bg-white/90 p-4 dark:border-indigo-900/40 dark:bg-slate-900/80">
            <Database className="h-5 w-5 shrink-0 text-violet-500" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Unique codes tracked
              </p>
              <p className="font-heading text-2xl font-bold text-violet-600 dark:text-violet-400">
                {totalCodesTracked}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-indigo-200/60 bg-white/90 p-4 dark:border-indigo-900/40 dark:bg-slate-900/80">
            <Flame className="h-5 w-5 shrink-0 text-orange-500" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Latest snapshot
              </p>
              <p className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
                {latestDate}
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-3">
          <Link
            href="/the-forge-codes"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600"
          >
            <span className="relative z-10">View Live Codes</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </Link>
          <Link
            href="/the-forge-codes/february-2026"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-indigo-200 bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300"
          >
            February 2026 Summary
          </Link>
        </div>
      </header>

      {/* Monthly groups */}
      {monthEntries.map(([monthKey, snapshots], index) => (
        <HistoryMonthGroup
          key={monthKey}
          monthLabel={formatMonthLabel(monthKey)}
          snapshots={snapshots}
          latestDate={latestDate}
          defaultOpen={index === 0}
        />
      ))}

      {/* SEO Content */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
          Why We Keep a Daily Archive of The Forge Codes
        </h2>
        <div className="mt-5 space-y-4 text-[0.95rem] leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            Most the forge codes tracking sites only show the current list. When a
            code expires, it simply disappears. This creates a problem for players
            who want to verify whether a code they found on social media has already
            been retired, or who want to check what rewards were available last
            week. Our daily snapshot archive solves this by preserving every single
            day&apos;s state as a permanent, browsable record.
          </p>
          <p>
            Each snapshot page captures the exact active and expired codes for that
            day, along with timestamps, sources, and update logs. This means you
            can compare two consecutive days to see precisely which the forge codes
            changed status. If a code worked on Monday but fails on Wednesday, the
            archive lets you pinpoint the exact day it expired — no guesswork
            required.
          </p>
          <p>
            Over time, this archive grows into a complete historical database of
            every the forge codes release. Monthly summaries like our{" "}
            <Link
              href="/the-forge-codes/february-2026"
              className="font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              February 2026 report
            </Link>{" "}
            aggregate these daily records into trend analysis, showing patterns
            like how long codes typically last and which reward types appear most
            frequently.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
          How to Use The Forge Codes History
        </h2>
        <div className="mt-5 space-y-4 text-[0.95rem] leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            The archive is organized by month with the most recent month expanded
            by default. Each card shows one day&apos;s snapshot with the number of
            active and expired codes. Click any card to open the full daily page
            with complete code tables, reward details, and source information.
          </p>
          <h3 className="font-heading text-lg font-bold text-indigo-700 dark:text-indigo-400">
            Common use cases for the forge codes history
          </h3>
          <ul className="ml-4 list-disc space-y-2 text-slate-600 dark:text-slate-300">
            <li>
              <strong>Verify expiration</strong> — check which day a specific code
              stopped working by comparing adjacent snapshots
            </li>
            <li>
              <strong>Missed codes</strong> — browse days you were not online to
              see if any short-lived codes appeared and expired while you were away
            </li>
            <li>
              <strong>Reward research</strong> — look at past active codes to
              understand the pattern of reward types (rerolls, boosts, gems) and
              plan your play sessions accordingly
            </li>
            <li>
              <strong>Dispute resolution</strong> — if someone claims a code
              existed on a certain date, the archive provides a verifiable record
            </li>
          </ul>
          <p>
            As more daily snapshots are added, older months automatically collapse
            to keep the page fast and scannable. Use the &quot;Show More&quot;
            button within any month to reveal all available days. For the complete
            live list with real-time status, visit the{" "}
            <Link
              href="/the-forge-codes"
              className="font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              live codes hub
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

import { ForgeDailySnapshotArchive } from "@/components/forge/ForgeSections";
import { BASE_URL } from "@/config/site";
import { Locale, LOCALES } from "@/i18n/routing";
import {
  ForgeCode,
  ForgeDailySnapshot,
  forgeDailySnapshots,
  getForgeSnapshotByDate,
} from "@/lib/forge-data";
import { breadcrumbSchema, JsonLd } from "@/lib/jsonld";
import { constructMetadata } from "@/lib/metadata";
import { CheckCircle2, ChevronDown, CircleX } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = Promise<{
  locale: string;
  date: string;
}>;

const redeemVariants = [
  "To redeem codes in the forge, open The Forge, enter the code panel, paste one active code, and confirm the reward popup.",
  "The fastest redeem flow is: launch game, open rewards/code menu, paste active entry, and verify success message.",
  "Use the redeem menu inside The Forge, not external pages, then paste the code exactly as shown in today's list.",
  "To redeem codes in the forge with fewer failures, always verify date freshness and use the latest active batch first.",
  "Redeem codes in the forge by using the in-game redeem box, keeping exact capitalization, then tapping confirm once.",
  "For consistent redemption, copy from today's active table, avoid manual typing errors, and redeem in descending confidence order.",
  "If you want to redeem codes in the forge quickly, start with today's top active code, paste exactly, and check inventory feedback.",
];

const useVariants = [
  "The best way to use codes in the forge is to start with newly active entries and stop retrying once a code is marked expired.",
  "Use codes in the forge in order: high-confidence active first, low-confidence active second, archived entries last.",
  "If one code fails, continue to the next active candidate and review expired notes after the full pass.",
  "To reduce wasted time, use only today's active section first and treat older pages as secondary references.",
  "Practical usage means redeeming each code once per account and skipping repeated attempts on already failed entries.",
  "To use codes in the forge efficiently, check today's update log before testing older daily snapshots.",
  "Use codes in the forge by prioritizing entries seen across multiple sources on the same day.",
];

const whereVariants = [
  "Put codes in the forge inside the in-game code/reward input box in The Forge interface.",
  "If you ask where to put codes in the forge, use the code field inside The Forge, not Roblox catalog pages.",
  "The correct place is the game's built-in redeem panel, usually under rewards, gift, or code menu.",
  "Do not paste codes into chat, profile fields, or external forms; only the in-game code box is valid.",
  "Enter codes in the in-game input area after your character fully loads to avoid UI sync issues.",
  "On mobile and desktop, the code location is in the same in-game menu family, though icon position may differ.",
  "Use the dedicated code textbox in The Forge UI and submit directly from that panel.",
];

function isIsoDate(input: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(input);
}

function toLongDate(input: string): string {
  const [year, month, day] = input.split("-").map((value) => Number(value));
  if (!year || !month || !day) {
    return input;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function dayKey(dateText: string): number {
  const date = new Date(`${dateText}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return 0;
  }
  return Math.floor(date.getTime() / 86400000);
}

function pickVariant(variants: string[], dateText: string, offset: number): string {
  const index = (dayKey(dateText) + offset) % variants.length;
  return variants[index];
}

function getPreviousSnapshot(date: string): ForgeDailySnapshot | null {
  const index = forgeDailySnapshots.findIndex((item) => item.date === date);
  if (index <= 0) {
    return null;
  }
  return forgeDailySnapshots[index - 1];
}

function formatDelta(current: number, previous: number): string {
  const delta = current - previous;
  if (delta > 0) return `+${delta}`;
  return `${delta}`;
}

function CodeList({
  title,
  codes,
}: {
  title: string;
  codes: ForgeCode[];
}) {
  return (
    <section className="rounded-2xl border border-indigo-100 bg-white p-6 dark:border-indigo-900/40 dark:bg-slate-950">
      <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h2>
      <ul className="mt-4 grid gap-3">
        {codes.map((item) => (
          <li
            key={item.code}
            className={`rounded-xl border p-4 ${
              item.status === "active"
                ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-900/10"
                : "border-indigo-100 dark:border-indigo-900/50"
            }`}
          >
            <div className="flex items-center gap-2">
              {item.status === "active" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <CircleX className="h-4 w-4 text-rose-400" />
              )}
              <p className="font-mono font-semibold text-indigo-700 dark:text-indigo-300">
                {item.code}
              </p>
            </div>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {item.reward}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {item.lastTested} · {item.source}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function eventBadge(event: string) {
  if (event === "added")
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  if (event === "expired")
    return "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300";
  return "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300";
}

function eventLabel(event: string) {
  if (event === "added") return "Added";
  if (event === "expired") return "Expired";
  return "Retested";
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, date } = await params;
  const formattedDate = toLongDate(date);

  return constructMetadata({
    page: "Daily",
    title: `The Forge Codes (${formattedDate}): Daily Auto-Collected Snapshot`,
    description:
      "Daily snapshot page for the forge codes with auto-collected active and expired lists, redeem guidance, and source coverage.",
    keywords: [
      `the forge codes ${formattedDate}`, "the forge codes today", "the forge roblox codes daily",
      "the forge codes active", "the forge codes expired", "the forge daily snapshot",
    ],
    locale: locale as Locale,
    path: `/the-forge-codes/${date}`,
    canonicalUrl: `/the-forge-codes/${date}`,
  });
}

export default async function DailyForgeCodesPage({
  params,
}: {
  params: Params;
}) {
  const { date } = await params;

  if (!isIsoDate(date)) {
    notFound();
  }

  const snapshot = getForgeSnapshotByDate(date);
  if (!snapshot) {
    notFound();
  }

  const previousSnapshot = getPreviousSnapshot(snapshot.date);
  const formattedDate = toLongDate(snapshot.date);

  const activeCount = snapshot.activeCodes.length;
  const expiredCount = snapshot.expiredCodes.length;
  const addedToday = snapshot.updateLog.filter((item) => item.event === "added").length;
  const movedExpiredToday = snapshot.updateLog.filter((item) => item.event === "expired").length;
  const retestedToday = snapshot.updateLog.filter((item) => item.event === "retested").length;

  const previousActive = previousSnapshot?.activeCodes.length ?? activeCount;
  const previousExpired = previousSnapshot?.expiredCodes.length ?? expiredCount;

  const sourceOkCount = snapshot.sources.filter((item) => item.ok).length;
  const sourceTotalCount = snapshot.sources.length;
  const sourceList = snapshot.sources.map((item) => item.name).join(", ");

  const redeemSentence = pickVariant(redeemVariants, snapshot.date, 0);
  const useSentence = pickVariant(useVariants, snapshot.date, 3);
  const whereSentence = pickVariant(whereVariants, snapshot.date, 5);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: BASE_URL },
          { name: "The Forge Codes", url: `${BASE_URL}/the-forge-codes` },
          { name: formattedDate, url: `${BASE_URL}/the-forge-codes/${snapshot.date}` },
        ])}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-6">
          {/* Hero header */}
          <header className="relative overflow-hidden rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 dark:border-indigo-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
            <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-800/20" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-800/20" />
            <p className="relative text-xs uppercase tracking-[0.16em] text-indigo-700 dark:text-indigo-300">
              Daily snapshot
            </p>
            <h1 className="relative mt-2 font-heading text-3xl font-black text-slate-900 dark:text-slate-100 sm:text-4xl">
              The Forge Codes ({formattedDate})
            </h1>
            <p className="relative mt-4 max-w-3xl text-slate-700 dark:text-slate-300">
              Last updated {snapshot.lastVerified}. Today we track{" "}
              <span className="font-semibold text-emerald-600">{activeCount} active</span> codes,{" "}
              <span className="font-semibold text-red-500">{expiredCount} expired</span> entries,{" "}
              {addedToday} newly added rows, and {movedExpiredToday} moves to expired status.
            </p>
          </header>

          {/* Today's changes */}
          <section className="rounded-2xl border border-indigo-100 bg-white p-6 dark:border-indigo-900/40 dark:bg-slate-950">
            <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
              Today&apos;s Changes in The Forge Codes
            </h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Compared with {previousSnapshot ? toLongDate(previousSnapshot.date) : "the previous available snapshot"},
              active count changed by{" "}
              <span className="font-semibold text-indigo-600">{formatDelta(activeCount, previousActive)}</span> and
              expired count changed by{" "}
              <span className="font-semibold text-violet-600">{formatDelta(expiredCount, previousExpired)}</span>.
              The log currently records {retestedToday} retested entries.
            </p>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              For users who check daily, this section should be your first stop
              before copying anything. It gives a fast view of whether the market
              moved, whether today&apos;s cycle is mostly stable, and whether you should
              prioritize testing newly added rows or stick to established entries.
            </p>
          </section>

          <CodeList title="Active codes" codes={snapshot.activeCodes} />
          <CodeList title="Expired codes" codes={snapshot.expiredCodes} />

          {/* How to redeem */}
          <section className="rounded-2xl border border-indigo-100 bg-white p-6 dark:border-indigo-900/40 dark:bg-slate-950">
            <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
              How to Redeem Codes in The Forge
            </h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">{redeemSentence}</p>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              On days with multiple additions, redeem in priority order: first
              entries that appear across multiple sources, then lower-consensus
              codes. Keep exact capitalization and punctuation, including symbols
              like exclamation marks if present.
            </p>
          </section>

          {/* How to use */}
          <section className="rounded-2xl border border-indigo-100 bg-white p-6 dark:border-indigo-900/40 dark:bg-slate-950">
            <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
              How to Use Codes in The Forge
            </h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">{useSentence}</p>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Using codes efficiently means avoiding duplicate retries and relying
              on state transitions from this page. If a code failed and appears in
              expired or recent-expired events, stop retesting and move on.
            </p>
          </section>

          {/* Where to put */}
          <section className="rounded-2xl border border-indigo-100 bg-white p-6 dark:border-indigo-900/40 dark:bg-slate-950">
            <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
              Where to Put Codes in The Forge
            </h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">{whereSentence}</p>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              If the input box is missing, check whether your game client fully
              loaded or whether UI layout differs on your device. Always enter
              codes directly in-game and avoid third-party forms.
            </p>
          </section>

          {/* Failure checklist */}
          <section className="rounded-2xl border border-indigo-100 bg-white p-6 dark:border-indigo-900/40 dark:bg-slate-950">
            <h2 className="border-l-4 border-indigo-500 pl-4 font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
              Daily Failure Checklist
            </h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              If today&apos;s redemption fails, run this quick checklist before
              assuming every code is dead:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { num: 1, text: "Retest only one high-confidence code after rejoin." },
                { num: 2, text: "Compare with today's expired movement before repeating." },
                { num: 3, text: "Stop after one failure per code and continue to next." },
              ].map((step) => (
                <div
                  key={step.num}
                  className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 dark:border-indigo-900/50 dark:bg-slate-900"
                >
                  <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                    {step.num}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Source coverage */}
          <section className="rounded-2xl border border-indigo-100 bg-white p-6 dark:border-indigo-900/40 dark:bg-slate-950">
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
              Source Coverage and Confidence for {formattedDate}
            </h2>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              Today&apos;s aggregation used {sourceTotalCount} tracked sources ({sourceList}),
              with {sourceOkCount} successful fetches. Treat this page as a decision aid:
              test top rows first, verify in-game, then move through the remaining list.
            </p>
            <ul className="mt-4 space-y-2">
              {snapshot.sources.map((source) => (
                <li
                  key={`${source.name}-${source.fetchedAt}`}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    source.ok
                      ? "border-emerald-200 bg-emerald-50/40 text-slate-700 dark:border-emerald-900/50 dark:bg-emerald-900/10 dark:text-slate-300"
                      : "border-rose-200 bg-rose-50/40 text-slate-700 dark:border-rose-900/50 dark:bg-rose-900/10 dark:text-slate-300"
                  }`}
                >
                  <span className="font-medium">{source.name}</span>: {source.foundCodes} codes ·{" "}
                  <span className={source.ok ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}>
                    {source.ok ? "ok" : "fetch-error"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Update log - timeline style */}
          <section className="rounded-2xl border border-indigo-100 bg-white p-6 dark:border-indigo-900/40 dark:bg-slate-950">
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-100">
              Update Log
            </h2>
            <div className="relative mt-5 ml-4 border-l-2 border-indigo-200 pl-6 dark:border-indigo-800">
              {snapshot.updateLog.map((item) => (
                <div
                  key={`${item.time}-${item.code}`}
                  className="relative mb-6 last:mb-0"
                >
                  <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-indigo-400 bg-white dark:border-indigo-500 dark:bg-slate-950" />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {item.time}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${eventBadge(item.event)}`}
                    >
                      {eventLabel(item.event)}
                    </span>
                    <span className="font-mono text-xs text-indigo-700 dark:text-indigo-300">
                      {item.code}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-300">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-20">
          <ForgeDailySnapshotArchive currentDate={snapshot.date} />
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    forgeDailySnapshots.map((snapshot) => ({
      locale,
      date: snapshot.date,
    }))
  );
}

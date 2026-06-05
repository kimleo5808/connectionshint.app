"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

interface ShareResultProps {
  puzzleId: number;
  dateLabel: string;
  difficulty: string;
  url: string;
}

/**
 * Lightweight share card for the daily puzzle. The generated text intentionally
 * contains no answers, so sharing never spoils the solve for the recipient.
 */
export function ShareResult({
  puzzleId,
  dateLabel,
  difficulty,
  url,
}: ShareResultProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `NYT Connections #${puzzleId} - ${dateLabel}\nToday's difficulty: ${difficulty}\nProgressive hints, no spoilers: ${url}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `NYT Connections #${puzzleId}`,
          text: shareText,
          url,
        });
      } catch {
        /* user dismissed the share sheet */
      }
    } else {
      handleCopy();
    }
  };

  const xHref = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      <h3 className="font-heading text-base font-bold text-foreground">
        Share Today&apos;s Puzzle
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Send a friend the hints &mdash; the share text never reveals the
        answers.
      </p>
      <pre className="mt-4 whitespace-pre-line rounded-xl border border-border bg-muted/30 p-4 font-mono text-sm text-muted-foreground">
        {shareText}
      </pre>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={handleNativeShare}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <a
          href={xHref}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
        >
          Post on X
        </a>
        <a
          href={fbHref}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400"
        >
          Facebook
        </a>
      </div>
    </div>
  );
}

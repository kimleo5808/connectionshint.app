"use client";

import { nextEditionTime } from "@/lib/puzzle-archive.mjs";
import { useEffect, useState } from "react";

function getTimeUntilMidnightET() {
  const now = new Date();
  const diff = nextEditionTime(now) - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

export function CountdownTimer() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getTimeUntilMidnightET());

    const interval = setInterval(() => {
      setTime(getTimeUntilMidnightET());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-3">
        {[0, 0, 0].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-800 text-2xl font-heading font-bold text-white">
              --
            </div>
            <span className="mt-1.5 text-xs text-slate-400">
              {["HRS", "MIN", "SEC"][i]}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const digits = [
    { value: time.hours, label: "HRS" },
    { value: time.minutes, label: "MIN" },
    { value: time.seconds, label: "SEC" },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {digits.map((d, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-800 text-2xl font-heading font-bold text-white shadow-lg">
            {String(d.value).padStart(2, "0")}
          </div>
          <span className="mt-1.5 text-xs font-medium text-slate-400">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

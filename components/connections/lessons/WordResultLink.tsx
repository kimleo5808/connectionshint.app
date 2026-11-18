"use client";

import Link from "next/link";
import { event } from "@/gtag";

export function WordResultLink({ date, id }: { date: string; id: number }) {
  return <Link href={"/connections-hint/" + date} prefetch={false}
    onClick={() => event({ action: "word_finder_open_puzzle", category: "connections", label: date, value: 1 })}>
    Puzzle #{id}
  </Link>;
}

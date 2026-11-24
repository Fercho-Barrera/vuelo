import type { Round } from "./stats";
import { MAX_SAVED, type SwingRecord } from "./swing/record";

export type PlanId = "free" | "pro_monthly" | "pro_annual";

// Brief section 5.
export const FREE_LIMITS = { swing: 3, ball: 2, rounds: 3 } as const;
export const PRICES = { pro_monthly: 179, pro_annual: 1499 } as const; // MXN

export const isPro = (p: PlanId) => p !== "free";
export const canUse = (plan: PlanId, kind: "swing" | "ball", usedThisMonth: number) => isPro(plan) || usedThisMonth < FREE_LIMITS[kind];
export const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export function visibleRounds(plan: PlanId, rounds: Round[]): Round[] {
  const sorted = rounds.slice().sort((a, b) => b.date.localeCompare(a.date));
  return isPro(plan) ? sorted : sorted.slice(0, FREE_LIMITS.rounds);
}

// Pro-only: watching saved clips again, the skeleton overlay and the before/after comparison.
export const canReplay = isPro;

// Pro keeps the last 90 days of swings (and their clips); free keeps the newest MAX_SAVED records, without clips.
export const PRO_HISTORY_DAYS = 90;
export function swingsToPrune(plan: PlanId, swings: SwingRecord[], now: Date): SwingRecord[] {
  const sorted = swings.slice().sort((a, b) => b.date.localeCompare(a.date));
  if (!isPro(plan)) return sorted.slice(MAX_SAVED);
  const cutoff = now.getTime() - PRO_HISTORY_DAYS * 86_400_000;
  return sorted.filter((s) => new Date(s.date).getTime() < cutoff);
}

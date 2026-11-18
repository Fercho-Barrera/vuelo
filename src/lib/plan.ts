import type { Round } from "./stats";

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

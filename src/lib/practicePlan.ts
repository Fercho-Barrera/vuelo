import type { Loss } from "./stats";
import type { Fault } from "./swing/analysis";

export type Drill = { source: "stats" | "swing"; text: string };

// Weekly plan from real data only: the area where most strokes are lost plus the worst swing faults.
// With no data it returns nothing instead of generic filler.
export function buildPracticePlan(input: { loss: Loss | null; faults: Fault[] }): Drill[] {
  const plan: Drill[] = [];
  if (input.loss && input.loss.strokes > 0) plan.push({ source: "stats", text: input.loss.tip });
  for (const f of input.faults) plan.push({ source: "swing", text: f.drill });
  return plan.slice(0, 3);
}

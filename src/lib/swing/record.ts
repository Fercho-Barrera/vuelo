import type { Fault, Frame, Result } from "./analysis";

export type Metrics = Extract<Result, { ok: true }>["metrics"];
export type SwingTimes = { start: number; top: number; impact: number };
export type SwingRecord = {
  id: string;
  date: string; // ISO
  metrics: Metrics;
  faults: Fault[];
  times: SwingTimes; // seconds into the clip
  thumb: string | null; // small data URL
  hasClip: boolean;
};

export function toRecord(id: string, date: string, result: Extract<Result, { ok: true }>, frames: Frame[], thumb: string | null, hasClip: boolean): SwingRecord {
  return {
    id, date, metrics: result.metrics, faults: result.faults, thumb, hasClip,
    times: { start: frames[0].t, top: frames[result.phases.top].t, impact: frames[result.phases.impact].t },
  };
}

export const MAX_SAVED = 10;

// Distance to a good value for each metric, and how much difference counts as a real change.
const RULES: { key: keyof Metrics; label: string; unit: string; digits: number; dist: (v: number) => number; tol: number }[] = [
  { key: "shoulderTurnDeg", label: "Giro de hombros", unit: "°", digits: 0, dist: (v) => Math.max(0, 90 - v), tol: 3 },
  { key: "tempoRatio", label: "Tempo", unit: ":1", digits: 1, dist: (v) => Math.abs(v - 3), tol: 0.15 },
  { key: "swayPct", label: "Desliz de cadera", unit: "%", digits: 0, dist: (v) => v, tol: 2 },
  { key: "headPct", label: "Movimiento de cabeza", unit: "%", digits: 0, dist: (v) => v, tol: 2 },
];

export type Row = { key: keyof Metrics; label: string; before: string; after: string; verdict: "mejor" | "peor" | "igual" };
export type Comparison = { before: SwingRecord; after: SwingRecord; rows: Row[]; fixed: Fault[]; appeared: Fault[]; summary: string };

export function compareSwings(x: SwingRecord, y: SwingRecord): Comparison {
  const [before, after] = x.date <= y.date ? [x, y] : [y, x];
  const rows: Row[] = RULES.map((r) => {
    const a = before.metrics[r.key], b = after.metrics[r.key];
    const da = r.dist(a), db = r.dist(b);
    const verdict = Math.abs(da - db) < r.tol ? "igual" : db < da ? "mejor" : "peor";
    const f = (v: number) => `${v.toFixed(r.digits)}${r.unit}`;
    return { key: r.key, label: r.label, before: f(a), after: f(b), verdict };
  });
  const ids = (s: SwingRecord) => s.faults.map((f) => f.id);
  const fixed = before.faults.filter((f) => !ids(after).includes(f.id));
  const appeared = after.faults.filter((f) => !ids(before).includes(f.id));
  const better = rows.filter((r) => r.verdict === "mejor").length, worse = rows.filter((r) => r.verdict === "peor").length;
  const summary = better > worse ? "Vas mejorando: tu swing más reciente está más cerca de lo ideal."
    : worse > better ? "Tu swing más reciente se alejó de lo ideal en más cosas. Repite los ejercicios de la falla principal."
    : "Tu swing está parecido. Para cambiar algo, enfócate en una sola falla a la vez.";
  return { before, after, rows, fixed, appeared, summary };
}

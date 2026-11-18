export type Fairway = "izq" | "centro" | "der" | null; // null on par 3

export type Hole = { number: number; par: number; score: number; putts: number; fairway: Fairway; gir: boolean; penalties: number; club: string };
export type Round = { id: string; courseName: string; date: string; holes: Hole[] };

export type Summary = { total: number; par: number; toPar: number; putts: number; girPct: number; fairwayPct: number; penalties: number };

const pct = (n: number, d: number) => (d === 0 ? 0 : Math.round((n / d) * 1000) / 10);

export function summarize(r: Round): Summary {
  const h = r.holes;
  const fw = h.filter((x) => x.fairway !== null);
  const total = h.reduce((a, x) => a + x.score, 0);
  const par = h.reduce((a, x) => a + x.par, 0);
  return {
    total,
    par,
    toPar: total - par,
    putts: h.reduce((a, x) => a + x.putts, 0),
    girPct: pct(h.filter((x) => x.gir).length, h.length),
    fairwayPct: pct(fw.filter((x) => x.fairway === "centro").length, fw.length),
    penalties: h.reduce((a, x) => a + x.penalties, 0),
  };
}

// Simplified handicap estimate. Without course rating and slope we use score minus par as the
// differential, best 8 of the last 20 (or best 40% when fewer), times 0.96. It is labeled "estimado".
export function handicapEstimate(rounds: Round[]): number | null {
  const full = rounds.filter((r) => r.holes.length > 0);
  if (full.length < 3) return null;
  const diffs = full
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20)
    .map((r) => {
      const s = summarize(r);
      return s.total - s.par;
    })
    .sort((a, b) => a - b);
  const use = full.length >= 20 ? 8 : Math.max(1, Math.round(Math.min(full.length, 20) * 0.4));
  const best = diffs.slice(0, use);
  const avg = best.reduce((a, x) => a + x, 0) / best.length;
  return Math.round(avg * 0.96 * 10) / 10;
}

export type Loss = { area: "drive" | "approach" | "putt" | "penalidades"; strokes: number; tip: string };

// Simplified strokes gained: strokes lost per round against a benchmark of an amateur at ~15 handicap.
export function lossAreas(rounds: Round[]): Loss[] {
  const holes = rounds.flatMap((r) => r.holes);
  const n = rounds.filter((r) => r.holes.length > 0).length || 1;
  const per = (x: number) => Math.round((x / n) * 10) / 10;
  const driveHoles = holes.filter((h) => h.fairway !== null);
  const drive = per(Math.max(0, driveHoles.filter((h) => h.fairway !== "centro").length - driveHoles.length * 0.5));
  const approach = per(Math.max(0, holes.filter((h) => !h.gir).length - holes.length * 0.5));
  const putt = per(Math.max(0, holes.reduce((a, h) => a + h.putts, 0) - holes.length * 1.9));
  const penalties = per(holes.reduce((a, h) => a + h.penalties, 0));
  const all: Loss[] = [
    { area: "drive", strokes: drive, tip: "Practica el tee shot: busca el fairway antes que la distancia." },
    { area: "approach", strokes: approach, tip: "Trabaja el approach: más greens en regulación bajan tu score más rápido." },
    { area: "putt", strokes: putt, tip: "Dedica la práctica al putt: baja los 3 putts con control de distancia." },
    { area: "penalidades", strokes: penalties, tip: "Juega más seguro: evita agua y fuera de límites con un palo más corto." },
  ];
  return all.sort((a, b) => b.strokes - a.strokes);
}

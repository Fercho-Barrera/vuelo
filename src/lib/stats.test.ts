import { describe, expect, it } from "vitest";
import { handicapEstimate, lossAreas, summarize, type Hole, type Round } from "./stats";

const hole = (n: number, o: Partial<Hole> = {}): Hole => ({ number: n, par: 4, score: 5, putts: 2, fairway: "centro", gir: false, penalties: 0, club: "Driver", ...o });
const round = (id: string, holes: Hole[], date = "2026-11-01"): Round => ({ id, courseName: "Test", date, holes });

describe("summarize", () => {
  it("computes totals, to-par and percentages", () => {
    const holes = [hole(1, { score: 4, gir: true }), hole(2, { score: 6, putts: 3, fairway: "izq" }), hole(3, { par: 3, score: 3, gir: true, fairway: null })];
    const s = summarize(round("a", holes));
    expect(s.total).toBe(13);
    expect(s.toPar).toBe(13 - 11);
    expect(s.putts).toBe(7);
    expect(s.girPct).toBeCloseTo(66.7, 1);
    expect(s.fairwayPct).toBe(50); // par 3 has no fairway
  });
  it("handles an empty round", () => {
    expect(summarize(round("e", [])).total).toBe(0);
  });
});

describe("handicapEstimate", () => {
  it("is null with fewer than 3 rounds", () => {
    expect(handicapEstimate([])).toBeNull();
  });
  it("averages the best differentials, one decimal", () => {
    const rs = [90, 92, 95, 100].map((t, i) => round(String(i), [hole(1, { score: t, par: 72 })], `2026-11-0${i + 1}`));
    expect(handicapEstimate(rs)).toBe(18.2); // best 2 of 4: (18+20)/2 = 19, times 0.96
  });
});

describe("lossAreas", () => {
  it("ranks where strokes are lost", () => {
    const holes = Array.from({ length: 18 }, (_, i) => hole(i + 1, { putts: 3, penalties: 0, gir: true, fairway: "centro" }));
    expect(lossAreas([round("p", holes)])[0].area).toBe("putt");
  });
});

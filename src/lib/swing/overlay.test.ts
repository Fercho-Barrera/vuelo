import { describe, expect, it } from "vitest";
import { containRect, interpolateFrame } from "./overlay";
import { compareSwings, type SwingRecord } from "./record";

describe("containRect", () => {
  it("letterboxes a wide box around a tall video", () => {
    const r = containRect(400, 300, 720, 1280);
    expect(r.h).toBe(300);
    expect(r.w).toBeCloseTo(168.75);
    expect(r.x).toBeCloseTo((400 - 168.75) / 2);
    expect(r.y).toBe(0);
  });
  it("fills the box when the aspect matches", () => expect(containRect(360, 640, 720, 1280)).toEqual({ x: 0, y: 0, w: 360, h: 640 }));
});

describe("interpolateFrame", () => {
  const pt = (x: number, y: number) => ({ x, y });
  const fr = [
    { t: 0, lm: [pt(0, 0), pt(0.2, 0.2)] },
    { t: 0.1, lm: [pt(0.1, 0.1), pt(0.4, 0.2)] },
    { t: 0.2, lm: [pt(0.2, 0.2), pt(0.6, 0.2)] },
  ];
  it("blends landmarks between the two samples around t", () => {
    const f = interpolateFrame(fr, 0.05);
    expect(f?.t).toBe(0.05);
    expect(f?.lm[0].x).toBeCloseTo(0.05);
    expect(f?.lm[1].x).toBeCloseTo(0.3);
  });
  it("returns the exact sample when t lands on it", () => expect(interpolateFrame(fr, 0.1)?.lm[0]).toEqual(pt(0.1, 0.1)));
  it("moves smoothly: no jump larger than the step between samples", () => {
    let prev = interpolateFrame(fr, 0)!.lm[0].x;
    for (let t = 0.005; t <= 0.2; t += 0.005) {
      const x = interpolateFrame(fr, t)!.lm[0].x;
      expect(Math.abs(x - prev)).toBeLessThanOrEqual(0.011);
      prev = x;
    }
  });
  it("returns null inside a hole where the person was not detected", () => {
    const holed = [{ t: 0, lm: [pt(0, 0)] }, { t: 0.5, lm: [pt(1, 1)] }];
    expect(interpolateFrame(holed, 0.25)).toBeNull();
  });
  it("keeps the edge sample for a short moment before the first or after the last", () => {
    expect(interpolateFrame(fr, -0.05)?.lm[0]).toEqual(pt(0, 0));
    expect(interpolateFrame(fr, 0.25)?.lm[0]).toEqual(pt(0.2, 0.2));
  });
  it("returns null far before or after the clip", () => {
    expect(interpolateFrame(fr, -1)).toBeNull();
    expect(interpolateFrame(fr, 2)).toBeNull();
  });
});

const rec = (id: string, date: string, m: Partial<SwingRecord["metrics"]>, faults: SwingRecord["faults"] = []): SwingRecord => ({
  id, date, faults, thumb: null, hasClip: false, times: { start: 0, top: 1, impact: 1.4 },
  metrics: { swayPct: 10, headPct: 10, shoulderTurnDeg: 80, tempoRatio: 3, ...m },
});
describe("compareSwings", () => {
  it("orders by date and judges against the ideal, ignoring tiny changes", () => {
    const old = rec("o", "2026-11-01", { shoulderTurnDeg: 55, swayPct: 30, tempoRatio: 1.6 }, [{ id: "turn", title: "t", detail: "", drill: "", severity: 1 }]);
    const neu = rec("n", "2026-11-10", { shoulderTurnDeg: 85, swayPct: 29, tempoRatio: 3.1 });
    const c = compareSwings(neu, old);
    expect(c.before.id).toBe("o");
    const by = Object.fromEntries(c.rows.map((r) => [r.key, r.verdict]));
    expect(by).toMatchObject({ shoulderTurnDeg: "mejor", tempoRatio: "mejor", swayPct: "igual", headPct: "igual" });
    expect(c.fixed.map((f) => f.id)).toEqual(["turn"]);
    expect(c.summary).toMatch(/mejorando/);
  });
  it("says worse when the newer swing drifts from the ideal", () => {
    const c = compareSwings(rec("a", "2026-11-01", {}), rec("b", "2026-11-02", { shoulderTurnDeg: 50, swayPct: 35 }));
    expect(c.rows.filter((r) => r.verdict === "peor").length).toBe(2);
    expect(c.summary).toMatch(/alejó/);
  });
});

import { describe, expect, it } from "vitest";
import { containRect, nearestFrame } from "./overlay";
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

describe("nearestFrame", () => {
  const fr = [0, 0.033, 0.066, 1].map((t) => ({ t, lm: [] }));
  it("picks the closest sample", () => expect(nearestFrame(fr, 0.04)?.t).toBe(0.033));
  it("returns null across a gap", () => expect(nearestFrame(fr, 0.5)).toBeNull());
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

import { describe, expect, it } from "vitest";
import { analyzeSwing, detectPhases, type Frame } from "./analysis";

// Synthetic face-on swing. Landmarks: 0 nose, 11/12 shoulders, 15/16 wrists, 23/24 hips (MediaPipe).
function swing(o: { sway?: number; head?: number; turnDeg?: number; backFrames?: number; downFrames?: number } = {}): Frame[] {
  const { sway = 0, head = 0, turnDeg = 90, backFrames = 30, downFrames = 10 } = o;
  const frames: Frame[] = [];
  const total = backFrames + downFrames + 5;
  for (let i = 0; i < total; i++) {
    const t = i / 60;
    const prog = i <= backFrames ? i / backFrames : Math.max(0, 1 - (i - backFrames) / downFrames);
    const lm = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5 }));
    const shoulderHalf = 0.1 * Math.cos((turnDeg * prog * Math.PI) / 180);
    lm[11] = { x: 0.5 - shoulderHalf + sway * prog * 0.5, y: 0.4 };
    lm[12] = { x: 0.5 + shoulderHalf + sway * prog * 0.5, y: 0.4 };
    lm[23] = { x: 0.45 + sway * prog, y: 0.6 };
    lm[24] = { x: 0.55 + sway * prog, y: 0.6 };
    lm[0] = { x: 0.5 + head * prog, y: 0.3 };
    const wristY = 0.55 - 0.35 * prog; // hands rise toward the top
    lm[15] = { x: 0.5, y: wristY };
    lm[16] = { x: 0.5, y: wristY };
    frames.push({ t, lm });
  }
  return frames;
}

describe("detectPhases", () => {
  it("finds top and impact", () => {
    const p = detectPhases(swing());
    expect(p.top).toBe(30);
    expect(p.impact).toBeGreaterThan(30);
  });
});

describe("analyzeSwing", () => {
  it("reports no faults for a clean swing", () => {
    expect(analyzeSwing(swing()).faults).toHaveLength(0);
  });
  it("flags sway", () => {
    const r = analyzeSwing(swing({ sway: 0.08 }));
    expect(r.faults[0].id).toBe("sway");
    expect(r.faults[0].drill).toBeTruthy();
  });
  it("flags head movement", () => {
    expect(analyzeSwing(swing({ head: 0.1 })).faults.map((f) => f.id)).toContain("head");
  });
  it("flags a short shoulder turn", () => {
    expect(analyzeSwing(swing({ turnDeg: 45 })).faults.map((f) => f.id)).toContain("turn");
  });
  it("flags a rushed backswing via tempo", () => {
    const r = analyzeSwing(swing({ backFrames: 12, downFrames: 12 }));
    expect(r.faults.map((f) => f.id)).toContain("tempo");
  });
  it("returns at most 3 faults, worst first", () => {
    const r = analyzeSwing(swing({ sway: 0.12, head: 0.12, turnDeg: 40, backFrames: 12, downFrames: 12 }));
    expect(r.faults.length).toBeLessThanOrEqual(3);
    expect(r.faults[0].severity).toBeGreaterThanOrEqual(r.faults[r.faults.length - 1].severity);
  });
  it("refuses too-short clips instead of guessing", () => {
    expect(analyzeSwing(swing().slice(0, 5)).ok).toBe(false);
  });
});

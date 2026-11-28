import { describe, expect, it } from "vitest";
import type { Frame } from "./analysis";
import { swingWindow } from "./window";

// 30 fps clip, 3 s long. The wrists stay at y = 0.5 except during the swing (1 s to 2 s),
// where they move at a constant speed of 1 unit per second: up to the top, then back down.
function clip(swingStart = 1, swingEnd = 2, duration = 3): Frame[] {
  const y = (t: number) => {
    if (t < swingStart || t >= swingEnd) return 0.5;
    const u = t - swingStart, half = (swingEnd - swingStart) / 2;
    return u < half ? 0.5 - u : u - half;
  };
  const frames: Frame[] = [];
  for (let i = 0; i < duration * 30; i++) {
    const t = i / 30;
    const wy = y(t);
    frames.push({ t, lm: Array.from({ length: 33 }, (_, k) => (k === 15 || k === 16 ? { x: 0.5, y: wy } : { x: 0.5, y: 0.5 })) });
  }
  return frames;
}

describe("swingWindow", () => {
  it("starts a little before the motion and ends a little after it", () => {
    const w = swingWindow(clip());
    expect(w).not.toBeNull();
    expect(w!.start).toBeCloseTo(0.5, 1);
    expect(w!.end).toBeCloseTo(2.8, 1);
  });

  it("finds the same window wherever the swing happens in the clip", () => {
    const w = swingWindow(clip(1.6, 2.6, 4));
    expect(w!.start).toBeCloseTo(1.1, 1);
    expect(w!.end).toBeCloseTo(3.4, 1);
  });

  it("never reaches outside the clip", () => {
    const w = swingWindow(clip(0.2, 1.2));
    expect(w!.start).toBe(0);
  });

  it("returns null when nothing moves fast enough to be a swing", () => {
    expect(swingWindow(clip(5, 6))).toBeNull();
  });

  it("returns null for a clip with fewer than two frames", () => {
    expect(swingWindow(clip().slice(0, 1))).toBeNull();
  });
});

import type { Frame } from "./analysis";

// Wrist speed in normalised units per second. Standing still stays well under REST; a swing is far above it.
// First guesses, to validate against real videos with a coach (same as the thresholds in analysis.ts).
const REST = 0.3;
// A pause shorter than GAP (the top of the swing, for example) does not end the swing.
const GAP = 0.4;
// Seconds kept before and after the motion, so the address and the finish are visible.
const PRE = 0.5, POST = 0.8;

export type SwingWindow = { start: number; end: number };

const wrist = (f: Frame) => ({ x: (f.lm[15].x + f.lm[16].x) / 2, y: (f.lm[15].y + f.lm[16].y) / 2 });

function wristSpeeds(frames: Frame[]): number[] {
  return frames.map((f, i) => {
    if (i === 0) return 0;
    const a = wrist(frames[i - 1]), b = wrist(f);
    const dt = f.t - frames[i - 1].t;
    return dt > 0 ? Math.hypot(b.x - a.x, b.y - a.y) / dt : 0;
  });
}

// Time span of the swing: the fast wrist motion around its peak, plus a margin.
// Null when nothing moves fast enough to be a swing.
export function swingWindow(frames: Frame[]): SwingWindow | null {
  if (frames.length < 2) return null;
  const speed = wristSpeeds(frames);
  let peak = 0;
  for (let i = 1; i < speed.length; i++) if (speed[i] > speed[peak]) peak = i;
  if (speed[peak] < REST) return null;

  let first = peak;
  for (let i = peak - 1; i >= 0; i--) {
    if (speed[i] >= REST) first = i;
    else if (frames[first].t - frames[i].t > GAP) break;
  }
  let last = peak;
  for (let i = peak + 1; i < speed.length; i++) {
    if (speed[i] >= REST) last = i;
    else if (frames[i].t - frames[last].t > GAP) break;
  }

  return {
    start: Math.max(frames[0].t, frames[first].t - PRE),
    end: Math.min(frames[frames.length - 1].t, frames[last].t + POST),
  };
}

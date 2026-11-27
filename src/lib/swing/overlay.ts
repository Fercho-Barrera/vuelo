import type { Fault, Frame } from "./analysis";

export type Rect = { x: number; y: number; w: number; h: number };

// Where a video of size vw x vh is drawn inside a box when fitted with object-fit: contain.
export function containRect(boxW: number, boxH: number, vw: number, vh: number): Rect {
  if (!vw || !vh) return { x: 0, y: 0, w: boxW, h: boxH };
  const s = Math.min(boxW / vw, boxH / vh);
  const w = vw * s, h = vh * s;
  return { x: (boxW - w) / 2, y: (boxH - h) / 2, w, h };
}

// Pose at time t, blended between the two samples around it so the skeleton moves with the video
// instead of jumping every sample (pose is sampled at 30 fps, video plays at 60 to 120 fps).
// Frames must be sorted by t. Null when t is outside the clip or inside a hole where nobody was detected
// (the samples on either side are more than maxGap apart).
export function interpolateFrame(frames: Frame[], t: number, maxGap = 0.12): Frame | null {
  let lo = 0, hi = frames.length;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (frames[m].t < t) lo = m + 1; else hi = m;
  }
  const after = frames[lo], before = frames[lo - 1];
  if (!before) return after && after.t - t <= maxGap ? after : null;
  if (!after) return t - before.t <= maxGap ? before : null;
  if (after.t - before.t > maxGap) return null;
  const k = (t - before.t) / (after.t - before.t);
  return {
    t,
    lm: before.lm.map((p, i) => ({ x: p.x + (after.lm[i].x - p.x) * k, y: p.y + (after.lm[i].y - p.y) * k })),
  };
}

const BONES: [number, number][] = [[11, 13], [13, 15], [12, 14], [14, 16], [11, 23], [12, 24], [23, 25], [25, 27], [24, 26], [26, 28]];
const SHOULDERS: [number, number] = [11, 12], HIPS: [number, number] = [23, 24];

export function drawSkeleton(ctx: CanvasRenderingContext2D, frame: Frame, r: Rect, faults: Fault["id"][]) {
  const P = (i: number) => ({ x: r.x + frame.lm[i].x * r.w, y: r.y + frame.lm[i].y * r.h });
  const line = (a: number, b: number, color: string, width: number) => {
    const p = P(a), q = P(b);
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
  };
  for (const [a, b] of BONES) line(a, b, "rgba(255,255,255,0.85)", 3);
  line(...SHOULDERS, faults.includes("turn") ? "#ff5a4d" : "#2fd68a", 5);
  line(...HIPS, faults.includes("sway") ? "#ff5a4d" : "#2fd68a", 5);
  const nose = P(0);
  ctx.fillStyle = faults.includes("head") ? "#ff5a4d" : "#2fd68a";
  ctx.beginPath(); ctx.arc(nose.x, nose.y, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff";
  for (const i of [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]) { const p = P(i); ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2); ctx.fill(); }
}

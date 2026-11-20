import type { Fault, Frame } from "./analysis";

export type Rect = { x: number; y: number; w: number; h: number };

// Where a video of size vw x vh is drawn inside a box when fitted with object-fit: contain.
export function containRect(boxW: number, boxH: number, vw: number, vh: number): Rect {
  if (!vw || !vh) return { x: 0, y: 0, w: boxW, h: boxH };
  const s = Math.min(boxW / vw, boxH / vh);
  const w = vw * s, h = vh * s;
  return { x: (boxW - w) / 2, y: (boxH - h) / 2, w, h };
}

// Frame closest in time, or null if the nearest sample is further than maxGap (person was not detected there).
export function nearestFrame(frames: Frame[], t: number, maxGap = 0.12): Frame | null {
  let best: Frame | null = null, bd = Infinity;
  for (const f of frames) {
    const d = Math.abs(f.t - t);
    if (d < bd) { bd = d; best = f; }
  }
  return best && bd <= maxGap ? best : null;
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

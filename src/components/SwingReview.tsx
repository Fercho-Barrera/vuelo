import { useEffect, useMemo, useRef, type RefObject } from "react";
import { VideoPlayer } from "./glass";
import type { Fault, Frame } from "../lib/swing/analysis";
import { containRect, drawSkeleton, interpolateFrame } from "../lib/swing/overlay";
import type { SwingTimes } from "../lib/swing/record";
import type { SwingWindow } from "../lib/swing/window";

function Overlay({ video, frames, faults }: { video: RefObject<HTMLVideoElement>; frames: Frame[]; faults: Fault["id"][] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  // The parent passes a new array on every render; key on the content so the effect does not restart for nothing.
  const key = faults.join(",");
  const ids = useMemo(() => key.split(",").filter(Boolean) as Fault["id"][], [key]);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    let raf = 0;
    const draw = () => {
      const c = canvas.current;
      if (!c) return;
      const dpr = window.devicePixelRatio || 1;
      const w = c.clientWidth, h = c.clientHeight;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      const ctx = c.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const f = interpolateFrame(frames, v.currentTime);
      if (f) drawSkeleton(ctx, f, containRect(w, h, v.videoWidth, v.videoHeight), ids);
    };
    // Redraw on every display frame only while the video plays; when paused, draw when the picture changes.
    const loop = () => { draw(); raf = requestAnimationFrame(loop); };
    const start = () => { cancelAnimationFrame(raf); loop(); };
    const stop = () => { cancelAnimationFrame(raf); draw(); };
    v.addEventListener("play", start);
    v.addEventListener("pause", stop);
    v.addEventListener("ended", stop);
    v.addEventListener("seeked", draw);
    v.addEventListener("loadeddata", draw);
    window.addEventListener("resize", draw);
    if (v.paused) draw(); else start();
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("play", start);
      v.removeEventListener("pause", stop);
      v.removeEventListener("ended", stop);
      v.removeEventListener("seeked", draw);
      v.removeEventListener("loadeddata", draw);
      window.removeEventListener("resize", draw);
    };
  }, [video, frames, ids]);
  return <canvas ref={canvas} className="vp__overlay" aria-hidden="true" />;
}

// Video with the body drawn over it (when pose data is available) and one-tap jumps to the key moments.
// With a trim window, playback starts at the swing and repeats inside it, so the address and the finish are skipped.
export function SwingReview({ src, frames, faults, times, trim = null }: { src: string; frames: Frame[] | null; faults: Fault["id"][]; times: SwingTimes | null; trim?: SwingWindow | null }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v || !trim) return;
    const toStart = () => { v.currentTime = trim.start; };
    const loop = () => { if (v.currentTime >= trim.end) v.currentTime = trim.start; };
    if (v.readyState >= 1) toStart(); else v.addEventListener("loadedmetadata", toStart, { once: true });
    v.addEventListener("timeupdate", loop);
    return () => {
      v.removeEventListener("loadedmetadata", toStart);
      v.removeEventListener("timeupdate", loop);
    };
  }, [trim]);
  const jump = (t: number) => { const v = video.current; if (v) { v.pause(); v.currentTime = t; } };
  return (
    <div className="stack" style={{ gap: 12 }}>
      <VideoPlayer src={src} videoRef={video}>{frames && <Overlay video={video} frames={frames} faults={faults} />}</VideoPlayer>
      {times && (
        <div className="chips">
          <button type="button" className="chip" onClick={() => jump(times.start)}>Posición inicial</button>
          <button type="button" className="chip" onClick={() => jump(times.top)}>Cima del swing</button>
          <button type="button" className="chip" onClick={() => jump(times.impact)}>Impacto</button>
        </div>
      )}
      {frames && <span className="label-caption">Verde: bien. Rojo: ahí está la falla. Usa ‹ › para avanzar cuadro por cuadro.</span>}
    </div>
  );
}

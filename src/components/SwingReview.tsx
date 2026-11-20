import { useEffect, useRef, type RefObject } from "react";
import { VideoPlayer } from "./glass";
import type { Fault, Frame } from "../lib/swing/analysis";
import { containRect, drawSkeleton, nearestFrame } from "../lib/swing/overlay";
import type { SwingTimes } from "../lib/swing/record";

function Overlay({ video, frames, faults }: { video: RefObject<HTMLVideoElement>; frames: Frame[]; faults: Fault["id"][] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const c = canvas.current, v = video.current;
      if (c && v) {
        const dpr = window.devicePixelRatio || 1;
        const w = c.clientWidth, h = c.clientHeight;
        if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, w, h);
          const f = nearestFrame(frames, v.currentTime);
          if (f) drawSkeleton(ctx, f, containRect(w, h, v.videoWidth, v.videoHeight), faults);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [video, frames, faults]);
  return <canvas ref={canvas} className="vp__overlay" aria-hidden="true" />;
}

// Video with the body drawn over it (when pose data is available) and one-tap jumps to the key moments.
export function SwingReview({ src, frames, faults, times }: { src: string; frames: Frame[] | null; faults: Fault["id"][]; times: SwingTimes | null }) {
  const video = useRef<HTMLVideoElement>(null);
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

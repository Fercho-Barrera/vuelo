import { useRef, useState, type ReactNode, type RefObject } from "react";
import "./glass.css";

const RATES = [1, 0.5, 0.25] as const;

export function VideoPlayer({ src, poster, videoRef, children }: { src: string; poster?: string; videoRef?: RefObject<HTMLVideoElement>; children?: ReactNode }) {
  const own = useRef<HTMLVideoElement>(null);
  const ref = videoRef ?? own;
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState<number>(1);
  const [t, setT] = useState(0);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };
  const step = (dir: 1 | -1) => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + dir / 30));
  };
  const cycleRate = () => {
    const next = RATES[(RATES.indexOf(rate as (typeof RATES)[number]) + 1) % RATES.length];
    setRate(next);
    if (ref.current) ref.current.playbackRate = next;
  };

  return (
    <div className="vp">
      <video
        ref={ref}
        src={src}
        poster={poster}
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
      />
      {children}
      <div className="glass vp__controls">
        <button type="button" onClick={() => step(-1)} aria-label="Cuadro anterior">‹</button>
        <button type="button" onClick={toggle} aria-label={playing ? "Pausar" : "Reproducir"}>{playing ? "II" : "▶"}</button>
        <input
          type="range" min={0} max={1} step={0.001} value={t} aria-label="Posición"
          onChange={(e) => {
            const v = ref.current;
            if (v && v.duration) v.currentTime = Number(e.target.value) * v.duration;
          }}
        />
        <button type="button" onClick={() => step(1)} aria-label="Cuadro siguiente">›</button>
        <button type="button" onClick={cycleRate} aria-label="Cámara lenta">{rate}x</button>
      </div>
    </div>
  );
}

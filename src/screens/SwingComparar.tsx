import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Card } from "../components/glass";
import { listSwings } from "../lib/swing/history";
import { compareSwings, type Comparison, type SwingRecord } from "../lib/swing/record";
import { useClipUrl } from "../lib/swing/useClipUrl";
import { BackLink } from "./SwingDetalle";
import { ProLock } from "../components/ProLock";
import { canReplay } from "../lib/plan";
import { usePlan } from "../lib/profile";

const day = (iso: string) => new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short" });

function Clip({ rec, label, videoRef }: { rec: SwingRecord; label: string; videoRef: React.RefObject<HTMLVideoElement> }) {
  const { url, loading } = useClipUrl(rec.id, rec.hasClip);
  return (
    <div className="stack" style={{ gap: 4 }}>
      <span className="label-caption">{label} · {day(rec.date)}</span>
      {url ? <video ref={videoRef} src={url} playsInline muted className="compare__video" /> : <span className="compare__video compare__video--empty">{loading ? "…" : "Sin video"}</span>}
    </div>
  );
}

export function SwingComparar() {
  const pro = canReplay(usePlan());
  const [params] = useSearchParams();
  const [cmp, setCmp] = useState<Comparison | null | undefined>(undefined);
  const va = useRef<HTMLVideoElement>(null), vb = useRef<HTMLVideoElement>(null);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    void listSwings().then((l) => {
      const a = l.find((s) => s.id === params.get("a")), b = l.find((s) => s.id === params.get("b"));
      setCmp(a && b ? compareSwings(a, b) : null);
    });
  }, [params]);

  const both = (f: (v: HTMLVideoElement) => void) => [va.current, vb.current].forEach((v) => v && f(v));
  const play = () => both((v) => { v.pause(); v.currentTime = 0; v.playbackRate = slow ? 0.5 : 1; void v.play(); });

  if (!pro) return <main className="screen"><BackLink to="/grabar/historial" label="Volver" /><ProLock text="Comparar dos swings antes y ahora es parte de Pro." /></main>;
  if (cmp === undefined) return <main className="screen"><span className="muted">Cargando…</span></main>;
  if (cmp === null) return <main className="screen"><BackLink to="/grabar/historial" label="Volver" /><Card>Elige dos swings para compararlos.</Card></main>;
  const mark = { mejor: "▲ Mejor", peor: "▼ Peor", igual: "Igual" } as const;
  return (
    <main className="screen">
      <div className="topbar"><BackLink to="/grabar/historial" label="Volver a mis swings" /></div>
      <h1>Antes y ahora</h1>
      <Card tight><strong>{cmp.summary}</strong></Card>
      <div className="compare">
        <Clip rec={cmp.before} label="Antes" videoRef={va} />
        <Clip rec={cmp.after} label="Ahora" videoRef={vb} />
      </div>
      {(cmp.before.hasClip || cmp.after.hasClip) && (
        <div className="row">
          <Button variant="primary" onClick={play}>Reproducir los dos</Button>
          <Button onClick={() => setSlow(!slow)}>{slow ? "Cámara lenta" : "Normal"}</Button>
        </div>
      )}
      <Card className="stack" style={{ gap: 0 }}>
        {cmp.rows.map((r) => (
          <div key={r.key} className="compare__row">
            <span>{r.label}</span>
            <span className="label-caption">{r.before} → <strong style={{ color: "var(--text)" }}>{r.after}</strong></span>
            <span className={`compare__verdict compare__verdict--${r.verdict}`}>{mark[r.verdict]}</span>
          </div>
        ))}
      </Card>
      {cmp.fixed.length > 0 && <Card tight><strong>Corregiste:</strong> {cmp.fixed.map((f) => f.title.toLowerCase()).join(", ")}.</Card>}
      {cmp.appeared.length > 0 && <Card tight><strong>Nueva falla:</strong> {cmp.appeared.map((f) => f.title.toLowerCase()).join(", ")}.</Card>}
    </main>
  );
}

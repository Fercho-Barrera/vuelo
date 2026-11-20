import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Card } from "../components/glass";
import { BackIcon } from "../components/icons";
import { SwingReview } from "../components/SwingReview";
import { listSwings, removeSwing } from "../lib/swing/history";
import type { SwingRecord } from "../lib/swing/record";
import { useClipUrl } from "../lib/swing/useClipUrl";
import { Coach } from "./Coach";

export const BackLink = ({ to, label }: { to: string; label: string }) => <Link to={to} className="icon-btn" aria-label={label}><BackIcon /></Link>;

export function SwingDetalle() {
  const { id } = useParams();
  const nav = useNavigate();
  const [rec, setRec] = useState<SwingRecord | null | undefined>(undefined);
  useEffect(() => { void listSwings().then((l) => setRec(l.find((s) => s.id === id) ?? null)); }, [id]);
  const clip = useClipUrl(rec?.id, rec?.hasClip ?? false);

  if (rec === undefined) return <main className="screen"><span className="muted">Cargando…</span></main>;
  if (rec === null) return <main className="screen"><BackLink to="/grabar/historial" label="Volver" /><Card>No encontramos ese swing.</Card></main>;
  return (
    <main className="screen">
      <div className="topbar"><BackLink to="/grabar/historial" label="Volver a mis swings" /></div>
      <h1>{new Date(rec.date).toLocaleDateString("es-MX", { day: "numeric", month: "long" })}</h1>
      {clip.url ? <SwingReview src={clip.url} frames={null} faults={[]} times={rec.times} /> : <Card tight><span className="muted">{clip.loading ? "Cargando video…" : "El video de este swing ya no está en este dispositivo, pero conservamos el análisis."}</span></Card>}
      <Coach result={{ ok: true, faults: rec.faults, metrics: rec.metrics, phases: { top: 0, impact: 0 } }} />
      <Button block onClick={async () => { await removeSwing(rec.id); nav("/grabar/historial"); }}>Borrar este swing</Button>
    </main>
  );
}

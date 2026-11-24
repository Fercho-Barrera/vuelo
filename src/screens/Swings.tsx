import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ButtonLink, Card, EmptyState } from "../components/glass";
import { BackLink } from "./SwingDetalle";
import { ProLock } from "../components/ProLock";
import { canReplay } from "../lib/plan";
import { usePlan } from "../lib/profile";
import { listSwings } from "../lib/swing/history";
import type { SwingRecord } from "../lib/swing/record";

const when = (iso: string) => new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function Swings() {
  const nav = useNavigate();
  const pro = canReplay(usePlan());
  const [swings, setSwings] = useState<SwingRecord[] | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  useEffect(() => { void listSwings().then(setSwings); }, []);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 2 ? [p[1], id] : [...p, id]));

  return (
    <main className="screen">
      <div className="topbar"><BackLink to="/grabar" label="Volver a grabar" /></div>
      <h1>Mis swings</h1>
      {swings === null && <span className="muted">Cargando…</span>}
      {swings?.length === 0 && <Card><EmptyState title="Aún no hay swings" text="Graba uno y toca Analizar mi swing para verlo aquí." action={<ButtonLink to="/grabar" variant="primary" small>Grabar un swing</ButtonLink>} /></Card>}
      {swings && swings.length > 1 && (pro ? <span className="muted">Elige dos para ver cómo cambiaste.</span> : <ProLock text="Comparar dos swings antes y ahora es parte de Pro." />)}
      {swings?.map((s) => (
        <Card key={s.id} className="swing-row" tight>
          <button type="button" className="swing-row__main" onClick={() => nav(`/grabar/swing/${s.id}`)}>
            {s.thumb ? <img src={s.thumb} alt="" className="swing-row__thumb" /> : <span className="swing-row__thumb" />}
            <span className="stack" style={{ gap: 2, textAlign: "left" }}>
              <strong>{when(s.date)}</strong>
              <span className="label-caption">{s.faults.length === 0 ? "Sin fallas claras" : s.faults.map((f) => f.title).join(" · ")}</span>
              <span className="label-caption">Hombros {Math.round(s.metrics.shoulderTurnDeg)}° · Tempo {s.metrics.tempoRatio.toFixed(1)}:1</span>
            </span>
          </button>
          {pro && swings.length > 1 && <input type="checkbox" className="swing-row__pick" checked={picked.includes(s.id)} onChange={() => toggle(s.id)} aria-label={`Elegir swing del ${when(s.date)}`} />}
        </Card>
      ))}
      {pro && swings && swings.length > 1 && <Button block variant="primary" disabled={picked.length !== 2} onClick={() => nav(`/grabar/comparar?a=${picked[0]}&b=${picked[1]}`)}>Comparar {picked.length}/2</Button>}
    </main>
  );
}

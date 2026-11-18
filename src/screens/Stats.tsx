import { useEffect, useState } from "react";
import { ButtonLink, Card, ListRow, SectionHeader } from "../components/glass";
import { PinIcon } from "../components/icons";
import { data } from "../lib/data";
import { handicapEstimate, lossAreas, overview, summarize, type Round } from "../lib/stats";

const fmtDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
const sign = (n: number) => (n > 0 ? `+${n}` : String(n));
const AREA: Record<string, string> = { drive: "Salida", approach: "Approach", putt: "Putt", penalidades: "Penalidades" };

export function Stats() {
  const [rounds, setRounds] = useState<Round[]>([]);
  useEffect(() => { void data.getRounds().then(setRounds); }, []);
  const sorted = rounds.slice().sort((a, b) => b.date.localeCompare(a.date));
  const o = overview(rounds);
  const hcp = handicapEstimate(rounds);
  const loss = rounds.length ? lossAreas(rounds) : [];
  const maxLoss = Math.max(0.1, ...loss.map((l) => l.strokes));

  return (
    <main className="screen">
      <div className="row">
        <h1>Stats</h1>
        <ButtonLink to="/stats/nueva" variant="primary" small>Nueva ronda</ButtonLink>
      </div>
      {!o ? (
        <Card><p className="muted" style={{ margin: 0 }}>Registra tu primera ronda y aquí verás tu score, tus putts y dónde pierdes golpes.</p></Card>
      ) : (
        <>
          <div className="stat-grid">
            <Card><span className="label-caption">Score promedio</span><span className="num-big">{o.avgScore}</span></Card>
            <Card><span className="label-caption">Hándicap estimado</span><span className="num-big">{hcp?.toFixed(1) ?? "--"}</span></Card>
            <Card><span className="label-caption">Putts por hoyo</span><span className="num-big">{o.puttsPerHole.toFixed(1)}</span></Card>
            <Card><span className="label-caption">Greens en regulación</span><span className="num-big">{o.girPct}%</span></Card>
          </div>

          <SectionHeader title="Dónde pierdes golpes" />
          <Card>
            <div className="stack" style={{ gap: 16 }}>
              {loss.map((l) => (
                <div key={l.area} className="stack">
                  <div className="row"><strong>{AREA[l.area]}</strong><span className="muted">{l.strokes} por ronda</span></div>
                  <div className="bar"><span style={{ width: `${(l.strokes / maxLoss) * 100}%` }} /></div>
                </div>
              ))}
              <span className="muted">{loss[0].tip}</span>
            </div>
          </Card>

          <SectionHeader title="Historial" />
          <Card flush>
            {sorted.map((r) => { const s = summarize(r); return (
              <ListRow key={r.id} icon={<PinIcon />} title={r.courseName} sub={`${fmtDate(r.date)} · ${s.putts} putts`} trail={<>{s.total} <span className="muted" style={{ fontWeight: 600 }}>{sign(s.toPar)}</span></>} />
            ); })}
          </Card>
          <span className="muted">El hándicap es un estimado: no usa rating ni slope del campo.</span>
        </>
      )}
    </main>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlassCard, StatRing } from "../components/glass";
import { data } from "../lib/data";
import { handicapEstimate, lossAreas, summarize, type Round } from "../lib/stats";
import { useProfile } from "../lib/profile";

export function Stats() {
  const { profile } = useProfile();
  const [rounds, setRounds] = useState<Round[]>([]);
  useEffect(() => { void data.getRounds().then(setRounds); }, []);
  const sorted = rounds.slice().sort((a, b) => b.date.localeCompare(a.date));
  const last = sorted[0] ? summarize(sorted[0]) : null;
  const hcp = handicapEstimate(rounds);
  const loss = rounds.length ? lossAreas(rounds)[0] : null;

  return (
    <main className="screen">
      <div className="row">
        <h1>Stats</h1>
        <Link to="/stats/nueva" className="glass glass-button glass-button--primary" style={{ textDecoration: "none" }}>Nueva ronda</Link>
      </div>
      {!last ? (
        <GlassCard><p className="muted" style={{ margin: 0 }}>Registra tu primera ronda y aquí verás tu score, tus putts y dónde pierdes golpes.</p></GlassCard>
      ) : (
        <>
          <GlassCard>
            <div className="label-caption">Última ronda</div>
            <div className="row" style={{ marginTop: 8 }}>
              <div><h2>{last.total} ({last.toPar >= 0 ? "+" : ""}{last.toPar})</h2><span className="muted">{sorted[0].courseName}</span></div>
              <div className="row" style={{ gap: 8 }}>
                <StatRing value={last.girPct} max={100} display={`${Math.round(last.girPct)}%`} label="GIR" size={72} />
                <StatRing value={last.fairwayPct} max={100} display={`${Math.round(last.fairwayPct)}%`} label="Fairway" size={72} />
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="label-caption">Hándicap estimado</div>
            <h2 style={{ marginTop: 6 }}>{hcp ?? "Juega 3 rondas"}</h2>
            <span className="muted">{hcp === null ? "Con 3 rondas calculamos tu estimado." : `Aprox. Tu hándicap oficial${profile?.handicap != null ? ` es ${profile.handicap}` : ""} puede variar.`}</span>
          </GlassCard>
          {loss && (
            <GlassCard>
              <div className="label-caption">Dónde pierdes más golpes</div>
              <h2 style={{ marginTop: 6, textTransform: "capitalize" }}>{loss.area}</h2>
              <span className="muted">{loss.tip}</span>
            </GlassCard>
          )}
          <GlassCard>
            <div className="label-caption">Historial</div>
            <div className="stack" style={{ marginTop: 8 }}>
              {sorted.map((r) => { const s = summarize(r); return (
                <div key={r.id} className="row"><span>{r.date} · {r.courseName}</span><strong>{s.total}</strong></div>
              ); })}
            </div>
          </GlassCard>
        </>
      )}
    </main>
  );
}

import { useEffect, useState } from "react";
import { GlassCard, StatRing } from "../components/glass";
import { data } from "../lib/data";
import { buildPracticePlan, type Drill } from "../lib/practicePlan";
import { lossAreas } from "../lib/stats";

import { useProfile } from "../lib/profile";

export function Hoy() {
  const { profile } = useProfile();
  const [drill, setDrill] = useState<Drill | null>(null);
  useEffect(() => {
    void data.getRounds().then((rs) => setDrill(buildPracticePlan({ loss: rs.length ? lossAreas(rs)[0] : null, faults: [] })[0] ?? null));
  }, []);
  return (
    <main className="screen">
      <header className="stack">
        <span className="label-caption">Hoy</span>
        <h1>Buen día, {profile?.name ?? "golfista"}</h1>
        <span className="muted">Aquí verás tu próximo tee time y tu práctica del día.</span>
      </header>

      <GlassCard>
        <div className="label-caption">Próximo tee time</div>
        <h2 style={{ marginTop: 6 }}>Aún no tienes uno</h2>
        <p className="muted" style={{ margin: "6px 0 0" }}>Encuentra un campo en la pestaña Clubes.</p>
      </GlassCard>

      <GlassCard>
        <div className="row">
          <div className="stack">
            <div className="label-caption">Drill del día</div>
            <h2>{drill ? "Práctica de hoy" : "Registra tu primera ronda"}</h2>
            <span className="muted">{drill ? drill.text : "Con tus rondas te armamos un plan de práctica."}</span>
          </div>
          <StatRing value={0} max={3} label="esta semana" display="0/3" size={88} />
        </div>
      </GlassCard>
    </main>
  );
}

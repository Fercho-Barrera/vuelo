import { GlassCard, StatRing } from "../components/glass";

import { useProfile } from "../lib/profile";

export function Hoy() {
  const { profile } = useProfile();
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
            <h2>Graba tu primer swing</h2>
            <span className="muted">Con tu análisis te damos un drill de 5 minutos.</span>
          </div>
          <StatRing value={0} max={3} label="esta semana" display="0/3" size={88} />
        </div>
      </GlassCard>
    </main>
  );
}

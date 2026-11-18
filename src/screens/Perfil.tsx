import { useState } from "react";
import { GlassCard, GlassSwitch } from "../components/glass";
import { NOTIFICATION_CATEGORIES, defaultPrefs, type Prefs } from "../lib/notifications";

export function Perfil() {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const toggle = (id: string) => setPrefs((p) => ({ ...p, [id]: !p[id] }));
  return (
    <main className="screen">
      <h1>Perfil</h1>
      <GlassCard>
        <h2>Notificaciones</h2>
        <p className="muted" style={{ margin: "4px 0 12px" }}>
          Pocas y que valgan la pena. Máximo 1 al día y 3 a la semana. Silencio de 22:00 a 08:00.
        </p>
        <div className="stack">
          {NOTIFICATION_CATEGORIES.map((c) => (
            <div key={c.id} className="row" style={{ minHeight: 48 }}>
              <span>{c.label}</span>
              <GlassSwitch checked={prefs[c.id]} onChange={() => toggle(c.id)} label={c.label} />
            </div>
          ))}
        </div>
      </GlassCard>
    </main>
  );
}

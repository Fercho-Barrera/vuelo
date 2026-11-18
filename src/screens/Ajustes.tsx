import { Link } from "react-router-dom";
import { Card, GlassSwitch, PillSelector, SectionHeader } from "../components/glass";
import { BackIcon } from "../components/icons";
import { NOTIFICATION_CATEGORIES } from "../lib/notifications";
import { useProfile } from "../lib/profile";

// Account configuration: personal data and notification preferences. Opened from the gear on Perfil.
export function Ajustes() {
  const { profile, save } = useProfile();
  if (!profile) return null;
  const set = (patch: Partial<typeof profile>) => save({ ...profile, ...patch });
  return (
    <main className="screen">
      <div className="topbar" style={{ marginLeft: -10 }}>
        <Link to="/perfil" className="icon-btn" aria-label="Volver al perfil"><BackIcon /></Link>
      </div>
      <h1>Ajustes</h1>

      <SectionHeader title="Tus datos" />
      <Card>
        <div className="stack" style={{ gap: 12 }}>
          <input className="field" aria-label="Nombre" value={profile.name} onChange={(e) => set({ name: e.target.value })} />
          <PillSelector label="Ciudad" value={profile.city} onChange={(city) => set({ city })} options={[{ value: "CDMX", label: "CDMX" }, { value: "Querétaro", label: "Querétaro" }, { value: "Otra", label: "Otra" }]} />
          <PillSelector label="Nivel" value={profile.level} onChange={(level) => set({ level })} options={[{ value: "principiante", label: "Principiante" }, { value: "intermedio", label: "Intermedio" }]} />
          <input className="field" aria-label="Hándicap" inputMode="decimal" placeholder="Hándicap" value={profile.handicap ?? ""} onChange={(e) => set({ handicap: e.target.value === "" ? null : Number(e.target.value.replace(/[^0-9.]/g, "")) })} />
        </div>
      </Card>

      <SectionHeader title="Notificaciones" />
      <Card>
        <p className="muted" style={{ margin: "0 0 8px" }}>Pocas y que valgan la pena. Máximo 1 al día y 3 a la semana. Silencio de 22:00 a 08:00.</p>
        <div className="stack">
          {NOTIFICATION_CATEGORIES.map((c) => (
            <div key={c.id} className="row" style={{ minHeight: 52 }}>
              <span>{c.label}</span>
              <GlassSwitch checked={profile.prefs[c.id]} onChange={(v) => set({ prefs: { ...profile.prefs, [c.id]: v } })} label={c.label} />
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}

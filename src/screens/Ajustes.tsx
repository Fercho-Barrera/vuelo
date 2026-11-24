import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MIN_AGE, parseAge } from "../lib/account";
import { Card, GlassSwitch, ListRow, PillSelector, SectionHeader } from "../components/glass";
import { BackIcon, BellIcon, ChevronIcon, HelpIcon, StarIcon } from "../components/icons";
import { NOTIFICATION_CATEGORIES } from "../lib/notifications";
import { useProfile } from "../lib/profile";

// Account configuration: personal data and notification preferences. Opened from the gear on Perfil.
export function Ajustes() {
  const { profile, save } = useProfile();
  const nav = useNavigate();
  const [ageText, setAgeText] = useState(profile?.age ? String(profile.age) : "");
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
          <div className="field field--static" aria-label="Correo de tu cuenta"><span className="label-caption">Correo de tu cuenta</span><span>{profile.email}</span></div>
          <input className="field" aria-label="Edad" inputMode="numeric" placeholder={`Edad (${MIN_AGE} o más)`} aria-invalid={ageText !== "" && parseAge(ageText) === null} value={ageText} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 3); setAgeText(v); const n = parseAge(v); if (n !== null) set({ age: n }); }} />
          <PillSelector label="Ciudad" value={profile.city} onChange={(city) => set({ city })} options={[{ value: "CDMX", label: "CDMX" }, { value: "Querétaro", label: "Querétaro" }, { value: "Otra", label: "Otra" }]} />
          <PillSelector label="Nivel" value={profile.level} onChange={(level) => set({ level })} options={[{ value: "principiante", label: "Principiante" }, { value: "intermedio", label: "Intermedio" }]} />
          <input className="field" aria-label="Hándicap" inputMode="decimal" placeholder="Hándicap" value={profile.handicap ?? ""} onChange={(e) => set({ handicap: e.target.value === "" ? null : Number(e.target.value.replace(/[^0-9.]/g, "")) })} />
        </div>
      </Card>

      <SectionHeader title="Preferencias" />
      <Card flush>
        <details className="faq faq--row">
          <summary>
            <span className="list-row__icon"><BellIcon /></span>
            <span className="list-row__title">Notificaciones</span>
          </summary>
          <p>Pocas y que valgan la pena. Máximo 1 al día y 3 a la semana. Silencio de 22:00 a 08:00.</p>
          <div className="stack faq__body">
            {NOTIFICATION_CATEGORIES.map((c) => (
              <div key={c.id} className="row" style={{ minHeight: 52 }}>
                <span>{c.label}</span>
                <GlassSwitch checked={profile.prefs[c.id]} onChange={(v) => set({ prefs: { ...profile.prefs, [c.id]: v } })} label={c.label} />
              </div>
            ))}
          </div>
        </details>
      </Card>

      <SectionHeader title="Ayuda" />
      <Card flush>
        <ListRow icon={<HelpIcon />} title="Preguntas frecuentes" sub="Dudas comunes o escríbenos la tuya" trail={<ChevronIcon />} onClick={() => nav("/perfil/ajustes/ayuda")} />
        <ListRow icon={<StarIcon />} title="Reseñas y sugerencias" sub="Dinos qué mejorar" trail={<ChevronIcon />} onClick={() => nav("/perfil/ajustes/resenas")} />
      </Card>
    </main>
  );
}

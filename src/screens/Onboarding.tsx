import { useState } from "react";
import { Button, GlassSwitch, PillSelector } from "../components/glass";
import { NOTIFICATION_CATEGORIES, defaultPrefs } from "../lib/notifications";
import { useProfile } from "../lib/profile";
import type { City, Level } from "../lib/data";

const BAG = ["Driver", "Madera 3", "Híbrido", "Hierro 5", "Hierro 7", "Hierro 9", "Pitching", "Sand", "Putter"];
const STEPS = 4;

export function Onboarding() {
  const { save } = useProfile();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState<City>("CDMX");
  const [level, setLevel] = useState<Level>("principiante");
  const [handicap, setHandicap] = useState("");
  const [clubs, setClubs] = useState<string[]>(["Driver", "Hierro 7", "Putter"]);
  const [prefs, setPrefs] = useState(defaultPrefs);

  const toggleClub = (c: string) => setClubs((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c]));
  const canNext = step !== 0 || name.trim().length > 0;
  const finish = () =>
    save({ name: name.trim(), city, level, handicap: handicap === "" ? null : Number(handicap), clubs, prefs });

  return (
    <main className="screen">
      <div className="progress" aria-label={`Paso ${step + 1} de ${STEPS}`}>{Array.from({ length: STEPS }, (_, i) => <span key={i} data-on={i <= step} />)}</div>
      {step === 0 && (
        <div className="stack" style={{ gap: 12 }}>
          <h1 style={{ fontSize: 40 }}>Tu coach de golf en el bolsillo</h1>
          <p className="muted" style={{ margin: 0 }}>Bienvenido a Vuelo. ¿Cómo te llamas?</p>
          <input className="field" aria-label="Nombre" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
        </div>
      )}
      {step === 1 && (
        <div className="stack" style={{ gap: 12 }}>
          <h2>Tu golf</h2>
          <div className="stack" style={{ marginTop: 12 }}>
            <span className="label-caption">Ciudad</span>
            <PillSelector label="Ciudad" value={city} onChange={setCity} options={[{ value: "CDMX", label: "CDMX" }, { value: "Querétaro", label: "Querétaro" }, { value: "Otra", label: "Otra" }]} />
            <span className="label-caption" style={{ marginTop: 8 }}>Nivel</span>
            <PillSelector label="Nivel" value={level} onChange={setLevel} options={[{ value: "principiante", label: "Principiante" }, { value: "intermedio", label: "Intermedio" }]} />
            <span className="label-caption" style={{ marginTop: 8 }}>Hándicap (opcional)</span>
            <input className="field" aria-label="Hándicap" inputMode="decimal" placeholder="Ej. 24" value={handicap} onChange={(e) => setHandicap(e.target.value.replace(/[^0-9.]/g, ""))} />
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="stack" style={{ gap: 12 }}>
          <h2>Tus palos</h2>
          <p className="muted">Con esto calculamos tus distancias reales por palo.</p>
          <div className="chips">
            {BAG.map((c) => (
              <button key={c} type="button" className="chip" aria-pressed={clubs.includes(c)} onClick={() => toggleClub(c)}>{c}</button>
            ))}
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="stack" style={{ gap: 12 }}>
          <h2>Notificaciones</h2>
          <p className="muted">Casi todo empieza apagado. Máximo 1 al día y 3 a la semana.</p>
          <div className="stack">
            {NOTIFICATION_CATEGORIES.map((c) => (
              <div key={c.id} className="row" style={{ minHeight: 48 }}>
                <span>{c.label}</span>
                <GlassSwitch label={c.label} checked={prefs[c.id]} onChange={(v) => setPrefs((p) => ({ ...p, [c.id]: v }))} />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="row">
        <Button onClick={() => setStep((s) => s - 1)} style={{ visibility: step === 0 ? "hidden" : "visible" }}>Atrás</Button>
        {step < STEPS - 1 ? (
          <Button variant="primary" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>Siguiente</Button>
        ) : (
          <Button variant="primary" onClick={finish}>Empezar</Button>
        )}
      </div>
    </main>
  );
}

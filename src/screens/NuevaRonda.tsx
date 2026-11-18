import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, ListRow, PillSelector } from "../components/glass";
import { BackIcon } from "../components/icons";
import { data } from "../lib/data";
import { summarize, type Fairway, type Hole } from "../lib/stats";

const blank = (n: number): Hole => ({ number: n, par: 4, score: 4, putts: 2, fairway: "centro", gir: false, penalties: 0, club: "Driver" });
const sign = (n: number) => (n > 0 ? `+${n}` : String(n));

function Stepper({ label, value, onChange, min = 0 }: { label: string; value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div className="row" style={{ minHeight: 56 }}>
      <span>{label}</span>
      <div className="row" style={{ gap: 12 }}>
        <button type="button" className="chip" aria-label={`Menos ${label}`} onClick={() => onChange(Math.max(min, value - 1))}>−</button>
        <strong style={{ minWidth: 24, textAlign: "center", fontSize: 22 }}>{value}</strong>
        <button type="button" className="chip" aria-label={`Más ${label}`} onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}

// Flow: course -> holes 1..18 (Atrás works at any time) -> summary (tap a hole to fix it) -> Guardar partida.
export function NuevaRonda() {
  const nav = useNavigate();
  const [course, setCourse] = useState("");
  const [started, setStarted] = useState(false);
  const [holes, setHoles] = useState<Hole[]>([]);
  const [idx, setIdx] = useState(0); // 0..17 = editing that hole, 18 = summary
  const [draft, setDraft] = useState<Hole>(blank(1));
  const [fixing, setFixing] = useState(false); // came here from the summary

  const commit = () => { const next = holes.slice(); next[idx] = draft; setHoles(next); return next; };
  const goTo = (i: number, from: Hole[]) => { setIdx(i); if (i < 18) setDraft(from[i] ?? blank(i + 1)); };

  const next = () => { const h = commit(); goTo(fixing ? 18 : idx + 1, h); if (fixing) setFixing(false); };
  const back = () => { const h = commit(); goTo(idx - 1, h); };
  const set = (patch: Partial<Hole>) => setDraft((x) => ({ ...x, ...patch }));

  const save = async () => {
    await data.saveRound({ id: crypto.randomUUID(), courseName: course.trim() || "Ronda", date: new Date().toISOString().slice(0, 10), holes });
    nav("/stats");
  };

  if (!started) {
    return (
      <main className="screen">
        <h1>Nueva ronda</h1>
        <Card><input className="field" aria-label="Campo" placeholder="¿En qué campo juegas?" value={course} onChange={(e) => setCourse(e.target.value)} /></Card>
        <Button variant="primary" block onClick={() => setStarted(true)}>Empezar</Button>
      </main>
    );
  }

  if (idx === 18) {
    const s = summarize({ id: "", courseName: course, date: "", holes });
    return (
      <main className="screen">
        <h1>Resumen</h1>
        <Card hero>
          <div className="label-caption">{course.trim() || "Ronda"}</div>
          <div className="num-hero" style={{ margin: "8px 0 4px" }}>{s.total}</div>
          <span className="pillbadge">{sign(s.toPar)} · {s.putts} putts · {Math.round(s.girPct)}% GIR</span>
        </Card>
        <span className="muted">Revisa tus hoyos. Toca uno para corregirlo. Una vez guardada, la partida ya no se puede modificar.</span>
        <Card flush>
          {holes.map((h, i) => (
            <ListRow key={h.number} title={`Hoyo ${h.number} · Par ${h.par}`} sub={`${h.putts} putts${h.gir ? " · GIR" : ""}${h.penalties ? ` · ${h.penalties} pen.` : ""}`} trail={h.score} onClick={() => { setFixing(true); goTo(i, holes); }} />
          ))}
        </Card>
        <Button variant="primary" block onClick={save}>Guardar partida</Button>
      </main>
    );
  }

  return (
    <main className="screen">
      <div className="topbar" style={{ marginLeft: -10 }}>
        {idx === 0 && !fixing
          ? <Link to="/stats" className="icon-btn" aria-label="Salir sin guardar"><BackIcon /></Link>
          : <button type="button" className="icon-btn" aria-label={fixing ? "Volver al resumen" : "Hoyo anterior"} onClick={fixing ? () => { commit(); goTo(18, holes.slice()); setFixing(false); } : back}><BackIcon /></button>}
        <span className="muted">{course.trim() || "Ronda"}</span>
      </div>
      <div className="row"><h1>Hoyo {draft.number}</h1><span className="muted">{draft.number} / 18</span></div>
      <Card>
        <Stepper label="Par" value={draft.par} min={3} onChange={(par) => set({ par, fairway: par === 3 ? null : (draft.fairway ?? "centro") })} />
        <Stepper label="Golpes" value={draft.score} min={1} onChange={(score) => set({ score })} />
        <Stepper label="Putts" value={draft.putts} onChange={(putts) => set({ putts })} />
        <Stepper label="Penalidades" value={draft.penalties} onChange={(penalties) => set({ penalties })} />
      </Card>
      <Card>
        <div className="stack" style={{ gap: 12 }}>
          {draft.par !== 3 && (
            <>
              <span className="label-caption">Fairway</span>
              <PillSelector<NonNullable<Fairway>> label="Fairway" value={draft.fairway ?? "centro"} onChange={(fairway) => set({ fairway })} options={[{ value: "izq", label: "Izq" }, { value: "centro", label: "Centro" }, { value: "der", label: "Der" }]} />
            </>
          )}
          <button type="button" className="chip" aria-pressed={draft.gir} onClick={() => set({ gir: !draft.gir })}>Green en regulación</button>
        </div>
      </Card>
      <Button variant="primary" block onClick={next}>{fixing ? "Volver al resumen" : draft.number === 18 ? "Ver resumen" : "Siguiente hoyo"}</Button>
    </main>
  );
}

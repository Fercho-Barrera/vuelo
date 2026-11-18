import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, PillSelector } from "../components/glass";
import { data } from "../lib/data";
import type { Fairway, Hole } from "../lib/stats";

const blank = (n: number): Hole => ({ number: n, par: 4, score: 4, putts: 2, fairway: "centro", gir: false, penalties: 0, club: "Driver" });

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

export function NuevaRonda() {
  const nav = useNavigate();
  const [course, setCourse] = useState("");
  const [started, setStarted] = useState(false);
  const [holes, setHoles] = useState<Hole[]>([]);
  const [h, setH] = useState<Hole>(blank(1));

  const next = async () => {
    const done = [...holes, h];
    if (h.number === 18) {
      await data.saveRound({ id: crypto.randomUUID(), courseName: course.trim() || "Ronda", date: new Date().toISOString().slice(0, 10), holes: done });
      nav("/stats");
      return;
    }
    setHoles(done);
    setH(blank(h.number + 1));
  };
  const set = (patch: Partial<Hole>) => setH((x) => ({ ...x, ...patch }));

  if (!started) {
    return (
      <main className="screen">
        <h1>Nueva ronda</h1>
        <Card>
          <input className="field" aria-label="Campo" placeholder="¿En qué campo juegas?" value={course} onChange={(e) => setCourse(e.target.value)} />
        </Card>
        <Button variant="primary" block onClick={() => setStarted(true)}>Empezar</Button>
      </main>
    );
  }
  return (
    <main className="screen">
      <div className="row">
        <h1>Hoyo {h.number}</h1>
        <span className="muted">{h.number} / 18</span>
      </div>
      <Card>
        <Stepper label="Par" value={h.par} min={3} onChange={(par) => set({ par, fairway: par === 3 ? null : (h.fairway ?? "centro") })} />
        <Stepper label="Golpes" value={h.score} min={1} onChange={(score) => set({ score })} />
        <Stepper label="Putts" value={h.putts} onChange={(putts) => set({ putts })} />
        <Stepper label="Penalidades" value={h.penalties} onChange={(penalties) => set({ penalties })} />
      </Card>
      <Card>
        <div className="stack" style={{ gap: 12 }}>
          {h.par !== 3 && (
            <>
              <span className="label-caption">Fairway</span>
              <PillSelector<NonNullable<Fairway>> label="Fairway" value={h.fairway ?? "centro"} onChange={(fairway) => set({ fairway })} options={[{ value: "izq", label: "Izq" }, { value: "centro", label: "Centro" }, { value: "der", label: "Der" }]} />
            </>
          )}
          <button type="button" className="chip" aria-pressed={h.gir} onClick={() => set({ gir: !h.gir })}>Green en regulación</button>
        </div>
      </Card>
      <Button variant="primary" block onClick={next}>{h.number === 18 ? "Terminar ronda" : "Siguiente hoyo"}</Button>
    </main>
  );
}

import { Coach } from "./Coach";
import type { Fault, Result } from "../lib/swing/analysis";

// Sample results to review the coach screens without recording. Not real analyses.
const F: Record<Fault["id"], Fault> = {
  sway: { id: "sway", severity: 1.6, title: "Tu cadera se desliza", detail: "En el backswing tu cadera se mueve hacia atrás en vez de girar.", drill: "Backswing contra una pared: pon la cadera derecha tocando la pared y gira sin separarla. 5 minutos." },
  head: { id: "head", severity: 1.3, title: "Tu cabeza se mueve", detail: "La cabeza se desplaza durante el swing y se pierde el punto de contacto.", drill: "Practica con la cabeza apoyada ligeramente en un palo vertical clavado en el suelo. 10 swings lentos." },
  turn: { id: "turn", severity: 1.2, title: "Poco giro de hombros", detail: "Tus hombros giran menos de lo ideal y pierdes potencia.", drill: "Cruza los brazos sobre el pecho y gira hasta que tu espalda mire al objetivo. 20 repeticiones." },
  tempo: { id: "tempo", severity: 1.1, title: "Tempo apresurado", detail: "La subida debería durar cerca de el triple que la bajada. Estás yendo muy rápido o muy lento.", drill: "Cuenta 'uno, dos, tres' subiendo y 'cuatro' en el impacto. 5 minutos con ritmo constante." },
};
const phases = { top: 40, impact: 52 };
const ok = (faults: Fault[], m: Partial<Extract<Result, { ok: true }>["metrics"]>): Result => ({ ok: true, faults, phases, metrics: { swayPct: 8, headPct: 12, shoulderTurnDeg: 88, tempoRatio: 3, ...m } });

const CASES: { title: string; result: Result }[] = [
  { title: "Con varias fallas", result: ok([F.sway, F.turn, F.tempo], { swayPct: 32, shoulderTurnDeg: 54, tempoRatio: 1.6 }) },
  { title: "Una sola falla", result: ok([F.head], { headPct: 41 }) },
  { title: "Buen swing", result: ok([], {}) },
  { title: "No se vio a la persona", result: { ok: false, reason: "No detectamos a una persona en el video. Encuádrate de cuerpo completo, con buena luz.", faults: [] } },
  { title: "Video incompleto", result: { ok: false, reason: "No pudimos ver el swing completo. Revisa el encuadre.", faults: [] } },
];

export function CoachEjemplo() {
  return (
    <main className="screen">
      <h1>Ejemplos del coach</h1>
      <span className="muted">Resultados de muestra para revisar cómo se ve la retroalimentación. No son análisis reales.</span>
      {CASES.map((c) => (
        <section key={c.title} className="stack" style={{ gap: 12 }}>
          <span className="label-caption">{c.title.toUpperCase()}</span>
          <Coach result={c.result} />
        </section>
      ))}
    </main>
  );
}

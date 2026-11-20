import { useEffect, useRef } from "react";
import { ButtonLink } from "../components/glass";
import { containRect, drawSkeleton } from "../lib/swing/overlay";
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

// A face-on stick figure doing a backswing and downswing, to show the skeleton overlay without a real person.
function figure(phase: number) {
  const lm = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5 }));
  const turn = Math.sin(phase * Math.PI), hands = 0.5 - 0.3 * turn;
  const set = (i: number, x: number, y: number) => { lm[i] = { x, y }; };
  set(0, 0.5 + 0.01 * turn, 0.2);
  set(11, 0.5 - 0.1 + 0.03 * turn, 0.32); set(12, 0.5 + 0.1 - 0.05 * turn, 0.32);
  set(13, 0.42, 0.42 - 0.06 * turn); set(14, 0.58, 0.42 - 0.06 * turn);
  set(15, 0.48, hands + 0.1); set(16, 0.52, hands + 0.1);
  set(23, 0.44 - 0.02 * turn, 0.55); set(24, 0.56 - 0.02 * turn, 0.55);
  set(25, 0.43, 0.72); set(26, 0.57, 0.72); set(27, 0.42, 0.9); set(28, 0.58, 0.9);
  return { t: phase, lm };
}

function SkeletonDemo() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = (ms: number) => {
      const c = ref.current, ctx = c?.getContext("2d");
      if (c && ctx) {
        ctx.clearRect(0, 0, c.width, c.height);
        drawSkeleton(ctx, figure((ms / 2500) % 1), containRect(c.width, c.height, 9, 16), ["sway", "turn"]);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} width={270} height={400} className="skeleton-demo" aria-label="Figura de muestra con el esqueleto del coach" />;
}

export function CoachEjemplo() {
  return (
    <main className="screen">
      <h1>Ejemplos del coach</h1>
      <span className="muted">Resultados de muestra para revisar cómo se ve la retroalimentación. No son análisis reales.</span>
      <section className="stack" style={{ gap: 12 }}>
        <span className="label-caption">SOBRE TU VIDEO</span>
        <SkeletonDemo />
        <span className="label-caption">Así se dibuja tu cuerpo sobre el video. Verde: bien. Rojo: ahí está la falla (aquí, hombros y cadera). Los botones "Posición inicial", "Cima del swing" e "Impacto" saltan al momento exacto.</span>
      </section>
      <section className="stack" style={{ gap: 12 }}>
        <span className="label-caption">COMPARAR ANTES Y AHORA</span>
        <ButtonLink block to="/grabar/historial">Ver mis swings (con datos de muestra)</ButtonLink>
      </section>
      {CASES.map((c) => (
        <section key={c.title} className="stack" style={{ gap: 12 }}>
          <span className="label-caption">{c.title.toUpperCase()}</span>
          <Coach result={c.result} />
        </section>
      ))}
    </main>
  );
}

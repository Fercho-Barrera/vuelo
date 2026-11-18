// Rule-based swing analysis on MediaPipe Pose landmarks (face-on view).
// Thresholds are first guesses. They MUST be validated against real videos with a coach (Phase 3 task).
export type Point = { x: number; y: number };
export type Frame = { t: number; lm: Point[] };

const NOSE = 0, L_SH = 11, R_SH = 12, L_WR = 15, R_WR = 16, L_HIP = 23, R_HIP = 24;

export type Fault = { id: "sway" | "head" | "turn" | "tempo"; title: string; detail: string; drill: string; severity: number };
export type Phases = { top: number; impact: number };
export type Result =
  | { ok: false; reason: string; faults: [] }
  | { ok: true; faults: Fault[]; metrics: { swayPct: number; headPct: number; shoulderTurnDeg: number; tempoRatio: number }; phases: Phases };

const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const wristY = (f: Frame) => (f.lm[L_WR].y + f.lm[R_WR].y) / 2;
const hipX = (f: Frame) => (f.lm[L_HIP].x + f.lm[R_HIP].x) / 2;
const hipWidth = (f: Frame) => dist(f.lm[L_HIP], f.lm[R_HIP]);
const shoulderWidth = (f: Frame) => Math.abs(f.lm[L_SH].x - f.lm[R_SH].x);

export function detectPhases(frames: Frame[]): Phases {
  let top = 0;
  for (let i = 1; i < frames.length; i++) if (wristY(frames[i]) < wristY(frames[top])) top = i;
  const address = wristY(frames[0]);
  let impact = frames.length - 1;
  for (let i = top + 1; i < frames.length; i++) {
    if (wristY(frames[i]) >= address - 0.02) { impact = i; break; }
  }
  return { top, impact };
}

export function analyzeSwing(frames: Frame[]): Result {
  if (frames.length < 20) return { ok: false, reason: "El video es muy corto. Graba el swing completo.", faults: [] };
  const { top, impact } = detectPhases(frames);
  if (top < 5 || impact <= top) return { ok: false, reason: "No pudimos ver el swing completo. Revisa el encuadre.", faults: [] };

  const f0 = frames[0], fTop = frames[top];
  const swayPct = (Math.abs(hipX(fTop) - hipX(f0)) / hipWidth(f0)) * 100;
  let head = 0;
  for (let i = 0; i <= impact; i++) head = Math.max(head, Math.abs(frames[i].lm[NOSE].x - f0.lm[NOSE].x));
  const headPct = (head / shoulderWidth(f0)) * 100;
  const ratio = Math.min(1, shoulderWidth(fTop) / shoulderWidth(f0));
  const shoulderTurnDeg = (Math.acos(ratio) * 180) / Math.PI;
  const tempoRatio = (fTop.t - f0.t) / (frames[impact].t - fTop.t);

  const faults: Fault[] = [];
  if (swayPct > 20)
    faults.push({ id: "sway", severity: swayPct / 20, title: "Tu cadera se desliza", detail: "En el backswing tu cadera se mueve hacia atrás en vez de girar.", drill: "Backswing contra una pared: pon la cadera derecha tocando la pared y gira sin separarla. 5 minutos." });
  if (headPct > 25)
    faults.push({ id: "head", severity: headPct / 25, title: "Tu cabeza se mueve", detail: "La cabeza se desplaza durante el swing y se pierde el punto de contacto.", drill: "Practica con la cabeza apoyada ligeramente en un palo vertical clavado en el suelo. 10 swings lentos." });
  if (shoulderTurnDeg < 70)
    faults.push({ id: "turn", severity: 70 / Math.max(shoulderTurnDeg, 1), title: "Poco giro de hombros", detail: "Tus hombros giran menos de lo ideal y pierdes potencia.", drill: "Cruza los brazos sobre el pecho y gira hasta que tu espalda mire al objetivo. 20 repeticiones." });
  if (tempoRatio < 2 || tempoRatio > 4)
    faults.push({ id: "tempo", severity: tempoRatio < 2 ? 2 / tempoRatio : tempoRatio / 4, title: "Tempo apresurado", detail: "La subida debería durar cerca de el triple que la bajada. Estás yendo muy rápido o muy lento.", drill: "Cuenta 'uno, dos, tres' subiendo y 'cuatro' en el impacto. 5 minutos con ritmo constante." });

  faults.sort((a, b) => b.severity - a.severity);
  return { ok: true, faults: faults.slice(0, 3), metrics: { swayPct, headPct, shoulderTurnDeg, tempoRatio }, phases: { top, impact } };
}

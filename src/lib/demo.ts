import { setPassword, unlock } from "./auth";
import { CLUBS } from "./clubs";
import { defaultPrefs } from "./notifications";
import type { Hole, Round } from "./stats";
import type { SwingRecord } from "./swing/record";

// Development-only sample data so the screens can be reviewed with content. Open with ?demo=1.
// It never ships: main.tsx only calls it when import.meta.env.DEV is true.
const course = (scores: number[], putts: number[]): Hole[] =>
  scores.map((s, i) => {
    const par = [4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 3, 5, 4][i];
    return { number: i + 1, par, score: s, putts: putts[i], fairway: par === 3 ? null : s <= par + 1 ? "centro" : i % 2 ? "izq" : "der", gir: s <= par, penalties: s >= par + 2 && i % 3 === 0 ? 1 : 0, club: "Driver" };
  });

const fault = (id: "sway" | "head" | "turn" | "tempo", title: string, detail: string, drill: string) => ({ id, title, detail, drill, severity: 1 });
const FAULTS = {
  turn: fault("turn", "Poco giro de hombros", "Tus hombros giran menos de lo ideal y pierdes potencia.", "Cruza los brazos sobre el pecho y gira hasta que tu espalda mire al objetivo. 20 repeticiones."),
  sway: fault("sway", "Tu cadera se desliza", "En el backswing tu cadera se mueve hacia atrás en vez de girar.", "Backswing contra una pared: pon la cadera derecha tocando la pared y gira sin separarla. 5 minutos."),
  tempo: fault("tempo", "Tempo apresurado", "La subida debería durar cerca de el triple que la bajada.", "Cuenta 'uno, dos, tres' subiendo y 'cuatro' en el impacto. 5 minutos con ritmo constante."),
};
const swing = (id: string, date: string, metrics: SwingRecord["metrics"], faults: SwingRecord["faults"]): SwingRecord => ({ id, date, metrics, faults, thumb: null, hasClip: false, times: { start: 0, top: 1.1, impact: 1.5 } });

function seedSwings() {
  if (localStorage.getItem("vuelo.swings.v1")) return;
  const swings: SwingRecord[] = [
    swing("sw1", "2026-11-03T18:20:00", { swayPct: 32, headPct: 14, shoulderTurnDeg: 54, tempoRatio: 1.7 }, [FAULTS.sway, FAULTS.turn, FAULTS.tempo]),
    swing("sw2", "2026-11-10T10:05:00", { swayPct: 24, headPct: 12, shoulderTurnDeg: 66, tempoRatio: 2.3 }, [FAULTS.sway, FAULTS.turn]),
    swing("sw3", "2026-11-17T17:40:00", { swayPct: 11, headPct: 10, shoulderTurnDeg: 82, tempoRatio: 2.9 }, []),
  ];
  localStorage.setItem("vuelo.swings.v1", JSON.stringify(swings));
}

// The demo account is demo@example.com with password demo1234, already signed in.
export async function seedDemo() {
  seedSwings();
  if (localStorage.getItem("vuelo.profile.v1")) return;
  localStorage.setItem("vuelo.profile.v1", JSON.stringify({ name: "Fer", email: "demo@example.com", age: 30, city: "CDMX", level: "intermedio", handicap: 19, clubs: ["Driver", "Hierro 7", "Putter"], prefs: defaultPrefs }));
  const rounds: Round[] = [
    { id: "d1", courseName: "Club de Golf México", date: "2026-11-15", holes: course([5,4,3,6,5,4,4,6,5,5,4,4,6,5,4,3,6,5], [2,2,2,3,2,2,2,2,3,2,2,2,2,3,2,2,2,2]) },
    { id: "d2", courseName: "Zibatá Golf Club", date: "2026-11-02", holes: course([5,5,4,6,5,5,3,6,4,5,5,3,6,5,5,4,6,5], [2,3,2,2,3,2,2,3,2,2,3,2,2,2,3,2,2,3]) },
    { id: "d3", courseName: "Club de Golf México", date: "2026-10-19", holes: course([4,5,3,6,4,5,4,6,5,4,5,4,6,4,5,3,6,5], [2,2,1,2,2,3,2,2,2,2,2,2,3,2,2,2,2,2]) },
    { id: "d4", courseName: "Parres Club de Golf", date: "2026-10-05", holes: course([6,5,4,7,5,5,4,6,5,5,5,4,6,5,6,4,6,5], [3,2,2,3,2,3,2,2,3,2,3,2,2,2,3,2,3,2]) },
  ];
  localStorage.setItem("vuelo.favorites.v1", JSON.stringify(CLUBS.slice(0, 2).map((c) => c.id)));
  localStorage.setItem("vuelo.rounds.v1", JSON.stringify(rounds));
  await setPassword("demo1234");
  unlock();
}

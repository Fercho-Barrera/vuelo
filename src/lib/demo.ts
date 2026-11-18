import { defaultPrefs } from "./notifications";
import type { Hole, Round } from "./stats";

// Development-only sample data so the screens can be reviewed with content. Open with ?demo=1.
// It never ships: main.tsx only calls it when import.meta.env.DEV is true.
const course = (scores: number[], putts: number[]): Hole[] =>
  scores.map((s, i) => {
    const par = [4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 3, 5, 4][i];
    return { number: i + 1, par, score: s, putts: putts[i], fairway: par === 3 ? null : s <= par + 1 ? "centro" : i % 2 ? "izq" : "der", gir: s <= par, penalties: s >= par + 2 && i % 3 === 0 ? 1 : 0, club: "Driver" };
  });

export function seedDemo() {
  if (localStorage.getItem("vuelo.profile.v1")) return;
  localStorage.setItem("vuelo.profile.v1", JSON.stringify({ name: "Fer", city: "CDMX", level: "intermedio", handicap: 19, clubs: ["Driver", "Hierro 7", "Putter"], prefs: defaultPrefs }));
  const rounds: Round[] = [
    { id: "d1", courseName: "Club de Golf México", date: "2026-11-15", holes: course([5,4,3,6,5,4,4,6,5,5,4,4,6,5,4,3,6,5], [2,2,2,3,2,2,2,2,3,2,2,2,2,3,2,2,2,2]) },
    { id: "d2", courseName: "Zibatá Golf Club", date: "2026-11-02", holes: course([5,5,4,6,5,5,3,6,4,5,5,3,6,5,5,4,6,5], [2,3,2,2,3,2,2,3,2,2,3,2,2,2,3,2,2,3]) },
    { id: "d3", courseName: "Club de Golf México", date: "2026-10-19", holes: course([4,5,3,6,4,5,4,6,5,4,5,4,6,4,5,3,6,5], [2,2,1,2,2,3,2,2,2,2,2,2,3,2,2,2,2,2]) },
    { id: "d4", courseName: "Parres Club de Golf", date: "2026-10-05", holes: course([6,5,4,7,5,5,4,6,5,5,5,4,6,5,6,4,6,5], [3,2,2,3,2,3,2,2,3,2,3,2,2,2,3,2,3,2]) },
  ];
  localStorage.setItem("vuelo.rounds.v1", JSON.stringify(rounds));
}

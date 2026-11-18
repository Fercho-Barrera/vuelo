import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, ListRow, SectionHeader } from "../components/glass";
import { BackIcon } from "../components/icons";
import { data } from "../lib/data";
import { summarize, type Round } from "../lib/stats";

const sign = (n: number) => (n > 0 ? `+${n}` : String(n));
const FW = { izq: "fairway izq", centro: "fairway", der: "fairway der" } as const;

// A saved round, read only: there is intentionally no way to edit it here.
export function Ronda() {
  const { id } = useParams();
  const [round, setRound] = useState<Round | null | undefined>(undefined);
  useEffect(() => { void data.getRounds().then((rs) => setRound(rs.find((r) => r.id === id) ?? null)); }, [id]);

  const back = <div className="topbar" style={{ marginLeft: -10 }}><Link to="/stats" className="icon-btn" aria-label="Volver a stats"><BackIcon /></Link></div>;
  if (round === undefined) return null;
  if (round === null) return <main className="screen">{back}<h1>Partida no encontrada</h1></main>;

  const s = summarize(round);
  const date = new Date(`${round.date}T12:00:00`).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
  return (
    <main className="screen">
      {back}
      <Card hero>
        <div className="label-caption">{round.courseName} · {date}</div>
        <div className="num-hero" style={{ margin: "8px 0 12px" }}>{s.total}</div>
        <div className="chips">
          <span className="pillbadge">{sign(s.toPar)}</span>
          <span className="pillbadge">{s.putts} putts</span>
          <span className="pillbadge">{Math.round(s.girPct)}% GIR</span>
          <span className="pillbadge">{Math.round(s.fairwayPct)}% fairways</span>
          {s.penalties > 0 && <span className="pillbadge">{s.penalties} penalidades</span>}
        </div>
      </Card>
      <SectionHeader title="Hoyo por hoyo" />
      <Card flush>
        {round.holes.map((h) => (
          <ListRow key={h.number} icon={<span style={{ fontWeight: 700 }}>{h.number}</span>} title={`Par ${h.par}`}
            sub={[`${h.putts} putts`, h.fairway ? FW[h.fairway] : null, h.gir ? "GIR" : null, h.penalties ? `${h.penalties} pen.` : null].filter(Boolean).join(" · ")}
            trail={<>{h.score} <span className="muted" style={{ fontWeight: 600 }}>{sign(h.score - h.par)}</span></>} />
        ))}
      </Card>
      <span className="muted">Las partidas guardadas no se pueden modificar.</span>
    </main>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, ButtonLink, Card, EmptyState, FlightArc, ListRow, SectionHeader } from "../components/glass";
import { CalendarIcon, PinIcon, TargetIcon } from "../components/icons";
import { data } from "../lib/data";
import { buildPracticePlan } from "../lib/practicePlan";
import { useProfile } from "../lib/profile";
import { handicapEstimate, lossAreas, summarize, type Round } from "../lib/stats";

const fmtDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
const sign = (n: number) => (n > 0 ? `+${n}` : String(n));

export function Hoy() {
  const { profile } = useProfile();
  const nav = useNavigate();
  const [rounds, setRounds] = useState<Round[]>([]);
  useEffect(() => { void data.getRounds().then(setRounds); }, []);

  const sorted = rounds.slice().sort((a, b) => b.date.localeCompare(a.date));
  const hcp = handicapEstimate(rounds);
  const plan = buildPracticePlan({ loss: rounds.length ? lossAreas(rounds)[0] : null, faults: [] });
  const last = sorted[0] ? summarize(sorted[0]) : null;

  return (
    <main className="screen">
      <div className="topbar">
        <div className="stack" style={{ gap: 2 }}>
          <span className="label-caption">Hola</span>
          <h1>{profile?.name ?? "Golfista"}</h1>
        </div>
        <Link to="/perfil" className="avatar-link" aria-label="Ir a mi perfil"><Avatar name={profile?.name ?? ""} photo={profile?.photo} /></Link>
      </div>

      <Card hero>
        <FlightArc className="hero__arc" />
        <div className="label-caption">Hándicap estimado</div>
        <div className="num-hero" style={{ margin: "8px 0 14px" }}>{hcp !== null ? hcp.toFixed(1) : "--"}</div>
        <div className="chips">
          <span className="pillbadge">{rounds.length === 0 ? "Registra tu primera ronda" : hcp === null ? `${rounds.length} de 3 rondas para calcularlo` : `Basado en ${rounds.length} rondas`}</span>
          {last && <span className="pillbadge">Última: {last.total} ({sign(last.toPar)})</span>}
        </div>
      </Card>

      <SectionHeader title="Práctica de hoy" />
      {plan.length > 0 ? (
        <Card flush>
          {plan.map((d, i) => <ListRow key={i} icon={<TargetIcon />} accent={i === 0} title={d.source === "stats" ? "Desde tus rondas" : "Desde tu swing"} sub={d.text} />)}
        </Card>
      ) : (
        <Card><EmptyState title="Tu práctica empieza con una ronda" text="Con tu primera ronda te armamos la práctica de la semana." action={<ButtonLink to="/stats/nueva" variant="primary" small>Registrar ronda</ButtonLink>} /></Card>
      )}

      <SectionHeader title="Próximo tee time" />
      <Card flush>
        <ListRow icon={<CalendarIcon />} title="Sin reservas" sub="Elige un club y contáctalo desde su ficha." onClick={() => nav("/clubes")} />
      </Card>

      {sorted.length > 0 && (
        <>
          <SectionHeader title="Últimas rondas" to="/stats" cta="Ver todo" />
          <Card flush>
            {sorted.slice(0, 3).map((r) => { const s = summarize(r); return (
              <ListRow key={r.id} icon={<PinIcon />} title={r.courseName} sub={fmtDate(r.date)} trail={<>{s.total} <span className="muted" style={{ fontWeight: 600 }}>{sign(s.toPar)}</span></>} onClick={() => nav(`/stats/ronda/${r.id}`)} />
            ); })}
          </Card>
        </>
      )}
    </main>
  );
}

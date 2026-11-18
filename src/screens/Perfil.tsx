import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, ListRow, SectionHeader } from "../components/glass";
import { FlagIcon, GearIcon } from "../components/icons";
import { CLUBS } from "../lib/clubs";
import { data } from "../lib/data";
import { getFavorites } from "../lib/favorites";
import { useProfile } from "../lib/profile";
import { handicapEstimate, type Round } from "../lib/stats";

export function Perfil() {
  const { profile } = useProfile();
  const [rounds, setRounds] = useState<Round[]>([]);
  useEffect(() => { void data.getRounds().then(setRounds); }, []);
  if (!profile) return null;

  const hcp = handicapEstimate(rounds);
  const favs = CLUBS.filter((c) => getFavorites().includes(c.id));
  return (
    <main className="screen">
      <div className="topbar" style={{ justifyContent: "flex-end", marginRight: -10 }}>
        <Link to="/perfil/ajustes" className="icon-btn" aria-label="Ajustes de la cuenta"><GearIcon /></Link>
      </div>

      <div className="stack" style={{ justifyItems: "center", textAlign: "center", gap: 10, marginTop: -8 }}>
        <div className="avatar avatar--lg" aria-hidden="true">{profile.name.trim().charAt(0).toUpperCase() || "G"}</div>
        <h1>{profile.name || "Golfista"}</h1>
        <span className="muted">{profile.city} · {profile.level === "principiante" ? "Principiante" : "Intermedio"}</span>
      </div>

      <Card>
        <div className="stat-trio">
          <div><span className="num-big" style={{ fontSize: 30 }}>{rounds.length}</span><span className="label-caption">Rondas</span></div>
          <div><span className="num-big" style={{ fontSize: 30 }}>{profile.handicap ?? "--"}</span><span className="label-caption">Hándicap</span></div>
          <div><span className="num-big" style={{ fontSize: 30 }}>{hcp?.toFixed(1) ?? "--"}</span><span className="label-caption">Estimado</span></div>
        </div>
      </Card>

      <SectionHeader title="Mi bolsa" />
      <Card>
        {profile.clubs.length > 0
          ? <div className="chips">{profile.clubs.map((c) => <span key={c} className="chip" style={{ cursor: "default" }}>{c}</span>)}</div>
          : <span className="muted">Aún no agregas palos.</span>}
      </Card>

      <SectionHeader title="Clubes favoritos" to="/clubes" cta="Ver clubes" />
      <Card flush>
        {favs.length > 0
          ? favs.map((c) => <ListRow key={c.id} icon={<FlagIcon />} title={c.name} sub={c.city} />)
          : <ListRow icon={<FlagIcon />} title="Sin favoritos" sub="Guarda un club desde su ficha." />}
      </Card>
    </main>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Card, ListRow, SectionHeader } from "../components/glass";
import { CameraIcon, FlagIcon, GearIcon } from "../components/icons";
import { BAG } from "../lib/bag";
import { fileToAvatarDataUrl } from "../lib/photo";
import { CLUBS } from "../lib/clubs";
import { data } from "../lib/data";
import { getFavorites } from "../lib/favorites";
import { useProfile } from "../lib/profile";
import { handicapEstimate, type Round } from "../lib/stats";

export function Perfil() {
  const { profile, save } = useProfile();
  const [photoError, setPhotoError] = useState(false);
  const [rounds, setRounds] = useState<Round[]>([]);
  useEffect(() => { void data.getRounds().then(setRounds); }, []);
  if (!profile) return null;

  const toggleClub = (c: string) => save({ ...profile, clubs: profile.clubs.includes(c) ? profile.clubs.filter((x) => x !== c) : [...profile.clubs, c] });
  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    setPhotoError(false);
    try { await save({ ...profile, photo: await fileToAvatarDataUrl(file) }); } catch { setPhotoError(true); }
  };
  const hcp = handicapEstimate(rounds);
  const favs = CLUBS.filter((c) => getFavorites().includes(c.id));
  return (
    <main className="screen">
      <div className="topbar" style={{ justifyContent: "flex-end", marginRight: -10 }}>
        <Link to="/perfil/ajustes" className="icon-btn" aria-label="Ajustes de la cuenta"><GearIcon /></Link>
      </div>

      <div className="stack" style={{ justifyItems: "center", textAlign: "center", gap: 10, marginTop: -8 }}>
        <label className="avatar-pick" aria-label="Cambiar foto de perfil">
          <Avatar name={profile.name} photo={profile.photo} large />
          <span className="avatar-pick__badge"><CameraIcon /></span>
          <input type="file" accept="image/*" onChange={(e) => { void pickPhoto(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
        <h1>{profile.name || "Golfista"}</h1>
        <span className="muted">{profile.city} · {profile.level === "principiante" ? "Principiante" : "Intermedio"}</span>
        {photoError && <span style={{ color: "var(--danger)" }}>No pudimos usar esa foto. Prueba con otra.</span>}
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
        <p className="muted" style={{ margin: "0 0 12px" }}>Toca para agregar o quitar palos.</p>
        <div className="chips">
          {BAG.map((c) => <button key={c} type="button" className="chip" aria-pressed={profile.clubs.includes(c)} onClick={() => toggleClub(c)}>{c}</button>)}
        </div>
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

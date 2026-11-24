import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Card, EmptyState, GlassSheet, ListRow, SectionHeader } from "../components/glass";
import { BackIcon, CalendarIcon, ChevronIcon, FlagIcon } from "../components/icons";
import { CLUBS } from "../lib/clubs";
import { data } from "../lib/data";
import { isValidTeeTime, upcoming, whenText, type TeeTime } from "../lib/teeTimes";

const OTHER = "otro";

export function MiTeeTime() {
  const [list, setList] = useState<TeeTime[]>([]);
  const [params] = useSearchParams();
  const fromClub = CLUBS.find((c) => c.id === params.get("club"));
  const [clubId, setClubId] = useState<string>(fromClub?.id ?? CLUBS[0]?.id ?? OTHER);
  const [picking, setPicking] = useState(false);
  const form = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const [other, setOther] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const load = () => data.getTeeTimes().then(setList);
  useEffect(() => { void load(); }, []);
  // Coming from a club card: the club is already chosen, so take the person straight to day and time.
  useEffect(() => {
    if (!fromClub) return;
    form.current?.scrollIntoView({ block: "center" });
    dateRef.current?.focus({ preventScroll: true });
  }, [fromClub]);

  const club = CLUBS.find((c) => c.id === clubId);
  const draft = { clubName: club ? club.name : other, date, time };
  const save = async () => {
    if (!isValidTeeTime(draft)) return;
    await data.saveTeeTime({ id: `t${Date.now()}`, clubId: club?.id ?? null, ...draft, clubName: draft.clubName.trim() });
    setDate(""); setTime(""); setOther("");
    await load();
  };
  const remove = async (id: string) => { await data.deleteTeeTime(id); await load(); };
  const next = upcoming(list, new Date());

  return (
    <main className="screen">
      <div className="topbar" style={{ marginLeft: -10 }}>
        <Link to="/" className="icon-btn" aria-label="Volver a Hoy"><BackIcon /></Link>
      </div>
      <h1>Mi tee time</h1>
      <span className="muted">{fromClub ? `Elegimos ${fromClub.name}. Solo falta el día y la hora.` : "Reserva con el club como siempre y apúntalo aquí. Así te lo recordamos."}</span>

      {next.length === 0
        ? <Card><EmptyState title="Sin tee times próximos" text="Agrega el que reservaste con tu club." /></Card>
        : <Card flush>{next.map((t) => (
            <div key={t.id} className="teetime-row">
              <ListRow icon={<CalendarIcon />} title={t.clubName} sub={whenText(t)} />
              <Button small onClick={() => void remove(t.id)} aria-label={`Quitar tee time en ${t.clubName}`}>Quitar</Button>
            </div>
          ))}</Card>}

      <SectionHeader title="Agregar tee time" />
      <div ref={form}><Card className="stack" style={{ gap: 12 }}>
        <button type="button" className="field field--picker" aria-haspopup="dialog" onClick={() => setPicking(true)}>
          <span className={club ? "" : "muted"}>{club ? club.name : "Otro club"}</span>
          <ChevronIcon />
        </button>
        {!club && <input className="field" aria-label="Nombre del club" placeholder="Nombre del club" value={other} onChange={(e) => setOther(e.target.value)} />}
        <div className="row" style={{ gap: 12 }}>
          <input ref={dateRef} className="field" type="date" aria-label="Día" value={date} onChange={(e) => setDate(e.target.value)} />
          <input className="field" type="time" aria-label="Hora" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <Button block variant="primary" disabled={!isValidTeeTime(draft)} onClick={() => void save()}>Guardar tee time</Button>
        <span className="label-caption">Los recordatorios de 24 y 2 horas antes se activan cuando las notificaciones estén conectadas.</span>
      </Card></div>

      <GlassSheet open={picking} onClose={() => setPicking(false)} title="Elige tu club">
        <div className="sheet__list">
          {CLUBS.map((c) => (
            <ListRow key={c.id} icon={<FlagIcon />} title={c.name} sub={c.city} trail={c.id === clubId ? "✓" : undefined} onClick={() => { setClubId(c.id); setPicking(false); }} />
          ))}
          <ListRow icon={<FlagIcon />} title="Otro club" sub="Escribe el nombre" trail={!club ? "✓" : undefined} onClick={() => { setClubId(OTHER); setPicking(false); }} />
        </div>
      </GlassSheet>
    </main>
  );
}

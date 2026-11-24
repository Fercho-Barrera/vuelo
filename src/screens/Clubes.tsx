import { useMemo, useState } from "react";
import { Button, ButtonAnchor, ButtonLink, Card, EmptyState, GlassSheet, PillSelector } from "../components/glass";
import { ChevronIcon } from "../components/icons";
import { CLUBS, accessOf, distanceKm, filterClubs, mapsLink, noFilters, practiceOf, priceText, servicesOf, sortByDistance, sortHomeFirst, waLink, type Club, type Filters } from "../lib/clubs";
import { getFavorites, toggleFavorite } from "../lib/favorites";
import { useProfile } from "../lib/profile";

export function Clubes() {
  const { profile } = useProfile();
  const [f, setF] = useState<Filters>(noFilters);
  const [favs, setFavs] = useState<string[]>(getFavorites);
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [open, setOpen] = useState<Club | null>(null);
  const [geoError, setGeoError] = useState(false);

  const list = useMemo(() => {
    let l = filterClubs(CLUBS, f);
    if (onlyFavs) l = l.filter((c) => favs.includes(c.id));
    return pos ? sortByDistance(l, pos.lat, pos.lng) : sortHomeFirst(l, profile?.city ?? "Otra");
  }, [f, onlyFavs, favs, pos, profile?.city]);

  const locate = () => {
    setGeoError(false);
    navigator.geolocation?.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setGeoError(true),
    );
  };

  return (
    <main className="screen">
      <h1>Clubes</h1>
      <PillSelector<Filters["city"]> label="Ciudad" value={f.city} onChange={(city) => setF({ ...f, city })} options={[{ value: "todas", label: "Todas" }, { value: "CDMX", label: "CDMX" }, { value: "Querétaro", label: "Querétaro" }]} />
      <div className="chips chips--scroll">
        <button type="button" className="chip" aria-pressed={pos !== null} onClick={locate}>Cerca de mí</button>
        <button type="button" className="chip" aria-pressed={f.nonMembers} onClick={() => setF({ ...f, nonMembers: !f.nonMembers })}>Abierto al público</button>
        <button type="button" className="chip" aria-pressed={f.maxPrice === 1500} onClick={() => setF({ ...f, maxPrice: f.maxPrice === 1500 ? null : 1500 })}>Hasta $1,500</button>
        <button type="button" className="chip" aria-pressed={onlyFavs} onClick={() => setOnlyFavs(!onlyFavs)}>Favoritos</button>
      </div>
      {geoError && <span className="muted">No pudimos ubicarte. Revisa el permiso de ubicación.</span>}
      {list.length === 0 && (
        <Card>
          {CLUBS.length === 0
            ? <EmptyState title="Aún no hay clubes" text="Estamos cargando el directorio con datos verificados." />
            : <EmptyState title="Ningún club coincide" text="Prueba con menos filtros." action={<Button small onClick={() => { setF(noFilters); setOnlyFavs(false); setPos(null); }}>Quitar filtros</Button>} />}
        </Card>
      )}
      {list.map((c) => {
        const km = pos && c.lat !== null && c.lng !== null ? distanceKm(pos.lat, pos.lng, c.lat, c.lng) : null;
        const access = accessOf(c);
        const practice = practiceOf(c);
        return (
          <Card key={c.id} className="club-card" role="button" tabIndex={0} onClick={() => setOpen(c)} onKeyDown={(e) => e.key === "Enter" && setOpen(c)}>
            <div className="row" style={{ alignItems: "flex-start" }}>
              <div className="stack" style={{ gap: 4, minWidth: 0 }}>
                <h2 style={{ fontSize: 19 }}>{c.name}</h2>
                <span className="label-caption">{[c.city, c.holes ? `${c.holes} hoyos` : null, km !== null ? `a ${Math.round(km)} km` : null].filter(Boolean).join(" · ")}</span>
              </div>
              {favs.includes(c.id) && <span className="club-card__star" aria-label="Favorito">★</span>}
            </div>
            <span className={`badge badge--${access.tone}`}>{access.text}</span>
            <div className="stack" style={{ gap: 2 }}>
              <strong>{priceText(c)}</strong>
              {practice.length > 0 && <span className="label-caption">Para practicar: {practice.join(" · ").toLowerCase()}</span>}
            </div>
            <div className="row club-card__foot">
              <ButtonLink small variant="primary" to={`/teetime?club=${c.id}`} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>Agendar tee time</ButtonLink>
              <span className="club-card__go" aria-hidden="true"><ChevronIcon /></span>
            </div>
          </Card>
        );
      })}
      <GlassSheet open={open !== null} onClose={() => setOpen(null)} title={open?.name ?? ""}>
        {open && (
          <div className="stack" style={{ gap: 14 }}>
            <span className={`badge badge--${accessOf(open).tone}`} style={{ justifySelf: "start" }}>{accessOf(open).text}</span>
            <div className="stack" style={{ gap: 2 }}><span className="label-caption">¿Cuánto cuesta?</span><strong>{priceText(open)}</strong></div>
            <div className="stack" style={{ gap: 2 }}><span className="label-caption">Dónde está</span><span>{open.address ?? open.city}</span></div>
            {practiceOf(open).length > 0 && <div className="stack" style={{ gap: 6 }}><span className="label-caption">Para practicar</span><div className="chips">{practiceOf(open).map((x) => <span key={x} className="tag">{x}</span>)}</div></div>}
            {servicesOf(open).length > 0 && <div className="stack" style={{ gap: 6 }}><span className="label-caption">Servicios</span><div className="chips">{servicesOf(open).map((x) => <span key={x} className="tag">{x}</span>)}</div></div>}
            <span className="muted">Precios y horarios cambian. Confirma con el club antes de ir.</span>
            {(open.whatsapp ?? open.phone) && <ButtonAnchor variant="primary" block href={open.whatsapp ? waLink(open.whatsapp) : `tel:${open.phone}`}>{open.whatsapp ? "Reservar por WhatsApp" : "Llamar al club"}</ButtonAnchor>}
            <ButtonAnchor block href={mapsLink(open)}>Abrir en Mapas</ButtonAnchor>
            {open.website && <ButtonAnchor block href={open.website}>Sitio del club</ButtonAnchor>}
            <ButtonLink block to={`/teetime?club=${open.id}`}>Agendar tee time</ButtonLink>
            <Button block onClick={() => setFavs(toggleFavorite(open.id))}>{favs.includes(open.id) ? "Quitar de favoritos" : "Guardar en favoritos"}</Button>
          </div>
        )}
      </GlassSheet>
    </main>
  );
}

import { useMemo, useState } from "react";
import { Button, ButtonAnchor, Card, GlassSheet, PillSelector } from "../components/glass";
import { ChevronIcon, PinIcon } from "../components/icons";
import { CLUBS, filterClubs, mapsLink, noFilters, sortByDistance, sortHomeFirst, waLink, type Club, type Filters } from "../lib/clubs";
import { useProfile } from "../lib/profile";
import { distanceKm } from "../lib/clubs";
import { getFavorites, toggleFavorite } from "../lib/favorites";

const AMENITY: Record<string, string> = { driving_range: "Driving range", putting_green: "Putting green", restaurante: "Restaurante", carrito: "Carrito", caddie: "Caddie", renta_palos: "Renta de palos", clases: "Clases", tienda: "Tienda" };
const mxn = (n: number) => `$${n.toLocaleString("es-MX")}`;

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
        <button type="button" className="chip" aria-pressed={f.nonMembers} onClick={() => setF({ ...f, nonMembers: !f.nonMembers })}>Acepta no socios</button>
        <button type="button" className="chip" aria-pressed={f.beginner} onClick={() => setF({ ...f, beginner: !f.beginner })}>Para principiantes</button>
        <button type="button" className="chip" aria-pressed={f.maxPrice === 1500} onClick={() => setF({ ...f, maxPrice: f.maxPrice === 1500 ? null : 1500 })}>Hasta $1,500</button>
        <button type="button" className="chip" aria-pressed={onlyFavs} onClick={() => setOnlyFavs(!onlyFavs)}>Favoritos</button>
      </div>
      {geoError && <span className="muted">No pudimos ubicarte. Revisa el permiso de ubicación.</span>}
      {list.length === 0 && <Card><p className="muted" style={{ margin: 0 }}>{CLUBS.length === 0 ? "Aún no hay clubes cargados." : "Ningún club coincide con tus filtros."}</p></Card>}
      {list.map((c) => {
        const km = pos && c.lat !== null && c.lng !== null ? distanceKm(pos.lat, pos.lng, c.lat, c.lng) : null;
        const tags = [
          c.holes ? `${c.holes} hoyos` : null,
          c.acceptsNonMembers === true ? "Acepta no socios" : c.acceptsNonMembers === false ? "Solo socios" : null,
          c.beginnerFriendly === true ? "Para principiantes" : null,
        ].filter(Boolean) as string[];
        return (
          <Card key={c.id} className="club-card" role="button" tabIndex={0} onClick={() => setOpen(c)} onKeyDown={(e) => e.key === "Enter" && setOpen(c)}>
            <div className="row" style={{ alignItems: "flex-start" }}>
              <div className="stack" style={{ gap: 4, minWidth: 0 }}>
                <h2 style={{ fontSize: 19 }}>{c.name}</h2>
                <span className="label-caption" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span className="club-card__pin"><PinIcon /></span>{c.city}{km !== null ? ` · a ${Math.round(km)} km` : ""}</span>
              </div>
              {favs.includes(c.id) && <span className="club-card__star" aria-label="Favorito">★</span>}
            </div>
            {tags.length > 0 && <div className="chips">{tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>}
            {c.amenities.length > 0 && <span className="label-caption">{c.amenities.slice(0, 3).map((a) => AMENITY[a]).join(" · ")}{c.amenities.length > 3 ? ` · +${c.amenities.length - 3}` : ""}</span>}
            <div className="row club-card__foot">
              {c.priceFromMXN !== null ? <span><span className="label-caption">Desde </span><strong>{mxn(c.priceFromMXN)}</strong></span> : <span className="label-caption">Precio: consulta al club</span>}
              <span className="club-card__go"><ChevronIcon /></span>
            </div>
          </Card>
        );
      })}
      <GlassSheet open={open !== null} onClose={() => setOpen(null)} title={open?.name ?? ""}>
        {open && (
          <div className="stack">
            <span className="muted">{open.address ?? open.city}</span>
            <span>{open.priceFromMXN !== null ? `Desde ${mxn(open.priceFromMXN)}` : "Precio: consulta al club"}{open.priceNote ? `. ${open.priceNote}` : ""}</span>
            {open.amenities.length > 0 && <div className="chips">{open.amenities.map((a) => <span key={a} className="chip" style={{ cursor: "default" }}>{AMENITY[a]}</span>)}</div>}
            <span className="muted">Precios y horarios cambian: confirma con el club antes de ir. Datos verificados el {open.verifiedOn}.</span>
            {(open.whatsapp ?? open.phone) && <ButtonAnchor variant="primary" block href={open.whatsapp ? waLink(open.whatsapp) : `tel:${open.phone}`}>{open.whatsapp ? "Reservar por WhatsApp" : "Llamar al club"}</ButtonAnchor>}
            <ButtonAnchor block href={mapsLink(open)}>Abrir en Mapas</ButtonAnchor>
            {open.website && <ButtonAnchor block href={open.website}>Sitio del club</ButtonAnchor>}
            <Button block onClick={() => setFavs(toggleFavorite(open.id))}>{favs.includes(open.id) ? "Quitar de favoritos" : "Guardar en favoritos"}</Button>
          </div>
        )}
      </GlassSheet>
    </main>
  );
}

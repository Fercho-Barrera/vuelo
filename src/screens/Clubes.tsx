import { useMemo, useState } from "react";
import { Button, ButtonAnchor, Card, GlassSheet, ListRow, PillSelector } from "../components/glass";
import { FlagIcon } from "../components/icons";
import { CLUBS, filterClubs, mapsLink, noFilters, sortByDistance, waLink, type Club, type Filters } from "../lib/clubs";
import { getFavorites, toggleFavorite } from "../lib/favorites";

const AMENITY: Record<string, string> = { driving_range: "Driving range", putting_green: "Putting green", restaurante: "Restaurante", carrito: "Carrito", caddie: "Caddie", renta_palos: "Renta de palos", clases: "Clases", tienda: "Tienda" };
const mxn = (n: number) => `$${n.toLocaleString("es-MX")}`;

export function Clubes() {
  const [f, setF] = useState<Filters>(noFilters);
  const [favs, setFavs] = useState<string[]>(getFavorites);
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [open, setOpen] = useState<Club | null>(null);
  const [geoError, setGeoError] = useState(false);

  const list = useMemo(() => {
    let l = filterClubs(CLUBS, f);
    if (onlyFavs) l = l.filter((c) => favs.includes(c.id));
    return pos ? sortByDistance(l, pos.lat, pos.lng) : l;
  }, [f, onlyFavs, favs, pos]);

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
      {list.length > 0 && (
        <Card flush>
          {list.map((c) => (
            <ListRow key={c.id} icon={<FlagIcon />} accent={favs.includes(c.id)} title={c.name}
              sub={`${c.city}${c.holes ? ` · ${c.holes} hoyos` : ""}${c.acceptsNonMembers === true ? " · Acepta no socios" : c.acceptsNonMembers === false ? " · Solo socios" : ""}`}
              trail={c.priceFromMXN !== null ? mxn(c.priceFromMXN) : ""} onClick={() => setOpen(c)} />
          ))}
        </Card>
      )}
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

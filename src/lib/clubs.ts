export type Amenity = "driving_range" | "putting_green" | "restaurante" | "carrito" | "caddie" | "renta_palos" | "clases" | "tienda";

export type Club = {
  id: string; name: string; city: "CDMX" | "Querétaro" | "Estado de México" | "Otra";
  address: string | null; lat: number | null; lng: number | null; holes: number | null;
  acceptsNonMembers: boolean | null; beginnerFriendly: boolean | null;
  priceFromMXN: number | null; priceNote: string | null;
  difficulty: "facil" | "media" | "dificil" | null;
  amenities: Amenity[]; phone: string | null; whatsapp: string | null; website: string | null;
  source: string; verifiedOn: string; confidence: "alta" | "media" | "baja";
};

export type Filters = { city: "todas" | Club["city"]; nonMembers: boolean; beginner: boolean; maxPrice: number | null; difficulty: "todas" | NonNullable<Club["difficulty"]> };
export const noFilters: Filters = { city: "todas", nonMembers: false, beginner: false, maxPrice: null, difficulty: "todas" };

// Unknown (null) never matches a restrictive filter: we only promise what the source states.
export function filterClubs(clubs: Club[], f: Filters): Club[] {
  return clubs.filter((c) =>
    (f.city === "todas" || c.city === f.city) &&
    (!f.nonMembers || c.acceptsNonMembers === true) &&
    (!f.beginner || c.beginnerFriendly === true) &&
    (f.maxPrice === null || (c.priceFromMXN !== null && c.priceFromMXN <= f.maxPrice)) &&
    (f.difficulty === "todas" || c.difficulty === f.difficulty),
  );
}

export const distanceKm = (aLat: number, aLng: number, bLat: number, bLng: number) => {
  const r = Math.PI / 180, dLat = (bLat - aLat) * r, dLng = (bLng - aLng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};

export const sortByDistance = (clubs: Club[], lat: number, lng: number): Club[] =>
  clubs.slice().sort((a, b) => {
    const da = a.lat !== null && a.lng !== null ? distanceKm(lat, lng, a.lat, a.lng) : Infinity;
    const db = b.lat !== null && b.lng !== null ? distanceKm(lat, lng, b.lat, b.lng) : Infinity;
    return da - db;
  });

export const waLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "")}`;
export const mapsLink = (c: Club) =>
  c.lat !== null && c.lng !== null ? `https://maps.apple.com/?ll=${c.lat},${c.lng}&q=${encodeURIComponent(c.name)}` : `https://maps.apple.com/?q=${encodeURIComponent(`${c.name} ${c.address ?? ""}`)}`;

const loaded = import.meta.glob<Club[]>("../data/clubs.json", { eager: true, import: "default" });
export const CLUBS: Club[] = Object.values(loaded)[0] ?? [];

// Clubs in the player's home city first, then the same metro area (Estado de México counts with CDMX),
// then the rest. The sort is stable, so the original order holds inside each group.
export function sortHomeFirst(clubs: Club[], home: "CDMX" | "Querétaro" | "Otra"): Club[] {
  if (home === "Otra") return clubs;
  const rank = (c: Club) => (c.city === home ? 0 : home === "CDMX" && c.city === "Estado de México" ? 1 : 2);
  return clubs.map((c, i) => ({ c, i })).sort((a, b) => rank(a.c) - rank(b.c) || a.i - b.i).map((x) => x.c);
}

// Plain-language answers a golfer cares about. Unknown never reads as yes.
export type Access = { text: string; tone: "ok" | "no" | "maybe" };
export const accessOf = (c: Club): Access =>
  c.acceptsNonMembers === true ? { text: "Abierto al público", tone: "ok" }
  : c.acceptsNonMembers === false ? { text: "Solo socios o invitados", tone: "no" }
  : { text: "Acceso por confirmar", tone: "maybe" };

// Prices not confirmed by the club itself are shown as approximate.
export function priceText(c: Club): string {
  if (c.priceFromMXN === null) return "Precio: pregunta al club";
  return `Desde $${c.priceFromMXN.toLocaleString("es-MX")}${c.confidence === "alta" ? "" : " (aprox.)"}`;
}

const PRACTICE: Partial<Record<Amenity, string>> = { driving_range: "Driving range", putting_green: "Green de práctica", clases: "Clases" };
const SERVICES: Partial<Record<Amenity, string>> = { carrito: "Carrito", caddie: "Caddie", renta_palos: "Renta de palos", restaurante: "Restaurante", tienda: "Tienda de golf" };
export const practiceOf = (c: Club) => c.amenities.map((a) => PRACTICE[a]).filter(Boolean) as string[];
export const servicesOf = (c: Club) => c.amenities.map((a) => SERVICES[a]).filter(Boolean) as string[];

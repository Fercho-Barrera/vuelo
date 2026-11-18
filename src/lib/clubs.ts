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

import { describe, expect, it } from "vitest";
import { filterClubs, noFilters, sortByDistance, waLink, type Club } from "./clubs";

const base: Club = { id: "a", name: "A", city: "CDMX", address: null, lat: 19.4, lng: -99.1, holes: 18, acceptsNonMembers: true, beginnerFriendly: null, priceFromMXN: 900, priceNote: null, difficulty: null, amenities: [], phone: null, whatsapp: null, website: null, source: "x", verifiedOn: "2026-11-17", confidence: "alta" };
const clubs: Club[] = [base, { ...base, id: "b", city: "Querétaro", acceptsNonMembers: false, priceFromMXN: null, lat: 20.6, lng: -100.4 }, { ...base, id: "c", acceptsNonMembers: null, priceFromMXN: 1500, beginnerFriendly: true }];

describe("filterClubs", () => {
  it("returns everything with no filters", () => expect(filterClubs(clubs, noFilters)).toHaveLength(3));
  it("treats unknown as not matching a restrictive filter", () => {
    expect(filterClubs(clubs, { ...noFilters, nonMembers: true }).map((c) => c.id)).toEqual(["a"]);
    expect(filterClubs(clubs, { ...noFilters, maxPrice: 1000 }).map((c) => c.id)).toEqual(["a"]);
    expect(filterClubs(clubs, { ...noFilters, beginner: true }).map((c) => c.id)).toEqual(["c"]);
  });
  it("filters by city", () => expect(filterClubs(clubs, { ...noFilters, city: "Querétaro" }).map((c) => c.id)).toEqual(["b"]));
});

describe("sortByDistance", () => {
  it("puts the nearest first and unknown coordinates last", () => {
    const withNull = [{ ...base, id: "n", lat: null, lng: null }, ...clubs];
    expect(sortByDistance(withNull, 20.59, -100.39)[0].id).toBe("b");
    expect(sortByDistance(withNull, 20.59, -100.39)[3].id).toBe("n");
  });
});

describe("waLink", () => {
  it("keeps digits only", () => expect(waLink("+52 55 1234-5678")).toBe("https://wa.me/525512345678"));
});

import { sortHomeFirst } from "./clubs";
describe("sortHomeFirst", () => {
  const mk = (id: string, city: Club["city"]): Club => ({ ...base, id, city });
  const list = [mk("q1", "Querétaro"), mk("m1", "Estado de México"), mk("c1", "CDMX"), mk("c2", "CDMX")];
  it("puts the home city first, then its metro area, then the rest, keeping order inside groups", () => {
    expect(sortHomeFirst(list, "CDMX").map((c) => c.id)).toEqual(["c1", "c2", "m1", "q1"]);
  });
  it("puts Querétaro first for a Querétaro player", () => {
    expect(sortHomeFirst(list, "Querétaro").map((c) => c.id)[0]).toBe("q1");
  });
  it("leaves the list alone for Otra", () => {
    expect(sortHomeFirst(list, "Otra").map((c) => c.id)).toEqual(["q1", "m1", "c1", "c2"]);
  });
});

import { accessOf, practiceOf, priceText, servicesOf } from "./clubs";
describe("plain-language helpers", () => {
  it("never turns unknown access into a yes", () => {
    expect(accessOf({ ...base, acceptsNonMembers: null }).tone).toBe("maybe");
    expect(accessOf({ ...base, acceptsNonMembers: true }).text).toBe("Abierto al público");
    expect(accessOf({ ...base, acceptsNonMembers: false }).tone).toBe("no");
  });
  it("marks unconfirmed prices as approximate and missing ones as ask the club", () => {
    expect(priceText({ ...base, priceFromMXN: 1500, confidence: "media" })).toBe("Desde $1,500 (aprox.)");
    expect(priceText({ ...base, priceFromMXN: 1500, confidence: "alta" })).toBe("Desde $1,500");
    expect(priceText({ ...base, priceFromMXN: null })).toBe("Precio: pregunta al club");
  });
  it("splits practice facilities from services", () => {
    const c = { ...base, amenities: ["driving_range", "restaurante", "putting_green", "caddie"] as Club["amenities"] };
    expect(practiceOf(c)).toEqual(["Driving range", "Green de práctica"]);
    expect(servicesOf(c)).toEqual(["Restaurante", "Caddie"]);
  });
});

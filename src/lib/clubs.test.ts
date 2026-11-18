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

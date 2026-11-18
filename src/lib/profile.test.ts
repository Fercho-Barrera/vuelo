import { beforeEach, describe, expect, it } from "vitest";
import { mockAdapter } from "./data/mock";
import { defaultPrefs } from "./notifications";

const p = { name: "Ana", city: "CDMX" as const, level: "principiante" as const, handicap: 28, clubs: ["Driver"], prefs: defaultPrefs };

describe("mock adapter", () => {
  beforeEach(() => localStorage.clear());
  it("returns null before onboarding", async () => {
    expect(await mockAdapter.getProfile()).toBeNull();
  });
  it("round-trips a profile", async () => {
    await mockAdapter.saveProfile(p);
    expect(await mockAdapter.getProfile()).toEqual(p);
  });
});

describe("mock rounds", () => {
  beforeEach(() => localStorage.clear());
  it("saves and replaces a round by id", async () => {
    const r = { id: "r1", courseName: "A", date: "2026-11-01", holes: [] };
    await mockAdapter.saveRound(r);
    await mockAdapter.saveRound({ ...r, courseName: "B" });
    const all = await mockAdapter.getRounds();
    expect(all).toHaveLength(1);
    expect(all[0].courseName).toBe("B");
  });
});

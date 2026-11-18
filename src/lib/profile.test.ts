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

import { describe, expect, it } from "vitest";
import { FREE_LIMITS, PRO_HISTORY_DAYS, canReplay, canUse, monthKey, PRICES, swingsToPrune, visibleRounds } from "./plan";
import { MAX_SAVED, type SwingRecord } from "./swing/record";
import { buildPracticePlan } from "./practicePlan";
import type { Fault } from "./swing/analysis";

describe("free limits", () => {
  it("allows 3 swing analyses and 2 ball traces per month on free", () => {
    expect(canUse("free", "swing", 2)).toBe(true);
    expect(canUse("free", "swing", FREE_LIMITS.swing)).toBe(false);
    expect(canUse("free", "ball", FREE_LIMITS.ball)).toBe(false);
  });
  it("pro is unlimited", () => {
    expect(canUse("pro_monthly", "swing", 999)).toBe(true);
    expect(canUse("pro_annual", "ball", 999)).toBe(true);
  });
  it("free sees only the last 3 rounds, newest first", () => {
    const rs = ["2026-11-01", "2026-11-05", "2026-11-03", "2026-11-09"].map((date, i) => ({ id: String(i), courseName: "", date, holes: [] }));
    expect(visibleRounds("free", rs).map((r) => r.date)).toEqual(["2026-11-09", "2026-11-05", "2026-11-03"]);
    expect(visibleRounds("pro_annual", rs)).toHaveLength(4);
  });
  it("keys usage by calendar month", () => expect(monthKey(new Date("2026-11-18T10:00:00"))).toBe("2026-11"));
  it("prices match the brief and the annual saves 649", () => {
    expect(PRICES.pro_monthly).toBe(179);
    expect(PRICES.pro_annual).toBe(1499);
    expect(PRICES.pro_monthly * 12 - PRICES.pro_annual).toBe(649);
  });
});

describe("swing history retention", () => {
  const now = new Date("2026-11-23T12:00:00Z");
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000).toISOString();
  const sw = (id: string, date: string) => ({ id, date }) as SwingRecord;
  it("pro keeps 90 days and drops only older swings", () => {
    const list = [sw("new", daysAgo(1)), sw("edge", daysAgo(PRO_HISTORY_DAYS - 1)), sw("old", daysAgo(PRO_HISTORY_DAYS + 1))];
    expect(swingsToPrune("pro_monthly", list, now).map((s) => s.id)).toEqual(["old"]);
  });
  it("pro has no count cap inside the 90 days", () => {
    const list = Array.from({ length: MAX_SAVED + 5 }, (_, i) => sw(String(i), daysAgo(i)));
    expect(swingsToPrune("pro_annual", list, now)).toEqual([]);
  });
  it("free keeps only the newest MAX_SAVED swings", () => {
    const list = Array.from({ length: MAX_SAVED + 2 }, (_, i) => sw(String(i), daysAgo(i)));
    expect(swingsToPrune("free", list, now).map((s) => s.id)).toEqual([String(MAX_SAVED), String(MAX_SAVED + 1)]);
  });
});

describe("pro-only features", () => {
  it("replay, skeleton and compare are pro only", () => {
    expect(canReplay("free")).toBe(false);
    expect(canReplay("pro_monthly")).toBe(true);
    expect(canReplay("pro_annual")).toBe(true);
  });
});

describe("buildPracticePlan", () => {
  const fault = (id: Fault["id"]): Fault => ({ id, title: "t", detail: "d", drill: `drill-${id}`, severity: 2 });
  it("combines the top loss area and the worst swing fault", () => {
    const plan = buildPracticePlan({ loss: { area: "putt", strokes: 3, tip: "tip putt" }, faults: [fault("sway"), fault("head")] });
    expect(plan.map((d) => d.source)).toEqual(["stats", "swing", "swing"]);
    expect(plan[0].text).toContain("tip putt");
  });
  it("caps the plan at 3 drills", () => {
    expect(buildPracticePlan({ loss: { area: "drive", strokes: 2, tip: "x" }, faults: [fault("sway"), fault("head"), fault("turn")] })).toHaveLength(3);
  });
  it("is empty with no data, never invented", () => {
    expect(buildPracticePlan({ loss: null, faults: [] })).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { isValidTeeTime, lockScreenName, nextTeeTime, pendingReminders, type TeeTime } from "./teeTimes";
import { decide } from "./notificationRules";
import { defaultPrefs } from "./notifications";
import type { Club } from "./clubs";

const tt = (id: string, date: string, time: string, extra: Partial<TeeTime> = {}): TeeTime => ({ id, clubId: null, clubName: "Club X", date, time, ...extra });
const now = new Date("2026-11-23T12:00:00");
const club = (o: Partial<Club>) => ({ id: "c1", name: "Club Abierto", acceptsNonMembers: true, ...o }) as Club;

describe("nextTeeTime", () => {
  it("picks the soonest one that has not started", () => {
    const list = [tt("past", "2026-11-22", "08:00"), tt("later", "2026-11-30", "09:00"), tt("soon", "2026-11-24", "08:20")];
    expect(nextTeeTime(list, now)?.id).toBe("soon");
  });
  it("is null with nothing upcoming", () => expect(nextTeeTime([tt("past", "2026-11-22", "08:00")], now)).toBeNull());
});

describe("isValidTeeTime", () => {
  it("needs a club name, a real date and a time", () => {
    expect(isValidTeeTime({ clubName: "A", date: "2026-11-24", time: "08:20" })).toBe(true);
    expect(isValidTeeTime({ clubName: " ", date: "2026-11-24", time: "08:20" })).toBe(false);
    expect(isValidTeeTime({ clubName: "A", date: "", time: "08:20" })).toBe(false);
    expect(isValidTeeTime({ clubName: "A", date: "2026-11-24", time: "" })).toBe(false);
  });
});

describe("pendingReminders", () => {
  it("schedules 24 h and 2 h before, and drops the ones already past", () => {
    const t = tt("a", "2026-11-24", "08:20");
    const all = pendingReminders(t, [], new Date("2026-11-23T00:00:00"));
    expect(all.map((r) => r.hoursBefore)).toEqual([24, 2]);
    expect(all[0].at).toEqual(new Date("2026-11-23T08:20:00"));
    const late = pendingReminders(t, [], new Date("2026-11-23T10:00:00"));
    expect(late.map((r) => r.hoursBefore)).toEqual([2]);
  });
  it("uses the brief copy and always points to the tee time screen", () => {
    const [r] = pendingReminders(tt("a", "2026-11-24", "08:20", { clubName: "Club Abierto", clubId: "c1" }), [club({})], new Date("2026-11-23T00:00:00"));
    expect(r.candidate.body).toBe("Mañana 08:20 en Club Abierto. ¿Llevas tus palos?");
    expect(r.candidate.deepLink).toBe("/teetime");
    expect(r.candidate.isBookingReminder).toBe(true);
  });
  it("reminders pass the rules engine on a normal evening when the category is on", () => {
    const [r] = pendingReminders(tt("a", "2026-11-24", "08:20"), [], new Date("2026-11-23T00:00:00"));
    expect(decide(r.candidate, defaultPrefs, [], new Date("2026-11-23T08:20:00"))).toEqual({ send: true });
  });
});

describe("lockScreenName", () => {
  it("names only clubs open to non-members; private or unknown clubs stay generic", () => {
    expect(lockScreenName(tt("a", "2026-11-24", "08:20", { clubId: "c1", clubName: "Club Abierto" }), [club({})])).toBe("Club Abierto");
    expect(lockScreenName(tt("a", "2026-11-24", "08:20", { clubId: "c1", clubName: "Club Privado" }), [club({ acceptsNonMembers: false })])).toBe("tu campo");
    expect(lockScreenName(tt("a", "2026-11-24", "08:20", { clubId: null, clubName: "Otro" }), [])).toBe("tu campo");
  });
});

import { describe, expect, it } from "vitest";
import { decide, type Candidate, type SentRecord } from "./notificationRules";
import { defaultPrefs } from "./notifications";

const at = (iso: string) => new Date(iso);
const cand = (o: Partial<Candidate> = {}): Candidate => ({ category: "progress", deepLink: "/swing/1", title: "Tu plano mejoró", body: "Sigue así.", isBookingReminder: false, ...o });
const prefs = { ...defaultPrefs, progress: true, practice: true };

describe("decide", () => {
  it("sends a normal notification inside allowed hours", () => {
    expect(decide(cand(), prefs, [], at("2026-11-18T18:00:00"))).toEqual({ send: true });
  });
  it("blocks when the category is off", () => {
    expect(decide(cand({ category: "offers" }), prefs, [], at("2026-11-18T18:00:00"))).toEqual({ send: false, reason: "category_off" });
  });
  it("blocks without a deep link", () => {
    expect(decide(cand({ deepLink: "" }), prefs, [], at("2026-11-18T18:00:00"))).toEqual({ send: false, reason: "no_deep_link" });
  });
  it("blocks during quiet hours (22:00 to 08:00), both sides of midnight", () => {
    for (const t of ["2026-11-18T22:30:00", "2026-11-18T03:00:00", "2026-11-18T07:59:00"])
      expect(decide(cand(), prefs, [], at(t))).toEqual({ send: false, reason: "quiet_hours" });
    expect(decide(cand(), prefs, [], at("2026-11-18T08:00:00")).send).toBe(true);
  });
  it("allows a booking reminder in quiet hours only if the tee time category is on", () => {
    const tee = cand({ category: "teetime", isBookingReminder: true });
    expect(decide(tee, prefs, [], at("2026-11-18T22:30:00")).send).toBe(true);
    expect(decide(tee, { ...prefs, teetime: false }, [], at("2026-11-18T22:30:00")).send).toBe(false);
  });
  it("caps at 1 per day, ignoring booking reminders", () => {
    const sent: SentRecord[] = [{ at: at("2026-11-18T09:00:00"), isBookingReminder: false }, { at: at("2026-11-18T10:00:00"), isBookingReminder: true }];
    expect(decide(cand(), prefs, sent, at("2026-11-18T18:00:00"))).toEqual({ send: false, reason: "daily_cap" });
    const onlyReminder: SentRecord[] = [{ at: at("2026-11-18T10:00:00"), isBookingReminder: true }];
    expect(decide(cand(), prefs, onlyReminder, at("2026-11-18T18:00:00")).send).toBe(true);
  });
  it("caps at 3 in the last 7 days", () => {
    const sent: SentRecord[] = ["2026-11-12T10:00:00", "2026-11-14T10:00:00", "2026-11-16T10:00:00"].map((d) => ({ at: at(d), isBookingReminder: false }));
    expect(decide(cand(), prefs, sent, at("2026-11-18T18:00:00"))).toEqual({ send: false, reason: "weekly_cap" });
  });
  it("silences everything but the booking reminder while the user is on the course", () => {
    expect(decide(cand(), prefs, [], at("2026-11-18T12:00:00"), { onCourse: true })).toEqual({ send: false, reason: "on_course" });
    const tee = cand({ category: "teetime", isBookingReminder: true });
    expect(decide(tee, prefs, [], at("2026-11-18T12:00:00"), { onCourse: true }).send).toBe(true);
  });
  it("never puts a price or private club in the lock-screen text", () => {
    expect(decide(cand({ body: "Hoy 16:40, $850 en vez de $1,200." }), prefs, [], at("2026-11-18T18:00:00"))).toEqual({ send: false, reason: "sensitive_text" });
  });
});

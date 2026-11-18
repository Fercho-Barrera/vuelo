import { MAX_PER_DAY, MAX_PER_WEEK, type Prefs } from "./notifications";

export type Candidate = { category: string; deepLink: string; title: string; body: string; isBookingReminder: boolean };
export type SentRecord = { at: Date; isBookingReminder: boolean };
export type Decision = { send: true } | { send: false; reason: "category_off" | "no_deep_link" | "quiet_hours" | "daily_cap" | "weekly_cap" | "on_course" | "sensitive_text" };

const QUIET_START_HOUR = 22;
const QUIET_END_HOUR = 8;

const inQuietHours = (d: Date) => d.getHours() >= QUIET_START_HOUR || d.getHours() < QUIET_END_HOUR;
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const SENSITIVE = /\$\s?\d|\bMXN\b|\bpesos\b/i; // prices must never show on a lock screen

// Brief section 8: off by default, quiet hours, 1/day and 3/week (booking reminders excluded from
// the caps), deep link required, silence on the course, nothing sensitive in the text.
export function decide(c: Candidate, prefs: Prefs, sent: SentRecord[], now: Date, ctx: { onCourse?: boolean } = {}): Decision {
  if (!prefs[c.category]) return { send: false, reason: "category_off" };
  if (!c.deepLink) return { send: false, reason: "no_deep_link" };
  if (SENSITIVE.test(`${c.title} ${c.body}`)) return { send: false, reason: "sensitive_text" };
  if (inQuietHours(now) && !c.isBookingReminder) return { send: false, reason: "quiet_hours" };
  if (ctx.onCourse && !c.isBookingReminder) return { send: false, reason: "on_course" };
  if (!c.isBookingReminder) {
    const counted = sent.filter((s) => !s.isBookingReminder);
    if (counted.filter((s) => sameDay(s.at, now)).length >= MAX_PER_DAY) return { send: false, reason: "daily_cap" };
    const weekAgo = now.getTime() - 7 * 24 * 3600 * 1000;
    if (counted.filter((s) => s.at.getTime() > weekAgo).length >= MAX_PER_WEEK) return { send: false, reason: "weekly_cap" };
  }
  return { send: true };
}

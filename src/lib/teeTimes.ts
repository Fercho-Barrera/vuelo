import type { Club } from "./clubs";
import type { Candidate } from "./notificationRules";

// A tee time the golfer wrote down after booking with the club directly. No club integration exists yet.
export type TeeTime = { id: string; clubId: string | null; clubName: string; date: string; time: string }; // date YYYY-MM-DD, time HH:MM

export const REMINDER_HOURS = [24, 2] as const; // brief section 8.1, row 3

const startOf = (t: Pick<TeeTime, "date" | "time">) => new Date(`${t.date}T${t.time}:00`);

export const isValidTeeTime = (t: Pick<TeeTime, "clubName" | "date" | "time">) =>
  t.clubName.trim() !== "" && /^\d{4}-\d{2}-\d{2}$/.test(t.date) && /^\d{2}:\d{2}$/.test(t.time) && !Number.isNaN(startOf(t).getTime());

export const upcoming = (list: TeeTime[], now: Date) =>
  list.filter((t) => startOf(t) >= now).sort((a, b) => startOf(a).getTime() - startOf(b).getTime());

export const nextTeeTime = (list: TeeTime[], now: Date): TeeTime | null => upcoming(list, now)[0] ?? null;

// Brief section 8.0: never name a private club on a lock screen. Unknown clubs count as private too.
export function lockScreenName(t: TeeTime, clubs: Club[]): string {
  const c = t.clubId ? clubs.find((x) => x.id === t.clubId) : undefined;
  return c && c.acceptsNonMembers === true ? t.clubName : "tu campo";
}

export type Reminder = { hoursBefore: number; at: Date; candidate: Candidate };

// Reminders still ahead of `now`. Nothing sends them yet (no push backend): this is what the scheduler will read.
export function pendingReminders(t: TeeTime, clubs: Club[], now: Date): Reminder[] {
  const start = startOf(t);
  const place = lockScreenName(t, clubs);
  return REMINDER_HOURS.map((h) => ({ hoursBefore: h, at: new Date(start.getTime() - h * 3_600_000) }))
    .filter((r) => r.at > now)
    .map((r) => ({
      ...r,
      candidate: {
        category: "teetime",
        deepLink: "/teetime",
        title: "Tu tee time",
        body: r.hoursBefore >= 24 ? `Mañana ${t.time} en ${place}. ¿Llevas tus palos?` : `Hoy ${t.time} en ${place}. Sal con tiempo.`,
        isBookingReminder: true,
      },
    }));
}

export const whenText = (t: TeeTime) =>
  `${new Date(`${t.date}T12:00:00`).toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })} · ${t.time}`;

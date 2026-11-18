// Push categories from brief section 8.1. Almost everything is off by default (section 8.0).
export const NOTIFICATION_CATEGORIES = [
  { id: "practice", label: "Recordatorio de práctica", defaultOn: false },
  { id: "progress", label: "Progreso de swing", defaultOn: false },
  { id: "teetime", label: "Recordatorio de tee time", defaultOn: true },
  { id: "round", label: "Resumen de ronda", defaultOn: false },
  { id: "challenges", label: "Retos con amigos", defaultOn: false },
  { id: "coach", label: "Revisión de coach", defaultOn: true },
  { id: "offers", label: "Ofertas de clubes", defaultOn: false },
  { id: "streak", label: "Racha", defaultOn: false },
  { id: "weather", label: "Clima en tu tee time", defaultOn: false },
  { id: "subscription", label: "Renovación de Pro", defaultOn: false },
] as const;

export type Prefs = Record<string, boolean>;

export const defaultPrefs: Prefs = Object.fromEntries(NOTIFICATION_CATEGORIES.map((c) => [c.id, c.defaultOn]));

export const QUIET_START = "22:00";
export const QUIET_END = "08:00";
export const MAX_PER_DAY = 1;
export const MAX_PER_WEEK = 3;

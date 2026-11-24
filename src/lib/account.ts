// Account fields. The account lives on this device until a backend is chosen (see docs/owner-tasks.md).
export const MIN_AGE = 13;
export const MAX_AGE = 100;

export const cleanEmail = (s: string) => s.trim().toLowerCase();
export const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail(s));

export function parseAge(s: string): number | null {
  if (!/^\d{1,3}$/.test(s.trim())) return null;
  const n = Number(s);
  return n >= MIN_AGE && n <= MAX_AGE ? n : null;
}

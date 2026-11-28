// Local password protection. The password is asked again only after the person signs out. It does not stop someone
// who can read the device's storage:
// real account security (reset by email, sign-in from another phone) arrives with the backend (docs/owner-tasks.md).
// Only a salted PBKDF2 hash is stored, never the password.
const KEY = "vuelo.auth.v1";
const SESSION = "vuelo.unlocked";
const ITERATIONS = 210_000;
export const MIN_PASSWORD = 8;

type Stored = { salt: string; hash: string; iterations: number };

const toHex = (b: ArrayBuffer | Uint8Array) => Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, "0")).join("");
const fromHex = (h: string) => Uint8Array.from(h.match(/../g) ?? [], (x) => parseInt(x, 16));

async function derive(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  return toHex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256));
}

const read = (): Stored | null => { try { return JSON.parse(localStorage.getItem(KEY) ?? "null") as Stored | null; } catch { return null; } };

export function passwordProblem(pw: string): string | null {
  if (pw.length < MIN_PASSWORD) return `Usa al menos ${MIN_PASSWORD} caracteres.`;
  if (!/[a-zA-Z]/.test(pw) || !/\d/.test(pw)) return "Combina letras y números.";
  return null;
}

export const hasPassword = () => read() !== null;

export async function setPassword(pw: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const stored: Stored = { salt: toHex(salt), hash: await derive(pw, salt, ITERATIONS), iterations: ITERATIONS };
  localStorage.setItem(KEY, JSON.stringify(stored));
}

export async function checkPassword(pw: string): Promise<boolean> {
  const s = read();
  if (!s || pw === "") return false;
  const h = await derive(pw, fromHex(s.salt), s.iterations);
  let diff = h.length ^ s.hash.length;
  for (let i = 0; i < h.length; i++) diff |= h.charCodeAt(i) ^ (s.hash.charCodeAt(i) || 0);
  return diff === 0;
}

// The session is remembered on this device until the person signs out in the app, even after the app is closed.
// Only lock() ends it. The phone's own lock screen remains the first line of protection.
export const isUnlocked = () => { try { return localStorage.getItem(SESSION) === "1"; } catch { return false; } };
export const unlock = () => { try { localStorage.setItem(SESSION, "1"); } catch { /* without storage the person signs in again next time */ } };
export const lock = () => { try { localStorage.removeItem(SESSION); } catch { /* nothing to clear */ } };

// Forgotten password with no server to reset it: the only way back in is to erase this phone's data.
export async function wipeLocalData() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith("vuelo.")).forEach((k) => localStorage.removeItem(k));
    sessionStorage.clear();
    await new Promise<void>((res) => { const r = indexedDB.deleteDatabase("vuelo-clips"); r.onsuccess = r.onerror = r.onblocked = () => res(); });
  } catch { /* best effort */ }
}

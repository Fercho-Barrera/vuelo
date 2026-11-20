export type Facing = "environment" | "user";

// Safari records mp4, Chrome and Firefox record webm. Take the first the browser supports.
const MIMES = ["video/mp4", "video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
export const pickMime = (isSupported: (m: string) => boolean): string | undefined => MIMES.find(isSupported);

export const extensionFor = (mime: string) => (mime.startsWith("video/mp4") ? "mp4" : "webm");

export type CameraProblem = "denied" | "missing" | "insecure" | "other";
export function classifyError(e: unknown, secure: boolean, hasApi: boolean): CameraProblem {
  if (!secure || !hasApi) return "insecure";
  const name = e instanceof DOMException ? e.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return "denied";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "missing";
  return "other";
}

export const PROBLEM_TEXT: Record<CameraProblem, string> = {
  denied: "No diste permiso a la cámara. Actívalo en los ajustes del navegador para este sitio y vuelve a intentar.",
  missing: "No encontramos una cámara en este dispositivo.",
  insecure: "La cámara solo funciona en una página segura (https).",
  other: "No pudimos abrir la cámara. Cierra otras apps que la usen e intenta de nuevo.",
};

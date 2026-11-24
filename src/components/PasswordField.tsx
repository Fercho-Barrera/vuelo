import { useState } from "react";

type Props = { label: string; value: string; onChange: (v: string) => void; autoComplete: "new-password" | "current-password"; invalid?: boolean; onEnter?: () => void };

// Password input with a show/hide toggle so typos on a phone keyboard are easy to catch.
export function PasswordField({ label, value, onChange, autoComplete, invalid, onEnter }: Props) {
  const [shown, setShown] = useState(false);
  return (
    <div className="pw">
      <input className="field" type={shown ? "text" : "password"} autoComplete={autoComplete} autoCapitalize="none" spellCheck={false} aria-label={label} aria-invalid={invalid} placeholder={label} value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onEnter?.()} />
      <button type="button" className="pw__toggle" aria-pressed={shown} onClick={() => setShown(!shown)}>{shown ? "Ocultar" : "Mostrar"}</button>
    </div>
  );
}

import { MIN_AGE, isValidEmail, parseAge } from "../lib/account";

type Props = { email: string; age: string; onEmail: (v: string) => void; onAge: (v: string) => void };

export const accountOk = (email: string, age: string) => isValidEmail(email) && parseAge(age) !== null;

// Email and age, with the problem shown as soon as something is typed that cannot work.
export function AccountFields({ email, age, onEmail, onAge }: Props) {
  const badEmail = email.trim() !== "" && !isValidEmail(email);
  const badAge = age.trim() !== "" && parseAge(age) === null;
  return (
    <div className="stack" style={{ gap: 12 }}>
      <input className="field" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" aria-label="Correo electrónico" aria-invalid={badEmail} placeholder="Correo electrónico" value={email} onChange={(e) => onEmail(e.target.value)} />
      {badEmail && <span className="field-error">Revisa tu correo, parece incompleto.</span>}
      <input className="field" inputMode="numeric" autoComplete="off" aria-label="Edad" aria-invalid={badAge} placeholder="Edad" value={age} onChange={(e) => onAge(e.target.value.replace(/\D/g, "").slice(0, 3))} />
      {badAge && <span className="field-error">Vuelo es para personas de {MIN_AGE} años o más.</span>}
      <span className="label-caption">Tu correo es tu cuenta. Por ahora vive en este celular; cuando conectemos el servidor, será tu acceso.</span>
    </div>
  );
}

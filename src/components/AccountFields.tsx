import { MIN_AGE, isValidEmail, parseAge } from "../lib/account";
import { passwordProblem } from "../lib/auth";
import { PasswordField } from "./PasswordField";

type Props = { email: string; age: string; pw: string; pw2: string; onEmail: (v: string) => void; onAge: (v: string) => void; onPw: (v: string) => void; onPw2: (v: string) => void };

export const accountOk = (email: string, age: string, pw: string, pw2: string) =>
  isValidEmail(email) && parseAge(age) !== null && passwordProblem(pw) === null && pw === pw2;

// Email, age and password, with the problem shown as soon as something is typed that cannot work.
export function AccountFields({ email, age, pw, pw2, onEmail, onAge, onPw, onPw2 }: Props) {
  const badEmail = email.trim() !== "" && !isValidEmail(email);
  const badAge = age.trim() !== "" && parseAge(age) === null;
  const pwProblem = pw !== "" ? passwordProblem(pw) : null;
  const mismatch = pw2 !== "" && pw !== pw2;
  return (
    <div className="stack" style={{ gap: 12 }}>
      <input className="field" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" aria-label="Correo electrónico" aria-invalid={badEmail} placeholder="Correo electrónico" value={email} onChange={(e) => onEmail(e.target.value)} />
      {badEmail && <span className="field-error">Revisa tu correo, parece incompleto.</span>}
      <input className="field" inputMode="numeric" autoComplete="off" aria-label="Edad" aria-invalid={badAge} placeholder="Edad" value={age} onChange={(e) => onAge(e.target.value.replace(/\D/g, "").slice(0, 3))} />
      {badAge && <span className="field-error">Vuelo es para personas de {MIN_AGE} años o más.</span>}
      <PasswordField label="Contraseña" autoComplete="new-password" value={pw} onChange={onPw} invalid={pwProblem !== null} />
      {pwProblem && <span className="field-error">{pwProblem}</span>}
      <PasswordField label="Repite tu contraseña" autoComplete="new-password" value={pw2} onChange={onPw2} invalid={mismatch} />
      {mismatch && <span className="field-error">Las contraseñas no coinciden.</span>}
      <span className="label-caption">Tu correo es tu cuenta y la contraseña la protege. Por ahora viven en este celular; cuando conectemos el servidor, serán tu acceso.</span>
    </div>
  );
}

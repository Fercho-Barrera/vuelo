import { useState } from "react";
import { AccountFields, accountOk } from "../components/AccountFields";
import { AuthShell } from "../components/AuthShell";
import { Button } from "../components/glass";
import { cleanEmail, parseAge } from "../lib/account";
import { setPassword } from "../lib/auth";
import { useProfile } from "../lib/profile";
import { useSession } from "../lib/session";

// For profiles created before accounts had email, age and a password: ask for what is missing once.
export function CompletarCuenta() {
  const { profile, save } = useProfile();
  const { unlock } = useSession();
  const [email, setEmail] = useState(profile?.email ?? "");
  const [age, setAge] = useState(profile?.age ? String(profile.age) : "");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  if (!profile) return null;
  const go = async () => {
    await setPassword(pw);
    await save({ ...profile, email: cleanEmail(email), age: parseAge(age)! });
    unlock();
  };
  return (
    <AuthShell title="Completa tu cuenta" text={`${profile.name ? `${profile.name}, ` : ""}ligamos tu cuenta a un correo y la protegemos con contraseña.`}>
      <AccountFields email={email} age={age} pw={pw} pw2={pw2} onEmail={setEmail} onAge={setAge} onPw={setPw} onPw2={setPw2} />
      <Button block variant="primary" disabled={!accountOk(email, age, pw, pw2)} onClick={() => void go()}>Continuar</Button>
    </AuthShell>
  );
}

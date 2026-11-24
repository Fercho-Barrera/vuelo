import { useState } from "react";
import { AccountFields, accountOk } from "../components/AccountFields";
import { Button } from "../components/glass";
import { cleanEmail, parseAge } from "../lib/account";
import { useProfile } from "../lib/profile";

// For profiles created before accounts existed: ask for the missing email and age once.
export function CompletarCuenta() {
  const { profile, save } = useProfile();
  const [email, setEmail] = useState(profile?.email ?? "");
  const [age, setAge] = useState(profile?.age ? String(profile.age) : "");
  if (!profile) return null;
  return (
    <main className="screen">
      <div className="stack" style={{ gap: 8 }}>
        <h1>Completa tu cuenta</h1>
        <p className="muted" style={{ margin: 0 }}>{profile.name ? `${profile.name}, ` : ""}ligamos tu cuenta a un correo y necesitamos tu edad.</p>
      </div>
      <AccountFields email={email} age={age} onEmail={setEmail} onAge={setAge} />
      <Button block variant="primary" disabled={!accountOk(email, age)} onClick={() => void save({ ...profile, email: cleanEmail(email), age: parseAge(age)! })}>Continuar</Button>
    </main>
  );
}

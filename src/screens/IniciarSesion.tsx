import { useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { Button } from "../components/glass";
import { PasswordField } from "../components/PasswordField";
import { checkPassword, wipeLocalData } from "../lib/auth";
import { useProfile } from "../lib/profile";
import { useSession } from "../lib/session";

export function IniciarSesion() {
  const { profile } = useProfile();
  const { unlock } = useSession();
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [forgot, setForgot] = useState(false);

  const enter = async () => {
    if (busy || pw === "") return;
    setBusy(true); setWrong(false);
    if (await checkPassword(pw)) unlock(); else { setWrong(true); setBusy(false); }
  };
  const erase = async () => { await wipeLocalData(); location.reload(); };

  return (
    <AuthShell title={profile?.name ? `Hola, ${profile.name}` : "Bienvenido de vuelta"} text={profile?.email}>
      <div className="stack" style={{ gap: 12 }}>
        <PasswordField label="Contraseña" autoComplete="current-password" value={pw} onChange={(v) => { setPw(v); setWrong(false); }} invalid={wrong} onEnter={() => void enter()} />
        {wrong && <span className="field-error">Contraseña incorrecta. Inténtalo de nuevo.</span>}
        <Button block variant="primary" disabled={pw === "" || busy} onClick={() => void enter()}>{busy ? "Entrando…" : "Entrar"}</Button>
      </div>
      {!forgot ? (
        <button type="button" className="auth__link" onClick={() => setForgot(true)}>Olvidé mi contraseña</button>
      ) : (
        <div className="stack auth__forgot">
          <strong>¿Olvidaste tu contraseña?</strong>
          <span className="muted">Todavía no podemos enviarte un correo para restablecerla. La única opción es borrar los datos de este celular (perfil, rondas, swings y tee times) y empezar de nuevo.</span>
          <Button block onClick={() => void erase()}>Borrar mis datos y empezar de nuevo</Button>
          <Button block variant="primary" onClick={() => setForgot(false)}>Volver</Button>
        </div>
      )}
    </AuthShell>
  );
}

import type { ReactNode } from "react";
import { FlightArc } from "./glass";

// Login layout: brand on a deep green top, the form on a rounded white sheet that rises over it.
export function AuthShell({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <main className="auth">
      <header className="auth__hero">
        <FlightArc className="auth__arc" />
        <span className="auth__brand">Vuelo</span>
        <span className="auth__tag">Tu coach de golf en el bolsillo</span>
      </header>
      <section className="auth__panel">
        <div className="stack" style={{ gap: 6 }}>
          <h1>{title}</h1>
          {text && <p className="muted" style={{ margin: 0 }}>{text}</p>}
        </div>
        {children}
      </section>
    </main>
  );
}

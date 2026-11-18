import { useState } from "react";
import { Card, PillSelector } from "../components/glass";

export function Grabar() {
  const [mode, setMode] = useState<"swing" | "ball">("swing");
  return (
    <main className="screen">
      <h1>Grabar</h1>
      <PillSelector<"swing" | "ball"> label="Modo" value={mode} onChange={setMode} options={[{ value: "swing", label: "Mi swing" }, { value: "ball", label: "Mi bola" }]} />
      <div className="viewfinder">
        <div className="stack" style={{ position: "relative", zIndex: 1 }}>
          <strong style={{ color: "#fff", fontSize: 20 }}>{mode === "swing" ? "Encuadra tu swing de cuerpo completo" : "Apunta hacia donde va la bola"}</strong>
          <span>{mode === "swing" ? "Celular vertical, de frente o por detrás. Funciona apoyado en el suelo." : "El trazado y la velocidad siempre se muestran como aprox."}</span>
        </div>
      </div>
      <button type="button" className="rec" disabled aria-label="Grabar (disponible en la app del celular)" />
      <Card tight><span className="muted">La cámara se activa en la app instalada en tu celular. Aquí solo ves el diseño.</span></Card>
    </main>
  );
}

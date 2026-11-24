import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, PillSelector } from "../components/glass";
import { BackIcon } from "../components/icons";
import { ContactForm } from "../components/ContactForm";

type Stars = "1" | "2" | "3" | "4" | "5";

export function Resenas() {
  const [stars, setStars] = useState<Stars>("5");
  return (
    <main className="screen">
      <div className="topbar" style={{ marginLeft: -10 }}>
        <Link to="/perfil/ajustes" className="icon-btn" aria-label="Volver a ajustes"><BackIcon /></Link>
      </div>
      <h1>Reseñas y sugerencias</h1>
      <span className="muted">Cuéntanos qué te gusta y qué podemos mejorar.</span>

      <Card className="stack">
        <strong>¿Cómo calificas Vuelo?</strong>
        <PillSelector<Stars> label="Calificación" value={stars} onChange={setStars} options={(["1", "2", "3", "4", "5"] as Stars[]).map((v) => ({ value: v, label: v }))} />
        <span className="label-caption">1 es mala, 5 es excelente.</span>
      </Card>

      <ContactForm subject="Reseña de Vuelo" prefix={`Calificación: ${stars} de 5\n\n`} placeholder="¿Qué te gusta? ¿Qué mejorarías?" cta="Enviar por correo" />
    </main>
  );
}

import { Link } from "react-router-dom";
import { Card, SectionHeader } from "../components/glass";
import { BackIcon } from "../components/icons";
import { ContactForm } from "../components/ContactForm";

const FAQ: [string, string][] = [
  ["¿Cómo grabo mi swing?", "Apoya el celular en vertical, de frente o por detrás, y encuádrate de cuerpo completo con buena luz. Al grabar hay 5 segundos para ponerte en posición."],
  ["¿Cómo comparo dos swings?", "En Grabar entra a Mis swings, elige dos y toca Comparar. Comparar y volver a ver tus videos son parte de Pro."],
  ["¿Dónde se guardan mis videos?", "En tu celular. Con Pro conservamos tus videos de los últimos 90 días. En el plan gratis guardamos el análisis, sin el video."],
  ["¿Qué tan exactos son los datos de la bola?", "Son aproximados. La velocidad y la distancia siempre se muestran como aprox., con un margen."],
  ["¿Cómo se calcula mi hándicap estimado?", "Con tus rondas guardadas, a partir de 3. Es un estimado: no usa el rating ni el slope del campo y no es oficial."],
  ["¿Puedo reservar un tee time?", "Todavía no. Desde la ficha de cada club puedes contactarlo directamente."],
  ["¿Cómo cancelo mi plan?", "En Perfil, toca Ver planes y luego Cancelar mi plan."],
];

export function Ayuda() {
  return (
    <main className="screen">
      <div className="topbar" style={{ marginLeft: -10 }}>
        <Link to="/perfil/ajustes" className="icon-btn" aria-label="Volver a ajustes"><BackIcon /></Link>
      </div>
      <h1>Preguntas frecuentes</h1>

      <Card flush>
        {FAQ.map(([q, a]) => (
          <details key={q} className="faq">
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </Card>

      <SectionHeader title="¿No encontraste tu respuesta?" />
      <span className="muted">Por ejemplo: cómo mejorar un swing, un problema con tu video o una duda sobre tu plan.</span>
      <ContactForm subject="Pregunta sobre Vuelo" placeholder="Escribe tu pregunta" cta="Enviar por correo" />
    </main>
  );
}

import { Card } from "../components/glass";
import type { Result } from "../lib/swing/analysis";

export function Coach({ result }: { result: Result }) {
  if (!result.ok) return <Card><strong>{result.reason}</strong></Card>;
  const m = result.metrics;
  return (
    <div className="stack" style={{ gap: 12 }}>
      <h2>Tu coach</h2>
      {result.faults.length === 0 && <Card><strong>Buen swing. No encontramos fallas claras en este video.</strong></Card>}
      {result.faults.map((f) => (
        <Card key={f.id} className="stack">
          <strong>{f.title}</strong>
          <span>{f.detail}</span>
          <span className="label-caption">Ejercicio: {f.drill}</span>
        </Card>
      ))}
      <Card className="stat-trio">
        <div><span className="num-big">{Math.round(m.shoulderTurnDeg)}°</span><span className="label-caption">Giro de hombros</span></div>
        <div><span className="num-big">{m.tempoRatio.toFixed(1)}:1</span><span className="label-caption">Tempo</span></div>
        <div><span className="num-big">{Math.round(m.swayPct)}%</span><span className="label-caption">Desliz de cadera</span></div>
      </Card>
      <span className="muted">Análisis aproximado a partir de video de frente. Los umbrales aún no están validados con un coach.</span>
    </div>
  );
}

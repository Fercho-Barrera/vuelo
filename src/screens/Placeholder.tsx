import { GlassCard } from "../components/glass";

export function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <main className="screen">
      <h1>{title}</h1>
      <GlassCard><p className="muted" style={{ margin: 0 }}>{note}</p></GlassCard>
    </main>
  );
}

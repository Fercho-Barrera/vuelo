import { ButtonLink, Card } from "./glass";

// Shown where a free user reaches a Pro-only feature.
export function ProLock({ text }: { text: string }) {
  return (
    <Card tight className="stack">
      <span>{text}</span>
      <ButtonLink to="/planes" variant="primary" small>Ver planes</ButtonLink>
    </Card>
  );
}

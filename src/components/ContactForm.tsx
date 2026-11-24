import { useState } from "react";
import { ButtonAnchor, Card } from "./glass";
import { mailto } from "../lib/support";

// Writes the message in the app and hands it to the mail app. There is no backend yet.
export function ContactForm({ subject, placeholder, cta, prefix = "" }: { subject: string; placeholder: string; cta: string; prefix?: string }) {
  const [text, setText] = useState("");
  return (
    <Card className="stack">
      <textarea className="field field--area" aria-label="Tu mensaje" placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} />
      <ButtonAnchor block variant="primary" href={mailto(subject, `${prefix}${text}`)} aria-disabled={text.trim() === ""} onClick={(e) => { if (text.trim() === "") e.preventDefault(); }}>{cta}</ButtonAnchor>
    </Card>
  );
}

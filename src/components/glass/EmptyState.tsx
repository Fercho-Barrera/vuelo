import type { ReactNode } from "react";
import { FlightArc } from "./FlightArc";
import "./glass.css";

// A screen with nothing to show yet: say what will appear here and offer the one next step.
export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <span className="empty__art"><FlightArc /></span>
      <strong className="empty__title">{title}</strong>
      <span className="muted">{text}</span>
      {action}
    </div>
  );
}

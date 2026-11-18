import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./glass.css";

export type ActionItem = { to: string; label: string; icon: ReactNode };

export function Actions({ items }: { items: ActionItem[] }) {
  return (
    <div className="actions">
      {items.map((a) => (
        <Link key={a.to} to={a.to} className="action">
          <span className="action__icon">{a.icon}</span>
          {a.label}
        </Link>
      ))}
    </div>
  );
}

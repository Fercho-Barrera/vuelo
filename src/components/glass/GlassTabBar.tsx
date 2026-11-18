import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import "./glass.css";

export type TabItem = { to: string; label: string; icon: ReactNode };

export function GlassTabBar({ items }: { items: TabItem[] }) {
  return (
    <nav className="glass tabbar" aria-label="Navegación principal">
      {items.map((it) => (
        <NavLink key={it.to} to={it.to} className="tab" end={it.to === "/"}>
          {it.icon}
          <span>{it.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

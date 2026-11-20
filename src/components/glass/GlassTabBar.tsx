import { useEffect, useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import "./glass.css";

export type TabItem = { to: string; label: string; icon: ReactNode };

// Like the iOS 26 tab bar: it recedes while scrolling down and returns on scroll up.
function useMinimized() {
  const [min, setMin] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY, d = y - last;
      if (y < 40) setMin(false);
      else if (d > 12) setMin(true);
      else if (d < -12) setMin(false);
      if (Math.abs(d) > 12) last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return min;
}

export function GlassTabBar({ items }: { items: TabItem[] }) {
  const min = useMinimized();
  return (
    <>
    <div className="scroll-edge" aria-hidden="true" />
    <nav className="glass tabbar" data-min={min} aria-label="Navegación principal">
      {items.map((it) => (
        <NavLink key={it.to} to={it.to} className="tab" end={it.to === "/"}>
          {it.icon}
          <span>{it.label}</span>
        </NavLink>
      ))}
    </nav>
    </>
  );
}

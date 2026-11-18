import { useEffect, type ReactNode } from "react";
import "./glass.css";

type Props = { open: boolean; onClose: () => void; title: string; children: ReactNode };

export function GlassSheet({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div className="sheet-backdrop" data-open={open} onClick={onClose} aria-hidden="true" />
      <section className="glass glass--strong sheet" data-open={open} role="dialog" aria-modal="true" aria-label={title} aria-hidden={!open}>
        <div className="sheet__grip" />
        <h2 style={{ margin: "0 0 12px", fontSize: "var(--fs-title)" }}>{title}</h2>
        {children}
      </section>
    </>
  );
}

import type { HTMLAttributes } from "react";
import "./glass.css";

type Props = HTMLAttributes<HTMLDivElement> & { tight?: boolean; hero?: boolean; flush?: boolean };

// Flat solid surface for content. Glass is only for floating navigation and sheets.
export function Card({ tight, hero, flush, className = "", ...rest }: Props) {
  const cls = ["card", tight && "card--tight", hero && "card--hero", flush && "card--flush", className].filter(Boolean).join(" ");
  return <div className={cls} {...rest} />;
}

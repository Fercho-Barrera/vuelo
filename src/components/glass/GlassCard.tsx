import type { HTMLAttributes } from "react";
import "./glass.css";

type Props = HTMLAttributes<HTMLDivElement> & { tight?: boolean; strong?: boolean };

export function GlassCard({ tight, strong, className = "", ...rest }: Props) {
  const cls = ["glass", "glass-card", tight && "glass-card--tight", strong && "glass--strong", className]
    .filter(Boolean)
    .join(" ");
  return <div className={cls} {...rest} />;
}

import type { ButtonHTMLAttributes } from "react";
import "./glass.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean; block?: boolean };

export function GlassButton({ primary, block, className = "", type = "button", ...rest }: Props) {
  const cls = ["glass", "glass-button", primary && "glass-button--primary", block && "glass-button--block", className]
    .filter(Boolean)
    .join(" ");
  return <button type={type} className={cls} {...rest} />;
}

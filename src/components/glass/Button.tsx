import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";
import "./glass.css";

type Common = { variant?: "primary" | "soft" | "accent"; block?: boolean; small?: boolean };
const cls = ({ variant = "soft", block, small }: Common, extra = "") =>
  ["btn", variant !== "soft" && `btn--${variant}`, block && "btn--block", small && "btn--small", extra].filter(Boolean).join(" ");

export function Button({ variant, block, small, className, type = "button", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & Common) {
  return <button type={type} className={cls({ variant, block, small }, className)} {...rest} />;
}

export function ButtonLink({ variant, block, small, className, ...rest }: LinkProps & Common) {
  return <Link className={cls({ variant, block, small }, className)} {...rest} />;
}

export function ButtonAnchor({ variant, block, small, className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & Common) {
  return <a className={cls({ variant, block, small }, className)} {...rest} />;
}

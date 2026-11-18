import { Link } from "react-router-dom";
import "./glass.css";

export function SectionHeader({ title, to, cta }: { title: string; to?: string; cta?: string }) {
  return (
    <div className="section-h">
      <h2>{title}</h2>
      {to && cta && <Link to={to}>{cta}</Link>}
    </div>
  );
}

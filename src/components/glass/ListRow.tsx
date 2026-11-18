import type { ReactNode } from "react";
import "./glass.css";

type Props = { icon?: ReactNode; accent?: boolean; title: string; sub?: string; trail?: ReactNode; onClick?: () => void };

export function ListRow({ icon, accent, title, sub, trail, onClick }: Props) {
  const inner = (
    <>
      {icon && <span className={`list-row__icon${accent ? " list-row__icon--accent" : ""}`}>{icon}</span>}
      <span className="list-row__body">
        <span className="list-row__title">{title}</span>
        {sub && <span className="list-row__sub">{sub}</span>}
      </span>
      {trail !== undefined && <span className="list-row__trail">{trail}</span>}
    </>
  );
  return onClick ? <button type="button" className="list-row" onClick={onClick}>{inner}</button> : <div className="list-row">{inner}</div>;
}

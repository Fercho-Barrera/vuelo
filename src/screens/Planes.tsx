import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, FlightArc, PillSelector } from "../components/glass";
import { BackIcon, CheckIcon } from "../components/icons";
import { FREE_LIMITS, PRICES, PRO_HISTORY_DAYS, isPro, type PlanId } from "../lib/plan";
import { useProfile } from "../lib/profile";

type Period = "pro_annual" | "pro_monthly";
const mxn = (n: number) => `$${n.toLocaleString("es-MX")}`;
const SAVING = PRICES.pro_monthly * 12 - PRICES.pro_annual;
const PER_MONTH = Math.round(PRICES.pro_annual / 12);

// [feature, free, pro]. A string is the limit, true is included, false is not.
const ROWS: [string, string | boolean, string | boolean][] = [
  ["Análisis de swing", `${FREE_LIMITS.swing} al mes`, "Ilimitado"],
  ["Trazado de bola", `${FREE_LIMITS.ball} al mes`, "Ilimitado"],
  ["Esqueleto sobre tu video", false, true],
  ["Volver a ver y comparar tus videos", false, true],
  ["Videos guardados", "No", `${PRO_HISTORY_DAYS} días`],
  ["Historial de rondas", `Últimas ${FREE_LIMITS.rounds}`, "Completo"],
  ["Stats básicas y clubes", true, true],
];

const Cell = ({ v }: { v: string | boolean }) =>
  v === true ? <span className="plan-table__yes"><CheckIcon /><span className="sr-only">Incluido</span></span>
    : v === false ? <span className="muted">—<span className="sr-only">No incluido</span></span>
    : <span>{v}</span>;

export function Planes() {
  const { profile, save } = useProfile();
  const current: PlanId = profile?.plan ?? "free";
  const [period, setPeriod] = useState<Period>(current === "pro_monthly" ? "pro_monthly" : "pro_annual");
  if (!profile) return null;
  const choose = (plan: PlanId) => save({ ...profile, plan });
  const annual = period === "pro_annual";

  return (
    <main className="screen">
      <div className="topbar" style={{ marginLeft: -10 }}>
        <Link to="/perfil" className="icon-btn" aria-label="Volver al perfil"><BackIcon /></Link>
      </div>
      <div className="stack" style={{ gap: 6 }}>
        <h1>Vuelo Pro</h1>
        <span className="muted">Mejora tu swing viéndote a ti mismo, cuadro por cuadro.</span>
      </div>

      <PillSelector<Period> label="Periodo de pago" value={period} onChange={setPeriod} options={[{ value: "pro_annual", label: "Anual" }, { value: "pro_monthly", label: "Mensual" }]} />

      <Card hero>
        <FlightArc className="hero__arc hero__arc--top" />
        <div className="plan__tag">{annual ? `Ahorra ${mxn(SAVING)} al año` : "Sin compromiso"}</div>
        <div className="num-hero" style={{ margin: "10px 0 2px" }}>{mxn(annual ? PRICES.pro_annual : PRICES.pro_monthly)}</div>
        <div className="label-caption" style={{ marginBottom: 18 }}>MXN {annual ? `al año · equivale a ${mxn(PER_MONTH)} al mes` : "al mes"}</div>
        {current === period
          ? <span className="plan__current"><CheckIcon /> Tu plan actual</span>
          : <button type="button" className="btn btn--block plan__cta" onClick={() => void choose(period)}>{annual ? "Elegir anual" : "Elegir mensual"}</button>}
      </Card>

      <Card className="plan-table">
        <div className="plan-table__row plan-table__head">
          <span />
          <span>Gratis</span>
          <span className="plan-table__pro">Pro</span>
        </div>
        {ROWS.map(([name, free, pro]) => (
          <div key={name} className="plan-table__row">
            <span>{name}</span>
            <Cell v={free} />
            <span className="plan-table__pro"><Cell v={pro} /></span>
          </div>
        ))}
      </Card>

      {isPro(current) && <Button block onClick={() => void choose("free")}>Volver a gratis</Button>}
      <span className="muted" style={{ textAlign: "center" }}>El cobro aún no está conectado: elegir un plan solo lo activa en este celular.</span>
    </main>
  );
}

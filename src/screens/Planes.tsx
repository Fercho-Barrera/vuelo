import { Link } from "react-router-dom";
import { Button, Card, SectionHeader } from "../components/glass";
import { BackIcon } from "../components/icons";
import { FREE_LIMITS, PRICES, PRO_HISTORY_DAYS, isPro, type PlanId } from "../lib/plan";
import { useProfile } from "../lib/profile";

const mxn = (n: number) => `$${n.toLocaleString("es-MX")} MXN`;
const SAVING = PRICES.pro_monthly * 12 - PRICES.pro_annual;

const FREE_LIST = [
  "Scorecard y stats básicas",
  "Directorio de clubes",
  `${FREE_LIMITS.swing} análisis de swing al mes`,
  `${FREE_LIMITS.ball} trazados de bola al mes`,
  `Historial de tus últimas ${FREE_LIMITS.rounds} rondas`,
];
const PRO_LIST = [
  "Análisis de swing y trazado de bola ilimitados",
  "Esqueleto sobre tu video",
  "Volver a ver y comparar tus videos",
  `Tus videos de los últimos ${PRO_HISTORY_DAYS} días guardados`,
  "Historial completo de rondas",
];

export function Planes() {
  const { profile, save } = useProfile();
  if (!profile) return null;
  const current: PlanId = profile.plan ?? "free";
  const choose = (plan: PlanId) => save({ ...profile, plan });
  const pick = (plan: PlanId, label: string, primary?: boolean) =>
    current === plan
      ? <span className="label-caption">Tu plan actual</span>
      : <Button block variant={primary ? "primary" : undefined} onClick={() => void choose(plan)}>{label}</Button>;

  return (
    <main className="screen">
      <div className="topbar" style={{ marginLeft: -10 }}>
        <Link to="/perfil" className="icon-btn" aria-label="Volver al perfil"><BackIcon /></Link>
      </div>
      <h1>Planes</h1>

      <Card className="stack">
        <strong>Anual</strong>
        <span className="num-big" style={{ fontSize: 30 }}>{mxn(PRICES.pro_annual)}<span className="label-caption"> al año</span></span>
        <span className="plan__save">Ahorra {mxn(SAVING)} al año</span>
        {pick("pro_annual", "Elegir anual", true)}
      </Card>

      <Card className="stack">
        <strong>Mensual</strong>
        <span className="num-big" style={{ fontSize: 30 }}>{mxn(PRICES.pro_monthly)}<span className="label-caption"> al mes</span></span>
        {pick("pro_monthly", "Elegir mensual")}
      </Card>

      <SectionHeader title="Con Pro" />
      <Card><ul className="plan__list">{PRO_LIST.map((t) => <li key={t}>{t}</li>)}</ul></Card>

      <SectionHeader title="Gratis" />
      <Card className="stack">
        <ul className="plan__list">{FREE_LIST.map((t) => <li key={t}>{t}</li>)}</ul>
        {isPro(current) && <Button block onClick={() => void choose("free")}>Volver a gratis</Button>}
      </Card>

      <Card tight><span className="muted">El cobro todavía no está conectado: elegir un plan solo lo activa en este celular.</span></Card>
    </main>
  );
}

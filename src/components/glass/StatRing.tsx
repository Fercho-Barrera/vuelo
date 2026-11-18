import "./glass.css";

type Props = { value: number; max: number; label: string; display?: string; size?: number };

export function StatRing({ value, max, label, display, size = 96 }: Props) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;
  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${display ?? value}`}>
      <svg width={size} height={size}>
        <circle className="ring__track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
        <circle className="ring__value" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <div className="ring__label">
        <strong>{display ?? value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

import "./glass.css";

type Option<T extends string> = { value: T; label: string };
type Props<T extends string> = { options: Option<T>[]; value: T; onChange: (v: T) => void; label: string };

export function PillSelector<T extends string>({ options, value, onChange, label }: Props<T>) {
  return (
    <div className="glass pills" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} className="pill" onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

import "./glass.css";

type Props = { checked: boolean; onChange: (v: boolean) => void; label: string };

export function GlassSwitch({ checked, onChange, label }: Props) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className="switch" onClick={() => onChange(!checked)}>
      <span className="switch__knob" />
    </button>
  );
}

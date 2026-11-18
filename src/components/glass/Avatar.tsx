import "./glass.css";

type Props = { name: string; photo?: string | null; large?: boolean };

export function Avatar({ name, photo, large }: Props) {
  const initial = name.trim().charAt(0).toUpperCase() || "G";
  return (
    <span className={`avatar${large ? " avatar--lg" : ""}`} aria-hidden="true">
      {photo ? <img src={photo} alt="" /> : initial}
    </span>
  );
}

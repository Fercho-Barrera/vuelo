import "./glass.css";

// Vuelo's signature: the arc of a shot from the tee to the flag. Decorative, so hidden from screen readers.
// The line draws once on mount; reduced motion collapses --dur-slow, so it just appears.
export function FlightArc({ className = "" }: { className?: string }) {
  return (
    <svg className={["flight", className].filter(Boolean).join(" ")} viewBox="0 0 120 80" aria-hidden="true" focusable="false">
      <path className="flight__line" d="M8 70 C 34 6, 82 6, 104 46" pathLength={1} />
      <circle className="flight__tee" cx="8" cy="70" r="3.5" />
      <path className="flight__pole" d="M104 46 V 22" />
      <path className="flight__flag" d="M104 22 L 116 27 L 104 32 Z" />
    </svg>
  );
}

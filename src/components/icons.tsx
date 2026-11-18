import type { ReactElement } from "react";

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" } as const;
type I = () => ReactElement;

export const HomeIcon: I = () => (<svg {...base}><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" /></svg>);
export const RecordIcon: I = () => (<svg {...base}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" fill="currentColor" /></svg>);
export const StatsIcon: I = () => (<svg {...base}><path d="M5 20V11M12 20V4M19 20v-6" /></svg>);
export const FlagIcon: I = () => (<svg {...base}><path d="M6 21V4M6 4h11l-2.5 4L17 12H6" /></svg>);
export const UserIcon: I = () => (<svg {...base}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>);
export const PlusIcon: I = () => (<svg {...base}><path d="M12 5v14M5 12h14" /></svg>);
export const VideoIcon: I = () => (<svg {...base}><rect x="3" y="6" width="13" height="12" rx="3" /><path d="M16 10l5-3v10l-5-3z" /></svg>);
export const TargetIcon: I = () => (<svg {...base}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.8" fill="currentColor" /></svg>);
export const ListIcon: I = () => (<svg {...base}><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" /></svg>);
export const PinIcon: I = () => (<svg {...base}><path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>);
export const CalendarIcon: I = () => (<svg {...base}><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M4 10h16M9 3v4M15 3v4" /></svg>);
export const ChevronIcon: I = () => (<svg {...base}><path d="M9 6l6 6-6 6" /></svg>);
export const BellIcon: I = () => (<svg {...base}><path d="M6 17V11a6 6 0 1 1 12 0v6l1.5 2h-15zM10 21a2 2 0 0 0 4 0" /></svg>);

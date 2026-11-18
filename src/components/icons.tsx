import type { ReactElement } from "react";

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" } as const;

export const HomeIcon = (): ReactElement => (<svg {...base}><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" /></svg>);
export const RecordIcon = (): ReactElement => (<svg {...base}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" fill="currentColor" /></svg>);
export const StatsIcon = (): ReactElement => (<svg {...base}><path d="M5 20V10M12 20V4M19 20v-7" /></svg>);
export const FlagIcon = (): ReactElement => (<svg {...base}><path d="M6 21V4M6 4h11l-2.5 4L17 12H6" /></svg>);
export const UserIcon = (): ReactElement => (<svg {...base}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>);

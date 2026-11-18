import type { Round } from "../stats";

export type Level = "principiante" | "intermedio";
export type City = "CDMX" | "Querétaro" | "Otra";

export type Profile = {
  name: string;
  city: City;
  level: Level;
  handicap: number | null;
  clubs: string[]; // clubs in the bag, e.g. "Driver", "7i"
  prefs: Record<string, boolean>; // notification categories
  photo?: string | null; // avatar as a small data URL
};

export interface DataAdapter {
  getProfile(): Promise<Profile | null>;
  saveProfile(p: Profile): Promise<void>;
  getRounds(): Promise<Round[]>;
  saveRound(r: Round): Promise<void>;
}

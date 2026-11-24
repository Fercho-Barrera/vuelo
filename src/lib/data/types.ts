import type { Round } from "../stats";
import type { PlanId } from "../plan";
import type { TeeTime } from "../teeTimes";
import type { SwingRecord } from "../swing/record";

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
  email?: string; // account identity. Local only until a backend exists.
  age?: number;
  plan?: PlanId; // missing means free. Billing is not connected yet, so this is local only.
};

export interface DataAdapter {
  getProfile(): Promise<Profile | null>;
  saveProfile(p: Profile): Promise<void>;
  getRounds(): Promise<Round[]>;
  saveRound(r: Round): Promise<void>;
  getSwings(): Promise<SwingRecord[]>;
  saveSwing(s: SwingRecord): Promise<void>;
  deleteSwing(id: string): Promise<void>;
  getTeeTimes(): Promise<TeeTime[]>;
  saveTeeTime(t: TeeTime): Promise<void>;
  deleteTeeTime(id: string): Promise<void>;
}

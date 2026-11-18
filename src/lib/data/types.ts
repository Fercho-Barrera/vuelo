export type Level = "principiante" | "intermedio";
export type City = "CDMX" | "Querétaro" | "Otra";

export type Profile = {
  name: string;
  city: City;
  level: Level;
  handicap: number | null;
  clubs: string[]; // clubs in the bag, e.g. "Driver", "7i"
  prefs: Record<string, boolean>; // notification categories
};

export interface DataAdapter {
  getProfile(): Promise<Profile | null>;
  saveProfile(p: Profile): Promise<void>;
}

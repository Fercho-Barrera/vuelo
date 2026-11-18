import type { Round } from "../stats";
import type { DataAdapter, Profile } from "./types";

const KEY = "vuelo.profile.v1";
const ROUNDS = "vuelo.rounds.v1";

// Local adapter used until a Supabase project exists. Same contract as the cloud one.
export const mockAdapter: DataAdapter = {
  async getProfile() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Profile) : null;
    } catch {
      return null;
    }
  },
  async saveProfile(p) {
    localStorage.setItem(KEY, JSON.stringify(p));
  },
  async getRounds() {
    try {
      return JSON.parse(localStorage.getItem(ROUNDS) ?? "[]") as Round[];
    } catch {
      return [];
    }
  },
  async saveRound(r) {
    const all = await this.getRounds();
    localStorage.setItem(ROUNDS, JSON.stringify([...all.filter((x) => x.id !== r.id), r]));
  },
};

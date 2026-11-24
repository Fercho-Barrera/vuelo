import type { Round } from "../stats";
import type { SwingRecord } from "../swing/record";
import type { TeeTime } from "../teeTimes";
import type { DataAdapter, Profile } from "./types";

const KEY = "vuelo.profile.v1";
const ROUNDS = "vuelo.rounds.v1";
const SWINGS = "vuelo.swings.v1";
const TEETIMES = "vuelo.teetimes.v1";

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
  async getSwings() {
    try {
      return JSON.parse(localStorage.getItem(SWINGS) ?? "[]") as SwingRecord[];
    } catch {
      return [];
    }
  },
  async saveSwing(sw) {
    const all = await this.getSwings();
    localStorage.setItem(SWINGS, JSON.stringify([...all.filter((x) => x.id !== sw.id), sw]));
  },
  async deleteSwing(id) {
    const all = await this.getSwings();
    localStorage.setItem(SWINGS, JSON.stringify(all.filter((x) => x.id !== id)));
  },
  async getTeeTimes() {
    try {
      return JSON.parse(localStorage.getItem(TEETIMES) ?? "[]") as TeeTime[];
    } catch {
      return [];
    }
  },
  async saveTeeTime(t) {
    const all = await this.getTeeTimes();
    localStorage.setItem(TEETIMES, JSON.stringify([...all.filter((x) => x.id !== t.id), t]));
  },
  async deleteTeeTime(id) {
    const all = await this.getTeeTimes();
    localStorage.setItem(TEETIMES, JSON.stringify(all.filter((x) => x.id !== id)));
  },
};

import type { DataAdapter, Profile } from "./types";

const KEY = "vuelo.profile.v1";

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
};

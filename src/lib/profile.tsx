import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { data, type Profile } from "./data";
import type { PlanId } from "./plan";

type Ctx = { profile: Profile | null; loading: boolean; save: (p: Profile) => Promise<void> };
const ProfileCtx = createContext<Ctx>({ profile: null, loading: true, save: async () => {} });

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void data.getProfile().then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, []);
  const save = async (p: Profile) => {
    await data.saveProfile(p);
    setProfile(p);
  };
  return <ProfileCtx.Provider value={{ profile, loading, save }}>{children}</ProfileCtx.Provider>;
}

export const useProfile = () => useContext(ProfileCtx);

export const usePlan = (): PlanId => useProfile().profile?.plan ?? "free";

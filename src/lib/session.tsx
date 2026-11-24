import { createContext, useContext, useState, type ReactNode } from "react";
import { isUnlocked, lock as lockSession, unlock as unlockSession } from "./auth";

type Ctx = { unlocked: boolean; unlock: () => void; lock: () => void };
const SessionCtx = createContext<Ctx>({ unlocked: false, unlock: () => {}, lock: () => {} });

export function SessionProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const unlock = () => { unlockSession(); setUnlocked(true); };
  const lock = () => { lockSession(); setUnlocked(false); };
  return <SessionCtx.Provider value={{ unlocked, unlock, lock }}>{children}</SessionCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => useContext(SessionCtx);

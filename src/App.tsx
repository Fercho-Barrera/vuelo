import { Route, Routes, useLocation } from "react-router-dom";
import { GlassTabBar, type TabItem } from "./components/glass";
import { FlagIcon, HomeIcon, RecordIcon, StatsIcon, UserIcon } from "./components/icons";
import { Hoy } from "./screens/Hoy";
import { Ajustes } from "./screens/Ajustes";
import { Perfil } from "./screens/Perfil";
import { Grabar } from "./screens/Grabar";
import { CoachEjemplo } from "./screens/CoachEjemplo";
import { Stats } from "./screens/Stats";
import { NuevaRonda } from "./screens/NuevaRonda";
import { Ronda } from "./screens/Ronda";
import { Clubes } from "./screens/Clubes";
import { Onboarding } from "./screens/Onboarding";
import { useProfile } from "./lib/profile";

const TABS: TabItem[] = [
  { to: "/", label: "Hoy", icon: <HomeIcon /> },
  { to: "/grabar", label: "Grabar", icon: <RecordIcon /> },
  { to: "/stats", label: "Stats", icon: <StatsIcon /> },
  { to: "/clubes", label: "Clubes", icon: <FlagIcon /> },
  { to: "/perfil", label: "Perfil", icon: <UserIcon /> },
];

export default function App() {
  const { profile, loading } = useProfile();
  const { pathname } = useLocation();
  if (loading) return null;
  if (!profile) return <Onboarding />;
  return (
    <>
      <Routes>
        <Route path="/" element={<Hoy />} />
        <Route path="/grabar" element={<Grabar />} />
        <Route path="/grabar/ejemplo" element={<CoachEjemplo />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/stats/nueva" element={<NuevaRonda />} />
        <Route path="/stats/ronda/:id" element={<Ronda />} />
        <Route path="/clubes" element={<Clubes />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfil/ajustes" element={<Ajustes />} />
      </Routes>
      {/* Home already has the quick actions and the profile avatar at the top, so no tab bar there. */}
      {pathname !== "/" && <GlassTabBar items={TABS} />}
    </>
  );
}

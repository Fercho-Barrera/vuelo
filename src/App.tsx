import { Route, Routes } from "react-router-dom";
import { GlassTabBar, type TabItem } from "./components/glass";
import { FlagIcon, HomeIcon, RecordIcon, StatsIcon, UserIcon } from "./components/icons";
import { Hoy } from "./screens/Hoy";
import { Perfil } from "./screens/Perfil";
import { Grabar } from "./screens/Grabar";
import { Stats } from "./screens/Stats";
import { NuevaRonda } from "./screens/NuevaRonda";
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
  if (loading) return null;
  if (!profile) return <Onboarding />;
  return (
    <>
      <Routes>
        <Route path="/" element={<Hoy />} />
        <Route path="/grabar" element={<Grabar />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/stats/nueva" element={<NuevaRonda />} />
        <Route path="/clubes" element={<Clubes />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
      <GlassTabBar items={TABS} />
    </>
  );
}

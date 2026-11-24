import { Route, Routes } from "react-router-dom";
import { GlassTabBar, type TabItem } from "./components/glass";
import { FlagIcon, HomeIcon, RecordIcon, StatsIcon, UserIcon } from "./components/icons";
import { Hoy } from "./screens/Hoy";
import { Ajustes } from "./screens/Ajustes";
import { Perfil } from "./screens/Perfil";
import { Grabar } from "./screens/Grabar";
import { CoachEjemplo } from "./screens/CoachEjemplo";
import { Swings } from "./screens/Swings";
import { SwingDetalle } from "./screens/SwingDetalle";
import { SwingComparar } from "./screens/SwingComparar";
import { Stats } from "./screens/Stats";
import { NuevaRonda } from "./screens/NuevaRonda";
import { Ronda } from "./screens/Ronda";
import { Clubes } from "./screens/Clubes";
import { Planes } from "./screens/Planes";
import { MiTeeTime } from "./screens/MiTeeTime";
import { Ayuda } from "./screens/Ayuda";
import { Resenas } from "./screens/Resenas";
import { Onboarding } from "./screens/Onboarding";
import { PageTransition } from "./components/PageTransition";
import { CompletarCuenta } from "./screens/CompletarCuenta";
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
  if (!profile.email || !profile.age) return <CompletarCuenta />;
  return (
    <>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Hoy />} />
          <Route path="/grabar" element={<Grabar />} />
          <Route path="/grabar/ejemplo" element={<CoachEjemplo />} />
          <Route path="/grabar/historial" element={<Swings />} />
          <Route path="/grabar/swing/:id" element={<SwingDetalle />} />
          <Route path="/grabar/comparar" element={<SwingComparar />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/stats/nueva" element={<NuevaRonda />} />
          <Route path="/stats/ronda/:id" element={<Ronda />} />
          <Route path="/clubes" element={<Clubes />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/ajustes" element={<Ajustes />} />
          <Route path="/perfil/ajustes/ayuda" element={<Ayuda />} />
          <Route path="/perfil/ajustes/resenas" element={<Resenas />} />
          <Route path="/teetime" element={<MiTeeTime />} />
          <Route path="/planes" element={<Planes />} />
        </Routes>
      </PageTransition>
      <GlassTabBar items={TABS} />
    </>
  );
}

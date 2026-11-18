import { Route, Routes } from "react-router-dom";
import { GlassTabBar, type TabItem } from "./components/glass";
import { FlagIcon, HomeIcon, RecordIcon, StatsIcon, UserIcon } from "./components/icons";
import { Hoy } from "./screens/Hoy";
import { Perfil } from "./screens/Perfil";
import { Placeholder } from "./screens/Placeholder";

const TABS: TabItem[] = [
  { to: "/", label: "Hoy", icon: <HomeIcon /> },
  { to: "/grabar", label: "Grabar", icon: <RecordIcon /> },
  { to: "/stats", label: "Stats", icon: <StatsIcon /> },
  { to: "/clubes", label: "Clubes", icon: <FlagIcon /> },
  { to: "/perfil", label: "Perfil", icon: <UserIcon /> },
];

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Hoy />} />
        <Route path="/grabar" element={<Placeholder title="Grabar" note="Aquí grabarás tu swing y tu bola." />} />
        <Route path="/stats" element={<Placeholder title="Stats" note="Tus rondas y estadísticas aparecerán aquí." />} />
        <Route path="/clubes" element={<Placeholder title="Clubes" note="El directorio de campos llega en la Fase 5." />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
      <GlassTabBar items={TABS} />
    </>
  );
}

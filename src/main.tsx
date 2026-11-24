import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ProfileProvider } from "./lib/profile";
import { SessionProvider } from "./lib/session";
import { seedDemo } from "./lib/demo";
import "./index.css";

const demo = (import.meta.env.DEV || import.meta.env.VITE_DEMO) && new URLSearchParams(location.search).has("demo");

void (async () => {
  if (demo) await seedDemo();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ProfileProvider>
        <SessionProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <App />
          </BrowserRouter>
        </SessionProvider>
      </ProfileProvider>
    </StrictMode>,
  );
})();

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ProfileProvider } from "./lib/profile";
import { seedDemo } from "./lib/demo";
import "./index.css";

if (import.meta.env.DEV && new URLSearchParams(location.search).has("demo")) seedDemo();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProfileProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProfileProvider>
  </StrictMode>,
);

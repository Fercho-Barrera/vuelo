/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.PAGES ? "/vuelo/" : "/",
  plugins: [react()],
  // privacidad.html is a second page: listed here so the build emits it and the dev server serves it.
  build: { rollupOptions: { input: { main: "index.html", privacidad: "privacidad.html" } } },
  test: { environment: "jsdom", globals: true, setupFiles: ["./vitest.setup.ts"] },
});

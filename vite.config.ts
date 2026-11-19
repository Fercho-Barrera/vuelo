/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.PAGES ? "/vuelo/" : "/",
  plugins: [react()],
  test: { environment: "jsdom", globals: true },
});

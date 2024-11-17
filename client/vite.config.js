import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Umožňuje globálne funkcie ako `test`, `expect`
    environment: "jsdom", // Simuluje prostredie prehliadača
    setupFiles: "./src/setupTests.js", // Inicializačný súbor
  },
});

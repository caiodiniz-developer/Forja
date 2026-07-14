import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Runs on a fresh port (5180) to escape any stale service worker that a
// previous project registered on the old localhost:5173 origin.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

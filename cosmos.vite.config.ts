import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Cosmos-specific vite config for export
export default defineConfig({
  plugins: [react()],
  define: {
    process: {
      env: {},
    },
  },
  build: {
    outDir: "cosmos-export",
    minify: false,
  },
})

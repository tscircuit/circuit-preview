import react from "@vitejs/plugin-react"
import { resolve } from "node:path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [
    // react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  define: {
    process: {
      env: {},
    },
  },
  build: {
    // sourcemap: true,
    // minify: false,
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "CircuitPreview",
      formats: ["iife"],
      fileName: () => "index.global.js",
    },
    target: "es2020",
    rollupOptions: {
      // external: ["react-dom", "fflate", "manifold-3d", "three", "three-stdlib"],
      output: {
        globals: {
          // 'react-dom': 'ReactDOM',
          // fflate: "fflate",
          // "manifold-3d": "manifold3d",
          // three: "THREE",
          // "three-stdlib": "ThreeStdlib",
        },
      },
    },
  },
})

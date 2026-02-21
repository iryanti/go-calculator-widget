import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import pkg from "./package.json"; // ✅ auto from package.json

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  define: {
    "process.env": {},
    "process.env.NODE_ENV": '"production"',
    __WIDGET_VERSION__: JSON.stringify(pkg.version), // ✅ inject version
  },
  build: {
    lib: {
      entry: "src/main.tsx",
      name: "YPWidgets",
      formats: ["umd"],
      fileName: () => "go-widget.umd.js",
    },
  },
});
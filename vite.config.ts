import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import pluginChecker from "vite-plugin-checker";

export default defineConfig({
  plugins: [pluginChecker({ typescript: true }), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src"),
      "rc-util": path.resolve(__dirname, "node_modules/rc-util"),
      "rc-util/lib": path.resolve(__dirname, "node_modules/rc-util/lib"),
      "rc-util/es": path.resolve(__dirname, "node_modules/rc-util/es"),
    },
  },
  optimizeDeps: {
    include: ["rc-util", "rc-util/lib", "rc-util/es"],
  },
});

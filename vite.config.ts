import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      'rc-util': path.resolve(__dirname, 'node_modules/rc-util'),
      'rc-util/lib': path.resolve(__dirname, 'node_modules/rc-util/lib'),
      'rc-util/es': path.resolve(__dirname, 'node_modules/rc-util/es'),
    },
  },
  optimizeDeps: {
    include: ['rc-util', 'rc-util/lib', 'rc-util/es'],
  },
});

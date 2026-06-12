import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import legacy from "@vitejs/plugin-legacy";
import path from "path";
import { componentTagger } from "lovable-tagger";

const BACKEND = 'http://localhost:8090';

export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api':         { target: BACKEND, changeOrigin: true },
      '/contact':     { target: BACKEND, changeOrigin: true },
      '/recruitment': { target: BACKEND, changeOrigin: true },
      '/jobs':        { target: BACKEND, changeOrigin: true },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && legacy({
      targets: ['ios >= 13', 'android >= 8', 'chrome >= 80', 'safari >= 13'],
    }),
  ].filter(Boolean),
  build: {
    target: ['es2015', 'safari13'],
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui':     ['@radix-ui/react-dialog', '@radix-ui/react-accordion', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-tooltip'],
          'vendor-query':  ['@tanstack/react-query'],
          'vendor-misc':   ['lucide-react', 'sonner', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));

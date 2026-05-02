import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { escapeHtmlAttr, getSeoKeywordsMetaContent } from "./shared/seoKeywords";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  envDir: path.resolve(__dirname, "./client"),
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared", "index.html"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin(), seoKeywordsMetaPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function seoKeywordsMetaPlugin(): Plugin {
  return {
    name: "seo-keywords-meta",
    transformIndexHtml(html) {
      if (/name=["']keywords["']/i.test(html)) return html;
      const content = escapeHtmlAttr(getSeoKeywordsMetaContent());
      return html.replace("</head>", `    <meta name="keywords" content="${content}" />\n  </head>`);
    },
  };
}

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    async configureServer(server) {
      // Dynamic import so `vite build` does not load `server/loadEnv` (backend secrets stay out of the client bundle env).
      const { createServer } = await import("./server/index");
      server.middlewares.use(createServer());
    },
  };
}

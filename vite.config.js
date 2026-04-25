import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import prerender from "@prerenderer/rollup-plugin";

// Prerender route list. Keep in sync with src/{diagrams,projects,talks,learn}/registry.js
// when adding new entries. (We don't import the registries here because Vite's config
// loader — esbuild — can't resolve their transitive CSS imports.)
const routes = [
  // Static pages
  "/architecture",
  "/about",
  "/me",
  "/open-source",
  "/talks",
  "/learn",
  // Diagrams
  "/diagram/multi-tenant-config",
  // Open-source projects
  "/open-source/youtube-download-extension",
  "/open-source/shadow-cursor",
  "/open-source/smartquiz-cloud",
  // Speaker / talks detail pages
  "/speaker/js-conf-2024",
  "/speaker/seattle-webdevcon",
  "/speaker/aws-community-day-guatemala-2025",
  // Learn detail pages
  "/learn/bst-inorder",
  "/learn/kubernetes-cheat-sheet",
  "/learn/kubectl-cheat-sheet",
];

const isVercel = process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);

async function getRendererOptions() {
  const baseOptions = {
    renderAfterDocumentEvent: "render-event",
    maxConcurrentRoutes: 4,
    timeout: 30000,
  };

  if (!isVercel) {
    return baseOptions;
  }

  const { default: chromium } = await import("@sparticuz/chromium");

  return {
    ...baseOptions,
    args: chromium.args,
    launchOptions: {
      executablePath: await chromium.executablePath(),
      headless: "shell",
    },
  };
}

export default defineConfig(async () => ({
  plugins: [
    react(),
    prerender({
      routes,
      renderer: "@prerenderer/renderer-puppeteer",
      rendererOptions: await getRendererOptions(),
    }),
  ],
}));

import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

const isCapacitorBuild = process.env.CAPACITOR_BUILD === "1";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    ...(isCapacitorBuild
      ? {
          spa: {
            enabled: true,
            prerender: {
              outputPath: "/index.html",
              crawlLinks: false,
              retryCount: 1,
            },
          },
        }
      : {}),
  },

  vite: {
    plugins: isCapacitorBuild
      ? []
      : [
          VitePWA({
            strategies: "generateSW",
            registerType: "autoUpdate",
            injectRegister: null,
            filename: "sw.js",
            devOptions: { enabled: false },
            manifest: false,
            workbox: {
              globDirectory: ".output/public",
              globPatterns: ["**/*.{js,css,html,png,svg,ico,woff2,webmanifest}"],
              navigateFallback: "/",
              navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//],
              cleanupOutdatedCaches: true,
              runtimeCaching: [
                {
                  urlPattern: ({ request }) => request.mode === "navigate",
                  handler: "NetworkFirst",
                  options: {
                    cacheName: "tibyan-pages",
                    networkTimeoutSeconds: 4,
                    expiration: { maxEntries: 30 },
                  },
                },
                {
                  urlPattern: ({ request, sameOrigin }) =>
                    sameOrigin &&
                    ["style", "script", "worker", "font", "image"].includes(request.destination),
                  handler: "CacheFirst",
                  options: {
                    cacheName: "tibyan-assets",
                    expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 90 },
                  },
                },
              ],
            },
          }),
        ],
  },
});

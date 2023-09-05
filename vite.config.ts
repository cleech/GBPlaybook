import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // cache all imports
        globPatterns: ['**/*'],
        // cache google fonts
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
            }
          }
        ]
      },
      // cache all public folder static assets
      includeAssets: ['**/*'],
      manifest: {
        name: 'Guild Ball Playbook',
        short_name: 'GB Playbook',
        description: 'Guild Ball reference and tracking',
        icons: [
          {
            src: "favicon.ico",
            sizes: "48x48 32x32 16x16",
            type: "image/x-icon"
          },
          {
            src: "logo192.png",
            type: "image/png",
            sizes: "192x192",
            purpose: "any"
          },
          {
            src: "logo512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any"
          },
          {
            src: "gbpb-logo-full.png",
            type: "image/png",
            sizes: "1024x1024",
            purpose: "maskable"
          }
        ],
        display: "standalone",
        orientation: "any",
        theme_color: "#000000",
        background_color: "#004508"
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  define: {
    global: 'globalThis'
  },
  server: {
    port: 3000
  }
})

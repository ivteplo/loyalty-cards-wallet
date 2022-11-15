// Copyright (c) 2022 Ivan Teplov

import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { VitePWA } from "vite-plugin-pwa"
import svelteSVG from "vite-plugin-svelte-svg"

export default defineConfig({
  plugins: [
    svelteSVG({
      svgoConfig: {},
      // don't require appending `?component` when importing SVG
      requireSuffix: false
    }),
    svelte({}),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Loyalty Card Wallet",
        short_name: "Wallet",
        description: "One place for all of your loyalty cards",
        background_color: "#fff",
        theme_color: "#4d4bf1",
        categories: ["finance", "shopping"],
        icons: [
          {
            src: "icons/192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icons/512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
})

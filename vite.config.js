// Copyright (c) 2022 Ivan Teplov

import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import svelteSVG from "vite-plugin-svelte-svg"

export default defineConfig({
  plugins: [
    svelteSVG({
      svgoConfig: {},
      // don't require appending `?component` when importing SVG
      requireSuffix: false
    }),
    svelte({}),
  ]
})

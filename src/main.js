// Copyright (c) 2022 Ivan Teplov

import App from "./App.svelte"

const app = new App({
  target: document.body,
  props: {},
})

export default app

function registerServiceWorker() {
  if (!navigator.serviceWorker) return

  console.log("navigator.serviceWorker is available")

  navigator.serviceWorker
    .register("../worker.js")
    .then((registration) => {
      console.log(
        "[Service worker] Registered with the scope " + registration.scope
      )
    })
    .catch(console.error)
}

if (process.env.NODE_ENV === "production") {
  registerServiceWorker()
}

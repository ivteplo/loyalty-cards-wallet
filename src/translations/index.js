// Copyright (c) 2022 Ivan Teplov

import { register, init as initialize, getLocaleFromNavigator } from "svelte-i18n"

register("en", () => import("./en.json"))

initialize({
  fallbackLocale: "en",
  initialLocale: getLocaleFromNavigator()
})

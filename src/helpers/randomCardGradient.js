// Copyright (c) 2022 Ivan Teplov

import { randomPastelColor } from "./randomPastelColor"

export function randomCardGradient() {
  return {
    from: randomPastelColor(),
    to: randomPastelColor(),
  }
}

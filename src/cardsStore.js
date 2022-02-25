// Copyright (c) 2022 Ivan Teplov

import { v4 as uuid } from "uuid"
import { writable } from "svelte/store"
export let cards = writable(undefined)

export function addCard({ store, number }) {
  cards.update(($cards) => [
    ...($cards || []),
    {
      id: uuid(),
      store,
      number,
    },
  ])
}

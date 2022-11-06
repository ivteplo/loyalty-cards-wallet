// Copyright (c) 2022 Ivan Teplov

import { v4 as uuid } from "uuid"
import { writable, get } from "svelte/store"
import localForage from "localforage"
import { randomCardGradient } from "./helpers/randomCardGradient"

export let cards = writable(undefined)
let initialized = false

let requestedPersistentStorage = false

cards.subscribe(() => saveCardsToStorage())

export async function loadCardsFromStorage() {
  const items = await localForage.getItem("cards")

  if (!(items instanceof Array)) cards.set([])
  else cards.set(items)

  initialized = true

  // If the storage isn't persistent, then we'll request it to be so a bit later
  navigator?.storage?.persisted().then(isPersisted => {
    requestedPersistentStorage = isPersisted
  })
}


export function saveCardsToStorage() {
  if (!initialized) return

  const cardsToSave = get(cards)

  if (initialized && cardsToSave.length > 0) {
    localForage
      .setItem("cards", cardsToSave || [])
      .then(() => console.log("Saved"))
      .catch((error) => console.error(error))
  }

  if (!requestedPersistentStorage) {
    requestedPersistentStorage = true

    // Request the storage to be persistent
    if (navigator?.storage?.persist) {
      navigator.storage.persist().then(isPersisted => {
        console.log(`Persistent storage is ${isPersisted ? "" : "not"} enabled`)
      }).catch(error => {
        console.error("There was an error while requesting persistent storage:", error)
      })
    }
  }
}

export function addCard({ store, number, gradient }) {
  if (!initialized)
    throw "Cannot add a card when the storage is not initialized"

  cards.update(($cards) => [
    ...($cards || []),
    {
      id: uuid(),
      store,
      number,
      gradient: gradient || randomCardGradient(),
    },
  ])
}

export function removeCard(cardID) {
  if (!initialized)
    throw "Cannot remove a card when the storage is not initialized"

  const cardIndex = get(cards).findIndex((card) => card.id === cardID) ?? -1

  if (cardIndex >= 0) {
    cards.update(($cards) => {
      $cards.splice(cardIndex, 1)
      return $cards
    })
  }
}

export function updateCard(card) {
  if (!initialized)
    throw "Cannot update a card when the storage is not initialized"

  const index = get(cards)?.findIndex((child) => child.id === card.id) ?? -1

  if (index === -1) throw "Could not update the card, since it doesn't exist"

  cards.update(($cards) => {
    $cards[index] = card
    return $cards
  })
}

export function updateCardBackground(card) {
  const newCard = {
    ...card,
    gradient: randomCardGradient(),
  }

  updateCard(newCard)
  return newCard
}

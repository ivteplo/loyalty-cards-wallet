<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import Card from "./Card.svelte"

  import { randomCardGradient } from "./helpers/randomCardGradient"
  import { addCard as addCardToStore, updateCard } from "./cardsStore"

  import { fade } from "svelte/transition"

  /** @type {"add"|"edit"} */
  export let formType = "add"

  export let message = {
    type: "",
    text: "",
  }

  // Store name
  export let store = ""

  // Card number
  export let number = ""

  // Card ID
  export let id = undefined

  // Card's background gradient
  export let gradient = randomCardGradient()

  $: cardPreviewData = { store, gradient }

  const changeCardGradient = () => {
    gradient = randomCardGradient()
  }

  const onCardFormError = (message) => {
    message = {
      type: "error",
      text: message,
    }
  }

  const tryDo = (func) => {
    try {
      func()
    } catch (error) {
      if (typeof error !== "string") {
        console.error(error)
        error = "Unknown error"
      }

      onCardFormError(error)
    }
  }

  const addCard = () =>
    tryDo(() => {
      addCardToStore({
        store,
        number,
        gradient,
      })

      message = {
        type: "success",
        text: "Added successfully",
      }

      store = ""
      number = ""
    })

  const saveCard = (card) =>
    tryDo(() => {
      updateCard(card)

      message = {
        type: "success",
        text: "Card was updated successfully",
      }
    })

  const validateCardFormInput = () => {
    if (!store) {
      onCardFormError("Please, specify store name")
    } else if (!/^\d+$/.test(number)) {
      onCardFormError("Invalid card number")
    } else {
      return true
    }

    return false
  }

  const submitCardForm = () => {
    if (!validateCardFormInput()) return

    if (formType === "add") {
      addCard()
    } else {
      saveCard({
        id,
        store,
        number,
        gradient,
      })
    }
  }
</script>

<h2>
  {#if formType === "edit"}
    Edit a card
  {:else}
    Add a card
  {/if}
</h2>

<div class="FormWrapper column fill">
  {#if message.text}
    <p class="FormMessage {message.type}" transition:fade>
      {message.text}
    </p>
  {/if}

  <form on:submit|preventDefault={submitCardForm} class="Form column">
    <div class="column">
      <label for="store-name">Store name</label>
      <input
        type="text"
        id="store-name"
        placeholder="Store name"
        bind:value={store}
        required
        autocomplete="off"
      />
    </div>
    <div class="column">
      <label for="card-number">Card number</label>
      <input
        type="text"
        id="card-number"
        placeholder="Card number"
        bind:value={number}
        required
        autocomplete="off"
      />
    </div>

    <button type="submit">
      {#if formType === "edit"}
        Save
      {:else}
        Add
      {/if}
    </button>

    <section class="FormPreview column">
      <h3>Preview</h3>

      <Card disabled role="img" bind:card={cardPreviewData} />

      <button type="button" class="gray" on:click={changeCardGradient}>
        Update color
      </button>
    </section>
  </form>
</div>

<style>
  .FormWrapper {
    min-width: 20rem;
  }

  .Form,
  .FormPreview {
    gap: 1rem;
    margin-top: 1rem;
  }

  .Form > div {
    gap: 0.5rem;
  }

  .Form label {
    font-weight: 500;
    font-size: 1.25rem;
  }

  .FormPreview h3 {
    font-weight: 700;
    font-size: 1.5rem;
  }

  .FormMessage {
    max-width: 100%;
    box-sizing: border-box;

    transition: background-color 0.5s;
    color: var(--background);

    padding: 0.5rem 1rem;
    margin-top: 1rem;

    border-radius: 0.5em;
    font-size: 1.15em;
  }

  .FormMessage.error {
    background: var(--danger);
  }

  .FormMessage.success {
    background: var(--success);
  }
</style>

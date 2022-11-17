<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { fade } from "svelte/transition"
  import { _ } from "svelte-i18n"

  import Card from "./Card.svelte"

  import { randomCardGradient } from "./helpers/randomCardGradient"
  import { addCard as addCardToStore, updateCard } from "./cardStore"

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

  const onCardFormError = (errorMessage) => {
    message = {
      type: "error",
      text: errorMessage,
    }
  }

  const tryDo = (func) => {
    try {
      func()
    } catch (error) {
      if (typeof error !== "string") {
        console.error(error)
        error = $_("cardForm.messages.unknownError")
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
        text: $_("cardForm.messages.cardAdded"),
      }

      store = ""
      number = ""
    })

  const saveCard = (card) =>
    tryDo(() => {
      updateCard(card)

      message = {
        type: "success",
        text: $_("cardForm.messages.cardUpdated")
      }
    })

  const validateCardFormInput = () => {
    if (!store) {
      onCardFormError($_("cardForm.messages.specifyStore"))
    } else if (!/^\d+$/.test(number)) {
      onCardFormError($_("cardForm.messages.invalidCard"))
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
    {$_("cardForm.editCardTitle")}
  {:else}
    {$_("cardForm.addCardTitle")}
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
      <label for="store-name">{$_("cardForm.fields.storeName")}</label>
      <input
        type="text"
        id="store-name"
        placeholder={$_("cardForm.fields.storeName")}
        bind:value={store}
        required
        autocomplete="off"
      />
    </div>
    <div class="column">
      <label for="card-number">{$_("cardForm.fields.cardNumber")}</label>
      <input
        type="text"
        id="card-number"
        placeholder={$_("cardForm.fields.cardNumber")}
        bind:value={number}
        required
        autocomplete="off"
      />
    </div>

    <button type="submit">
      {#if formType === "edit"}
        {$_("cardForm.saveButtonText")}
      {:else}
        {$_("cardForm.addButtonText")}
      {/if}
    </button>

    <section class="FormPreview column">
      <h3>{$_("cardForm.preview.title")}</h3>

      <Card disabled role="img" bind:card={cardPreviewData} />

      <button type="button" class="gray" on:click={changeCardGradient}>
        {$_("cardForm.preview.updateColorButtonText")}
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

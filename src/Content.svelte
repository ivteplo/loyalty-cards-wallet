<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import Card from "./Card.svelte"
  import Sheet from "./Sheet.svelte"
  import CardView from "./CardView.svelte"
  import Spinner from "./Spinner.svelte"
  import Alert from "./Alert.svelte"
  import { fade } from "svelte/transition"
  import {
    cards,
    addCard as addCardToStore,
    removeCard,
    updateCard,
  } from "./cardsStore"

  function tryDo(func, callback) {
    try {
      func()
    } catch (error) {
      if (typeof error === "string") {
        callback(error)
      } else {
        console.error(error)
        callback("Unknown error")
      }
    }
  }

  // Form for adding/editing cards:
  /**
   * @type {{
   *   show: boolean,
   *   type: "add" | "edit",
   *   message: {
   *     type: "error" | "success",
   *     text: string
   *   },
   *   storeName: string,
   *   cardNumber: string,
   *   cardID?: string
   * }}
   */
  let cardForm = {
    show: false,
    type: "add",
    message: {
      type: "",
      text: "",
    },
    storeName: "",
    cardNumber: "",
    cardID: undefined,
  }

  function onCardFormError(message) {
    cardForm.message = {
      type: "error",
      text: message,
    }

    cardForm = cardForm
  }

  let isCardRemovingDialogShown = false

  const showCardRemovingDialog = () => {
    isCardRemovingDialogShown = true
  }

  const hideCardRemovingDialog = () => {
    isCardRemovingDialogShown = false
  }

  const hideCardForm = () => {
    cardForm = {
      ...cardForm,
      show: false,
      type: "",
      message: {
        type: "",
        text: "",
      },
      storeName: "",
      cardNumber: "",
      cardID: undefined,
    }
  }

  const showAddCardForm = () => {
    cardForm = {
      ...cardForm,
      show: true,
      type: "add",
      message: {
        type: "",
        text: "",
      },
      storeName: "",
      cardNumber: "",
      cardID: undefined,
    }
  }

  function addCard() {
    tryDo(() => {
      addCardToStore({
        store: cardForm.storeName,
        number: cardForm.cardNumber,
      })

      cardForm.message = {
        type: "success",
        text: "Added successfully",
      }

      cardForm.storeName = ""
      cardForm.cardNumber = ""

      cardForm = cardForm
    }, onCardFormError)
  }

  function openEditCardForm(card) {
    cardForm = {
      show: true,
      type: "edit",
      message: "",
      storeName: card.store,
      cardNumber: card.number,
      cardID: card.id,
    }
  }

  function saveCard(card) {
    tryDo(() => {
      updateCard(card)

      cardForm.message = {
        type: "success",
        text: "Card was updated successfully",
      }

      cardForm = cardForm
    }, onCardFormError)
  }

  function validateCardFormInput() {
    if (!cardForm.storeName) {
      cardForm.message = {
        type: "error",
        text: "Please, specify store name",
      }
    } else if (!/^\d+$/.test(cardForm.cardNumber)) {
      cardForm.message = {
        type: "error",
        text: "Invalid card number",
      }
    } else {
      return true
    }

    return false
  }

  function submitCardForm() {
    if (validateCardFormInput()) {
      if (cardForm.type === "add") {
        addCard()
      } else {
        saveCard({
          ...shownCard,
          store: cardForm.storeName,
          number: cardForm.cardNumber,
        })
      }
    }

    cardForm = cardForm
  }

  // Viewing cards
  let shownCardIndex
  $: shownCard = $cards ? $cards[shownCardIndex] : undefined

  function onSubmitCardRemoving() {
    const cardID = shownCard?.id

    if (cardID) {
      removeCard(cardID)
      shownCardIndex = undefined
    }

    hideCardRemovingDialog()
  }
</script>

<div class="column fill">
  <h1>Wallet</h1>

  {#if $cards === undefined}
    <div class="column center fill">
      <Spinner />
    </div>
  {:else if $cards.length === 0}
    <div class="fill column center">
      <p style="font-weight: 500; margin-bottom: 0.5rem">
        Currently you don't have any cards
      </p>
      <button type="button" on:click={() => showAddCardForm()}
        >Click here to add a card</button
      >
    </div>
  {:else}
    <ul class="CardList">
      {#each $cards as card, cardIndex}
        <li class="column fill">
          <Card
            {card}
            class="fill"
            on:click={() => {
              shownCardIndex = cardIndex
            }}
          />
        </li>
      {/each}

      <li class="column fill">
        <Card
          card={null}
          class="fill"
          on:click={() => {
            showAddCardForm()
          }}
        >
          <span class="BigAddButtonText column fill center"> Add a card </span>
        </Card>
      </li>
    </ul>
  {/if}

  {#if shownCard}
    <Sheet
      minHeight="75vh"
      on:hide={() => {
        shownCardIndex = undefined
      }}
    >
      <div class="fill column center">
        <CardView
          card={shownCard}
          on:edit={() => openEditCardForm(shownCard)}
          on:remove={showCardRemovingDialog}
        />
      </div>
    </Sheet>
  {/if}

  {#if cardForm.show}
    <Sheet on:hide={() => hideCardForm()}>
      <h2>
        {#if cardForm.type === "edit"}
          Edit a card
        {:else}
          Add a card
        {/if}
      </h2>

      <div class="FormWrapper column fill">
        {#if cardForm.message.text}
          <p class="FormMessage {cardForm.message.type}" transition:fade>
            {cardForm.message.text}
          </p>
        {/if}

        <form on:submit|preventDefault={submitCardForm} class="Form column">
          <div class="column">
            <label for="store-name">Store name</label>
            <input
              type="text"
              id="store-name"
              placeholder="Store name"
              bind:value={cardForm.storeName}
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
              bind:value={cardForm.cardNumber}
              required
              autocomplete="off"
            />
          </div>
          <button type="submit">
            {#if cardForm.type === "edit"}
              Save
            {:else}
              Add
            {/if}
          </button>
        </form>
      </div>
    </Sheet>
  {/if}

  {#if isCardRemovingDialogShown}
    <Alert on:hide={hideCardRemovingDialog}>
      <h2>Removing the card</h2>
      <p>
        Are you sure you want to remove the {shownCard.store} card from the app?
      </p>

      <svelte:fragment slot="actions">
        <button
          type="button"
          class="danger filled"
          on:click={onSubmitCardRemoving}>Yes, remove the card</button
        >
        <button type="button" class="gray" on:click={hideCardRemovingDialog}
          >Cancel</button
        >
      </svelte:fragment>
    </Alert>
  {/if}
</div>

<style>
  .CardList {
    --columns-count: 1;

    display: grid;
    grid-template-columns: repeat(var(--columns-count), 1fr);

    list-style: none;
    margin-top: 2rem;
    gap: 1rem;

    padding-bottom: 1rem;
  }

  @media (min-width: 20rem) {
    .CardList {
      --columns-count: 2;
    }
  }

  @media (min-width: 30rem) {
    .CardList {
      --columns-count: 3;
    }
  }

  @media (min-width: 40rem) {
    .CardList {
      --columns-count: 4;
    }
  }

  @media (min-width: 50rem) {
    .CardList {
      --columns-count: 5;
    }
  }

  @media (min-width: 60rem) {
    .CardList {
      --columns-count: 6;
    }

    .App {
      width: 100%;
      max-width: 80rem;
      align-self: center;
    }
  }

  .CardList li {
    flex-basis: 10rem;
  }

  .FormWrapper {
    min-width: 20rem;
  }

  .Form {
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

  .BigAddButtonText {
    width: 100%;
    font-size: 1.25rem;
    color: var(--gray);
  }

  .BigAddButtonText::before {
    content: "+";
    font-size: 1.75em;
    line-height: 0.7;
    margin-bottom: 0.25rem;
  }
</style>

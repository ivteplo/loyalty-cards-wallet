<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import Card from "./Card.svelte"
  import Sheet from "./Sheet.svelte"
  import CardView from "./CardView.svelte"
  import Spinner from "./Spinner.svelte"

  import localForage from "localforage"
  import { onMount } from "svelte"
  import { v4 as uuid } from "uuid"
  import { fade } from "svelte/transition"

  let cards

  $: {
    localForage
      .setItem("cards", cards || [])
      .then(() => console.log("Saved"))
      .catch((error) => console.error(error))
  }

  onMount(async () => {
    try {
      cards = (await localForage.getItem("cards")) || []
    } catch (error) {
      console.error(error)
    }
  })

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

  const hideCardForm = () => {
    cardForm = {
      ...cardForm,
      show: false,
      message: {
        type: "",
        text: "",
      },
      storeName: "",
      cardNUmber: "",
      cardID: undefined,
    }
  }

  const showCardForm = () => {
    cardForm = {
      ...cardForm,
      show: true,
    }
  }

  function addCard() {
    cards = [
      ...(cards || []),
      {
        id: uuid(),
        store: cardForm.storeName,
        number: cardForm.cardNumber,
      },
    ]

    cardForm.message = {
      type: "success",
      text: "Added successfully",
    }

    cardForm.storeName = ""
    cardForm.cardNumber = ""

    cardForm = cardForm
  }

  function editCard(card) {
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
    const index = cards.findIndex((child) => child.id === card.id)
    cards[index] = card
    cards = cards

    cardForm.message = {
      type: "success",
      text: "Card was updated successfully",
    }

    cardForm = cardForm
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
  $: shownCard = cards ? cards[shownCardIndex] : undefined
</script>

<main class="column fill">
  <h1>Wallet</h1>

  {#if cards === undefined}
    <div class="column center fill">
      <Spinner />
    </div>
  {:else if cards.length === 0}
    <div class="fill column center">
      <p style="font-weight: 500; margin-bottom: 0.5rem">
        Currently you don't have any cards
      </p>
      <button type="button" on:click={() => showCardForm()}
        >Click here to add a card</button
      >
    </div>
  {:else}
    <ul class="CardList row wrap">
      {#each cards as card, cardIndex}
        <li class="column fill">
          <Card
            {card}
            className="fill"
            on:click={() => {
              shownCardIndex = cardIndex
            }}
          />
        </li>
      {/each}

      <li class="column fill">
        <Card
          card={null}
          on:click={() => {
            showCardForm()
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
      hide={() => {
        shownCardIndex = undefined
      }}
    >
      <div class="fill column center">
        <CardView card={shownCard} on:edit={() => editCard(shownCard)} />
      </div>
    </Sheet>
  {/if}

  {#if cardForm.show}
    <Sheet hide={() => hideCardForm()}>
      <h2>
        {#if cardForm.type === "edit"}
          Edit a card
        {:else}
          Add a card
        {/if}
      </h2>

      <div class="column fill center">
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
</main>

<style>
  .CardList {
    list-style: none;
    margin-top: 2rem;
    gap: 1rem;
  }

  .CardList li {
    flex-basis: 10rem;
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
    transition: background-color 0.5s;
    color: var(--background);

    padding: 0.5rem 1rem;
    margin-bottom: 1rem;

    width: calc(100% - 2rem);
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
    font-size: 1.25em;
  }

  .BigAddButtonText::before {
    content: "+";
    font-size: 3.5em;
  }
</style>
<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import Card from "./Card.svelte"
  import Sheet from "./Sheet.svelte"
  import CardView from "./CardView.svelte"

  let showAddCardSheet = false
  let cards = []

  // Form for adding cards:
  let formMessage = ""
  let storeName = ""
  let cardNumber = ""

  function addCard() {
    if (!storeName) {
      formMessage = "Please, specify store name"
    } else if (!/\d+/.test(cardNumber)) {
      formMessage = "Invalid card number"
    } else {
      cards = [
        ...cards,
        {
          store: storeName,
          number: cardNumber,
        },
      ]

      storeName = ""
      cardNumber = ""
      formMessage = ""
    }
  }

  // Viewing cards
  let shownCard
</script>

<main class="column fill">
  <h1>Wallet</h1>

  {#if cards.length === 0}
    <div class="fill column center">
      <p style="font-weight: 500; margin-bottom: 0.5rem">
        Currently you don't have any cards
      </p>
      <button
        type="button"
        on:click={() => {
          showAddCardSheet = true
        }}>Click here to add a card</button
      >
    </div>
  {:else}
    <ul class="CardList row wrap">
      {#each cards as card}
        <Card
          {card}
          className="fill"
          on:click={() => {
            shownCard = card
          }}
        />
      {/each}

      <Card card={null} className="fill no-padding">
        <button
          type="button"
          class="fill column center BigAddButton"
          on:click={() => {
            showAddCardSheet = true
          }}>Add a card</button
        >
      </Card>
    </ul>
  {/if}

  {#if showAddCardSheet}
    <Sheet
      hide={() => {
        showAddCardSheet = false
      }}
    >
      <h2>Add a card</h2>

      {#if formMessage}
        <p class="FormMessage">{formMessage}</p>
      {/if}

      <form on:submit|preventDefault={addCard} class="Form column">
        <input
          type="text"
          placeholder="Store name"
          bind:value={storeName}
          required
        />
        <input
          type="text"
          placeholder="Card number"
          bind:value={cardNumber}
          required
        />
        <button type="submit">Add</button>
      </form>
    </Sheet>
  {/if}

  {#if shownCard}
    <Sheet
      minHeight="75vh"
      hide={() => {
        shownCard = undefined
      }}
    >
      <div class="fill column center">
        <h2 style="text-align: center">{shownCard.store}</h2>
        <CardView card={shownCard} />
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

  .Form {
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .FormMessage {
    background: var(--danger);
    color: var(--background);
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 0.5em;
    font-size: 1.15em;
  }

  .BigAddButton {
    width: 100%;
    font-size: 1.25em;
    background-color: var(--divider);
    color: var(--foreground);
  }

  .BigAddButton::before {
    content: "+";
    font-size: 3.5em;
  }

  /* Remove arrows for input[type=number] */
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>

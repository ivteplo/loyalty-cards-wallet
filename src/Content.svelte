<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import Sheet from "./components/Sheet.svelte"
  import Alert from "./components/Alert.svelte"
  import Spinner from "./components/Spinner.svelte"

  import Card from "./Card.svelte"
  import CardView from "./CardView.svelte"

  import { cards, removeCard } from "./cardsStore"

  import { randomCardGradient } from "./helpers/randomCardGradient"
  import CardForm from "./CardForm.svelte"

  let showCardForm = false
  let cardForm = {}

  const hideCardForm = () => {
    showCardForm = false
    cardForm = {}
  }

  const showAddCardForm = () => {
    cardForm = { formType: "add" }
    showCardForm = true
  }

  function openEditCardForm(card) {
    cardForm = {
      formType: "edit",
      store: card.store,
      number: card.number,
      id: card.id,
      gradient: card.gradient,
    }

    showCardForm = true
  }

  let isCardRemovingDialogShown = false

  const showCardRemovingDialog = () => {
    isCardRemovingDialogShown = true
  }

  const hideCardRemovingDialog = () => {
    isCardRemovingDialogShown = false
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

  {#if showCardForm}
    <Sheet on:hide={() => hideCardForm()}>
      <CardForm {...cardForm} />
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

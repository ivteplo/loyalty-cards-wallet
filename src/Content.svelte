<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import Sheet from "./components/Sheet.svelte"
  import Alert from "./components/Alert.svelte"
  import CardView from "./CardView.svelte"

  import { cards, removeCard } from "./cardsStore"

  import CardForm from "./CardForm.svelte"
  import CardList from "./CardList.svelte"

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
  let shownCard

  function onSubmitCardRemoving() {
    if (shownCard?.id) {
      removeCard(shownCard?.id)
      shownCard = undefined
    }

    hideCardRemovingDialog()
  }
</script>

<div class="column fill">
  <h1>Wallet</h1>

  <CardList
    on:cardClick={(event) => {
      shownCard = event.detail.card
    }}
    on:createNewCard={showAddCardForm}
  />

  {#if shownCard}
    <Sheet
      minHeight="75vh"
      on:hide={() => {
        shownCard = undefined
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

<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { _ } from "svelte-i18n"

  import Sheet from "./components/Sheet.svelte"
  import Alert from "./components/Alert.svelte"
  import CardView from "./CardView.svelte"

  import { cards, removeCard } from "./cardStore"

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
      <h2>{$_("content.removeCardDialog.title")}</h2>
      <p>{$_("content.removeCardDialog.text").replace("{{store}}", shownCard.store)}</p>

      <svelte:fragment slot="actions">
        <button
          type="button"
          class="danger filled"
          on:click={onSubmitCardRemoving}
        >
          {$_("content.removeCardDialog.deleteButtonText")}
        </button>
        <button
          type="button"
          class="gray"
          on:click={hideCardRemovingDialog}
        >
          {$_("content.removeCardDialog.cancelButtonText")}
        </button>
      </svelte:fragment>
    </Alert>
  {/if}
</div>

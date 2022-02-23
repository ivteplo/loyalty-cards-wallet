<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import Barcode from "jsbarcode"
  import { createEventDispatcher } from "svelte"

  export let card

  const dispatchEvent = createEventDispatcher()

  let svg

  $: (function generateBarcode(card) {
    if (!svg) return

    Barcode(svg, card?.number ?? 0, {
      displayValue: false,
      flat: false,
      height: 75,
    })

    svg.removeAttribute("width")
    svg.removeAttribute("height")
  })(card)

  const editCard = () => dispatchEvent("edit")
  const deleteCard = () => dispatchEvent("delete")
</script>

<div class="CardView column center">
  <div class="CardInfo column center">
    <h2>{card.store}</h2>
    <svg bind:this={svg} />
    <code class="CardNumber">{card.number}</code>
  </div>
  <div class="row CardViewActions">
    <button type="button" class="fill" on:click={editCard}>Edit</button>
    <button type="button" class="fill danger" on:click={deleteCard}
      >Delete</button
    >
  </div>
</div>

<style>
  .CardView {
    gap: 2rem;
    justify-content: space-between;
  }

  .CardInfo {
    gap: 1rem;
  }

  .CardInfo h2 {
    text-align: center;
  }

  .CardView svg {
    width: 50vw;
    min-width: 15rem;
    max-width: 40rem;
  }

  .CardNumber {
    font-family: inherit;
    font-size: 2rem;
  }

  .CardViewActions {
    gap: 1rem;
    width: 100%;
  }
</style>

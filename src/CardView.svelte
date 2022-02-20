<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import Barcode from "jsbarcode"

  export let card

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
</script>

<div class="CardView column center">
  <svg bind:this={svg} />
  <code class="CardNumber">{card.number}</code>
</div>

<style>
  .CardView svg {
    width: 50vw;
    min-width: 15rem;
    max-width: 40rem;
  }

  .CardNumber {
    font-family: inherit;
    font-size: 2rem;
  }
</style>

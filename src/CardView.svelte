<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { createEventDispatcher } from "svelte"
  import { _ } from "svelte-i18n"
  import Barcode from "jsbarcode"

  export let card

  const dispatchEvent = createEventDispatcher()

  // Barcode colors
  let colors = {
    background: null,
    foreground: null,
  }

  // CSS media query that checks if the user prefers dark mode
  const darkModeMedia = window.matchMedia("(prefers-color-scheme: dark)")

  // Function that updates barcode colors
  const updateColors = () => {
    // Get :root styles
    const style = getComputedStyle(document.documentElement)

    // Get colors from CSS variables
    colors.background = style.getPropertyValue("--background")
    colors.foreground = style.getPropertyValue("--foreground")
  }

  // Listen for dark/light mode changes
  darkModeMedia.addEventListener("change", updateColors)

  // Set initial values
  updateColors()

  // Barcode SVG
  let svg

  $: (function generateBarcode(card) {
    if (!svg) return

    Barcode(svg, card?.number ?? 0, {
      displayValue: false,
      flat: false,
      height: 75,
      background: colors.background,
      lineColor: colors.foreground,
    })

    svg.removeAttribute("width")
    svg.removeAttribute("height")
  })(card)

  const editCard = () => dispatchEvent("edit")
  const removeCard = () => dispatchEvent("remove")
</script>

<div class="CardView column center">
  <div class="CardInfo column center">
    <h2>{card.store}</h2>
    <svg bind:this={svg} />
    <code class="CardNumber">{card.number}</code>
  </div>
  <div class="row CardViewActions">
    <button type="button" class="fill" on:click={editCard}>
      {$_("cardView.actions.editButtonText")}
    </button>
    <button type="button" class="fill danger" on:click={removeCard}>
      {$_("cardView.actions.removeButtonText")}
    </button>
  </div>
</div>

<style>
  .CardView {
    gap: 2rem;
    justify-content: space-between;
  }

  .CardInfo {
    gap: 1rem;
    max-width: 90vw;
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
    word-break: break-all;
    text-align: center;
  }

  .CardViewActions {
    gap: 1rem;
    width: 100%;
  }
</style>

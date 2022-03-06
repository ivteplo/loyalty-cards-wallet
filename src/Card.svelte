<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { updateCardBackground } from "./cardsStore"

  export let card

  // Migration: add background gradient for cards that were created with older app versions
  if (card && !card.gradient) {
    try {
      card = updateCardBackground(card)
    } catch (error) {
      console.error(error)
    }
  }

  let style = card?.gradient
    ? `background: linear-gradient(-45deg, ${card.gradient.from}, ${card.gradient.to}); color: var(--card-foreground)`
    : ""
</script>

<button
  type="button"
  {style}
  {...$$props}
  card={null}
  class={`Card column center ${$$props.class}`}
  on:click
>
  {#if card}
    <b>{card.store}</b>
  {:else}
    <slot />
  {/if}
</button>

<style>
  .Card {
    aspect-ratio: 3 / 2;
    background: var(--background);
    color: var(--foreground);
    padding: 1rem;
    border: 0.125rem solid var(--divider);
    border-radius: 1rem;
    box-sizing: border-box;
  }

  .Card b {
    font-size: 1.25rem;
    font-weight: 500;
  }
</style>

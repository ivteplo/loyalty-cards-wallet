<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { updateCardBackground } from "./cardStore"

  export let card

  // Migration: add background gradient for cards that were created with older app versions
  if (card && !card.gradient && card.id) {
    try {
      card = updateCardBackground(card)
    } catch (error) {
      console.error(error)
    }
  }

  $: style = card?.gradient
    ? `background-image: linear-gradient(-45deg, ${card.gradient.from}, ${card.gradient.to}); color: var(--card-foreground); border: none`
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
    background-color: var(--background);
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

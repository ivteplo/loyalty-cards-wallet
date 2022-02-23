<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  export let card
  export let className = ""
</script>

<button class="Card column center {className}" type="button" on:click>
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
    font-size: 1.75rem;
    font-weight: 500;
  }
</style>

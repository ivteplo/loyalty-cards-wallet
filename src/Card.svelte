<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  export let card
  export let className = ""
</script>

<li class="Card column center {className}" on:click>
  {#if card}
    <b>{card.store}</b>
  {:else}
    <slot />
  {/if}
</li>

<style>
  .Card {
    aspect-ratio: 3 / 2;
    max-width: 25rem;
    padding: 1rem;
    border: 0.125rem solid var(--divider);
    border-radius: 1rem;
    box-sizing: border-box;
  }

  .Card.no-padding {
    padding: 0;
  }

  .Card b {
    font-size: 1.75rem;
  }
</style>

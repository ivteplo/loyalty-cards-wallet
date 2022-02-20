<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import Card from "./Card.svelte"

  const shops = ["Shop #1", "Shop #2", "Shop #3"]

  function addCard() {}
</script>

<main>
  <h1>Wallet</h1>

  <button type="button" on:click={addCard}>Add a card</button>

  <ul class="CardList row wrap">
    {#each shops as shop}
      <li class="fill">
        <Card {shop} />
      </li>
    {/each}
  </ul>
</main>

<style>
  .CardList {
    list-style: none;
    margin-top: 2rem;
    gap: 1rem;
  }
</style>

<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  export let shop
</script>

<main>
  <div class="Card column">
    <b>{shop}</b>
  </div>
</main>

<style>
  .Card {
    aspect-ratio: 3 / 2;
    padding: 1rem;
    justify-content: center;
    align-items: center;
    border: 0.125rem solid var(--divider);
    border-radius: 1rem;
  }
</style>

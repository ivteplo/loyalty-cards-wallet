<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import Spinner from "./components/Spinner.svelte"
  import Card from "./Card.svelte"

  import { cards } from "./cardsStore"

  import { createEventDispatcher } from "svelte"

  const dispatchEvent = createEventDispatcher()

  const onCardClick = (card) => {
    dispatchEvent("cardClick", { card })
  }

  const showAddCardForm = () => {
    dispatchEvent("createNewCard")
  }
</script>

{#if $cards === undefined}
  <div class="column center fill">
    <Spinner />
  </div>
{:else if $cards.length === 0}
  <div class="fill column center">
    <p style="font-weight: 500; margin-bottom: 0.5rem">
      Currently you don't have any cards
    </p>
    <button type="button" on:click={() => showAddCardForm()}
      >Click here to add a card</button
    >
  </div>
{:else}
  <ul class="CardList">
    {#each $cards as card}
      <li class="column fill">
        <Card {card} class="fill" on:click={() => onCardClick(card)} />
      </li>
    {/each}

    <li class="column fill">
      <Card
        card={null}
        class="fill"
        on:click={() => {
          showAddCardForm()
        }}
      >
        <span class="BigAddButtonText column fill center">Add a card</span>
      </Card>
    </li>
  </ul>
{/if}

<style>
  .CardList {
    --columns-count: 1;

    display: grid;
    grid-template-columns: repeat(var(--columns-count), 1fr);

    list-style: none;
    margin-top: 2rem;
    gap: 1rem;

    padding-bottom: 1rem;
  }

  @media (min-width: 20rem) {
    .CardList {
      --columns-count: 2;
    }
  }

  @media (min-width: 35rem) {
    .CardList {
      --columns-count: 3;
    }
  }

  @media (min-width: 45rem) {
    .CardList {
      --columns-count: 4;
    }
  }

  @media (min-width: 55rem) {
    .CardList {
      --columns-count: 5;
    }
  }

  @media (min-width: 65rem) {
    .CardList {
      --columns-count: 6;
    }
  }

  .CardList li {
    flex-basis: 10rem;
  }

  .BigAddButtonText {
    width: 100%;
    font-size: 1.25rem;
    color: var(--gray);
  }

  .BigAddButtonText::before {
    content: "+";
    font-size: 1.75em;
    line-height: 0.7;
    margin-bottom: 0.25rem;
  }
</style>

<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { createEventDispatcher } from "svelte"
  import { fade, fly } from "svelte/transition"

  const dispatchEvent = createEventDispatcher()
  const hide = () => dispatchEvent("hide")

  export let minHeight = "50vh"
</script>

<div class="Sheet">
  <div class="SheetOverlay" on:click={hide} transition:fade />
  <div
    class="SheetContents column"
    style="min-height: {minHeight}"
    transition:fly={{ y: 200 }}
  >
    <button
      type="button"
      class="SheetCloseButton"
      on:click={hide}
      title="Close"
    >
      &times;
    </button>
    <slot />
  </div>
</div>

<style>
  .Sheet {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    z-index: 999;
  }

  .SheetOverlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: #0008;
  }

  .SheetContents {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;

    padding: 1rem;
    border-radius: 1rem 1rem 0 0;
    background: var(--background);
  }

  @media (min-width: 50rem) {
    .SheetContents {
      top: 50%;
      left: 50%;
      right: auto;
      bottom: auto;
      transform: translate(-50%, -50%);

      min-height: auto !important;

      max-height: 90vh;
      max-width: 90vw;

      border-radius: 1rem;
    }
  }

  .SheetCloseButton {
    position: absolute;
    right: 0;
    top: 0;

    background: transparent;
    color: inherit;

    padding: 1rem 1rem 0.5rem 0.5rem;
    font-size: 1.5rem;
  }
</style>

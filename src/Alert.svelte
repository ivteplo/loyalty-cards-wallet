<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { createEventDispatcher } from "svelte"
  import { fade, fly } from "svelte/transition"

  const dispatchEvent = createEventDispatcher()
  const hide = () => dispatchEvent("hide")

  /**
   * @type {"alert"|"alertdialog"}
   */
  export let role = "alert"
</script>

<div class="Alert">
  <div class="AlertOverlay" on:click={hide} transition:fade />
  <div class="AlertContents column" {role} transition:fly={{ y: 200 }}>
    <div class="AlertContentsInformation column">
      <slot />
    </div>
    <div class="AlertActionButtons column">
      <slot name="actions" />
    </div>
  </div>
</div>

<style>
  .Alert {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    z-index: 999;
  }

  .AlertOverlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: #0008;
  }

  .AlertContents {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    margin: auto;

    justify-content: space-between;

    min-width: 18rem;

    max-height: 90vh;
    max-width: 90vw;

    padding: 1rem;
    border-radius: 1rem;
    background: var(--background);

    gap: 1rem;
  }

  .AlertContentsInformation {
    gap: 0.25rem;
  }

  .AlertActionButtons {
    gap: 0.5rem;
  }
</style>

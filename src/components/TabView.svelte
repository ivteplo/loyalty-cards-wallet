<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { setContext } from "svelte"
  import { writable } from "svelte/store"

  export let defaultTab = undefined

  let tabs = []
  let currentTab = writable(defaultTab)

  function addTab(label, icon) {
    tabs = [...tabs, { label, icon }]
  }

  setContext("tabView", { currentTab, addTab })
</script>

<div {...$$props} class={`TabView ${$$props.class}`}>
  <nav>
    {#each tabs as tab}
      <div class="fill" />
      <button
        type="button"
        on:click={() => {
          $currentTab = tab.label
        }}
        class="fill column"
        class:current={$currentTab === tab.label}
      >
        <svelte:component
          this={tab.icon}
          style="width: 1.25rem; fill: currentColor; stroke: currentColor; stroke-width: 0.5"
        />
        <span>{tab.label}</span>
      </button>
    {/each}
    <div class="fill" />
  </nav>

  <main class="fill column">
    <slot />
  </main>
</div>

<style>
  .TabView {
    display: flex;
    flex-direction: column-reverse;
  }

  nav {
    display: flex;
    border-top: 0.0675rem solid var(--divider);
    padding: 0.25rem;

    background-color: var(--background);

    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  @supports (backdrop-filter: blur(1rem)) {
    nav {
      background-color: var(--transparent-background);
      backdrop-filter: blur(1rem);
    }
  }

  nav > button {
    background: transparent;
    color: var(--foreground);
    align-items: center;
    gap: 0.125rem;
  }

  nav > button.current {
    color: var(--primary);
  }

  main {
    padding: 2rem 1rem 4rem;
  }

  @media (min-width: 70rem) {
    .TabView {
      flex-direction: row;
    }

    nav {
      position: unset;
      bottom: unset;
      left: unset;
      right: unset;

      flex-direction: column;

      border-top: none;
      border-right: 0.0675rem solid var(--divider);

      min-width: 10rem;

      padding: 2rem 1rem 1rem;
    }

    nav > button {
      flex-direction: row;
      margin-bottom: 0.5rem;
      gap: 0.5rem;
    }

    nav > .fill {
      flex-grow: unset;
    }

    main {
      padding: 2rem;
      max-width: 90rem;
    }
  }

  @media (min-width: 95rem) {
    .TabView {
      justify-content: center;
    }
  }
</style>

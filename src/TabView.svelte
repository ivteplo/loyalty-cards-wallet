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
  }

  nav > button {
    background: var(--background);
    color: var(--foreground);
    align-items: center;
    gap: 0.125rem;
  }

  nav > button.current {
    color: var(--primary);
  }

  main {
    padding: 2rem 1rem 1rem;
  }
</style>

<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { getContext } from "svelte"

  export let label
  export let icon

  const { currentTab, addTab } = getContext("tabView")
  addTab(label, icon)
</script>

{#if $currentTab === label}
  <slot />
{/if}

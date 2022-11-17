<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { getContext } from "svelte"

  export let label
  export let icon
  export let tabID

  const { currentTab, addTab } = getContext("tabView")
  addTab(tabID, label, icon)
</script>

{#if $currentTab === tabID}
  <slot />
{/if}

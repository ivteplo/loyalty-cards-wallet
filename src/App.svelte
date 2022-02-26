<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { onMount } from "svelte"
  import TabView from "./TabView.svelte"
  import Tab from "./Tab.svelte"
  import Content from "./Content.svelte"

  import { loadCardsFromStorage } from "./cardsStore"
  import Settings from "./Settings.svelte"

  import CardIcon from "./icons/card.svg"
  import SettingsIcon from "./icons/settings.svg"

  onMount(async () => {
    try {
      await loadCardsFromStorage()
    } catch (error) {
      console.error(error)
    }
  })
</script>

<div class="App column fill">
  <TabView class="fill" defaultTab="Cards">
    <Tab label="Cards" icon={CardIcon}>
      <Content />
    </Tab>
    <Tab label="Settings" icon={SettingsIcon}>
      <Settings />
    </Tab>
  </TabView>
</div>

<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import localForage from "localforage"
  import { onMount } from "svelte"
  import TabView from "./TabView.svelte"
  import Tab from "./Tab.svelte"
  import Content from "./Content.svelte"

  import { cards } from "./cardsStore"
  import Settings from "./Settings.svelte"

  import CardIcon from "./icons/card.svg"
  import SettingsIcon from "./icons/settings.svg"

  $: {
    localForage
      .setItem("cards", $cards || [])
      .then(() => console.log("Saved"))
      .catch((error) => console.error(error))
  }

  onMount(async () => {
    try {
      $cards = (await localForage.getItem("cards")) || []
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

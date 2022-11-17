<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { useRegisterSW as useRegisterServiceWorker } from 'virtual:pwa-register/svelte'

  import { onMount } from "svelte"

  import Content from "./Content.svelte"
  import Settings from "./Settings.svelte"

  import Tab from "./components/Tab.svelte"
  import TabView from "./components/TabView.svelte"
  import Alert from "./components/Alert.svelte"

  import CardIcon from "./icons/card.svg"
  import SettingsIcon from "./icons/settings.svg"

  import { loadCardsFromStorage } from "./cardStore"

  // Service worker won't be registered in development mode.
  // It's implemented in the library
  const { needRefresh, updateServiceWorker } = useRegisterServiceWorker({
    onRegistered(registration) {
      console.log("Service worker is registered with scope", registration.scope)
    },
    onRegisterError(error) {
      console.error("Couldn't register service worker due to the error:", error)
    }
  })

  $: isUpdateAlertShown = $needRefresh
  const hideUpdateAlert = () => {
    needRefresh.set(false)
  }

  onMount(() => {
    loadCardsFromStorage().catch(console.error)
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

  {#if isUpdateAlertShown}
    <Alert on:hide={hideUpdateAlert}>
      <h2>Update</h2>
      <p>
        There is an update available. It will be installed when all tabs for
        this page are closed.
      </p>

      <svelte:fragment slot="actions">
        <button type="button" on:click={() => updateServiceWorker(true)}>Reload</button>
        <button type="button" class="gray" on:click={hideUpdateAlert}>Cancel</button>
      </svelte:fragment>
    </Alert>
  {/if}
</div>

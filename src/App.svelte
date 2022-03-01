<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { onMount } from "svelte"

  import Content from "./Content.svelte"
  import Settings from "./Settings.svelte"

  import Tab from "./components/Tab.svelte"
  import TabView from "./components/TabView.svelte"
  import Alert from "./components/Alert.svelte"

  import CardIcon from "./icons/card.svg"
  import SettingsIcon from "./icons/settings.svg"

  import { loadCardsFromStorage } from "./cardsStore"

  let isUpdateAlertShown = false

  const hideUpdateAlert = () => {
    isUpdateAlertShown = false
  }

  let newWorker
  const skipWaiting = () => {
    if (!newWorker) return

    newWorker.postMessage({
      action: "skipWaiting",
    })
  }

  onMount(() => {
    loadCardsFromStorage().catch(console.error)
    checkForUpdates().catch(console.error)
  })

  async function checkForUpdates() {
    if (!navigator.serviceWorker) return

    const registration = await navigator.serviceWorker.getRegistration()

    registration?.addEventListener("updatefound", () => {
      const installingWorker = registration.installing

      if (installingWorker == null) {
        return
      }

      installingWorker.addEventListener("statechange", () => {
        if (installingWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            newWorker = installingWorker

            // The previous service worker will still serve
            // the older content until all client tabs are closed
            isUpdateAlertShown = true
            console.log("New content is available")
          } else {
            console.log("Content is cached for offline use")
          }
        }
      })
    })

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload()
    })
  }
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
        <button type="button" on:click={skipWaiting}>Reload</button>
        <button type="button" class="gray" on:click={hideUpdateAlert}
          >Cancel</button
        >
      </svelte:fragment>
    </Alert>
  {/if}
</div>

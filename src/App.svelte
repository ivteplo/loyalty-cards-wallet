<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { useRegisterSW as useRegisterServiceWorker } from "virtual:pwa-register/svelte"
  import { isLoading as areTranslationsLoading, _ } from "svelte-i18n"

  import { onMount } from "svelte"

  import Content from "./Content.svelte"
  import Settings from "./Settings.svelte"

  import Tab from "./components/Tab.svelte"
  import TabView from "./components/TabView.svelte"
  import Alert from "./components/Alert.svelte"
  import Spinner from "./components/Spinner.svelte"

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
  {#if $areTranslationsLoading}
    <Spinner />
  {:else}
    <TabView class="fill" defaultTab="cards">
      <Tab tabID="cards" label={$_("app.navigationBarTabs.cards")} icon={CardIcon}>
        <Content />
      </Tab>
      <Tab tabID="settings" label={$_("app.navigationBarTabs.settings")} icon={SettingsIcon}>
        <Settings />
      </Tab>
    </TabView>

    {#if isUpdateAlertShown}
      <Alert on:hide={hideUpdateAlert}>
        <h2>{$_("app.update.title")}</h2>
        <p>{$_("app.update.text")}</p>

        <svelte:fragment slot="actions">
          <button type="button" on:click={() => updateServiceWorker(true)}>{$_("app.update.reloadButtonText")}</button>
          <button type="button" class="gray" on:click={hideUpdateAlert}>{$_("app.update.cancelButtonText")}</button>
        </svelte:fragment>
      </Alert>
    {/if}
  {/if}
</div>

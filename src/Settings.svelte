<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import { version, repository } from "../package.json"
  import { _ } from "svelte-i18n"

  import Alert from "./components/Alert.svelte"
  import { cards, addCard } from "./cardStore"

  const jsonFileType = "*.json,application/json,application/JSON"

  let infoDialog = {
    title: "",
    contents: "",
  }

  let confirmRemovingAllCards = false

  function openFileUpload(fileType) {
    const fileUploadInput = document.createElement("input")
    fileUploadInput.setAttribute("type", "file")
    fileUploadInput.setAttribute("accept", fileType)

    return new Promise((resolve, reject) => {
      fileUploadInput.addEventListener("change", () => {
        if (fileUploadInput.files.length === 1) {
          resolve(fileUploadInput.files[0])
        }
      })

      fileUploadInput.addEventListener("error", () => {
        reject($_("settings.errors.fileUpload"))
      })

      fileUploadInput.click()
    })
  }

  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.addEventListener("load", () => {
        resolve(reader.result)
      })

      reader.addEventListener("error", () => {
        reject($_("settings.errors.fileRead"))
      })

      reader.readAsText(file)
    })
  }

  async function importCards() {
    const file = await openFileUpload(jsonFileType)
    const contents = await readFile(file)

    try {
      var json = JSON.parse(contents)
    } catch (error) {
      throw $_("settings.errors.fileRead")
    }

    if (!(json instanceof Array)) {
      throw $_("settings.errors.unsupportedFileFormat")
    }

    json.forEach((card) => {
      const { store, number, gradient } = card

      if (!(typeof store === "string" && typeof number === "string")) {
        return
      }

      addCard({ store, number, gradient })
    })

    infoDialog = {
      title: $_("settings.successfulImportDialog.title"),
      contents: $_("settings.successfulImportDialog.text")
    }
  }

  function exportCards() {
    const exportedData = $cards.map((card) => ({
      ...card,
      id: undefined,
    }))
    const encodedString = encodeURIComponent(JSON.stringify(exportedData))
    const downloadLink = "data:application/json;charset=utf-8," + encodedString

    const linkElement = document.createElement("a")
    linkElement.setAttribute("download", "cards.json")
    linkElement.setAttribute("href", downloadLink)
    linkElement.click()

    infoDialog = {
      title: $_("settings.successfulExportDialog.title"),
      contents: $_("settings.successfulExportDialog.text"),
    }
  }

  function tryDo(func) {
    const wrapper = async () => {
      const value = func()

      if (value instanceof Promise) {
        return await value
      }

      return value
    }

    wrapper().catch((error) => {
      if (typeof error === "string") {
        infoDialog = {
          title: $_("settings.errors.errorDialog.title"),
          contents: error,
        }
      } else {
        console.error(error)

        infoDialog = {
          title: $_("settings.errors.unknownError.title"),
          contents: $_("settings.errors.unknownError.text")
        }
      }
    })
  }
</script>

<div class="Settings column">
  <h1>{$_("settings.title")}</h1>

  <section class="column">
    <h2>{$_("settings.dataSection.title")}</h2>

    <div class="column SettingsButtonsList">
      <button
        type="button"
        on:click={() => {
          tryDo(importCards)
        }}
      >
        {$_("settings.dataSection.importCardsButtonText")}
      </button>
      <button
        type="button"
        on:click={() => {
          tryDo(exportCards)
        }}
      >
        {$_("settings.dataSection.exportCardsButtonText")}
      </button>
      <button
        type="button"
        class="danger"
        on:click={() => {
          confirmRemovingAllCards = true
        }}
      >
        {$_("settings.dataSection.removeAllCardsButtonText")}
      </button>
    </div>
  </section>

  <section class="column">
    <h2>{$_("settings.aboutSection.title")}</h2>

    <ul class="column SettingsButtonsList">
      <li>
        <b>{$_("settings.aboutSection.appVersionText")}</b>: {version}
      </li>
      <li class="column">
        <a href={repository.url} rel="noreferrer" target="_blank">
          {$_("settings.aboutSection.linkToRepoText")}
        </a>
      </li>
    </ul>
  </section>

  {#if infoDialog.title && infoDialog.contents}
    <Alert>
      <h2 class="AlertTitle">{infoDialog.title}</h2>
      <p>{infoDialog.contents}</p>
      <button
        slot="actions"
        type="button"
        on:click={() => {
          infoDialog = {
            title: "",
            contents: "",
          }
        }}>OK</button
      >
    </Alert>
  {/if}

  {#if confirmRemovingAllCards}
    <Alert>
      <h2 class="AlertTitle">{$_("settings.removeAllCardsDialog.title")}</h2>
      <p>{$_("settings.removeAllCardsDialog.text")}</p>

      <svelte:fragment slot="actions">
        <button
          type="button"
          class="danger filled"
          on:click={() => {
            $cards = []
            confirmRemovingAllCards = false
          }}
        >
          {$_("settings.removeAllCardsDialog.removeAllCardsButtonText")}
        </button>
        <button
          type="button"
          class="gray"
          on:click={() => {
            confirmRemovingAllCards = false
          }}
        >
          {$_("settings.removeAllCardsDialog.cancelButtonText")}
        </button>
      </svelte:fragment>
    </Alert>
  {/if}
</div>

<style>
  .Settings {
    gap: 2rem;
  }

  section {
    --border-size: 0.125rem;
    --border-color: var(--divider);
    --border-radius: 0.5rem;

    gap: 0.5rem;
  }

  ul.SettingsButtonsList {
    list-style: none;
  }

  .SettingsButtonsList > * {
    text-align: left;
    border: var(--border-size) solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 0.5em 1em;
  }

  .SettingsButtonsList > :not(button) {
    color: var(--gray);
  }

  .SettingsButtonsList > button:not(.danger) {
    background: var(--background);
    color: var(--primary);
  }

  .SettingsButtonsList > :first-child {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .SettingsButtonsList > :last-child {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .SettingsButtonsList > :not(:first-child):not(:last-child) {
    border-radius: 0;
  }

  .SettingsButtonsList > :not(:last-child) {
    border-bottom-width: calc(var(--border-size) / 2);
  }

  .SettingsButtonsList > :not(:first-child) {
    border-top-width: calc(var(--border-size) / 2);
  }

  .AlertTitle {
    margin-bottom: 0.25rem;
  }
</style>

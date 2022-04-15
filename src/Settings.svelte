<!-- Copyright (c) 2022 Ivan Teplov -->
<script>
  import Alert from "./components/Alert.svelte"
  import { cards, addCard } from "./cardsStore"

  import { version, repository } from "../package.json"

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
        reject("Error while uploading a file")
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
        reject("Error while reading the file")
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
      throw "Error while reading the file's contents"
    }

    if (!(json instanceof Array)) {
      throw "File cannot be used for importing cards. The format is unsupported"
    }

    json.forEach((card) => {
      const { store, number, gradient } = card

      if (!(typeof store === "string" && typeof number === "string")) {
        return
      }

      addCard({ store, number, gradient })
    })

    infoDialog = {
      title: "Successful import",
      contents: "Your cards were imported successfully",
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
      title: "Successful export",
      contents: "Your cards were exported successfully",
    }
  }

  function tryDo(func) {
    func().catch((error) => {
      if (typeof error === "string") {
        infoDialog = {
          title: "Error",
          contents: error,
        }
      } else {
        console.error(error)

        infoDialog = {
          title: "Unknown Error",
          contents: "Please, try again or contact the developer",
        }
      }
    })
  }
</script>

<div class="Settings column">
  <h1>Settings</h1>

  <section class="column">
    <h2>Data</h2>

    <div class="column SettingsButtonsList">
      <button
        type="button"
        on:click={() => {
          tryDo(importCards)
        }}>Import cards</button
      >
      <button
        type="button"
        on:click={() => {
          tryDo(exportCards)
        }}>Export cards</button
      >
      <button
        type="button"
        class="danger"
        on:click={() => {
          confirmRemovingAllCards = true
        }}>Remove all cards</button
      >
    </div>
  </section>

  <section class="column">
    <h2>About</h2>

    <ul class="column SettingsButtonsList">
      <li>
        <b>Version</b>: {version}
      </li>
      <li class="column">
        <a href={repository.url} target="_blank"> Source code </a>
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
      <h2 class="AlertTitle">Removing All Cards</h2>
      <p>
        All the cards will disappear from the app. Are you sure you want to
        continue?
      </p>

      <svelte:fragment slot="actions">
        <button
          type="button"
          class="danger filled"
          on:click={() => {
            $cards = []
            confirmRemovingAllCards = false
          }}>Yes, remove all cards</button
        >
        <button
          type="button"
          class="gray"
          on:click={() => {
            confirmRemovingAllCards = false
          }}>Cancel</button
        >
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

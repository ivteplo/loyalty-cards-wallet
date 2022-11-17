// Copyright (c) 2022 Ivan Teplov

import fs from "fs/promises"
import path from "path"
import url from "url"

const thisFile = url.fileURLToPath(import.meta.url)
const projectRoot = path.resolve(path.dirname(thisFile), "..")
const translationsFolder = path.join(projectRoot, "src/translations")
const referenceFile = "en.json"

const files = await fs.readdir(translationsFolder)
const translationFiles = files.filter(
  file => file.endsWith(".json") && file !== referenceFile
)

let anyProblems = false

const getAllKeys = object => {
  const keys = []

  for (const key in object) {
    if (typeof object[key] !== "object") {
      keys.push(key)
    } else {
      const childKeys = getAllKeys(object[key])
      keys.push(...childKeys.map(childKey => `${key}.${childKey}`))
    }
  }

  return keys
}

const getTranslationKeys = async (file) => {
  const contents = String(await fs.readFile(file))
  const json = JSON.parse(contents || "{}")
  return getAllKeys(json)
}

const referenceKeys =
  await getTranslationKeys(path.join(translationsFolder, referenceFile))

for (const file of translationFiles) {
  const keys = await getTranslationKeys(path.join(translationsFolder, file))
  const keysToAdd = new Set(referenceKeys)

  for (const key of keys) {
    if (keysToAdd.has(key)) {
      keysToAdd.delete(key)
    }
  }

  if (keysToAdd.size > 0) {
    anyProblems = true
    console.log(`File ${file} doesn't have these keys:`)

    for (const key of keysToAdd) {
      console.log(key)
    }

    console.log()
  }
}

if (anyProblems) {
  process.exit(1)
}

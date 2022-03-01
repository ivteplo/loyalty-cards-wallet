// Copyright (c) 2022 Ivan Teplov

const cacheName = "discountCardsWallet@1.0.3"
const filesToCache = [
  "index.html",
  "global.css",
  "build/bundle.css",
  "build/bundle.js",
  "icons/favicon.png",
]

const cacheKeeplist = [cacheName]

const log = function (message) {
  console.log("[Service worker]", message)
}

async function cacheBaseFiles() {
  // Open our cache
  const cache = await caches.open(cacheName)

  log("Caching base files")

  // Add files to cache
  await cache.addAll(filesToCache)
}

self.addEventListener("install", (event) => {
  log("Install")
  event.waitUntil(cacheBaseFiles())
})

async function deleteOldCaches() {
  // Get list of caches
  const keyList = await caches.keys()

  await Promise.all(
    // Iterate over caches
    keyList.map((key) => {
      // If cache should not be keeped
      if (cacheKeeplist.indexOf(key) === -1) {
        log("Deleting old cache: " + key)

        // Delete the cache
        return caches.delete(key)
      }
    })
  )
}

self.addEventListener("activate", (event) => {
  log("Activate")
  event.waitUntil(deleteOldCaches())
})

// Function called when the client makes a request
async function fetchRequest(request) {
  // Check if the requested file is cached
  let response = await caches.match(request)

  // If file isn't cached
  if (!response) {
    // Fetch the file
    response = await fetch(request)

    // Open our cache
    const cache = await caches.open(cacheName)
    // And save the response to the cache
    cache.put(request, response.clone())
  }

  // And finally, return our response
  return response
}

self.addEventListener("fetch", (event) => {
  log(`Fetch ${event.request.url}`)
  event.respondWith(fetchRequest(event.request))
})

self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting()
  }
})

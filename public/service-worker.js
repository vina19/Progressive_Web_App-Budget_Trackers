const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "/db.js",
  "/manifest.webmanifest",
  "/style.css",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
];

const CACHE_NAME = "static-cache-budget-tracker-v2";
const DATA_CACHE_NAME = "data-cache-budget-tracker-v1";

// install
self.addEventListener("install", function (evt) {
  // pre cache all static assets
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );

  // tell the browser to activate this service worker immediately once it
  // has finished installing
  self.skipWaiting();
});

// Activate the service worker and remove old data from the cache
self.addEventListener("activate", function (evt) {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

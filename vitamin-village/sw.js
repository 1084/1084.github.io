/* Vitamin Village — service worker
   ================================
   This tiny file is what lets the app work with NO internet once installed.
   It keeps a copy ("cache") of the app's files on the phone. When the app asks
   for a file, we hand back the cached copy instead of going to the network.

   IMPORTANT when you make changes: bump CACHE_NAME (v1 -> v2). That is how the
   phone knows to throw away the old copy and fetch your new one. If your edits
   "don't show up" on a phone, this is almost always why.
*/
const CACHE_NAME = "vitamin-village-v1";
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
];

// 1. On install: download and store every file in the list above.
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())
  );
});

// 2. On activate: delete any caches from older versions.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 3. On every request: serve the cached copy first, fall back to the network.
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(hit => hit || fetch(event.request))
  );
});

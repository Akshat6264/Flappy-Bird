const CACHE_NAME = 'offline-game-cache-v1';
const urlsToCache = [
  '/',
  'styles.css',
  'game.js',
  'Images/flappybird.png',
  'Images/toppipe.png',
  'Images/bottompipe.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Cache files
const cacheName = 'map-app-cache-v1'; // Add versioning to the cache name
const filesToCache = [
  './', // Correct the base path
  './SP1-2-floor-plan-5th-floor.jpg',
  './index.html', // Ensure paths are relative
  './styles.css', // Ensure paths are relative
  './app.js', // Ensure paths are relative
  './icon/SP1-2-floor-plan-5th-floor.jpg' // Ensure paths are relative
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        console.log('Opened cache', filesToCache);
        return cache.addAll(filesToCache);
      })
  );
});

// Fetch files from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('Cache hit', event.request.url);
          return response;
        }
        // No cache match - fetch from network
        console.log('Cache miss, fetching from network immediately', event.request.url);
        return fetch(event.request);
      })
      .catch((error) => {
        console.error('Error fetching resource:', error);
        // Handle errors gracefully
      })
  );
});


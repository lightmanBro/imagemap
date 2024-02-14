  // Cache files
  const cacheName = 'map-app-cache';
  const filesToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/icon/SP1-2-floor-plan-5th-floor.jpg'
  ];
  
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(cacheName)
        .then((cache) => {
          console.log('Opened cache');
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
            return response;
          }
          return fetch(event.request);
        })
    );
  });
  
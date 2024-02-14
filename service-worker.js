// service-worker.js

// Install service worker
self.addEventListener('install', (event) => {
    // Perform install steps
  });
  
  // Cache files
  const cacheName = 'my-cache';
  const filesToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/path/to/image.png'
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
  
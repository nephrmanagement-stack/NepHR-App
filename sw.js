const CACHE_NAME = 'nephr-offline-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// १. फाइलहरू मेमोरीमा सेभ गर्ने (Installation)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// २. पुरानो क्यास हटाउने (Activation)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// ३. इन्टरनेट नहुँदा मेमोरीबाट फाइल दिने (Fetch Interceptor)
self.addEventListener('fetch', (event) => {
  // Apps Script को URL लाई क्यास नगर्ने (किनकि त्यो Iframe हो)
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request) || caches.match('./index.html');
    })
  );
});

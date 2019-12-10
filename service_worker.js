// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v2';
const RUNTIME = 'runtime';

// clang-format off
// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  'logic/activity.js',
  'logic/local_datastore.js',
  'logic/recurrence.js',
  'logic/util.js',
  'views/activity_date_picker_element.js',
  'views/activity_editor_element.js',
  'views/activity_list_element.js',
  'views/activity_state_picker_element.js',
  'views/app_element.js',
  'views/data_loader_element.js',
  'views/recurrence_picker_element.js',
  'index.html',
  'style.css'
];
// clang-format on

importScripts(
    'https://unpkg.com/@material/mwc-checkbox@0.11.1/mwc-checkbox.js?module',
    'https://unpkg.com/@material/mwc-button@0.11.1/mwc-button.js?module',
    'https://unpkg.com/@material/mwc-textarea@0.11.1/mwc-textarea.js?module',
    'https://unpkg.com/@material/mwc-textfield?module',
    'https://unpkg.com/lit-element@2.2.1/lit-element.js?module',
);

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(caches.open(PRECACHE)
                      .then(cache => cache.addAll(PRECACHE_URLS))
                      .then(self.skipWaiting()));
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(caches.keys()
                      .then(cacheNames => {
                        return cacheNames.filter(
                            cacheName => !currentCaches.includes(cacheName));
                      })
                      .then(cachesToDelete => {
                        return Promise.all(cachesToDelete.map(cacheToDelete => {
                          return caches.delete(cacheToDelete);
                        }));
                      })
                      .then(() => self.clients.claim()));
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  event.respondWith(caches.match(event.request).then(async cachedResponse => {
    if (cachedResponse) {
      return cachedResponse;
    }
    const cache = await caches.open(RUNTIME);
    const response = await fetch(event.request);
    await cache.put(event.request, response.clone());
    return response;
  }));
});

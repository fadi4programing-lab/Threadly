const STATIC_CACHE = "clothes-store-static-v1";
const DYNAMIC_CACHE = "clothes-store-dynamic-v1";

const STATIC_ASSETS = [
  "/",
  "/products",
  "/login",
  "/register",
];

// Install: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network first, fallback to cache
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip API calls (let them fail naturally when offline)
  if (url.pathname.startsWith("/api/")) return;

  // Skip admin pages (always need fresh data)
  if (url.pathname.startsWith("/admin")) return;

  // Strategy: Network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response before caching
        const responseClone = response.clone();

        // Cache successful responses
        if (response.ok) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // If no cache, return offline page for navigation
          if (request.mode === "navigate") {
            return caches.match("/");
          }

          return new Response("Offline", { status: 503 });
        });
      })
  );
});

// Listen for messages from main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

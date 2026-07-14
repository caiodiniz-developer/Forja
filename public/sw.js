/*
 * Kill-switch service worker.
 *
 * This project ships NO service worker of its own. This file exists only to
 * neutralize a stale/rogue service worker that a previous project may have
 * registered on this same localhost origin (its broken `fetch` handler was
 * failing every request with "Failed to fetch", breaking API calls, uploads,
 * module creation, etc).
 *
 * The browser checks `/sw.js` for updates on navigation. Because these bytes
 * differ from the old worker, the browser installs THIS one, which:
 *   - intercepts nothing (there is no `fetch` listener → requests go straight
 *     to the network),
 *   - deletes every cache,
 *   - unregisters itself,
 *   - reloads open tabs so they run the real, up-to-date app.
 */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      } catch (e) {
        /* ignore */
      }
      try {
        await self.registration.unregister();
      } catch (e) {
        /* ignore */
      }
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })(),
  );
});

/* No `fetch` handler on purpose — this worker never intercepts requests. */

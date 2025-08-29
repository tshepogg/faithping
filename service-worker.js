// Basic cache-first SW for FaithPing PWA

const VERSION = "v1.0.2";

const CACHE = `faithping-${VERSION}`;
const ASSETS = [
  "./",
  "./index.html",
  "./verses.html",
  "./styles.css",
  "./app.js",
  "./verses.js",
  "./verses.json",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/logo.svg",
  "./privacy.html"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys
      .filter(k => k.startsWith("faithping-") && k !== CACHE)
      .map(k => caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(res => res || fetch(req).then(net => {
      // opportunistic cache for GETs
      if (req.method === "GET") {
        const clone = net.clone();
        caches.open(CACHE).then(c => c.put(req, clone)).catch(()=>{});
      }
      return net;
    }).catch(() => {
      // offline fallback for navigation
      if (req.mode === "navigate") return caches.match("./index.html");
      return new Response("Offline", { status: 503 });
    }))
  );
});

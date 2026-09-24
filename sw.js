// Service worker Kedai Jajanan AMEERA
// Ganti angka versi ini setiap kali mengubah file supaya aplikasi di HP ikut terbarui.
const VERSI = "ameera-v7";
const FILE = ["./", "./index.html", "./kasir.html", "./menu.js?v=7", "./toko.js?v=7", "./kasir.json", "./manifest.json", "./icon-192.png", "./icon-512.png", "./icon-maskable.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(FILE)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSI).map(k => caches.delete(k)))));
  self.clients.claim();
});

// Utamakan internet (supaya menu & harga selalu terbaru), pakai simpanan kalau offline
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then(res => { const salin = res.clone(); caches.open(VERSI).then(c => c.put(e.request, salin)); return res; })
      .catch(() => caches.match(e.request).then(r => r || (e.request.mode === "navigate" && !e.request.url.includes("kasir") ? caches.match("./index.html") : Response.error())))
  );
});

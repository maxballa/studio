// Prima la rete, poi la copia salvata: con internet l'app e i dati sono sempre aggiornati,
// senza internet si apre l'ultima versione scaricata.
var CACHE = 'studio-v1';
var BASE = ['./', 'index.html', 'app.css', 'app.js', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-180.png',
  'data/sessioni.json', 'data/orario.json', 'data/config.json', 'data/compiti.json'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(BASE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  var mia = url.origin === location.origin;
  var font = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!mia && !font) return;
  var chiave = mia ? new Request(url.origin + url.pathname) : e.request;
  e.respondWith(fetch(e.request).then(function (r) {
    if (r && (r.ok || r.type === 'opaque')) {
      var copia = r.clone();
      caches.open(CACHE).then(function (c) { c.put(chiave, copia); });
    }
    return r;
  }).catch(function () {
    return caches.match(chiave).then(function (r) { return r || caches.match('index.html'); });
  }));
});

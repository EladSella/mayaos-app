/* MayaOS Service Worker v1 */
const CACHE = 'mayaos-v1';
const PRECACHE = ['/', '/index.html', '/icon-192.png', '/icon-512.png', '/manifest.json'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => { const url = new URL(e.request.url); if (url.hostname.includes('googleapis.com') || url.hostname.includes('google.com')) return; e.respondWith(fetch(e.request).then(res => { if (res.ok && url.origin === self.location.origin) { caches.open(CACHE).then(c => c.put(e.request, res.clone())); } return res; }).catch(() => caches.match(e.request).then(r => r || caches.match('/')))); });
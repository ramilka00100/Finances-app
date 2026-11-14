// ⚠️ МЕНЯЙ VERSION КАЖДЫЙ РАЗ при обновлении сайта
const VERSION = 'v1.9.0';
const CACHE_NAME = 'finance-' + VERSION;
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json'
];

// === install: скачиваем файлы новой версии ===
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // НЕ вызываем skipWaiting() сразу — ждём подтверждения от пользователя
});

// === activate: удаляем старые кэши, захватываем контроль ===
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// === message: пользователь нажал "Обновить" ===
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// === fetch: cache-first + фоновое обновление (stale-while-revalidate) ===
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached || caches.match('./index.html'));

      return cached || network;
    })
  );
});
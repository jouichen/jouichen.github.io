const CACHE_NAME = 'brain-gym-v1';
// 這裡列出所有需要「離線下載」到手機裡的檔案清單
const ASSETS_TO_CACHE = [
  'index.html',
  'game_memory.html',
  'game_math.html',
  'game_reaction.html',
  'game_finger.html',
  'manifest.json'
];

// 安裝時：把所有網頁默默存進手機快取
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 啟用時：清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 當斷網時：攔截請求，改從手機快取拿檔案
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // 找到快取，直接離線使用
      }
      return fetch(event.request); // 沒找到，走一般網路
    })
  );
});

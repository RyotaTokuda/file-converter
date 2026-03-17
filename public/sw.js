// Service Worker - ローカルファイル変換
// アプリシェル（HTML・CSS・JS）をキャッシュしてオフラインでも表示できるようにする。
// ファイル変換処理自体はブラウザ内で完結するため、オフラインでも動作可能。

const CACHE_NAME = "file-converter-v1";

// インストール時：アプリシェルをキャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(["/", "/favicon.ico"])
    )
  );
  self.skipWaiting();
});

// アクティベート時：古いキャッシュを削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// フェッチ：ナビゲーションリクエストは Network First、静的アセットは Cache First
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 別オリジン（CDN等）はキャッシュしない
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    // ページナビゲーション：ネットワーク優先、失敗したらキャッシュを返す
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match("/"))
    );
  } else {
    // 静的アセット：キャッシュ優先、なければネットワーク
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
      )
    );
  }
});

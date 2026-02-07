const CACHE_NAME = 'al-isayi-legal-v1';
// قائمة الملفات الأساسية التي يجب أن تعمل بدون إنترنت
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/script.js',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// مرحلة التثبيت: حفظ الملفات في الذاكرة (Cache)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('جاري حفظ ملفات المنصة للعمل بدون إنترنت...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// مرحلة الاستجابة: جلب الملفات من الذاكرة إذا انقطع النت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // إذا وجد الملف في الذاكرة (Cache) يعرضه، وإلا يحاول جلبه من الشبكة
      return response || fetch(event.request).catch(() => {
        // إذا فشل النت ولم يجد الملف (مثل صفحة غير مخزنة)
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// مرحلة التنشيط: حذف النسخ القديمة من الذاكرة لضمان التحديث
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('حذف ملفات التخزين المؤقت القديمة');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

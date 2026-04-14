// Service Worker بسيط للسماح بالتثبيت (PWA)
const CACHE_NAME = 'trustera-v1';

self.addEventListener('install', (event) => {
    console.log('SW Installed');
});

self.addEventListener('fetch', (event) => {
    // نحتاجه ليكون PWA صالحاً حتى لو لم نقم بتخزين مؤقت للبيانات حالياً
    event.respondWith(fetch(event.request));
});
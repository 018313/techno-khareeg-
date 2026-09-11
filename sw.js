// تكنو خريج - V10.1 Service Worker - إشعارات ومكالمات في الخلفية
const CACHE_NAME = 'techno-khareeg-v10-1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  console.log('[SW] Install V10.1');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activate V10.1');
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // لا نعترض طلبات Firebase
  if (event.request.url.includes('firestore') || event.request.url.includes('firebase') || event.request.url.includes('googleapis')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});

// إشعارات المكالمات والرسائل في الخلفية
self.addEventListener('push', event => {
  console.log('[SW] Push received', event);
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch(e) { data = {title: 'تكنو خريج', body: event.data ? event.data.text() : 'إشعار جديد'}; }
  
  let title = data.title || 'تكنو خريج 📞';
  let options = {
    body: data.body || 'عندك إشعار جديد',
    icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || 'techno-call',
    renotify: true,
    requireInteraction: data.type === 'call',
    actions: data.type === 'call' ? [
      {action: 'answer', title: '📞 رد'},
      {action: 'reject', title: '📴 رفض'}
    ] : [
      {action: 'open', title: 'فتح'},
      {action: 'close', title: 'إغلاق'}
    ],
    data: data
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click', event.action);
  event.notification.close();
  
  let data = event.notification.data || {};
  
  if (event.action === 'reject') {
    // رفض المكالمة - نحدث Firebase من هنا؟ نسيبها للصفحة
    return;
  }
  
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(clientList => {
      // لو فيه تبويب مفتوح، ركز عليه
      for (let client of clientList) {
        if (client.url.includes('techno-khareeg') && 'focus' in client) {
          client.postMessage({action: event.action, data: data});
          return client.focus();
        }
      }
      // لو مفيش، افتح جديد
      if (clients.openWindow) {
        let url = './index.html';
        if (data.type === 'call') url += '?call=' + (data.callId || '');
        if (data.chatId) url += '#chat';
        return clients.openWindow(url);
      }
    })
  );
});

// رسائل من الصفحة الرئيسية للـ SW
self.addEventListener('message', event => {
  console.log('[SW] Message', event.data);
  if (event.data && event.data.type === 'SHOW_CALL_NOTIFICATION') {
    let d = event.data;
    self.registration.showNotification('📞 مكالمة واردة من ' + d.fromName, {
      body: (d.callType === 'video' ? '📹 مكالمة فيديو' : '📞 مكالمة صوتية') + ' - اضغط للرد',
      icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      vibrate: [300, 100, 300, 100, 300],
      tag: 'incoming-call-' + d.callId,
      requireInteraction: true,
      actions: [
        {action: 'answer', title: '📞 رد'},
        {action: 'reject', title: '📴 رفض'}
      ],
      data: d
    });
  }
  if (event.data && event.data.type === 'SHOW_MSG_NOTIFICATION') {
    let d = event.data;
    self.registration.showNotification('💬 ' + d.fromName, {
      body: d.text,
      icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      tag: 'msg-' + Date.now(),
      vibrate: [200, 100, 200]
    });
  }
});

// Background Sync - يحاول يصحى كل شوية
self.addEventListener('periodicsync', event => {
  if (event.tag === 'check-calls') {
    event.waitUntil(checkForCalls());
  }
});

async function checkForCalls() {
  console.log('[SW] Periodic check for calls');
  // هنا ممكن نعمل fetch لـ Firestore REST API لاحقاً
}

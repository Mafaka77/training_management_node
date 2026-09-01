// Scripts for Firebase App and Messaging in Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAHg19FihigMeBCWWtsxmyBUFb_GJI7PBU",
  authDomain: "ati-training-256e5.firebaseapp.com",
  projectId: "ati-training-256e5",
  storageBucket: "ati-training-256e5.firebasestorage.app",
  messagingSenderId: "302008020891",
  appId: "1:302008020891:web:3b46674b9a4cd81a13fb3e",
  measurementId: "G-8Y6X4PE16B"
};

// Initialize Firebase in Service Worker
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background push messages via Firebase Messaging
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || 'ATI Training Portal';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'You have a new update.',
    icon: payload.notification?.icon || '/favicon.ico',
    badge: '/favicon.ico',
    requireInteraction: true,
    data: {
      url: payload.data?.url || payload.fcmOptions?.link || payload.notification?.click_action || '/admin/dashboard',
      ...payload.data
    },
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Fallback native push event listener (wakes service worker even if Firebase SDK delays)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    console.log('[firebase-messaging-sw.js] Native push event:', payload);

    const title = payload.notification?.title || payload.data?.title || 'ATI Training Portal';
    const body = payload.notification?.body || payload.data?.body || '';
    const targetUrl = payload.data?.url || payload.notification?.click_action || '/admin/dashboard';

    const options = {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: true,
      data: { url: targetUrl, ...payload.data }
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.warn('[firebase-messaging-sw.js] Could not parse push data as JSON:', err);
  }
});

// Handle notification click to open or focus the target URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/admin/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if ('focus' in client) {
          if (client.url.includes('/admin')) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});


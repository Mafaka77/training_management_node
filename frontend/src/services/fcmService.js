import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "../config/firebase";
import api from "../api/axios";
import { useAlertStore } from "../store/alertStore";
import { useDashboardStore } from "../store/dashboardStore";

let currentToken = null;
let unsubscribeOnMessage = null;

export const requestNotificationPermissionAndGetToken = async (vapidKey = null) => {
  try {
    if (!("Notification" in window)) {
      console.warn("⚠️ [FCM] Notifications not supported in this browser.");
      return null;
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      console.warn("⚠️ [FCM] Firebase Messaging is not supported in this environment.");
      return null;
    }

    // Request browser permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("ℹ️ [FCM] Notification permission was not granted:", permission);
      return null;
    }

    // Register service worker if available
    let swRegistration = null;
    if ("serviceWorker" in navigator) {
      swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      console.log("✅ [FCM] Service worker registered successfully.");
    }

    const tokenOptions = {
      serviceWorkerRegistration: swRegistration || undefined,
    };
    if (vapidKey) {
      tokenOptions.vapidKey = vapidKey;
    }

    const token = await getToken(messaging, tokenOptions);

    if (token) {
      console.log("🔥 [FCM] Web Push Token acquired:", token);
      currentToken = token;

      // Register token with backend for current user
      try {
        await api.post("/fcm/register-token", {
          token,
          platform: "web",
        });
        console.log("✅ [FCM] Token registered with backend.");
      } catch (err) {
        console.error("❌ [FCM] Failed to register token with backend:", err);
      }

      return token;
    } else {
      console.warn("⚠️ [FCM] No registration token available.");
      return null;
    }
  } catch (error) {
    console.error("❌ [FCM] Error obtaining FCM token:", error);
    return null;
  }
};

export const setupForegroundNotificationListener = async (customCallback = null) => {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    if (unsubscribeOnMessage) {
      unsubscribeOnMessage();
    }

    unsubscribeOnMessage = onMessage(messaging, (payload) => {
      console.log("🔔 [FCM] Message received:", payload);
      
      const title = payload.notification?.title || payload.data?.title || "New Notification";
      const body = payload.notification?.body || payload.data?.body || "";
      const targetUrl = payload.data?.url || payload.fcmOptions?.link || "";

      // 1. Show In-App Banner/Toast
      const alertStore = useAlertStore();
      alertStore.info(`${title}: ${body}`);

      // 2. Trigger native OS/Browser notification banner if enabled
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          const browserNotif = new Notification(title, {
            body: body,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
            data: payload.data || {},
          });
          browserNotif.onclick = () => {
            window.focus();
            if (targetUrl) {
              window.location.href = targetUrl;
            }
          };
        } catch (e) {
          console.warn("⚠️ [FCM] Could not show native browser notification popup:", e.message);
        }
      }

      // 3. Refresh Dashboard notifications list in real-time
      try {
        const dashboardStore = useDashboardStore();
        dashboardStore.fetchNotification();
      } catch (e) {
        console.warn("⚠️ [FCM] Could not auto-refresh notifications list:", e.message);
      }

      if (typeof customCallback === "function") {
        customCallback(payload);
      }
    });

    return unsubscribeOnMessage;
  } catch (error) {
    console.error("❌ [FCM] Error setting up foreground listener:", error);
    return null;
  }
};

export const initFCM = async (vapidKey = null, onNotification = null) => {
  const token = await requestNotificationPermissionAndGetToken(vapidKey);
  if (token) {
    setupForegroundNotificationListener(onNotification);
  }
  return token;
};

export const deleteFCMToken = async () => {
  if (currentToken) {
    try {
      await api.post("/fcm/delete-token", { token: currentToken });
      console.log("✅ [FCM] Token removed from backend.");
      currentToken = null;
    } catch (err) {
      console.error("❌ [FCM] Failed to delete token:", err);
    }
  }
};

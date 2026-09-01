import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "../config/firebase";
import api from "../api/axios";
import { useAlertStore } from "../store/alertStore";

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
      console.log("🔔 [FCM] Foreground message received:", payload);
      
      const title = payload.notification?.title || payload.data?.title || "New Notification";
      const body = payload.notification?.body || payload.data?.body || "";
      
      const alertStore = useAlertStore();
      alertStore.info(`${title}: ${body}`);

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

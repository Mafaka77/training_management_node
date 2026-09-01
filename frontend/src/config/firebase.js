import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyAHg19FihigMeBCWWtsxmyBUFb_GJI7PBU",
  authDomain: "ati-training-256e5.firebaseapp.com",
  projectId: "ati-training-256e5",
  storageBucket: "ati-training-256e5.firebasestorage.app",
  messagingSenderId: "302008020891",
  appId: "1:302008020891:web:3b46674b9a4cd81a13fb3e",
  measurementId: "G-8Y6X4PE16B"
};

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Messaging if supported in current browser environment
export const getFirebaseMessaging = async () => {
  try {
    if (typeof window !== "undefined" && "Notification" in window && (await isSupported())) {
      return getMessaging(app);
    }
  } catch (error) {
    console.warn("⚠️ [FCM] Firebase messaging is not supported in this browser:", error.message);
  }
  return null;
};

export default app;


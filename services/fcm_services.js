const admin = require("firebase-admin");

function getMessaging() {
  if (!admin.apps.length) {
    throw new Error("Firebase Admin not initialized. Make sure index.js did admin.initializeApp(...)");
  }
  return admin.messaging();
}

module.exports = { getMessaging };

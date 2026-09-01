// services/push_service.js
const mongoose = require("mongoose");
const Token = require("../models/device_token_model");
const { getMessaging } = require("../services/fcm_services");

const FCM_MAX_TOKENS = 500;

function buildBaseMessage(title, body, icon, url) {
  const base = {
    notification: {
      title,
      body,
    },
    android: {
      priority: "high",
      notification: {
        title,
        body,
        channelId: "high_importance_channel",
        sound: "default"
      },
      ttl: 60 * 60 * 1000,
    },
    apns: {
      headers: { "apns-priority": "10" },
      payload: {
        aps: {
          alert: { title, body },
          sound: "default",
          contentAvailable: true
        }
      },
    },
    webpush: {
      headers: {
        Urgency: "high",
        TTL: "86400"
      },
      notification: {
        title,
        body,
        icon: icon || "/favicon.ico",
        requireInteraction: true
      },
      fcmOptions: {
        link: url || "/"
      }
    }
  };

  if (icon) {
    base.android.notification.icon = icon;
  }

  return base;
}

function toStringData(data = {}) {
  const out = {};
  for (const [k, v] of Object.entries(data)) out[k] = v == null ? "" : String(v);
  return out;
}

async function cleanupInvalidTokens(tokens, batchResponse) {
  const bad = [];
  batchResponse.responses.forEach((r, i) => {
    if (!r.success) {
      const code = r.error?.code || "";
      const msg = r.error?.message || "";
      if (/registration-token-not-registered|invalid-registration/i.test(code) || /registration-token-not-registered|invalid-registration/i.test(msg)) {
        bad.push(tokens[i]);
      }
    }
  });
  if (bad.length) await Token.deleteMany({ token: { $in: bad } });
  return bad.length;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Send push to all devices of a userId (ObjectId or string).
 * Returns { sent, failed, cleaned }
 */
async function sendPushToUser(userId, { title, body, data = {}, icon, url }) {
  if (!userId || !title || !body) {
    throw new Error("userId, title, body are required");
  }

  const userFilterId = mongoose.isValidObjectId(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;

  const docs = await Token.find({ user: userFilterId }).lean();
  if (!docs.length) return { sent: 0, failed: 0, cleaned: 0, skipped: true };

  const tokens = Array.from(new Set(docs.map(d => d.token)));
  const payloadData = { ...data };
  if (url) {
    payloadData.url = url;
  }
  const dataStr = toStringData(payloadData);
  const messaging = getMessaging();

  let sent = 0, failed = 0, cleaned = 0;
  for (const batch of chunk(tokens, FCM_MAX_TOKENS)) {
    const message = {
      ...buildBaseMessage(title, body, icon, url),
      tokens: batch,
      notification: { title, body },
      data: dataStr,
    };
    const resp = await messaging.sendEachForMulticast(message);
    resp.responses.forEach((r, i) => {
      if (!r.success) {
        const e = r.error;
        console.error(`[FCM] idx=${i} failed`, {
          code: e?.errorInfo?.code || e?.code,
          message: e?.message,
          details: e?.errorInfo, // often includes service response
        });
      }
    });
    sent += resp.successCount;
    failed += resp.failureCount;
    cleaned += await cleanupInvalidTokens(batch, resp);
  }
  return { sent, failed, cleaned };
}

async function sendPushToMultipleUsers(userIds, { title, body, data = {}, icon, url }) {
  if (!Array.isArray(userIds) || !title || !body) {
    throw new Error("userIds (array), title, body are required");
  }

  const validIds = userIds
    .filter(id => id)
    .map(id => mongoose.isValidObjectId(id) ? new mongoose.Types.ObjectId(id) : id);

  if (!validIds.length) return { sent: 0, failed: 0, cleaned: 0, skipped: true };

  const docs = await Token.find({ user: { $in: validIds } }).lean();
  if (!docs.length) {
    console.warn("⚠️ [push_service] No FCM device tokens registered in database for target users:", validIds.map(id => id.toString()));
    return { sent: 0, failed: 0, cleaned: 0, skipped: true };
  }

  const tokens = Array.from(new Set(docs.map(d => d.token)));
  console.log(`🚀 [push_service] Dispatching push notification to ${tokens.length} token(s) across ${validIds.length} user(s)...`);
  const payloadData = { ...data };
  if (url) {
    payloadData.url = url;
  }
  const dataStr = toStringData(payloadData);
  const messaging = getMessaging();

  let sent = 0, failed = 0, cleaned = 0;
  for (const batch of chunk(tokens, FCM_MAX_TOKENS)) {
    const message = {
      ...buildBaseMessage(title, body, icon, url),
      tokens: batch,
      data: dataStr,
    };
    const resp = await messaging.sendEachForMulticast(message);
    resp.responses.forEach((r, i) => {
      if (!r.success) {
        const e = r.error;
        console.error(`[FCM] idx=${i} failed`, {
          code: e?.errorInfo?.code || e?.code,
          message: e?.message,
          details: e?.errorInfo, // often includes service response
        });
      }
    });
    sent += resp.successCount;
    failed += resp.failureCount;
    cleaned += await cleanupInvalidTokens(batch, resp);
  }
  console.log(`✅ [push_service] Push dispatch result: ${sent} sent, ${failed} failed, ${cleaned} cleaned.`);
  return { sent, failed, cleaned };
}

module.exports = {
  sendPushToUser,
  sendPushToMultipleUsers,
  buildBaseMessage, // export if you need it elsewhere
};

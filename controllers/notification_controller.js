const mongoose = require("mongoose");
const Token = require("../models/device_token_model");
const { getMessaging } = require("../services/fcm_services");      // your helper
const STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
const FCM_MAX_TOKENS = 500;

function buildBaseMessage() {
  return {
    android: {
      priority: "high",
      notification: { channelId: "high_importance_channel", sound: "default" },
      ttl: 60 * 60 * 1000,
    },
    apns: {
      headers: { "apns-priority": "10" },
      payload: { aps: { sound: "default", contentAvailable: true } },
    },
  };
}

function toStringData(data = {}) {
  // FCM requires string values
  const out = {};
  for (const [k, v] of Object.entries(data)) out[k] = v == null ? "" : String(v);
  return out;
}

async function cleanupInvalidTokens(tokens, batchResponse) {
  const bad = [];
  batchResponse.responses.forEach((r, i) => {
    if (!r.success) {
      const msg = r.error?.message || "";
      if (/registration-token-not-registered|invalid-registration/i.test(msg)) {
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

exports.sendToUser = async function sendToUser(req, res) {
  try {
    const { userId, title, body, data } = req.body || {};
    if (!userId || !title || !body) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ error: "userId, title, body are required", status: STATUS.BAD_REQUEST });
    }

    // Optional: cast userId if your Token.user is ObjectId
    const userFilterId = mongoose.isValidObjectId(userId) ? new mongoose.Types.ObjectId(userId) : userId;

    const docs = await Token.find({ user: userFilterId }).lean();
    if (!docs.length) {
      return res
        .status(STATUS.OK)
        .json({ sent: 0, failed: 0, message: "No device tokens for user", status: STATUS.OK });
    }

    // dedupe tokens
    const tokens = Array.from(new Set(docs.map(d => d.token)));
    const dataStr = toStringData(data);

    const messaging = getMessaging();

    let totalSent = 0;
    let totalFailed = 0;
    let totalCleaned = 0;

    const batches = chunk(tokens, FCM_MAX_TOKENS);
    for (const batch of batches) {
      const message = {
        ...buildBaseMessage(),
        tokens: batch,
        notification: { title, body },
        data: dataStr,
      };

      const resp = await messaging.sendEachForMulticast(message);
      totalSent += resp.successCount;
      totalFailed += resp.failureCount;
      totalCleaned += await cleanupInvalidTokens(batch, resp);
    }

    return res
      .status(STATUS.OK)
      .json({ sent: totalSent, failed: totalFailed, cleaned: totalCleaned, status: STATUS.OK });
  } catch (e) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
  }
};

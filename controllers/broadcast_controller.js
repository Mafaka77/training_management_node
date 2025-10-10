const { getMessaging } = require("../services/fcm_services");
const STATUS=require('../utils/httpStatus')
function toStringData(data = {}) {
  const out = {};
  for (const [k, v] of Object.entries(data)) out[k] = v == null ? "" : String(v);
  return out;
}

exports.sendToAllUsers = async (req, res) => {
  try {
    const { title, body, data } = req.body || {};
    if (!title || !body) {
      return res.status(STATUS.OK).json({ error: "title and body are required" ,status:STATUS.BAD_GATEWAY});
    }

    const messaging = getMessaging();

    const resp = await messaging.send({
      topic: "all_users",
      notification: { title, body },
      data: toStringData(data),
      android: {
        priority: "high",
        notification: { channelId: "high_importance_channel", sound: "default" },
      },
      apns: {
        headers: { "apns-priority": "10" },
        payload: { aps: { sound: "default" } },
      },
    });

    return res.status(STATUS.OK).json({ messageId: resp ,status:STATUS.OK});
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

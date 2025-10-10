const mongoose = require("mongoose");
const { sendPushToUser } = require("../services/push_service");

const STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

exports.sendToUser = async(req, res) =>{
  try {
    const { userId, title, body, data } = req.body || {};
    if (!userId || !title || !body) {
      return res.status(STATUS.BAD_REQUEST).json({
        error: "userId, title, body are required",
        status: STATUS.BAD_REQUEST
      });
    }

    const result = await sendPushToUser(userId, { title, body, data });
    console.log(result.errors);
    // Log detailed failures once on server
    if (result.failed.length) {
      console.error("[FCM] failures:", result.errors.slice(0, 5)); // sample first few
    }

    return res.status(STATUS.OK).json({
      sent: result.sent,
      failed: result.failed,
      cleaned: result.cleaned,
      // optionally include errors; or omit in production
      errors: result.errors,
      status: STATUS.OK
    });
  } catch (e) {
    return res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ error: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
  }
};

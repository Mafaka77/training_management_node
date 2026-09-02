const mongoose = require("mongoose");
const { sendPushToUser, sendPushToMultipleUsers } = require("../services/push_service");
const Notification = require("../models/notification_model");
const Enrollment = require("../models/enrollment_model");
const DeviceToken = require("../models/device_token_model");
const TrainingProgram = require("../models/training_program_model");
const { getMessaging } = require("../services/fcm_services");
const STATUS = require("../utils/httpStatus");

function toStringData(data = {}) {
  const out = {};
  for (const [k, v] of Object.entries(data)) out[k] = v == null ? "" : String(v);
  return out;
}

// 1. Fetch paginated notification list with filters & search
exports.getNotifications = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", type = "All", target_type = "All" } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ];
    }

    if (type && type !== "All") {
      filter.type = type;
    }

    if (target_type && target_type !== "All") {
      filter.target_type = target_type;
    }

    const total = await Notification.countDocuments(filter);
    const notifications = await Notification.find(filter)
      .populate("recipient_id", "full_name email mobile")
      .populate("sender_id", "full_name email")
      .populate("training_program", "t_name t_code t_start_date t_end_date")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(STATUS.OK).json({
      status: STATUS.OK,
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      status: STATUS.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

// 2. Fetch FCM & Notification statistics
exports.getNotificationStats = async (req, res) => {
  try {
    const [totalNotifications, totalTokens, androidTokens, iosTokens, webTokens, broadcastCount] =
      await Promise.all([
        Notification.countDocuments(),
        DeviceToken.countDocuments(),
        DeviceToken.countDocuments({ platform: "android" }),
        DeviceToken.countDocuments({ platform: "ios" }),
        DeviceToken.countDocuments({ platform: "web" }),
        Notification.countDocuments({ target_type: "All" }),
      ]);

    return res.status(STATUS.OK).json({
      status: STATUS.OK,
      stats: {
        totalNotifications,
        totalTokens,
        androidTokens,
        iosTokens,
        webTokens,
        broadcastCount,
      },
    });
  } catch (error) {
    console.error("Error fetching notification stats:", error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      status: STATUS.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

// 3. Get summary of enrollees for a specific program
exports.getProgramEnrolleesSummary = async (req, res) => {
  try {
    const { programId } = req.params;
    const { status = "Approved" } = req.query;

    if (!mongoose.isValidObjectId(programId)) {
      return res.status(STATUS.BAD_REQUEST).json({
        status: STATUS.BAD_REQUEST,
        message: "Invalid training program ID",
      });
    }

    const filter = { training_program: programId };
    if (status && status !== "All") {
      filter.status = status;
    }

    const enrollments = await Enrollment.find(filter).select("user status").lean();
    const userIds = enrollments.map((e) => e.user);

    const tokens = await DeviceToken.find({ user: { $in: userIds } }).lean();
    const uniqueUsersWithTokens = new Set(tokens.map((t) => t.user.toString()));

    const program = await TrainingProgram.findById(programId).select("t_name t_code t_start_date t_end_date t_banner venue").lean();

    return res.status(STATUS.OK).json({
      status: STATUS.OK,
      data: {
        program,
        totalEnrolled: enrollments.length,
        usersWithTokens: uniqueUsersWithTokens.size,
        totalTokens: tokens.length,
        statusFilter: status,
      },
    });
  } catch (error) {
    console.error("Error getting program enrollees summary:", error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      status: STATUS.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

function parseExtraData(extraData) {
  if (!extraData) return {};
  if (typeof extraData === "string") {
    try {
      return JSON.parse(extraData);
    } catch (e) {
      return {};
    }
  }
  return typeof extraData === "object" ? extraData : {};
}

function resolveNotificationImage(req, fallbackPath = "") {
  let relativePath = "";
  if (req.file) {
    relativePath = `/uploads/${req.file.filename}`;
  } else if (req.body && (req.body.imageUrl || req.body.image_url || req.body.image)) {
    relativePath = req.body.imageUrl || req.body.image_url || req.body.image;
  } else if (fallbackPath) {
    relativePath = fallbackPath;
  }

  if (!relativePath) return { image_url: "", full_image_url: "" };

  let full_image_url = relativePath;
  if (!relativePath.startsWith("http://") && !relativePath.startsWith("https://")) {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
    const host = req.get("host") || "localhost:3000";
    full_image_url = `${protocol}://${host}${relativePath.startsWith("/") ? "" : "/"}${relativePath}`;
  }
  return { image_url: relativePath, full_image_url };
}

// 4. Send notification to enrolled users for a specific training program
exports.sendToProgram = async (req, res) => {
  try {
    const {
      programId,
      title,
      body,
      statusFilter = "Approved",
      target_url = "",
      type = "Training",
      extraData = {},
    } = req.body || {};

    if (!programId || !title || !body) {
      return res.status(STATUS.BAD_REQUEST).json({
        status: STATUS.BAD_REQUEST,
        message: "programId, title, and body are required",
      });
    }

    const program = await TrainingProgram.findById(programId);
    if (!program) {
      return res.status(STATUS.NOT_FOUND).json({
        status: STATUS.NOT_FOUND,
        message: "Training program not found",
      });
    }

    const filter = { training_program: programId };
    if (statusFilter && statusFilter !== "All") {
      filter.status = statusFilter;
    }

    const enrollments = await Enrollment.find(filter).select("user status").lean();
    const userIds = enrollments.map((e) => e.user.toString()).filter(Boolean);

    if (userIds.length === 0) {
      return res.status(STATUS.OK).json({
        status: STATUS.BAD_REQUEST,
        message: `No enrolled users found with status "${statusFilter}" for this training program.`,
      });
    }

    // Automatically use the program's saved database banner (program.t_banner) if no custom image was uploaded
    const { image_url, full_image_url } = resolveNotificationImage(req, program.t_banner || "");
    const resolvedTargetUrl = target_url || `/training-details/${programId}`;
    const parsedExtra = parseExtraData(extraData);

    const payloadData = {
      ...parsedExtra,
      programId: programId.toString(),
      type: type || "Training",
      url: resolvedTargetUrl,
      ...(full_image_url ? { image: full_image_url, imageUrl: full_image_url } : {}),
    };

    // Send push notification via FCM to all enrolled trainees with device tokens
    const pushResult = await sendPushToMultipleUsers(userIds, {
      title,
      body,
      url: resolvedTargetUrl,
      imageUrl: full_image_url,
      data: payloadData,
    });

    const senderId = req.user?.user?.id || req.user?.id || null;

    // 1. Create a parent/summary log record in Notification collection
    const notificationSummary = new Notification({
      sender_id: senderId,
      type: type || "Training",
      target_type: "Program",
      training_program: programId,
      title,
      message: body,
      target_url: resolvedTargetUrl,
      image_url: image_url || "",
      recipient_count: userIds.length,
      sent_count: pushResult.sent || 0,
      failed_count: pushResult.failed || 0,
      extra_data: payloadData,
    });
    await notificationSummary.save();

    // 2. Also insert individual in-app notification records for each recipient
    const recipientNotifications = userIds.map((userId) => ({
      recipient_id: userId,
      sender_id: senderId,
      type: type || "Training",
      target_type: "Program",
      training_program: programId,
      title,
      message: body,
      target_url: resolvedTargetUrl,
      image_url: image_url || "",
      is_read: true,
      extra_data: payloadData,
    }));

    if (recipientNotifications.length > 0) {
      Notification.insertMany(recipientNotifications).catch((err) =>
        console.error("Non-fatal: Failed to save recipient notification records:", err.message)
      );
    }

    return res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: `Notification dispatched to ${userIds.length} enrollees (${pushResult.sent} device pushes sent, ${pushResult.failed} failed)`,
      sent: pushResult.sent,
      failed: pushResult.failed,
      cleaned: pushResult.cleaned,
      totalRecipients: userIds.length,
    });
  } catch (error) {
    console.error("Error sending program notification:", error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      status: STATUS.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

// 5. Send notification to a single user
exports.sendToUser = async (req, res) => {
  try {
    const { userId, title, body, target_url = "", type = "General", extraData = {} } = req.body || {};
    if (!userId || !title || !body) {
      return res.status(STATUS.BAD_REQUEST).json({
        status: STATUS.BAD_REQUEST,
        message: "userId, title, and body are required",
      });
    }

    const { image_url, full_image_url } = resolveNotificationImage(req);
    const parsedExtra = parseExtraData(extraData);

    const payloadData = {
      ...parsedExtra,
      type: type || "General",
      url: target_url,
      ...(full_image_url ? { image: full_image_url, imageUrl: full_image_url } : {}),
    };

    const result = await sendPushToUser(userId, {
      title,
      body,
      url: target_url,
      imageUrl: full_image_url,
      data: payloadData,
    });

    const senderId = req.user?.user?.id || req.user?.id || null;

    const noti = new Notification({
      recipient_id: userId,
      sender_id: senderId,
      type: type || "General",
      target_type: "User",
      title,
      message: body,
      target_url: target_url || "",
      image_url: image_url || "",
      is_read: true,
      sent_count: result.sent || 0,
      failed_count: result.failed || 0,
      recipient_count: 1,
      extra_data: payloadData,
    });
    await noti.save();

    return res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: result.sent > 0 ? "Notification sent successfully" : "Push queued (No active device registered)",
      sent: result.sent,
      failed: result.failed,
      cleaned: result.cleaned,
    });
  } catch (e) {
    console.error("Error sending push to user:", e);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      status: STATUS.INTERNAL_SERVER_ERROR,
      message: e.message,
    });
  }
};

// 6. Broadcast notification to all users
exports.sendToAllUsers = async (req, res) => {
  try {
    const { title, body, target_url = "", type = "Broadcast", extraData = {} } = req.body || {};
    if (!title || !body) {
      return res.status(STATUS.BAD_REQUEST).json({
        status: STATUS.BAD_REQUEST,
        message: "title and body are required",
      });
    }

    const { image_url, full_image_url } = resolveNotificationImage(req);
    const parsedExtra = parseExtraData(extraData);

    const payloadData = {
      ...parsedExtra,
      type: type || "Broadcast",
      url: target_url,
      ...(full_image_url ? { image: full_image_url, imageUrl: full_image_url } : {}),
    };

    let pushSuccess = 0;
    let pushFailure = 0;

    // 1. Multicast to all active tokens in database
    const allTokensDocs = await DeviceToken.find().select("token").lean();
    const tokens = Array.from(new Set(allTokensDocs.map((d) => d.token)));

    if (tokens.length > 0) {
      const { buildBaseMessage } = require("../services/push_service");
      const messaging = getMessaging();

      const FCM_MAX_TOKENS = 500;
      for (let i = 0; i < tokens.length; i += FCM_MAX_TOKENS) {
        const batch = tokens.slice(i, i + FCM_MAX_TOKENS);
        try {
          const message = {
            ...buildBaseMessage(title, body, null, target_url, full_image_url),
            tokens: batch,
            notification: {
              title,
              body,
              ...(full_image_url ? { imageUrl: full_image_url } : {}),
            },
            data: toStringData(payloadData),
          };
          const resp = await messaging.sendEachForMulticast(message);
          pushSuccess += resp.successCount;
          pushFailure += resp.failureCount;
        } catch (fcmErr) {
          console.error("[FCM Broadcast Multicast Batch Error]:", fcmErr.message);
        }
      }
    } else {
      // Fallback: If no direct tokens in database, dispatch to "all_users" topic
      try {
        const messaging = getMessaging();
        const topicNotification = { title, body };
        if (full_image_url) {
          topicNotification.imageUrl = full_image_url;
        }
        const topicResp = await messaging.send({
          topic: "all_users",
          notification: topicNotification,
          data: toStringData(payloadData),
          android: {
            priority: "high",
            notification: {
              channelId: "high_importance_channel",
              sound: "default",
              ...(full_image_url ? { imageUrl: full_image_url } : {})
            },
          },
          apns: {
            headers: { "apns-priority": "10" },
            payload: {
              aps: {
                sound: "default",
                mutableContent: true,
                'mutable-content': 1
              }
            },
            ...(full_image_url ? { fcmOptions: { image: full_image_url } } : {})
          },
          webpush: {
            notification: {
              title,
              body,
              icon: "/favicon.ico",
              ...(full_image_url ? { image: full_image_url } : {})
            }
          }
        });
        if (topicResp) pushSuccess++;
      } catch (topicErr) {
        console.error("[FCM Topic Error]:", topicErr.message);
      }
    }

    const senderId = req.user?.user?.id || req.user?.id || null;

    const noti = new Notification({
      sender_id: senderId,
      type: type || "Broadcast",
      target_type: "All",
      title,
      message: body,
      target_url: target_url || "",
      image_url: image_url || "",
      recipient_count: tokens.length,
      sent_count: pushSuccess,
      failed_count: pushFailure,
      extra_data: payloadData,
    });
    await noti.save();

    return res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: `Broadcast sent to all devices (${pushSuccess} delivered)`,
      sent: pushSuccess,
      failed: pushFailure,
      recipientCount: tokens.length,
    });
  } catch (error) {
    console.error("Error sending broadcast notification:", error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      status: STATUS.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

// 7. Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(STATUS.NOT_FOUND).json({
        status: STATUS.NOT_FOUND,
        message: "Notification not found",
      });
    }
    return res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      status: STATUS.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

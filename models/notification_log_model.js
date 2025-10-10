const mongoose = require("mongoose");

const notificationLogSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g., "training-start-24h:TRAININGID:USERID:2025-09-29T08:00:00Z"
    type: { type: String, required: true },              // e.g., "training-start-24h"
    training: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingProgram", index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    scheduledFor: { type: Date, required: true },        // window time we intended to notify
    sentAt: { type: Date, default: Date.now },
    meta: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NotificationLog", notificationLogSchema);

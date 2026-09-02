const mongoose = require("mongoose");

const DeviceTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",       // 👈 reference to User model
      required: true,
      // index: true
    },
    token: { type: String, required: true, unique: true },
    platform: { type: String, enum: ["android", "ios", "web"], default: "android" },
    lastSeenAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Fast lookups by user
DeviceTokenSchema.index({ user: 1, platform: 1 });

module.exports = mongoose.model("DeviceToken", DeviceTokenSchema);

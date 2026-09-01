const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const cron = require("node-cron");
const admin = require("firebase-admin");

// Load Environment Variables
dotenv.config({
    path: path.join(__dirname, "../.env"),
});

// Connect to Database
const connectDB = require("../config/db");
connectDB();

// Initialize Firebase Admin for Notifications
const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, "../serviceAccount.json");
const absCredPath = path.isAbsolute(credPath) ? credPath : path.join(__dirname, "..", credPath);

if (fs.existsSync(absCredPath)) {
    if (!admin.apps.length) {
        const serviceAccount = JSON.parse(fs.readFileSync(absCredPath, "utf8"));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("🔥 [CRON] Firebase Admin initialized.");
    }
} else {
    console.warn(`⚠️ [CRON] Firebase service account not found at ${absCredPath}. FCM reminders may fail.`);
}

// Import Job Handlers
const sendTrainingReminderNotifications = require("./sendNotification");
const trainingsStatusUpdater = require("./training_jobs");
const { startBlacklistCronJobs } = require("./reset_blacklist_jobs");

function startAllCronJobs() {
    console.log("🕒 [CRON] Initializing Dedicated Cron Worker Process...");

    // 1. Midnight jobs (00:00 every day)
    cron.schedule("0 0 * * *", async () => {
        console.log("⏰ [CRON] Running daily midnight status & blacklist check...");
        await trainingsStatusUpdater();
        await startBlacklistCronJobs();
    });

    // 2. Morning reminder (06:00 every day)
    cron.schedule("0 6 * * *", async () => {
        console.log("⏰ [CRON] Running morning reminder notifications...");
        await sendTrainingReminderNotifications();
    });

    console.log("✅ [CRON] All cron jobs scheduled successfully and waiting for execution times (00:00 & 06:00).");
}

startAllCronJobs();

module.exports = { startAllCronJobs };
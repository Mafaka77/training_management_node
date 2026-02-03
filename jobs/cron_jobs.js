const path = require("path");
const cron = require("node-cron");
require("dotenv").config({
    path: path.join(__dirname, "../.env"),
});

console.log("✅ MONGO_URI =", process.env.MONGO_URI);

const connectDB = require("../config/db");
connectDB();
const startCleanupJob = require('../jobs/cleanupPendingEnrollments');
const sendTrainingReminderNotifications = require('../jobs/sendNotification');
const trainingsStatusUpdater = require('../jobs/training_jobs');

console.log("Reminder Stated Working");
cron.schedule("10 12 * * *", async () => {
    await startCleanupJob();
    await sendTrainingReminderNotifications();
    await trainingsStatusUpdater();
});
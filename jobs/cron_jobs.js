const path = require("path");
const cron = require("node-cron");
require("dotenv").config({
    path: path.join(__dirname, "../.env"),
});

console.log("✅ MONGO_URI =", process.env.MONGO_URI);

const connectDB = require("../config/db");
connectDB();
// const startCleanupJob = require('../jobs/cleanupPendingEnrollments');
const sendTrainingReminderNotifications = require('../jobs/sendNotification');
const trainingsStatusUpdater = require('../jobs/training_jobs');
const { startBlacklistCronJobs } = require('../jobs/reset_blacklist_jobs');

console.log("Reminder Stated Working");
cron.schedule("0 0 * * *", async () => {
    // await startCleanupJob();
    await trainingsStatusUpdater();
    await startBlacklistCronJobs();
});
cron.schedule("0 6 * * *", async () => {
    await sendTrainingReminderNotifications();
})
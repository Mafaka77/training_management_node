const cron=require('node-cron');
const dotenv = require('dotenv');
const connectDb=require('../config/db');

dotenv.config();
connectDb();
const {startCleanupJob} = require('../jobs/cleanupPendingEnrollments');
const {sendTrainingReminderNotifications} = require('../jobs/sendNotification');
const {trainingsStatusUpdater} = require('../jobs/training_jobs');

console.log("Reminder Stated Working");
cron.schedule("22 11 * * *", async () => {
    await startCleanupJob();
    await sendTrainingReminderNotifications();
    await trainingsStatusUpdater();
});
const cron=require('node-cron');
const dotenv = require('dotenv');
const connectDb=require('../config/db');

dotenv.config();
connectDb();
const {cleanupPendingEnrollments} = require('../jobs/cleanupPendingEnrollments');
const {sendTrainingReminderNotifications} = require('../jobs/sendNotification');
const {trainingsStatusUpdater} = require('../jobs/training_jobs');

console.log("Reminder Stated Working");
cron.schedule("45 10 * * *", async () => {
    await cleanupPendingEnrollments();
    await sendTrainingReminderNotifications();
    await trainingsStatusUpdater();
});
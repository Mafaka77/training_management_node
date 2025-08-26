// cronJobs.js
const cron = require("node-cron");
const TrainingProgram = require("../models/training_program_model");

function startCronJobs() {
    // Runs every day at midnight (00:00)
    cron.schedule("0 0 * * *", async () => {
        try {
            const today = new Date();

            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));

            // Update to Ongoing if start date is today
            await TrainingProgram.updateMany(
                { t_start_date: { $gte: startOfDay, $lte: endOfDay } },
                { $set: { t_status: "Ongoing" } }
            );

            // Update to Finished if end date already passed
            await TrainingProgram.updateMany(
                { t_end_date: { $lt: startOfDay } },
                { $set: { t_status: "Finished" } }
            );

            console.log(`[CRON] Training statuses updated at ${new Date().toISOString()}`);
        } catch (err) {
            console.error("[CRON] Error updating training statuses:", err.message);
        }
    });
}

module.exports = startCronJobs;

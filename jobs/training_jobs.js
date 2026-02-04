const TrainingProgram = require("../models/training_program_model");

async function startCronJobs() {
    try {
        console.log("⏳ [CRON] Updating Training Status...");

        const now = new Date();

        // ✅ Mark trainings as Ongoing
        await TrainingProgram.updateMany(
            {
                t_start_date: { $lte: now },
                t_end_date: { $gte: now },
            },
            { $set: { t_status: "Ongoing" } }
        );

        // ✅ Mark trainings as Finished
        await TrainingProgram.updateMany(
            {
                t_end_date: { $lt: now },
            },
            { $set: { t_status: "Completed" } }
        );

        // ✅ Mark trainings as Upcoming (optional)
        await TrainingProgram.updateMany(
            {
                t_start_date: { $gt: now },
            },
            { $set: { t_status: "Upcoming" } }
        );

        console.log("✅ [CRON] Training statuses updated successfully.");
    } catch (err) {
        console.error("❌ [CRON] Error updating training statuses:", err.message);
    }
}

module.exports = startCronJobs;

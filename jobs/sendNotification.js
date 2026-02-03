const moment = require("moment");
const TrainingProgram = require("../models/training_program_model");
const Enrollment = require("../models/enrollment_model");
const Token = require("../models/device_token_model");
const admin = require("firebase-admin");
const cron = require("node-cron");
async function sendTrainingReminderNotifications() {
        try {
            console.log("🔔 Running training reminder job...");

            // Tomorrow date range
            const startOfTomorrow = moment().add(1, "days").startOf("day").toDate();
            const endOfTomorrow = moment().add(1, "days").endOf("day").toDate();

            // 1. Find trainings starting tomorrow
            const trainings = await TrainingProgram.find({
                t_start_date: {
                    $gte: startOfTomorrow,
                    $lte: endOfTomorrow,
                },
            });

            if (!trainings.length) {
                console.log("✅ No trainings starting tomorrow.");
                return;
            }

            for (const training of trainings) {
                console.log("📌 Training Tomorrow:", training.t_name);

                // 2. Find approved enrollments
                const enrollments = await Enrollment.find({
                    training_program: training._id,
                    status: "Approved",
                });

                if (!enrollments.length) {
                    console.log("⚠️ No approved enrollments found.");
                    continue;
                }

                // 3. Extract user IDs
                const userIds = enrollments.map((e) => e.user);

                // 4. Get FCM tokens for those users
                const tokensData = await Token.find({
                    user: { $in: userIds },
                });

                const tokens = tokensData.map((t) => t.token);

                if (!tokens.length) {
                    console.log("⚠️ No FCM tokens found.");
                    continue;
                }

                // 5. Send Notification
                const message = {
                    notification: {
                        title: "📢 Training Reminder",
                        body: `Your training "${training.t_name}" starts tomorrow.`,
                    },
                    data: {
                        trainingId: training._id.toString(),
                        type: "training_reminder",
                    },
                    tokens: tokens,
                };

                const response = await admin.messaging().sendEachForMulticast(message);

                console.log(
                    `✅ Notification sent: ${response.successCount} success, ${response.failureCount} failed`
                );
            }
        } catch (error) {
            console.error("❌ Reminder Job Error:", error.message);
        }
}
module.exports=sendTrainingReminderNotifications;

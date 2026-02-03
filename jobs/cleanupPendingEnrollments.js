const cron=require('node-cron');
const Enrollment=require('../models/enrollment_model');
const TrainingProgram=require('../models/training_program_model');

async function startCleanupJob() {

        const now = new Date();

        const result = await Enrollment.deleteMany({
            status: "Pending",
            training_program: {
                $in: await TrainingProgram.find({t_end_date: {$lt: now}}).distinct("_id"),
            },
        });

        console.log("Deleted:", result.deletedCount);

}
module.exports=startCleanupJob;


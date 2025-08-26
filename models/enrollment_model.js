const mongoose= require('mongoose');
const enrollmentSchema = new mongoose.Schema({
    training_program: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingProgram", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Waitlisted"],
        default: "Pending",
    },

    enrolledAt: { type: Date, default: Date.now },
});
module.exports= mongoose.model("Enrollment", enrollmentSchema);
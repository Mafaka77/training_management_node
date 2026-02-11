const mongoose= require('mongoose');
const attendanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", required: true },
    sessionId:{type:mongoose.Schema.Types.ObjectId, ref: "TrainingCourse", required: true },
    trainingId: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingProgram", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent"], required: true ,default:"Absent"},
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
    notes: { type: String, required: false },
},{timestamps:true});
// At the bottom of your Attendance model file
attendanceSchema.index({ user: 1, sessionId: 1 }, { unique: true });
module.exports = mongoose.model('Attendance', attendanceSchema);
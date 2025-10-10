const mongoose= require('mongoose');
const attendanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", required: true },
    trainingId: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingProgram", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent"], required: true ,default:"Absent"},
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
    notes: { type: String, required: false },
},{timestamps:true});
attendanceSchema.index({ user: 1, training_program: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Attendance', attendanceSchema);
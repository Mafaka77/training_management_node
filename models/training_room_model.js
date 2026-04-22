const mongoose = require('mongoose');

const trainingRoomSchema = new mongoose.Schema({
    room_name: { type: String, required: true },
    room_no: { type: String },
    capacity: { type: Number },
    details: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrainingRoom', trainingRoomSchema);
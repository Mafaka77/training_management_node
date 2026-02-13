const mongoose = require('mongoose');

const trainingRoomSchema = new mongoose.Schema({
    room_name: { type: String, required: true },
    room_no: { type: String },
    capacity: { type: Number },
    details: { type: String },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude] !! IMPORTANT ORDER !!
            required: true,
        }
    },
    createdAt: { type: Date, default: Date.now }
});

// Create the 2dsphere index so distance queries are fast
trainingRoomSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('TrainingRoom', trainingRoomSchema);
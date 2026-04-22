const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    location_name: {
        type: String,
        required: false,
        default: "ATI Campus"
    },
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
    radius: {
        type: Number,
        required: false,
        default: 50
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
locationSchema.index({ location: "2dsphere" });
module.exports = mongoose.model('Location', locationSchema);
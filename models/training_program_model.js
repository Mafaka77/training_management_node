const mongoose = require('mongoose');
const trainingProgramSchema = new mongoose.Schema({
    t_name: {
        type: String,
        required: true,
        unique: true,

    },
    t_banner: {
        type: String,
        required: false,
    },
    t_description: {
        type: String,
        required: false,

    },
    t_start_date: {
        type: Date,
        required: true,
    },
    t_end_date: {
        type: Date,
        required: true,
    },
    t_duration: {
        type: Number, // Duration in days
        required: false
    },
    t_eligibility: {
        type: String,
        required: false,

    },
    t_organizer: {
        type: String,
        required: false
    },
    t_capacity: {
        type: Number,
        required: true,
        default: 0 // Default capacity if not specified
    },

    t_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingCategory',
        required: true
    },
    t_status: {
        type: String,
        enum: ["Draft", "Upcoming", "Ongoing", "Completed"], // allowed values
        default: "Draft" // optional default
    },
    t_room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingRoom',
        required: true
    },
    averageRating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

trainingProgramSchema.virtual('trainingCourse', {
    ref: 'TrainingCourse',
    localField: '_id',
    foreignField: 't_program',
})
trainingProgramSchema.set('toObject', { virtuals: true });
trainingProgramSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);
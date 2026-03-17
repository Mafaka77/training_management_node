const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    t_program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingProgram',
        required: true
    },
    trainee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Category 1: Course Content
    content_rating: {
        relevance: { type: Number, min: 1, max: 5, required: true },
        depth: { type: Number, min: 1, max: 5, required: true },
        materials: { type: Number, min: 1, max: 5, required: true }
    },
    // Category 2: Trainer/Instructor Performance
    trainer_rating: {
        knowledge: { type: Number, min: 1, max: 5, required: true },
        communication: { type: Number, min: 1, max: 5, required: true },
        punctuality: { type: Number, min: 1, max: 5, required: true }
    },
    // Category 3: Facilities & Logistics
    facility_rating: {
        room_comfort: { type: Number, min: 1, max: 5 },
        food_quality: { type: Number, min: 1, max: 5 },
        tech_support: { type: Number, min: 1, max: 5 }
    },
    // Open Ended Fields
    comments: {
        strengths: { type: String },
        improvements: { type: String },
        general_feedback: { type: String }
    },
    // Overall Score (can be calculated or explicitly asked)
    overall_score: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent a trainee from submitting feedback twice for the same program
feedbackSchema.index({ t_program: 1, trainee: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
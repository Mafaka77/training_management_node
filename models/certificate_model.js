const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    training_program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingProgram'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Draft', 'Pending_Director', 'Completed'],
        default: 'Draft'
    },
    course_director_signed_at: {
        type: Date,
        default: null
    },
    director_signed_at: {
        type: Date,
        default: null
    },
    temp_pdf_url: {
        type: String,
        default: ''
    },
    final_pdf_url: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Certificate', certificateSchema);
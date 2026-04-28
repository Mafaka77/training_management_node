const mongoose = require('mongoose');
const Counter = require('./counter_model'); // Import your Counter model

const certificateSchema = new mongoose.Schema({
    certificate_id: {
        type: String,
        unique: true
        // Removed required: true here because we will auto-generate it before saving
    },
    training_program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingProgram'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    file_name: {
        type: String,
        required: false,
    },
    certificate_url: {
        type: String,
        required: false,
    },
    signed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    is_signed: {
        type: Boolean,
        default: false
    },
    temp_session_key: {
        type: String,
        required: false,
    },
    reference_number: {
        type: String,
        required: false,
    }
}, { timestamps: true });

// === AUTO-INCREMENT PRE-SAVE HOOK ===
certificateSchema.pre('save', async function (next) {
    // Only generate the ID if this is a brand new certificate being created
    if (this.isNew) {
        try {
            const currentYear = new Date().getFullYear(); // e.g., 2026
            const counterName = `certificate_${currentYear}`;

            // findByIdAndUpdate with $inc is ATOMIC. It prevents race conditions.
            // upsert: true means if the counter doesn't exist (e.g., first cert of the year), it creates it.
            const counter = await Counter.findByIdAndUpdate(
                { _id: counterName },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            // Format: ATI2026/No.1
            this.certificate_id = `ATI${currentYear}/No.${counter.seq}`;

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model('Certificate', certificateSchema);
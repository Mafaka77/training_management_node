const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    type: {
        type: String,
        enum: ["Training", "Ticket", "Broadcast", "General", "Announcement", "Reminder"],
        default: "General"
    },
    target_type: {
        type: String,
        enum: ["All", "Program", "User"],
        default: "User"
    },
    training_program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TrainingProgram",
        required: false
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    target_url: {
        type: String,
        default: "",
    },
    is_read: {
        type: Boolean,
        default: false,
    },
    sent_count: {
        type: Number,
        default: 0
    },
    failed_count: {
        type: Number,
        default: 0
    },
    recipient_count: {
        type: Number,
        default: 1
    },
    extra_data: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
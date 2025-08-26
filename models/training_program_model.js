const mongoose= require('mongoose');
const trainingProgramSchema = new mongoose.Schema({
    t_name: {
        type: String,
        required: true,
        unique: true,

    },
    t_description: {
        type: String,
        required: false,

    },
    t_start_date:{
        type:Date,
        required:true,
    },
    t_end_date:{
        type:Date,
        required:true,
    },
    t_duration: {
        type: Number, // Duration in days
        required: false
    },
    t_eligibility: {
        type: String,
        required: false,

    },
    t_organizer:{
        type: String,
        required: false
    },
    t_capacity:{
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
        enum: ["Upcoming", "Ongoing", "Finished"], // allowed values
        default: "Upcoming" // optional default
    },
    t_room:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrainingRoom',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model('TrainingProgram', trainingProgramSchema);
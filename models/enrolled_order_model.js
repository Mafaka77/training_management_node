const mongoose = require("mongoose")

const EnrolledOrderSchema = new mongoose.Schema({
    training_program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TrainingProgram"
    },
    file_name: {
        type: String,
        required: false,
    },
    enrolled_order_url: {
        type: String,
        required: false,
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("EnrolledOrder", EnrolledOrderSchema)
const mongoose = require("mongoose");
const releaseOrderSchema = new mongoose.Schema({
    file_name: {
        type: String,
    },
    training_program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TrainingProgram",
    },
    release_order_url: {
        type: String,
        required: true
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
}, { timestamps: true })
module.exports = mongoose.model("ReleaseOrder", releaseOrderSchema);
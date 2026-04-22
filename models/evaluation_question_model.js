const mongoose = require("mongoose");

const evaluationQuestionSchema = new mongoose.Schema({
    question_text: { type: String, required: true },
    input_type: { type: String, required: true, enum: ['rating', 'text', 'boolean'], default: 'rating' },
    category: { type: String, required: true, enum: ['Course', 'Trainer'], default: 'Course' },
    is_mandatory: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("EvaluationQuestion", evaluationQuestionSchema);
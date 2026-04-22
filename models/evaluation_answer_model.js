const mongoose = require("mongoose");

const evaluationAnswerSchema = new mongoose.Schema({
    training_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TrainingProgram",
        required: true
    },
    trainee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    answers: [{
        _id: false,
        question_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "EvaluationQuestion",
            required: true
        },
        score: {
            type: Number,
            min: 0,
            max: 10,
        },
        text_answer: {
            type: String,
            trim: true
        },
        // 3. Optional comment (e.g., if they give a score of 5 and want to explain why)
        comment: String
    }],

    general_feedback: String,

}, { timestamps: true });

module.exports = mongoose.model("EvaluationAnswer", evaluationAnswerSchema);
const EvaluationQuestion = require('../../models/evaluation_question_model');
const EvaluationAnswer = require('../../models/evaluation_answer_model');
const status = require('../../utils/httpStatus');

exports.checkEvaluationStatus = async (req, res) => {
    try {
        const { training_id } = req.query;
        const trainee_id = req.user.user.id;
        const existingEvaluation = await EvaluationAnswer.findOne({
            training_id: training_id,
            trainee_id: trainee_id
        });
        if (existingEvaluation) {
            return res.status(status.OK).json({
                status: status.BAD_REQUEST,
                message: "Evaluation already submitted!",
            });
        }
        return res.status(status.OK).json({
            status: status.OK,
            message: "Evaluation not submitted!",
        });
    } catch (ex) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ status: status.INTERNAL_SERVER_ERROR, message: ex.message });
    }
}

exports.getEvaluationQuestions = async (req, res) => {
    try {
        const data = await EvaluationQuestion.find();
        return res.status(status.OK).json({ status: status.OK, data });
    } catch (ex) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ status: status.INTERNAL_SERVER_ERROR, message: ex.message });
    }
}

exports.submitEvaluation = async (req, res) => {
    try {
        const { training_id, answers } = req.body;
        const trainee_id = req.user.user.id;
        // 1. Validate the input
        if (!training_id || !answers || typeof answers !== 'object') {
            return res.status(status.OK).json({
                status: status.BAD_REQUEST,
                message: "Missing training_id or invalid ratings format."
            });
        }
        const existingEvaluation = await EvaluationAnswer.findOne({
            training_id: training_id,
            trainee_id: trainee_id
        });
        if (existingEvaluation) {
            return res.status(status.OK).json({
                status: status.BAD_REQUEST,
                message: "Evaluation already submitted!",
            });
        }
        const formattedAnswers = Object.entries(answers).map(([question_id, answer]) => {

            let calculatedScore = undefined;
            let calculatedText = null;
            if (typeof answer === 'number') {
                calculatedScore = answer;
            }
            else if (typeof answer === 'boolean') {
                calculatedScore = answer ? 10 : 0;
            }
            else if (typeof answer === 'string') {
                calculatedText = answer;
            }
            return {
                question_id: question_id,
                score: calculatedScore,
                text_answer: calculatedText
            };
        });
        const newEvaluation = new EvaluationAnswer({
            training_id: training_id,
            trainee_id: trainee_id,
            answers: formattedAnswers
        });
        await newEvaluation.save();
        return res.status(status.OK).json({
            status: status.CREATED,
            message: "Evaluation submitted successfully!",
        });

    } catch (error) {
        console.error("Error saving evaluation:", error);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            status: status.INTERNAL_SERVER_ERROR,
            message: error
        });
    }
};
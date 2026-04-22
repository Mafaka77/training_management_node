const EvaluationQuestion = require('../../models/evaluation_question_model');
const status = require('../../utils/httpStatus');
exports.createEvaluationQuestion = async (req, res) => {
    try {
        const { question_text, input_type, category, is_mandatory, is_active } = req.body;
        console.log(req.body);
        const evaluationQuestion = new EvaluationQuestion({
            question_text,
            input_type,
            is_mandatory,
            is_active
        });
        await evaluationQuestion.save();
        return res.status(status.OK).json({ status: status.CREATED, message: 'Evaluation question created successfully', evaluationQuestion });
    } catch (ex) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ status: status.INTERNAL_SERVER_ERROR, message: ex.message });
    }
}
exports.getAllEvaluationQuestions = async (req, res) => {
    try {
        const data = await EvaluationQuestion.find();
        return res.status(status.OK).json({ status: status.OK, message: 'Evaluation questions fetched successfully', data });
    } catch (ex) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ status: status.INTERNAL_SERVER_ERROR, message: ex.message });
    }
}

exports.deleteEvaluationQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        await EvaluationQuestion.findByIdAndDelete(id);
        return res.status(status.OK).json({ status: status.OK, message: 'Evaluation question deleted successfully' });
    } catch (ex) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ status: status.INTERNAL_SERVER_ERROR, message: ex.message });
    }
}

const EvaluationAnswer = require("../../models/evaluation_answer_model");
const status = require('../../utils/httpStatus');
const mongoose = require("mongoose");


exports.fetchEvaluationByTrainingId = async (req, res) => {
    const { trainingId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sortBy = req.query.sortBy || 'createdAt';

    try {
        const pipeline = [
            {
                $match: {
                    training_id: new mongoose.Types.ObjectId(trainingId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'trainee_id',
                    foreignField: '_id',
                    as: 'trainee'
                }
            },

            { $unwind: { path: '$trainee', preserveNullAndEmptyArrays: true } },
            {
                $sort: {
                    [sortBy]: sortOrder
                }
            },
            {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit }
                    ]
                }
            }
        ];

        const result = await EvaluationAnswer.aggregate(pipeline);
        const totalItems = result[0].metadata[0] ? result[0].metadata[0].total : 0;
        const responseData = result[0].data;

        return res.status(status.OK).json({
            status: status.OK,
            message: 'Evaluation answers fetched successfully',
            data: responseData,
            meta: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limit)
            }
        });

    } catch (ex) {
        console.error("Fetch Evaluations Error:", ex);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            status: status.INTERNAL_SERVER_ERROR,
            message: ex.message
        });
    }
}


exports.fetchEvaluationById = async (req, res) => {
    const { evaluationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(evaluationId)) {
        return res.status(status.BAD_REQUEST).json({
            status: status.BAD_REQUEST,
            message: "Invalid Evaluation ID format"
        });
    }

    try {
        const pipeline = [
            {
                $match: { _id: new mongoose.Types.ObjectId(evaluationId) }
            },
            // 1. Join Trainee Details
            {
                $lookup: {
                    from: 'users',
                    localField: 'trainee_id',
                    foreignField: '_id',
                    as: 'trainee'
                }
            },
            { $unwind: { path: '$trainee', preserveNullAndEmptyArrays: true } },

            // 2. 🚨 NEW: Fetch all matching Questions for this evaluation 🚨
            {
                $lookup: {
                    from: 'evaluationquestions', // <-- VERIFY YOUR DB COLLECTION NAME HERE
                    localField: 'answers.question_id',
                    foreignField: '_id',
                    as: 'questionData'
                }
            }
        ];

        const results = await EvaluationAnswer.aggregate(pipeline);
        const evaluation = results[0];

        if (!evaluation) {
            return res.status(status.NOT_FOUND).json({
                status: status.NOT_FOUND,
                message: 'Evaluation not found'
            });
        }

        // 3. Map the question text cleanly into the answers array
        evaluation.answers = evaluation.answers.map(answer => {
            // Find the matching question document
            const matchedQuestion = evaluation.questionData.find(
                q => q._id.toString() === answer.question_id.toString()
            );

            return {
                ...answer,
                // Attach the text! (Change 'question_text' if your schema uses 'title' or 'question')
                question_text: matchedQuestion ? matchedQuestion.question_text : 'Unknown Question'
            };
        });

        // 4. Remove the raw questionData array to keep the API payload lightweight
        delete evaluation.questionData;

        return res.status(status.OK).json({
            status: status.OK,
            message: 'Evaluation details fetched successfully',
            data: evaluation,
        });

    } catch (error) {
        console.error("Fetch Evaluation Details Error:", error);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            status: status.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
}

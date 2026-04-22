
const TrainingProgram = require('../../models/training_program_model');
const User = require('../../models/user_model');
const mongoose = require("mongoose");
const STATUS = require('../../utils/httpStatus')

exports.getTraineeCertificateDetails = async (req, res) => {
    const { traineeId } = req.params;
    const { trainingId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(traineeId) || !mongoose.Types.ObjectId.isValid(trainingId)) {
        return res.status(STATUS.OK).json({
            status: STATUS.BAD_REQUEST,
            message: "Invalid Trainee ID or Training ID format"
        });
    }

    try {
        const [program, trainee] = await Promise.all([
            TrainingProgram.findById(trainingId).populate('t_category').populate('t_director').lean(),
            User.findById(traineeId).lean(),
        ]);

        if (!program) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Program not found"
            });
        }

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            data: {
                traineeId,
                trainee,
                program,
            }
        });

    } catch (ex) {
        console.error("Trainee Attendance Details Error:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: ex.message
        });
    }
}
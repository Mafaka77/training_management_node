const TrainingCategory= require('../../models/training_category_model');
const STATUS= require('../../utils/httpStatus');
//TRAINING CATEGORY-----------------------------------------------

exports.createTrainingCategory= async (req, res) => {
    const { name, description } = req.body;

    try {
        if (!name) {
            return res.status(STATUS.OK).json({ message: "Please fill all required fields", status: STATUS.BAD_REQUEST });
        }

        const existingCategory = await TrainingCategory.findOne({ name });

        if (existingCategory) {
            return res.status(STATUS.OK).json({ message: "Training category with same name already exists", status: STATUS.CONFLICT });
        }

        const category = new TrainingCategory({
            name,
            description,
        });

        await category.save();
        return res.status(STATUS.OK).json({ message: "Training category created successfully", status: STATUS.CREATED });

    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
exports.getTrainingCategory= async (req, res) => {
    try {
        const categories = await TrainingCategory.find();
        return res.status(STATUS.OK).json({ categories, status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
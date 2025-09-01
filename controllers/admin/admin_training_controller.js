const TrainingProgram= require('../../models/training_program_model');
const TrainingCategory= require('../../models/training_category_model');
const User= require('../../models/user_model');
const Role= require('../../models/role_model');
const STATUS=require('../../utils/httpStatus');


//TRAINING PROGRAM-----------------------------------------------------------------------------------
exports.getTraining = async (req, res) => {
    try {
        // Query params
        let { page = 1, limit = 10, search = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        // Build search filter
        const filter = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" }; // search by program name
        }

        // Get total count for pagination
        const total = await TrainingProgram.countDocuments(filter);

        // Fetch paginated data
        const programs = await TrainingProgram.find(filter)
            .populate("t_category", "name")
            .populate("t_room", "room_name")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 }); // optional: latest first

        return res.status(STATUS.OK).json({
            programs,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            status: STATUS.OK,
        });
    } catch (e) {
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
};

exports.submitTrainingProgram= async (req, res) => {
    const { t_name, t_description, t_start_date, t_end_date, t_duration, t_eligibility,t_category ,t_capacity,t_organizer,t_room} = req.body;

    try {
        if (!t_name ||!t_start_date||!t_end_date||!t_category||!t_room) {
            return res.status(STATUS.OK).json({ message: "Please fill all required fields" ,status:STATUS.BAD_REQUEST});
        }

        const existingTraining = await TrainingProgram.findOne({ t_name });

        if (existingTraining) {
            return res.status(STATUS.OK).json({ message: "Training with same name already exists" ,status:STATUS.CONFLICT});
        }

        const program = new TrainingProgram({
            t_name,
            t_description,
            t_start_date,
            t_end_date,
            t_duration,
            t_eligibility,
            t_organizer,
            t_capacity,
            t_category ,
            t_room,
        });

        await program.save();
        return res.status(STATUS.OK).json({ message: "Training created successfully" ,status:STATUS.CREATED});

    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message ,status:STATUS.INTERNAL_SERVER_ERROR});
    }
}



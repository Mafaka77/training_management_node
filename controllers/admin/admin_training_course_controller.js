const TrainingCourse= require('../../models/training_course_model');
const STATUS= require('../../utils/httpStatus');
const User= require('../../models/user_model');
const Role= require('../../models/role_model');


//TRAIINING COURSE----------------------
exports.getTrainer= async (req, res) => {
    try {
        const trainerRole = await Role.findOne({ name: "Trainer" });
        console.log(trainerRole);
        const trainers = await User.find({ roles: trainerRole._id})
            .select("full_name email mobile roles")
            .populate("roles", "name"); // optional: show role name
        return res.status(STATUS.OK).json({ trainers, status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.OK).json({ error: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}



exports.submitTrainingCourse = async (req, res) => {
    const { tc_topic, tc_description, tc_start_time, tc_end_time, tc_session, t_program, trainer, qrVersion, } = req.body;

    try {
        if (!tc_topic || !tc_start_time || !tc_end_time || !t_program || !trainer) {
            return res.status(STATUS.OK).json({ error: "Please fill all required fields" ,status:STATUS.BAD_REQUEST});
        }

        const existingCourse = await TrainingCourse.findOne({ tc_topic });

        if (existingCourse) {
            return res.status(STATUS.OK).json({ error: "Training Course with same topic already exists" ,status:STATUS.CONFLICT});
        }

        const course = new TrainingCourse({
            tc_topic,
            tc_description,
            tc_start_time,
            tc_end_time,
            tc_session,
            t_program,
            trainer,
            qrVersion
        });

        await course.save();
        return res.status(STATUS.OK).json({ message: "Training Course created successfully" ,status:STATUS.CREATED});

    } catch (e) {
        return res.status(STATUS.OK).json({ error: e.message ,status:STATUS.INTERNAL_SERVER_ERROR});
    }
}
exports.getAllTrainingCourse = async (req, res) => {
    try {
        // pagination params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // search param
        const search = req.query.search || "";

        // build search filter
        const searchFilter = search
            ? {
                $or: [
                    { course_name: { $regex: search, $options: "i" } },   // assuming you have course_name field
                    { course_description: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        // total count
        const total = await TrainingCourse.countDocuments(searchFilter);

        // fetch courses
        const courses = await TrainingCourse.find(searchFilter)
            .skip(skip)
            .limit(limit)
            .populate("t_program", "t_name")
            .populate("trainer", "full_name email mobile roles")
            .populate({
                path: "t_program",
                populate: { path: "t_room", select: "room_name" } // nested populate
            });

        return res.status(STATUS.OK).json({
            total,
            page,
            pages: Math.ceil(total / limit),
            courses,
            status: STATUS.OK
        });

    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            error: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
};

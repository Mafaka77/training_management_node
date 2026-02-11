const TrainingCourse= require('../../models/training_course_model');
const STATUS= require('../../utils/httpStatus');
const User= require('../../models/user_model');
const Role= require('../../models/role_model');


//TRAIINING COURSE----------------------
exports.getTrainer= async (req, res) => {
    try {
        const trainerRole = await Role.findOne({ name: "Trainer" });
        const trainers = await User.find({ roles: trainerRole._id})
            .select("full_name email mobile roles")
            .populate("roles", "name"); // optional: show role name
        return res.status(STATUS.OK).json({ trainers, status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}



exports.submitTrainingCourse = async (req, res) => {
    const { tc_topic, tc_description, tc_start_time, tc_end_time, tc_session, t_program, trainer, qrVersion,tc_date } = req.body;
    function parseIsoToDate(value) {
        if (!value) return null;
        const cleaned = value.toString().trim();
        const d = new Date(cleaned);
        return isNaN(d.getTime()) ? null : d;
    }

    const date= parseIsoToDate(tc_date);
    const start =   tc_start_time;
    const end = tc_end_time;

    if (!start || !end) {
        return res.status(STATUS.OK).json({ status: STATUS.BAD_REQUEST, message: 'Invalid start/end time'});
    }

    try {
        if (!tc_topic || !tc_start_time || !tc_end_time || !t_program ) {
            return res.status(STATUS.OK).json({ message: "Please fill all required fields" ,status:STATUS.BAD_REQUEST});
        }

        const existingCourse = await TrainingCourse.findOne({ tc_topic });

        if (existingCourse) {
            return res.status(STATUS.OK).json({ message: "Session with same topic already exists" ,status:STATUS.CONFLICT});
        }
        const conflictCourse = await TrainingCourse.findOne({
            tc_date: date,
            tc_start_time: { $lt: end },
            tc_end_time: { $gt: start }
        });

        if (conflictCourse) {
            return res.status(STATUS.OK).json({
                message: "Session already exists in this time slot",
                status: STATUS.CONFLICT
            });
        }
        const course = new TrainingCourse({
            tc_topic,
            tc_description,
            tc_date:date,
            tc_start_time:start,
            tc_end_time:end,
            tc_session,
            t_program,
            trainer,
            qrVersion
        });

        await course.save();
        return res.status(STATUS.OK).json({ message: "Session created successfully" ,status:STATUS.CREATED});

    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message ,status:STATUS.INTERNAL_SERVER_ERROR});
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
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
};
exports.getCoursesByProgramId = async (req, res) => {
    const { programId } = req.params;
    try {
        const courses = await TrainingCourse.find({t_program: programId})
            .populate("t_program")
            .populate("trainer", "full_name email mobile")
        return res.status(STATUS.OK).json({
            courses,
            status: STATUS.OK
        });
    }catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
};
exports.deleteTrainingCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await TrainingCourse.findById(courseId);
        if (!course) {
            return res.status(STATUS.OK).json({ message: "Session not found", status: STATUS.NOT_FOUND });
        }
        await TrainingCourse.findByIdAndDelete(courseId);
        return res.status(STATUS.OK).json({ message: "Session deleted successfully", status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
exports.getCourseById = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await TrainingCourse.findById(courseId)
            .populate("t_program")
            .populate("trainer", "full_name email mobile roles")
        return res.status(STATUS.OK).json({
            course,
            status: STATUS.OK
        });
    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
},

exports.updateCourse = async (req, res) => {
    const { courseId } = req.params; // Assuming ID is passed in the URL
    const { tc_topic, tc_description, tc_start_time, tc_end_time, tc_session, t_program, trainer, qrVersion, tc_date } = req.body;
    function parseIsoToDate(value) {
        if (!value) return null;
        const cleaned = value.toString().trim();
        const d = new Date(cleaned);
        return isNaN(d.getTime()) ? null : d;
    }

    const date = parseIsoToDate(tc_date);
    const start = tc_start_time;
    const end = tc_end_time;

    // 1. Basic Validation
    if (!start || !end) {
        return res.status(STATUS.OK).json({ status: STATUS.BAD_REQUEST, message: 'Invalid start/end time' });
    }

    if (!tc_topic || !tc_start_time || !tc_end_time || !t_program) {
        return res.status(STATUS.OK).json({ message: "Please fill all required fields", status: STATUS.BAD_REQUEST });
    }

    try {
        // 2. Conflict Check (Overlap Logic)
        // We check for conflicts but EXCLUDE the current course ID ($ne: id)
        const conflictCourse = await TrainingCourse.findOne({
            _id: { $ne: courseId }, // This is the crucial line for updates
            tc_date: date,
            tc_start_time: { $lt: end },
            tc_end_time: { $gt: start }
        });

        if (conflictCourse) {
            return res.status(STATUS.OK).json({
                message: "Another session already exists in this time slot",
                status: STATUS.CONFLICT
            });
        }

        // 3. Perform Update
        const updatedCourse = await TrainingCourse.findByIdAndUpdate(
            courseId,
            {
                tc_topic,
                tc_description,
                tc_date: date,
                tc_start_time: start,
                tc_end_time: end,
                tc_session,
                t_program,
                trainer,
                qrVersion
            },
            { new: true } // Returns the updated document
        );

        if (!updatedCourse) {
            return res.status(STATUS.OK).json({ message: "Course not found", status: STATUS.NOT_FOUND });
        }

        return res.status(STATUS.OK).json({ 
            message: "Session updated successfully", 
            status: STATUS.OK, // Or STATUS.OK depending on your preference
            data: updatedCourse 
        });

    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
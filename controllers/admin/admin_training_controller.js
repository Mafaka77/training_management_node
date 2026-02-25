const TrainingProgram = require('../../models/training_program_model');
const TrainingCourse = require('../../models/training_course_model');
const TrainingCategory = require('../../models/training_category_model');
const User = require('../../models/user_model');
const Role = require('../../models/role_model');
const STATUS = require('../../utils/httpStatus');
const Group = require('../../models/group_model');
const { parse, startOfDay } = require('date-fns');
const mongoose = require("mongoose");
function parseDateFlexible(val) {
    if (val === undefined || val === null || val === '') return null;
    let d;
    if (typeof val === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val.trim())) {
        d = parse(val.trim(), 'dd/MM/yyyy', new Date());
    }
    else {
        d = new Date(val);
    }

    if (!d || isNaN(d.getTime())) return null;
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}
//TRAINING PROGRAM-----------------------------------------------------------------------------------
exports.getTraining = async (req, res) => {
    try {
        let { page = 1, limit = 4, search = "", status = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const filter = {};
        const user = req.user.user;
        const userRoles = user.roles || [];
        const roleList = Array.isArray(userRoles) ? userRoles : [userRoles];
        // LOGIC: Filter by Director ID ONLY if they have the Director role 
        // AND they don't have the Admin role (who should see everything).
        if (roleList.includes('Director')) {
            filter.t_director = user.id;
        }

        if (search) {
            filter.t_name = { $regex: search, $options: "i" };
        }

        if (status && status !== "All") {
            filter.t_status = status;
        }

        const total = await TrainingProgram.countDocuments(filter);
        const programs = await TrainingProgram.find(filter)
            .populate("t_category", "name")
            .populate("t_room", "room_name")
            .populate("t_eligibility", "group_name")
            .populate("t_director", "full_name")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

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
exports.submitTrainingProgram = async (req, res) => {
    const { t_name, t_description, t_start_date, t_end_date, t_duration, t_eligibility, t_category, t_capacity, t_organizer, t_room, t_banner, t_director } = req.body;

    try {
        if (t_start_date === undefined || t_end_date === undefined || t_start_date === '' || t_end_date === '') {
            return res.status(STATUS.OK).json({ error: 't_start_date and t_end_date are required', status: STATUS.BAD_REQUEST });
        }
        const start = parseDateFlexible(t_start_date);
        const end = parseDateFlexible(t_end_date);
        if (!start || !end) {
            return res.status(STATUS.OK).json({ error: 'Invalid date format for t_start_date or t_end_date', status: STATUS.BAD_REQUEST });
        }

        if (end.getTime() < start.getTime()) {
            return res.status(STATUS.OK).json({ error: 't_end_date cannot be earlier than t_start_date', status: STATUS.BAD_REQUEST });
        }
        if (!t_name || !t_start_date || !t_end_date || !t_category || !t_room) {
            return res.status(STATUS.OK).json({ message: "Please fill all required fields", status: STATUS.BAD_REQUEST });
        }

        const existingTraining = await TrainingProgram.findOne({ t_name });

        if (existingTraining) {
            return res.status(STATUS.OK).json({ message: "Training with same name already exists", status: STATUS.CONFLICT });
        }
        const program = new TrainingProgram({
            t_name,
            t_description,
            t_start_date: start,
            t_end_date: end,
            t_duration,
            t_eligibility,
            t_organizer,
            t_capacity,
            t_category,
            t_room,
            t_director,
            t_banner: `/uploads/${req.file.filename}`
        });

        await program.save();
        return res.status(STATUS.OK).json({ message: "Training created successfully", status: STATUS.CREATED });

    } catch (e) {
        console.log(e);
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}

exports.updateTrainingProgram = async (req, res) => {
    const { programId } = req.params;
    const updateData = { ...req.body };
    console.log("Request Body:", req.body);
    try {
        const trainingProgram = await TrainingProgram.findById(programId);
        if (!trainingProgram) {
            return res.status(STATUS.NOT_FOUND).json({ message: "Not found", status: STATUS.NOT_FOUND });
        }

        // 1. Handle Dates
        ['t_start_date', 't_end_date'].forEach(field => {
            if (updateData[field]) {
                const parsed = parseDateFlexible(updateData[field]);
                if (!parsed) throw new Error(`Invalid date for ${field}`);
                trainingProgram[field] = parsed;
            }
        });

        // 2. Handle Eligibility (The Error Fix)
        if (updateData.t_eligibility) {
            let eligibility = updateData.t_eligibility;
            // Parse if it's a stringified JSON array from FormData
            if (typeof eligibility === 'string') eligibility = JSON.parse(eligibility);
            // Flatten in case it's nested like [['id1', 'id2']]
            trainingProgram.t_eligibility = Array.isArray(eligibility) ? eligibility.flat() : [eligibility];
        }
        if (req.file) {
            trainingProgram.t_banner = `/uploads/${req.file.filename}`;
        }
        const simpleFields = ['t_name', 't_description', 't_duration', 't_category', 't_capacity', 't_organizer', 't_room', 't_director', 't_status'];
        simpleFields.forEach(field => {
            if (updateData[field] !== undefined) trainingProgram[field] = updateData[field];
        });

        await trainingProgram.save();
        return res.status(STATUS.OK).json({ message: "Updated successfully", status: STATUS.OK });

    } catch (e) {
        console.error(e);
        const statusCode = e.message.includes('Invalid date') ? STATUS.BAD_REQUEST : STATUS.INTERNAL_SERVER_ERROR;
        return res.status(statusCode).json({ message: e.message, status: statusCode });
    }
}

exports.getTrainingById = async (req, res) => {


    try {
        const { programId } = req.params;
        console.log(programId);
        const trainingProgram = await TrainingProgram.findById(programId)
            .populate("t_room")
            .populate("trainingCourse")
            .populate("t_director")
            .populate("t_category");

        if (!trainingProgram) {
            return res.status(STATUS.OK).json({ message: "Training Program not found", status: STATUS.NOT_FOUND });
        }
        return res.status(STATUS.OK).json({ training: trainingProgram, status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }

};
exports.deleteTrainingProgram = async (req, res) => {
    const { programId } = req.params;
    try {
        const trainingProgram = await TrainingProgram.findById(programId);
        if (!trainingProgram) {
            return res.status(STATUS.OK).json({ message: "Training Program not found", status: STATUS.NOT_FOUND });
        }
        await TrainingCourse.deleteMany(programId);
        await TrainingProgram.findByIdAndDelete(programId);
        return res.status(STATUS.OK).json({ message: "Training Program deleted successfully", status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find().select('-__v').lean();
        return res.status(STATUS.OK).json({ groups, status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
exports.getTrainingDirectors = async (req, res) => {
    try {
        const trainerRole = await Role.findOne({ name: "Director" });
        const directors = await User.find({ roles: trainerRole._id })
            .select("full_name email mobile roles")
            .populate("roles", "name"); // optional: show role name
        return res.status(STATUS.OK).json({ data: directors, status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
exports.updateStatus = async (req, res) => {
    try {
        const { programId } = req.params;
        const program = await TrainingProgram.findById(programId);
        if (!program) {
            return res.status(STATUS.OK).json({
                message: "Training not found",
                status: STATUS.NOT_FOUND
            });
        }
        program.t_status = 'Upcoming'
        await program.save();
        return res.status(STATUS.OK).json({
            message: "Training status updated successfully",
            status: STATUS.OK
        });
    } catch (ex) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: ex.message,
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
}
exports.getEnrollmentsByProgram = async (req, res) => {
    try {
        let { programId } = req.params;
        let {
            page = 1,
            limit = 10,
            search = "",
            sortOrder = "desc",
            status = ""
        } = req.query;

        page = Math.max(1, parseInt(page));
        limit = parseInt(limit);
        console.log(req.query);
        const pipeline = [
            {
                $match: {
                    training_program: new mongoose.Types.ObjectId(programId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'trainingprograms',
                    localField: 'training_program',
                    foreignField: '_id',
                    as: 'training_program'
                }
            },
            { $unwind: { path: '$training_program', preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    ...(status && status !== 'All' ? { status: status } : {}),
                    ...(search ? {
                        $or: [
                            { "user.full_name": { $regex: search, $options: "i" } },
                            { "training_program.t_name": { $regex: search, $options: "i" } }
                        ]
                    } : {})
                }
            }
        ];
        const countResult = await mongoose.model('Enrollment').aggregate([
            ...pipeline,
            { $count: "total" }
        ]);
        const total = countResult.length > 0 ? countResult[0].total : 0;
        pipeline.push(
            { $sort: { createdAt: sortOrder === "desc" ? -1 : 1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
        );

        const enrollments = await mongoose.model('Enrollment').aggregate(pipeline);

        res.status(STATUS.OK).json({
            status: STATUS.OK,
            enrollments,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Aggregation Error:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Error fetching paginated enrollments"
        });
    }
}


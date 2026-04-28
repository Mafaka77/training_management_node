const TrainingProgram = require('../../models/training_program_model');
const TrainingCourse = require('../../models/training_course_model');
const TrainingCategory = require('../../models/training_category_model');
const Enrollment = require('../../models/enrollment_model');
const User = require('../../models/user_model');
const Role = require('../../models/role_model');
const STATUS = require('../../utils/httpStatus');
const Group = require('../../models/group_model');
const Notification = require('../../models/notification_model');
const { sendPushToUser } = require('../../services/push_service');
const { parse, startOfDay } = require('date-fns');
const mongoose = require("mongoose");
const axios = require('axios');
const { sendEmail } = require('../../services/mailer_services');
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
    const userId = req.user.user.id;
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
            t_director: t_director || userId,
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
        const trainerRole = await Role.findOne({ name: "Course Director" });
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
        const category = await TrainingCategory.find({ name: 'Mandatory' }).lean();
        const foundationCategoryId = category[0]._id;
        let isFoundation = false;
        const training = await TrainingProgram.findById(programId);
        if (training.t_category.toString() === foundationCategoryId.toString()) {
            isFoundation = true;
        }
        let {
            page = 1,
            limit = 10,
            search = "",
            sortOrder = "desc",
            status = ""
        } = req.query;

        page = Math.max(1, parseInt(page));
        limit = parseInt(limit);
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
            isFoundation,
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

exports.searchFoundationUsers = async (req, res) => {
    try {
        const { search } = req.query;

        const traineeRole = await Role.findOne({ name: "Trainee" });

        if (!traineeRole) {
            return res.status(STATUS.NOT_FOUND).json({
                message: "Trainee role not found in database",
                status: STATUS.NOT_FOUND
            });
        }

        let query = {
            mandatory_completion: false,
            roles: traineeRole._id
        };
        if (search) {

            query.$and = [
                {
                    $or: [
                        { full_name: { $regex: search, $options: "i" } },
                        { mobile: { $regex: search, $options: "i" } }
                    ]
                }
            ];
        }

        const users = await User.find(query)
            .select("full_name email roles department mobile")
            .limit(10)
            .populate("roles", "name")
            .lean();

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Foundation User Search Error:", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Failed to fetch foundation users",
            error: error.message
        });
    }
};
exports.getFoundationUsersByGroup = async (req, res) => {
    try {
        const { trainingId } = req.params;

        // Extract query parameters with defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'mandatoryCourseDueDate';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        const training = await TrainingProgram.findById(trainingId);

        if (!training) {
            return res.status(STATUS.NOT_FOUND).json({ message: "Training not found", status: STATUS.NOT_FOUND });
        }

        const eligibility = training.t_eligibility;
        const existingEnrollments = await Enrollment.find({ training_program: trainingId }).select("user").lean();
        const enrolledUserIds = existingEnrollments.map(enrollment => enrollment.user);

        // 1. Build the Database Query
        const dbQuery = {
            is_blacklisted: false,
            confirmation: 'Confirmed',
            mandatory_completion: false,
            group: { $in: eligibility },
            _id: { $nin: enrolledUserIds }
        };

        // Apply Search Filter (Name or Mobile)
        if (search) {
            dbQuery.$or = [
                { full_name: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } }
            ];
        }

        // 2. Fetch the filtered users
        const users = await User.find(dbQuery)
            .select("full_name department mobile date_of_entry_in_present_grade")
            .lean();

        // 3. Map to add the Due Date
        const mappedUsers = users.map(user => {
            let dueDate = null;

            if (user.date_of_entry_in_present_grade) {
                const entryDate = new Date(user.date_of_entry_in_present_grade);
                dueDate = new Date(entryDate);
                dueDate.setFullYear(entryDate.getFullYear() + 2);
            }

            return {
                ...user,
                mandatoryCourseDueDate: dueDate
            };
        });

        // 4. Apply Sorting
        mappedUsers.sort((a, b) => {
            // Special handling for the calculated date field
            if (sortBy === 'mandatoryCourseDueDate') {
                if (!a.mandatoryCourseDueDate) return 1; // Always push nulls to the bottom
                if (!b.mandatoryCourseDueDate) return -1;
                return (a.mandatoryCourseDueDate - b.mandatoryCourseDueDate) * sortOrder;
            }

            // Generic string/number sorting for other fields (e.g., full_name, department)
            const valA = a[sortBy] || '';
            const valB = b[sortBy] || '';

            if (valA < valB) return -1 * sortOrder;
            if (valA > valB) return 1 * sortOrder;
            return 0;
        });

        // 5. Apply Pagination (Slice the array)
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedUsers = mappedUsers.slice(startIndex, endIndex);

        // 6. Return standard paginated payload
        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            data: paginatedUsers,
            pagination: {
                totalRecords: mappedUsers.length,
                currentPage: page,
                totalPages: Math.ceil(mappedUsers.length / limit),
                limit: limit
            }
        });

    } catch (error) {
        console.error("Error fetching foundation users by group:", error);
        return res.status(500).json({ message: "Internal server error", status: 500 });
    }
}

exports.enrollInTraining = async (req, res) => {
    const { trainingId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(trainingId) || !mongoose.Types.ObjectId.isValid(userId)) {
        // Note: It's better practice to use res.status(STATUS.BAD_REQUEST) here rather than OK
        return res.status(STATUS.OK).json({ message: "Invalid ID provided", status: STATUS.BAD_REQUEST });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(STATUS.OK).json({ message: "User not found", status: STATUS.NOT_FOUND });
        }

        if (user.is_blacklisted) {
            const now = new Date();
            const isCurrentlyBlocked = (!user.blacklist_details.end_date || now <= user.blacklist_details.end_date) &&
                (!user.blacklist_details.start_date || now >= user.blacklist_details.start_date);

            if (isCurrentlyBlocked) {
                return res.status(STATUS.OK).json({
                    message: `Trainee is blacklisted until ${user.blacklist_details.end_date?.toLocaleDateString()}. Reason: ${user.blacklist_details.reason}`,
                    status: STATUS.FORBIDDEN
                });
            }
        }

        const training = await TrainingProgram.findById(trainingId);
        if (!training) {
            return res.status(STATUS.OK).json({ message: "Training not found", status: STATUS.NOT_FOUND });
        }

        if (training.t_eligibility && training.t_eligibility.length > 0) {
            if (!user.group) {
                return res.status(STATUS.OK).json({
                    message: "This training is restricted to specific groups. Please update your profile.",
                    status: STATUS.FORBIDDEN
                });
            }

            const isEligible = training.t_eligibility.some(groupId => groupId.equals(user.group));
            if (!isEligible) {
                return res.status(STATUS.OK).json({
                    message: "You are not eligible for this training based on your group.",
                    status: STATUS.FORBIDDEN
                });
            }
        }

        if (training.t_status !== 'Upcoming') {
            return res.status(STATUS.OK).json({ message: "Enrollment is only allowed for upcoming trainings", status: STATUS.FORBIDDEN });
        }

        const currentEnrollments = await Enrollment.countDocuments({ training_program: trainingId, status: 'Approved' });
        if (currentEnrollments >= training.t_capacity) {
            return res.status(STATUS.OK).json({ message: "Training capacity reached", status: STATUS.BAD_REQUEST });
        }

        const existingEnrollment = await Enrollment.findOne({ training_program: trainingId, user: userId });
        if (existingEnrollment) {
            return res.status(STATUS.OK).json({ message: "Trainee already enrolled in this training", status: STATUS.CONFLICT });
        }
        const newEnrollment = new Enrollment({
            training_program: trainingId,
            user: userId,
            status: 'Approved'
        });
        await newEnrollment.save();


        // SMS Notification
        try {
            const startDate = training.t_start_date.toLocaleDateString();
            const templateId = '1407177545223617029';
            const message = `ATI a training turin thlan i ni a, Dt. ${startDate} 09:30 AM ah ATI Reception ah in report tura hriattir i ni e. EGOVMZ`;

            await axios.get("https://sms.msegs.in/api/send-sms", {
                headers: { 'Authorization': `Bearer ${process.env.SMS_TOKEN}` },
                params: {
                    template_id: templateId,
                    message: message,
                    recipient: user.mobile // <-- Fixed: was just 'mobile' previously
                }
            });
        } catch (smsError) {
            console.error("Failed to send SMS:", smsError.message);
        }

        // Admin Notification
        try {
            const adminNotification = new Notification({
                sender_id: req.user.user.id,
                type: "Training",
                title: "New Enrollment Request",
                message: `${user.full_name} applied for ${training.t_name}`,
                target_url: `/admin/training/enrollment/${newEnrollment._id}`,
                is_read: false
            });
            await adminNotification.save();
        } catch (notifError) {
            console.error("Non-fatal error: Failed to save Admin Notification:", notifError.message);
        }

        // Push Notification
        try {
            // Assuming sendPushToUser returns a Promise
            await sendPushToUser(userId, {
                title: "Enrollment",
                body: `You have been enrolled in ${training.t_name}.`,
            });
        } catch (pushError) {
            console.error("Non-fatal error: Failed to send Push Notification:", pushError.message);
        }
        try {
            await sendEmail(user.email, "Enrollment", `You have been enrolled in ${training.t_name}.`);
        } catch (ex) { }

        // --- 3. RETURN SUCCESS ---
        // Even if the side effects above fail, the user gets a success response!
        return res.status(STATUS.OK).json({
            message: "Enrolled successfully",
            enrollment: newEnrollment,
            status: STATUS.CREATED
        });

    } catch (e) {
        console.error("Fatal Enrollment Error:", e);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
}

exports.getTraineeEnrollmentHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const enrollments = await Enrollment.find({ user: userId })
            .populate("training_program", "t_name")
            .sort({ createdAt: -1 })
            .lean();
        if (enrollments.length === 0) {
            return res.status(STATUS.OK).json({
                status: STATUS.NO_CONTENT,
                data: []
            });
        }
        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            data: enrollments
        });
    } catch (ex) {
        console.error("Error fetching trainee enrollment history:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
}
exports.getEnrollmentDetails = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const enrollment = await Enrollment.findById(enrollmentId)
            .populate("training_program", "t_name t_start_date t_end_date")
            .populate("user")
            .lean();
        if (!enrollment) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                data: null
            });
        }
        const userHistory = await Enrollment.find({
            user: new mongoose.Types.ObjectId(enrollment.user._id),
            status: 'Approved'
        }).populate("training_program");
        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            enrollment,
            userHistory
        });
    } catch (ex) {
        console.error("Error fetching enrollment details:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
}
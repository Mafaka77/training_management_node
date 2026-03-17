const User = require('../../models/user_model');
const STATUS = require('../../utils/httpStatus');
const Role = require("../../models/role_model");
const bcrypt = require("bcryptjs");

exports.getAllTrainee = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;

        page = Math.max(1, parseInt(page));
        limit = parseInt(limit);
        const traineeRole = await Role.findOne({ name: "Trainee" });
        if (!traineeRole) {
            return res.status(STATUS.OK).json({ trainees: [], status: STATUS.NOT_FOUND });
        }
        const query = { roles: traineeRole._id };
        if (search) {
            query.$or = [
                { full_name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobile: { $regex: search, $options: "i" } },
                { department: { $regex: search, $options: "i" } }
            ];
        }
        const [total, trainees] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .populate('district', 'name')
                .populate('group', 'group_name')
                .select("-password -__v")
                .sort({ _id: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(STATUS.OK).json({
            success: true,
            trainees,
            pagination: {
                total,
                page,
                limit,
                totalPages: totalPages || 1,
            },
            status: STATUS.OK,
        });
    } catch (e) {
        console.log(e);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR,
        });
    }
};

exports.createTrainee = async (req, res) => {
    try {
        // 1. Destructure groups from req.body
        const { full_name, email, mobile, password, department, district, group, gender, mandatory_completion } = req.body;

        // Basic validation
        if (!full_name || !email || !mobile || !password) {
            return res.status(STATUS.OK).json({
                message: "All fields are required",
                status: STATUS.BAD_REQUEST,
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(STATUS.OK).json({
                message: "User with this email already exists",
                status: STATUS.CONFLICT,
            });
        }

        const role = await Role.findOne({ name: "Trainee" });
        if (!role) {
            return res.status(STATUS.OK).json({
                message: "Trainee role not found in database",
                status: STATUS.NOT_FOUND,
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Create new trainee with groups array
        const newTrainee = new User({
            full_name,
            gender,
            email,
            mobile,
            department,
            district,
            mandatory_completion: mandatory_completion || false,
            password: hashedPassword,
            roles: [role._id], // Roles is usually an array in your model
            group: group || null, // Assign the Group ID
        });

        await newTrainee.save();
        return res.status(STATUS.OK).json({
            message: "Trainee created successfully",
            status: STATUS.CREATED,
        });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR,
        });
    }
}

exports.getTraineeById = async (req, res) => {
    try {
        const trainee = await User.findById(req.params.traineeId).populate('district').populate('group');
        if (!trainee) {
            return res.status(STATUS.OK).json({
                message: "Trainee not found",
                status: STATUS.NOT_FOUND,
            });
        }
        return res.status(STATUS.OK).json({
            trainee,
            status: STATUS.OK,
        });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR,
        });
    }
}
exports.blacklistTrainee = async (req, res) => {
    try {
        const trainee = await User.findById(req.params.traineeId);

        if (!trainee) {
            return res.status(STATUS.OK).json({
                message: "Trainee not found",
                status: STATUS.NOT_FOUND,
            });
        }
        if (req.body.revoke === true) {
            trainee.is_blacklisted = false;
            trainee.blacklist_details = {
                reason: null,
                end_date: null
            };
            await trainee.save();
            return res.status(STATUS.OK).json({
                message: "Trainee restriction revoked successfully",
                status: STATUS.OK,
            });
        }
        trainee.is_blacklisted = true;
        trainee.blacklist_details = {
            reason: req.body.reason,
            end_date: req.body.end_date,
            created_at: new Date()
        };
        await trainee.save();
        return res.status(STATUS.OK).json({
            message: "Trainee blacklisted successfully",
            status: STATUS.OK,
        });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR,
        });
    }
}
exports.updateTrainee = async (req, res) => {
    try {
        const trainee = await User.findById(req.params.traineeId);

        if (!trainee) {
            return res.status(STATUS.OK).json({
                message: "Trainee not found",
                status: STATUS.NOT_FOUND,
            });
        }
        trainee.full_name = req.body.full_name;
        trainee.email = req.body.email;
        trainee.mobile = req.body.mobile;
        trainee.department = req.body.department;
        trainee.designation = req.body.designation;
        trainee.district = req.body.district;
        trainee.group = req.body.group;
        trainee.gender = req.body.gender;
        trainee.mandatory_completion = req.body.mandatory_completion;
        await trainee.save();
        return res.status(STATUS.OK).json({
            message: "Trainee updated successfully",
            status: STATUS.OK,
        });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR,
        });
    }
}



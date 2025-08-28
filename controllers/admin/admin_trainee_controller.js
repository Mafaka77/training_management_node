const User=require('../../models/user_model');
const STATUS=require('../../utils/httpStatus');
const Role = require("../../models/role_model");
const bcrypt = require("bcryptjs");

exports.getAllTrainee = async (req, res) => {
    try {
        // Get pagination params from query string
        let { page = 1, limit = 10, search = "" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        // Build filter (with optional search by name/email/mobile)
        const filter = { role: 'Trainee' };

        if (search) {
            filter.$or = [
                { full_name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobile: { $regex: search, $options: "i" } }
            ];
        }

        // Count total documents
        const total = await User.countDocuments(filter);

        // Fetch paginated data
        const trainees = await User.find(filter)
            .select("-password -__v") // exclude sensitive fields
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(STATUS.OK).json({
            trainees,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            status: STATUS.OK,
        });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            error: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR,
        });
    }
};

exports.createTrainee = async (req, res) => {
    try {
        const { full_name, email, mobile, password ,department,district} = req.body;

        // Basic validation
        if (!full_name || !email || !mobile || !password) {
            return res.status(STATUS.OK).json({
                error: "All fields are required",
                status: STATUS.BAD_REQUEST,
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(STATUS.OK).json({
                error: "User with this email already exists",
                status: STATUS.CONFLICT,
            });
        }
        const role = await Role.findOne({ name: "Trainee" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new trainee
        const newTrainee = new User({
            full_name,
            email,
            mobile,
            department,
            district,
            password:hashedPassword, // Assume password hashing middleware is in place
            roles:role._id,
        });

        await newTrainee.save();

        return res.status(STATUS.OK).json({
            message: "Trainee created successfully",
            trainee: newTrainee,
            status: STATUS.CREATED,
        });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            error: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR,
        });
    }
}


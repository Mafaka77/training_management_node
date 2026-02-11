const User=require('../../models/user_model');
const Role = require("../../models/role_model");
const STATUS = require("../../utils/httpStatus");
const bcrypt = require("bcryptjs");

exports.submitEmployee=async function(req, res){
    try {
        const trainerRole = await Role.findOne({ name: "Director" });
        const { full_name, email, mobile,password,district,department,designation } = req.body;

        if (!full_name || !email || !mobile) {
            return res.status(STATUS.OK).json({ message: "All fields are required", status: STATUS.BAD_REQUEST });
        }

        const existingTrainer = await User.findOne({ mobile,email });
        if (existingTrainer) {
            return res.status(STATUS.OK).json({ message: "Trainer already exists", status: STATUS.CONFLICT });
        }

        // 🔑 Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newTrainer = new User({
            full_name,
            email,
            mobile,
            password:hashedPassword,
            district,
            designation,
            department,
            roles: trainerRole._id
        });

        await newTrainer.save();

        return res.status(STATUS.OK).json({ message: "Employee created successfully", trainer: newTrainer, status: STATUS.CREATED });
    } catch (e) {
        console.log(e);
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}

exports.getEmployees=async function(req, res){
    try {
        // pagination
        const page = parseInt(req.query.page) || 1;   // default page = 1
        const limit = parseInt(req.query.limit) || 10; // default limit = 10
        const skip = (page - 1) * limit;

        // search keyword
        const search = req.query.search || "";

        // get trainer role
        const trainerRole = await Role.findOne({ name: "Director" });

        if (!trainerRole) {
            return res.status(STATUS.OK).json({
                message: "Director role not found",
                status: STATUS.NOT_FOUND,
            });
        }

        // build query
        const query = {
            roles: trainerRole._id,
            $or: [
                { full_name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobile: { $regex: search, $options: "i" } },
            ],
        };

        const trainers = await User.find(query)
            .select("-password -roles -__v")
            .populate("district", "name")
            .skip(skip)
            .limit(limit);

        // count total
        const total = await User.countDocuments(query);

        if (!trainers || trainers.length === 0) {
            return res.status(STATUS.OK).json({
                message: "No Employee found",
                status: STATUS.NOT_FOUND,
            });
        }

        return res.status(STATUS.OK).json({
            trainers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            status: STATUS.OK,
        });
    } catch (e) {
        return res
            .status(STATUS.OK)
            .json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
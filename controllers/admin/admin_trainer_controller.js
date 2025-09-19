const User= require('../../models/user_model');
const STATUS= require('../../utils/httpStatus');
const bcrypt = require("bcryptjs");
const Role= require("../../models/role_model");
const TrainerProfile= require("../../models/trainer_profile_model");

exports.createTrainer= async (req, res) => {
    try {
        const trainerRole = await Role.findOne({ name: "Trainer" });
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

        return res.status(STATUS.OK).json({ message: "Trainer created successfully", trainer: newTrainer, status: STATUS.CREATED });
    } catch (e) {
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}

exports.getAllTrainers = async (req, res) => {
    try {
        // pagination
        const page = parseInt(req.query.page) || 1;   // default page = 1
        const limit = parseInt(req.query.limit) || 10; // default limit = 10
        const skip = (page - 1) * limit;

        // search keyword
        const search = req.query.search || "";

        // get trainer role
        const trainerRole = await Role.findOne({ name: "Trainer" });

        if (!trainerRole) {
            return res.status(STATUS.OK).json({
                message: "Trainer role not found",
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

        // fetch trainers with pagination
        const trainers = await User.find(query)
            .select("-password -roles -__v")
            .populate("district", "name")
            .populate("trainerProfile")
            .skip(skip)
            .limit(limit);

        // count total
        const total = await User.countDocuments(query);

        if (!trainers || trainers.length === 0) {
            return res.status(STATUS.OK).json({
                message: "No trainers found",
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
};
exports.deleteTrainer = async (req, res) => {
    try {
        const { trainerId } = req.params;

        // Check if user exists
        const user = await User.findById(trainerId);
        if (!user) {
            return res
                .status(STATUS.NOT_FOUND)
                .json({ message: "Trainer not found", status: STATUS.NOT_FOUND });
        }

        // Delete trainer profile if exists
        await TrainerProfile.findOneAndDelete({ user_id: trainerId });

        // Delete trainer user
        await User.findByIdAndDelete(trainerId);

        return res
            .status(STATUS.OK)
            .json({ message: "Trainer deleted successfully", status: STATUS.OK });
    } catch (e) {
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
};

exports.getTrainerById = async (req, res) => {
    try {
        const { trainerId } = req.params;

        // Check if user exists
        const user = await User.findById(trainerId);
       if (!user) {
           return res.status(STATUS.OK).json({
               message: "Trainer not found",
               status: STATUS.NOT_FOUND,
           });
       }

       return res.status(STATUS.OK).json({
           user,
           status: STATUS.OK,
       });
   } catch (e) {
       return res
           .status(STATUS.INTERNAL_SERVER_ERROR)
           .json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
   }
};

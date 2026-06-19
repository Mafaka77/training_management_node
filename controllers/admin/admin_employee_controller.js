const User = require('../../models/user_model');
const Role = require("../../models/role_model");
const STATUS = require("../../utils/httpStatus");
const bcrypt = require("bcryptjs");

exports.submitEmployee = async function (req, res) {
    try {

        const { full_name, email, mobile, password, district, department, designation, trainer, director, signature, course_director } = req.body;
        console.log(full_name)
        const rolesToAssign = [];
        const baseRole = await Role.findOne({ name: "Employee" });
        if (baseRole) rolesToAssign.push(baseRole._id);

        if (trainer === true || trainer === 'true') {
            const trainerRole = await Role.findOne({ name: "Trainer" });
            if (trainerRole) {
                rolesToAssign.push(trainerRole._id);
            }
        }
        if (director === true || director === 'true') {
            const directorRole = await Role.findOne({ name: "Director" });
            if (directorRole) {
                rolesToAssign.push(directorRole._id);
            }
        }
        if (course_director === true || course_director === 'true') {
            const courseDirectorRole = await Role.findOne({ name: "Course Director" });
            if (courseDirectorRole) {
                rolesToAssign.push(courseDirectorRole._id);
            }
        }
        if (!full_name || !email || !mobile) {
            return res.status(STATUS.OK).json({ message: "All fields are required", status: STATUS.BAD_REQUEST });
        }

        const existingTrainer = await User.findOne({ mobile, email });
        if (existingTrainer) {
            return res.status(STATUS.OK).json({ message: "Trainer already exists", status: STATUS.CONFLICT });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newTrainer = new User({
            full_name,
            email,
            mobile,
            password: hashedPassword,
            district,
            designation,
            department,
            signature: req.file ? `/uploads/${req.file.filename}` : undefined,
            roles: rolesToAssign
        });

        await newTrainer.save();

        return res.status(STATUS.OK).json({ message: "Employee created successfully", trainer: newTrainer, status: STATUS.CREATED });
    } catch (e) {
        console.log(e);
        return res.status(STATUS.OK).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}

exports.getEmployees = async function (req, res) {
    try {
        // pagination
        const page = parseInt(req.query.page) || 1;   // default page = 1
        const limit = parseInt(req.query.limit) || 10; // default limit = 10
        const skip = (page - 1) * limit;

        // search keyword
        const search = req.query.search || "";

        // get trainer role
        const trainerRole = await Role.findOne({ name: "Employee" });

        if (!trainerRole) {
            return res.status(STATUS.OK).json({
                message: "Employee role not found",
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
            .populate("roles", "name")
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        if (!trainers || trainers.length === 0) {
            return res.status(STATUS.OK).json({
                message: "No Employee found",
                status: STATUS.NOT_FOUND,
            });
        }

        return res.status(STATUS.OK).json({
            employees: trainers,
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

exports.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await User.findById(id).populate('district', 'name').populate('roles', 'name');
        if (!employee) {
            return res.status(STATUS.OK).json({ message: "Employee not found", status: STATUS.NOT_FOUND });
        }
        return res.status(STATUS.OK).json({ employee, status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
};

exports.toggleEmployeeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(STATUS.OK).json({ message: "Employee not found", status: STATUS.NOT_FOUND });
        }
        user.is_active = !user.is_active;
        await user.save();
        return res.status(STATUS.OK).json({
            message: "Employee " + (user.is_active ? "activated" : "deactivated") + " successfully",
            status: STATUS.OK,
        });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(STATUS.OK).json({ message: "Employee not found", status: STATUS.NOT_FOUND });
        }
        await User.findByIdAndDelete(id);
        return res.status(STATUS.OK).json({ message: "Employee deleted successfully", status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, mobile, password, district, department, designation, trainer, director, course_director } = req.body;
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(STATUS.OK).json({ message: "Employee not found", status: STATUS.NOT_FOUND });
        }

        const rolesToAssign = [];
        const baseRole = await Role.findOne({ name: "Employee" });
        if (baseRole) rolesToAssign.push(baseRole._id);

        if (trainer === true || trainer === 'true') {
            const trainerRole = await Role.findOne({ name: "Trainer" });
            if (trainerRole) rolesToAssign.push(trainerRole._id);
        }
        if (director === true || director === 'true') {
            const directorRole = await Role.findOne({ name: "Director" });
            if (directorRole) rolesToAssign.push(directorRole._id);
        }
        if (course_director === true || course_director === 'true') {
            const courseDirectorRole = await Role.findOne({ name: "Course Director" });
            if (courseDirectorRole) rolesToAssign.push(courseDirectorRole._id);
        }

        user.full_name = full_name;
        user.email = email;
        user.mobile = mobile;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        
        if (district !== 'null' && district !== undefined && district !== '') {
            user.district = district;
        } else {
            user.district = undefined;
        }
        
        user.department = department;
        user.designation = designation;
        user.roles = rolesToAssign;

        if (req.file) {
            user.signature = `/uploads/${req.file.filename}`;
        }

        await user.save();

        return res.status(STATUS.OK).json({ message: "Employee updated successfully", employee: user, status: STATUS.OK });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
};
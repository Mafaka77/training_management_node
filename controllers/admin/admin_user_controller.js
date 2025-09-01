const bcrypt=require('bcryptjs');
const User= require("../../models/user_model");
const Role= require("../../models/role_model");
const District= require("../../models/district_model");
const STATUS= require("../../utils/httpStatus");
exports.getRoles= async (req, res) => {
    try {
        const roles = await Role.find().populate('name');
        return res.status(STATUS.OK).json({ roles ,status:STATUS.OK});
    } catch (e) {
        return res.status(STATUS.OK).json({ error: e.message ,status:STATUS.INTERNAL_SERVER_ERROR});
    }
}
exports.getDistrict= async (req, res) => {
    try {
        const districts = await District.find().populate('name');
        return res.status(STATUS.OK).json({ districts ,status:STATUS.OK});
    } catch (e) {
        return res.status(STATUS.OK).json({ error: e.message ,status:STATUS.INTERNAL_SERVER_ERROR});
    }
}
exports.createUser = async (req, res) => {
    const { full_name, email, password, mobile, district, department, designation ,roles} = req.body;

    try {
        if (!full_name || !email || !password || !mobile || !designation) {
            return res.status(STATUS.OK).json({
                message: "Please fill all required fields",
                status: STATUS.BAD_REQUEST
            });
        }

        const existingUser = await User.findOne({ $or: [{ mobile }, { email }] });
        if (existingUser) {
            return res.status(STATUS.OK).json({
                message: "User with this email or mobile already exists",
                status: STATUS.CONFLICT
            });
        }

        // 🔑 Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            full_name,
            email,
            password: hashedPassword, // save hashed password
            mobile,
            district,
            department,
            designation,
            roles,
        });

        await user.save();

        return res.status(STATUS.OK).json({
            message: "Trainee created successfully",
            status: STATUS.CREATED
        });

    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        // Extract query params
        let { page = 1, limit = 10, search = "", sortField = "name", sortOrder = "asc", role = "" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        // Build filter
        const filter = {};

        // Search by name/email (adjust fields as needed)
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        // Role-based filtering
        if (role) {
            filter.roles = role; // assuming roles stores ObjectId, use roleId from frontend
        }

        // Sorting
        const sort = {};
        sort[sortField] = sortOrder === "asc" ? 1 : -1;

        // Count total for pagination
        const totalUsers = await User.countDocuments(filter);

        // Query with filter, sort, paginate
        const users = await User.find(filter)
            .populate("roles", "name") // populate only necessary fields
            .populate("district", "name")
            .populate("department", "name")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            page,
            limit,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            users,
        });
    } catch (e) {
        console.error("Error fetching users:", e);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: e.message,
        });
    }
};

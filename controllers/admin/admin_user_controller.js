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
                error: "Please fill all required fields",
                status: STATUS.BAD_REQUEST
            });
        }

        const existingUser = await User.findOne({ $or: [{ mobile }, { email }] });
        if (existingUser) {
            return res.status(STATUS.OK).json({
                error: "User with this email or mobile already exists",
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
            error: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
};
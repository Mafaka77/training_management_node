const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../../models/user_model');
const Role=require('../../models/role_model');
const STATUS=require('../../utils/httpStatus');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email }).populate('roles', '-__v');

        if (!user) {
            return res.status(STATUS.OK).json({
                message: "User not found",
                status: STATUS.NOT_FOUND
            });
        }

        // 1. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(STATUS.OK).json({
                message: "Incorrect password",
                status: STATUS.BAD_REQUEST
            });
        }

        // 2. Extract Role Names
        const roleNames = user.roles.map(role => role.name);

        const restrictedRoles = ["Trainee", "Guest", "Director"];
        if (roleNames.some(role=>restrictedRoles.includes(role))) {
            return res.status(STATUS.OK).json({
                message: "Access Denied: Not Permitted.",
                status: STATUS.UNAUTHORIZED // Or FORBIDDEN
            });
        }

        const payload = {
            user: {
                id: user.id,
                email: user.email,
                roles: roleNames,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                return res.status(STATUS.OK).json({
                    token,
                    status: STATUS.OK,
                    user: {
                        id: user._id,
                        email: user.email,
                        full_name: user.full_name,
                        mobile: user.mobile,
                        roles: roleNames
                    }
                });
            }
        );
    } catch (e) {
        console.error("Login Error:", e);
        return res.status(STATUS.OK).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
}

exports.me=async (req,res)=>{
    try{
        const userId=req.user.user.id;
        const user=await User.findById(userId).populate('roles','-__v');
        if(!user){
            return res.status(STATUS.OK).json({message:"User not found",status:STATUS.NOT_FOUND});
        }
        return res.status(STATUS.OK).json({user:{
            id: user._id,
            email: user.email,
            full_name:user.full_name,
            mobile:user.mobile,
        },status:STATUS.OK});
    }catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message:e.message,status:STATUS.INTERNAL_SERVER_ERROR});
    }
}
exports.logout=async (req,res)=>{
    // For JWT, logout is handled on the client side by deleting the token.
    // Optionally, you can implement token blacklisting on the server side.
    return res.status(STATUS.OK).json({message:"Logged out successfully",status:STATUS.OK});
}
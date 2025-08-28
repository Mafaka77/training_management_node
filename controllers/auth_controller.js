const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/user_model');
const Role=require('../models/role_model');
const STATUS=require('../utils/httpStatus');

exports.login=async (req,res)=>{
    const {email,password}=req.body;
    try{
        let user=await User.findOne({email})
            .populate('roles','-__v');
        if(!user){
            return res.status(STATUS.OK).json({message:"User not found",status:STATUS.NOT_FOUND});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(STATUS.OK).json({message:"Incorrect password",status:STATUS.BAD_REQUEST});
        }
        const payload={
            user:{
                id:user.id,
                email: user.email,
                roles: user.roles.map(role => role.name),
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn:'1d'},
            (err,token)=>{
                if(err) throw err;
                return res.status(STATUS.OK).json({token,status:STATUS.OK,user:{
                        id: user._id,
                        email: user.email,
                        full_name:user.full_name,
                        mobile:user.mobile,
                        roles: user.roles.map(role=>role.name)
                    }});
            }
        );
    }catch (e) {
        return res.status(STATUS.OK).json({message:e.message,status:STATUS.INTERNAL_SERVER_ERROR});
    }
}

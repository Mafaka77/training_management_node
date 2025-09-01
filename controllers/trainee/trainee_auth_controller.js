const mongoose=require('mongoose');
const axios = require('axios');
const User=require('../../models/user_model');
const Role=require('../../models/role_model');
const STATUS = require("../../utils/httpStatus");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");
// Initialize cache with a 5-minute expiration time
const otpCache = new NodeCache({ stdTTL: 300 }); // 300 seconds = 5 minutes
exports.login=async (req,res)=>{
    const {mobile,password}=req.body;

    try{
        let user=await User.findOne({
            $or: [
                { mobile: mobile },
                { email: mobile }
            ]
        })
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
                mobile: user.mobile,
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
exports.register=async (req,res)=>{
    const roles=await Role.findOne({name:'Trainee'});
    const {full_name,email,password,mobile,district,department,gender,designation}=req.body;
    try{
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
            gender,
            designation,
            roles:[roles._id],
        });

        await user.save();

        return res.status(STATUS.OK).json({
            message: "Trainee created successfully",
            status: STATUS.CREATED
        });
    }catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }

}
exports.sendOtp=async(req,res)=>{
    const {mobile}=req.body;
    const user=await User.findOne({mobile:mobile});
    if(user){
        return res.status(STATUS.OK).json({message:'User already exists',status:STATUS.CONFLICT})
    }
    const otp=generateOTP(mobile);
    const templateId='1407173926279603243';
    const message=`Please enter OTP ${otp} to submit your Ruangphur application.EGOVMZ`;
    try {
        // const response = await axios.get("https://sms.msegs.in/api/send-sms", {
        //     headers: {
        //         'Authorization': `Bearer ${process.env.SMS_TOKEN}`
        //     },
        //     params: {
        //         template_id: templateId,
        //         message: message,
        //         recipient: mobile
        //     }
        // });

        return res.status(STATUS.OK).json({message:'OTP Sent',status:STATUS.OK,otp:otp})
    } catch (error) {

        return  res.status(STATUS.INTERNAL_SERVER_ERROR).json({message:'Failed to send OTP',status:500})

    }


}
exports.verifyOtp=async(req,res)=>{
    const { mobile, otp } = req.body;
    try {
        const storedOtp = otpCache.get(`otp_${mobile}`);

        if (!storedOtp) {
            return res.status(STATUS.OK).json({ message: 'OTP has expired or does not exist.', status: 400 });
        }

        if (storedOtp !== otp) {
            return res.status(STATUS.OK).json({ message: 'Invalid OTP.', status: 400 });
        }

        // OTP is valid, remove it from cache to prevent reuse
        otpCache.del(`otp_${mobile}`);

        return res.status(STATUS.OK).json({ message: 'OTP is verified', status: STATUS.OK });
    } catch (ex) {
        return res.status(STATUS.OK).json({ message: ex.message, status: 500 });
    }
}
const generateOTP = (phone) => {
    // Generate a 4-digit random OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Store OTP in cache with a 5-minute expiration
    otpCache.set(`otp_${phone}`, otp);

    return otp;
};

const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../../models/user_model');
const Role=require('../../models/role_model');


exports.login=async (req,res)=>{
    const {email,password}=req.body;
    try{
        let user=await User.findOne({email})
            .populate('roles','-__v');
        if(!user){
            return res.status(200).json({message:"User not found",status:404});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(200).json({message:"Incorrect password",status:400});
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
                return res.status(200).json({token,status:200,user:{
                    id: user._id,
                    email: user.email,
                        full_name:user.full_name,
                        mobile:user.mobile,
                    roles: user.roles.map(role=>role.name)
                    }});
            }
        );
    }catch (e) {
        return res.status(200).json({message:e.message,status:500});
    }
}
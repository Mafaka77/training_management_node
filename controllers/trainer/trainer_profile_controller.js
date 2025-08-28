const User=require('../../models/user_model');
const STATUS=require('../../utils/httpStatus');
const TrainerProfile=require('../../models/trainer_profile_model');

exports.me=async (req,res)=>{
    try{
        const userId=req.user.user.id;
        const user=await User.findById(userId).select('-password').populate('roles');
        if(!user){
            return res.status(STATUS.NOT_FOUND).json({
                success:false,
                message:'User not found'
            });
        }
        return res.status(STATUS.OK).json({
            success:true,
            user:{
                id: user._id,
                email: user.email,
                full_name:user.full_name,
                mobile:user.mobile,
                designation:user.designation,
                department:user.department,
                roles: user.roles.map(role=>role.name)
            }
        });
    }catch (e) {

    }
}

exports.updateProficiency = async (req, res) => {
    try {
        const userId = req.user.user.id; // authenticated user

        const { expertise, qualification, experience } = req.body;

        // find trainer profile by user_id
        let profile = await TrainerProfile.findOne({ user_id: userId });

        if (!profile) {
            // if no profile exists, create one
            profile = new TrainerProfile({ user_id: userId });
        }

        // update fields if provided
        if (expertise) profile.expertise = expertise;
        if (qualification) profile.qualification = qualification;
        if (experience) profile.experience = experience;

        // handle profile picture upload
        if (req.file) {
            profile.profile_picture = `/uploads/${req.file.filename}`;
        }

        await profile.save();

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: 'Trainer profile updated successfully',
            profile
        });

    } catch (e) {
        console.error("Error in updateProficiency:", e);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: 'Something went wrong'
        });
    }
};



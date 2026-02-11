const Notification=require('../../models/notification_model');
const STATUS=require('../../utils/httpStatus');
const Training=require('../../models/training_program_model');
const User = require("../../models/user_model");
const Trainer = require("../../models/user_model");
const Role=require('../../models/role_model');
exports.fetchNotification=async(req,res)=>{
    try{
        const noti=await Notification.find({is_read:false}).sort({createdAt:-1}).limit(10);
       return res.status(STATUS.OK).json({notifications:noti,status:STATUS.OK})
    }catch(ex){
       return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message:ex.message,status:STATUS.INTERNAL_SERVER_ERROR});
    }
}

exports.readNotification = async (req, res) => {
    try {
        const { id } = req.params;

        // Use findByIdAndUpdate directly. 
        // { new: true } returns the updated document if you need to check it.
        const noti = await Notification.findByIdAndUpdate(
            id, 
            { is_read: true }, 
            { new: true }
        );

        if (!noti) {
            return res.status(STATUS.OK).json({ 
                message: 'Notification not found', 
                status: STATUS.NOT_FOUND 
            });
        }

        return res.status(STATUS.OK).json({ 
            message: 'Notification marked as read', 
            status: STATUS.OK,
            // Returning the target_url helps the frontend redirect immediately
            target_url: noti.target_url 
        });

    } catch (ex) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ 
            message: ex.message, 
            status: STATUS.INTERNAL_SERVER_ERROR 
        });
    }
};


exports.getStats = async (req, res) => {
    try {
        const roles = await Role.find({
            name: { $in: ['Trainee', 'Trainer'] }
        });
        const traineeRoleId = roles.find(r => r.name === 'Trainee')?._id;
        const trainerRoleId = roles.find(r => r.name === 'Trainer')?._id;
        const [countTrainings, countTrainees, countTrainers, countCertificates] = await Promise.all([
            Training.countDocuments({t_status:{$ne:'Draft'}}),
            traineeRoleId ? User.countDocuments({ roles: traineeRoleId }) : 0,
            trainerRoleId ? User.countDocuments({ roles: trainerRoleId }) : 0,
            0
        ]);
        const trainings = await Training.find({
            t_status: { $in: ['Ongoing', 'Upcoming'] }
        })
            .sort({ t_start_date: 1 }) // Sort by date (soonest first)
            .limit(4);
        const stats = [
            {
                label: 'Total Trainings',
                value: countTrainings.toLocaleString(),
                icon: 'AcademicCapIcon',
                trend: 12,
                colorClass: 'bg-blue-500/10 text-blue-500'
            },
            {
                label: 'Total Trainees',
                value: countTrainees.toLocaleString(),
                icon: 'UserGroupIcon',
                trend: 8,
                colorClass: 'bg-purple-500/10 text-purple-500'
            },
            {
                label: 'Active Trainers',
                value: countTrainers.toLocaleString(),
                icon: 'BriefcaseIcon',
                trend: -2,
                colorClass: 'bg-amber-500/10 text-amber-500'
            },
            {
                label: 'Certificates Issued',
                value: countCertificates.toLocaleString(),
                icon: 'ClipboardDocumentCheckIcon',
                trend: 24,
                colorClass: 'bg-emerald-500/10 text-emerald-500'
            }
        ];

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            stats: stats,
            trainings:trainings,
        });

    } catch (ex) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: ex.message
        });
    }
};
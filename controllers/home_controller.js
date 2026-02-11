const Training=require('../models/training_program_model');
const STATUS=require('../utils/httpStatus');
exports.getPrograms=async (req,res,next)=>{
    const page=parseInt(req.query.page)||1;
    const limit=parseInt(req.query.limit)||6;
    const skip=(page-1)*limit;
    try{
        const training=await Training.find({t_stats:{$ne:['Draft']}})
            .populate('t_eligibility')
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit);

        return res.status(STATUS.OK).json({data:training,status:STATUS.OK});

    }catch(err){
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message:err.message});
    }
}

exports.getCalendarTrainings = async (req, res) => {
    try {
        const { month, year } = req.query;

        // Expanded range to catch trainings that spill over from prev/next months
        const startDate = new Date(year, month - 1, -7); // Start 7 days before
        const endDate = new Date(year, month, 7);      // End 7 days after

        const trainings = await Training.find({
            t_status: { $ne: 'Draft' },
            $or: [
                { t_start_date: { $gte: startDate, $lte: endDate } },
                { t_end_date: { $gte: startDate, $lte: endDate } },
                {
                    $and: [
                        { t_start_date: { $lte: startDate } },
                        { t_end_date: { $gte: endDate } }
                    ]
                }
            ]
        })
            .select('t_name t_start_date t_end_date t_status')
            .sort({ t_start_date: 1 });

        res.status(200).json({ success: true, data: trainings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
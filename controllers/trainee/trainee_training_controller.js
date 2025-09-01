const mongoose=require('mongoose');
const TrainingProgram=require('../../models/training_program_model');
const User=require('../../models/user_model');
const STATUS=require('../../utils/httpStatus');
const Enrollment=require('../../models/enrollment_model');
const TrainingRatings=require('../../models/training_program_rating_model');
const {populate} = require("dotenv");
//TRAINING PROGRAM-----------------------------------------------------------------------------------
exports.getTraining = async (req, res) => {
    try {
        // Query params
        let { page = 1, limit = 10, search = "", offset } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        // If offset is provided, calculate page from it
        let skip;
        if (offset !== undefined) {
            offset = parseInt(offset);
            skip = offset;
        } else {
            skip = (page - 1) * limit; // default pagination
        }

        // Build search filter
        const filter = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" }; // search by program name
        }

        // Get total count for pagination
        const total = await TrainingProgram.countDocuments(filter);

        // Fetch paginated data
        const programs = await TrainingProgram.find(filter)
            .populate("t_category", "name")
            .populate("t_room", "room_name")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return res.status(STATUS.OK).json({
            programs,
            total,
            page: offset !== undefined ? Math.floor(offset / limit) + 1 : page,
            offset: skip,
            limit,
            totalPages: Math.ceil(total / limit),
            status: STATUS.OK,
        });
    } catch (e) {
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ error: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }

};
exports.getTrainingById=async (req,res)=>{
    const {trainingId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(trainingId)){
        return res.status(STATUS.OK).json({error:"Invalid training ID",status:STATUS.BAD_REQUEST});
    }
    try{
        const training=await TrainingProgram.findById(trainingId)
            .populate('trainingCourse',['tc_topic','tc_description','-t_program']);

        if(!training){
            return res.status(STATUS.OK).json({error:"Training not found",status:STATUS.NOT_FOUND});
        }
        return res.status(STATUS.OK).json({training,status:STATUS.OK});
    }catch(e){
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ error: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
exports.enrollInTraining=async (req,res)=>{
    const {trainingId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(trainingId)){
        return res.status(STATUS.OK).json({error:"Invalid training ID",status:STATUS.BAD_REQUEST});
    }
    try{
        // Check if training exists
        const training=await TrainingProgram.findById(trainingId);
        if(!training){
            return res.status(STATUS.OK).json({error:"Training not found",status:STATUS.NOT_FOUND});
        }
        if(training.t_status!=='Upcoming'){
            return res.status(STATUS.OK).json({error:"Enrollment is only allowed for upcoming trainings",status:STATUS.FORBIDDEN});
        }
        // Check if capacity is reached

        const currentEnrollments=await Enrollment.countDocuments({training_program:trainingId,status:'Approved'});
        if(currentEnrollments>=training.t_capacity){
            return res.status(STATUS.OK).json({error:"Training capacity reached",status:STATUS.BAD_REQUEST});
        }

        // Check if user already enrolled
        const existingEnrollment=await Enrollment.findOne({training_program:trainingId,user:req.user.user.id});
        if(existingEnrollment){
            return res.status(STATUS.OK).json({error:"You are already enrolled in this training",status:STATUS.CONFLICT});
        }

        // Create enrollment
        const newEnrollment=new Enrollment({
            training_program:trainingId,
            user:req.user.user.id,
            status:'Pending'
        });
        await newEnrollment.save();
        return res.status(STATUS.OK).json({message:"Enrollment request submitted",enrollment:newEnrollment,status:STATUS.OK});

    }catch(e){
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ error: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
exports.myEnrollments=async (req,res)=>{
    try{
        const enrollments=await Enrollment.find({user:req.user.user.id})
            .populate('training_program').select("-__v -user");
        return res.status(STATUS.OK).json({enrollments,status:STATUS.OK});
    }catch (e) {
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ error: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
exports.myEnrollmentDetails=async (req,res)=>{
    const {enrollmentId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(enrollmentId)){
        return res.status(STATUS.OK).json({error:"Invalid enrollment ID",status:STATUS.BAD_REQUEST});
    }
    try{
        const status = await Enrollment.findOne({
            status: { $in: ["Pending", "Rejected", "Waitlisted"] }
        });

        if (status) {
            let message = "";
            switch (status.status) {
                case "Pending":
                    message = "Your enrollment is pending for approval";
                    break;
                case "Rejected":
                    message = "Your enrollment is rejected";
                    break;
                case "Waitlisted":
                    message = "Your enrollment is waitlisted";
                    break;
                default:
                    message = "Unknown status";
            }

            return res.status(STATUS.OK).json({
                error: message,
                status: STATUS.FORBIDDEN
            });
        }

        const enrollment=await Enrollment.findById(enrollmentId)
            .populate({path: 'training_program', populate:[
                    {
                        path:'trainingCourse',
                        populate:[
                            {
                                path:'materials'
                            }
                        ]
                    }
                ]})
            .select("-__v");
        if(!enrollment){
            return res.status(STATUS.OK).json({error:"Enrollment not found",status:STATUS.NOT_FOUND});
        }
        // Ensure the enrollment belongs to the requesting user
        if(enrollment.user._id.toString()!==req.user.user.id){
            return res.status(STATUS.OK).json({error:"Access denied",status:STATUS.FORBIDDEN});
        }
        return res.status(STATUS.OK).json({enrollment,status:STATUS.OK});
    }catch (e) {
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ error: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
exports.upsertMyRating = async (req, res) => {
    try {
        const { trainingId } = req.params;
        const { rating, review = "" } = req.body;
        const traineeId = req.user.user.id;
        // Optional rule: only approved attendees can rate
        const ok = await Enrollment.exists({ user: traineeId, training_program: trainingId, status: "Approved" });
        if (!ok) return res.status(STATUS.OK).json({ message: "You can rate only after approval/attendance" ,status:STATUS.BAD_REQUEST});

        const doc = await TrainingRatings.findOneAndUpdate(
            { training: trainingId, trainee: traineeId },
            { $set: { rating, review } , $setOnInsert: { training: trainingId, trainee: traineeId } },
            { new: true, upsert: true, runValidators: true }
        );

        await TrainingRatings.calculateStats(trainingId);

        return res.status(201).json({ message: "Rating saved", rating: doc });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};
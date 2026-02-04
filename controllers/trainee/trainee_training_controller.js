const mongoose=require('mongoose');
const TrainingProgram=require('../../models/training_program_model');
const TrainingCourse=require('../../models/training_course_model');
const User=require('../../models/user_model');
const STATUS=require('../../utils/httpStatus');
const Enrollment=require('../../models/enrollment_model');
const TrainingRatings=require('../../models/training_program_rating_model');
const Material=require('../../models/materials_model');
const {populate} = require("dotenv");
const {sendPushToUser}=require('../../services/push_service');
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
        const filter = {
            t_status: { $ne: "Draft" }
        };
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
            .json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }

};
exports.getTrainingById=async (req,res)=>{
    const {trainingId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(trainingId)){
        return res.status(STATUS.OK).json({message:"Invalid training ID",status:STATUS.BAD_REQUEST});
    }
    try{
        const training=await TrainingProgram.findById(trainingId)
            .populate('trainingCourse',['-t_program'])
            .populate('t_category','name description')
            .populate('t_room');

        if(!training){
            return res.status(STATUS.OK).json({message:"Training not found",status:STATUS.NOT_FOUND});
        }
        return res.status(STATUS.OK).json({training,status:STATUS.OK});
    }catch(e){
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
}
    exports.enrollInTraining=async (req,res)=>{
        const {trainingId}=req.params;
        if(!mongoose.Types.ObjectId.isValid(trainingId)){
            return res.status(STATUS.OK).json({message:"Invalid training ID",status:STATUS.BAD_REQUEST});
        }
        try{
            // Check if training exists
            const training=await TrainingProgram.findById(trainingId);
            if(!training){
                return res.status(STATUS.OK).json({message:"Training not found",status:STATUS.NOT_FOUND});
            }
            if(training.t_status!=='Upcoming'){
                return res.status(STATUS.OK).json({message:"Enrollment is only allowed for upcoming trainings",status:STATUS.FORBIDDEN});
            }
            // Check if capacity is reached

            const currentEnrollments=await Enrollment.countDocuments({training_program:trainingId,status:'Approved'});
            if(currentEnrollments>=training.t_capacity){
                return res.status(STATUS.OK).json({message:"Training capacity reached",status:STATUS.BAD_REQUEST});
            }

            // Check if user already enrolled
            const existingEnrollment=await Enrollment.findOne({training_program:trainingId,user:req.user.user.id});
            if(existingEnrollment){
                return res.status(STATUS.OK).json({message:"You are already enrolled in this training",status:STATUS.CONFLICT});
            }

            // Create enrollment
            const newEnrollment=new Enrollment({
                training_program:trainingId,
                user:req.user.user.id,
                status:'Pending'
            });
            await newEnrollment.save();
            sendPushToUser(req.user.user.id, {
            title: "Pending",
            body: `Your request is under review. You'll be notified once approved.`,
             });
            return res.status(STATUS.OK).json({message:"Enrollment request submitted",enrollment:newEnrollment,status:STATUS.OK});

        }catch(e){
            return res
                .status(STATUS.INTERNAL_SERVER_ERROR)
                .json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
        }
    }
exports.myEnrollments = async (req, res) => {
    try {
        // Pagination
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;

        // Search (by training program name, title, etc.)
        const search = req.query.search || "";

        // Build query for enrollments
        let query = { user: req.user.user.id };

        // If searching inside populated training_program fields
        const trainingProgramFilter = search
            ? { name: { $regex: search, $options: "i" } } // adjust "name" to actual field
            : {};

        // Count total for pagination
        const total = await Enrollment.countDocuments(query);

        // Query with populate, filter, sort, pagination
        const enrollments = await Enrollment.find(query)
            .select("-__v -user")
            .populate({
                path: "training_program",
                match: trainingProgramFilter, // apply search filter inside populate
                select: "-__v"
            })
            .sort({ enrolledAt: -1 }) // latest first
            .skip(offset)
            .limit(limit);

        // Filter out null training_program if search didn’t match
        const filtered = enrollments.filter(e => e.training_program);

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            total,
            offset,
            limit,
            count: filtered.length,
            enrollments: filtered
        });
    } catch (e) {
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
    }
};
exports.checkStatus=async (req,res)=>{
    const {enrollmentId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(enrollmentId)){
        return res.status(STATUS.OK).json({message:"Invalid enrollment ID",status:STATUS.BAD_REQUEST});
    }
    try{
        const data = await Enrollment.findById(enrollmentId);

        if (!data) {
            return res.status(STATUS.NOT_FOUND).json({
                status: STATUS.NOT_FOUND,
                message: "Enrollment not found",
            });
        }

        if (data.status === "Pending") {
            return res.status(STATUS.OK).json({
                status: STATUS.FORBIDDEN,
                message: "Your enrollment is pending for approval",
            });
        }
        if (data.status === "Rejected") {
            return res.status(STATUS.OK).json({
                status: STATUS.FORBIDDEN,
                message: "Your enrollment is rejected",
            });
        }
        if (data.status === "Waitlisted") {
            return res.status(STATUS.OK).json({
                status: STATUS.FORBIDDEN,
                message: "Your enrollment is waitlisted",
            });
        }
        return res.status(STATUS.OK).json({status:STATUS.OK})
    }catch (ex){}
}
exports.myEnrollmentDetails=async (req,res)=>{
    const {enrollmentId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(enrollmentId)){
        return res.status(STATUS.OK).json({message:"Invalid enrollment ID",status:STATUS.BAD_REQUEST});
    }
    try{


        const enrollment = await Enrollment.findById(enrollmentId)
            .populate({
                path: 'training_program',
                populate: [
                    { path: 't_category' },          // replace with actual field name
                    { path: 't_room' },              // replace with actual field name
                    {
                        path: 'trainingCourse',              // replace with actual field name
                        populate: [
                            { path: 'materials' }              // nested populate inside trainingCourse
                        ]
                    }
                ]
            })
            .select('-__v');

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
            .json({ message: e.message, status: STATUS.INTERNAL_SERVER_ERROR });
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
exports.getUpcomingTrainings = async (req, res) => {
    try {
        // Parse offset & limit from query params
        const offset = parseInt(req.query.offset) || 0;  // default: 0
        const limit = parseInt(req.query.limit) || 10;   // default: 10

        // Count total upcoming trainings (for frontend pagination info)
        const total = await TrainingProgram.countDocuments({ t_status: "Upcoming" });

        // Fetch trainings with pagination
        const trainings = await TrainingProgram.find({ t_status: "Upcoming" })
            .populate("t_category", "name")
            .populate("t_room", "room_name")
            .sort({ createdAt: -1 }) // earliest first
            .skip(offset)              // skip N docs
            .limit(limit);             // limit results
        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            total,        // total available trainings
            offset,       // current offset
            limit,        // page size
            count: trainings.length,
            trainings,

        });
    } catch (e) {
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({
                message: e.message,
                status: STATUS.INTERNAL_SERVER_ERROR,
            });
    }
};

exports.getCourseByProgram=async (req,res)=>{
    const {trainingId}=req.params;
    try{
        const data=await TrainingCourse.find({t_program:trainingId}).populate('t_program',['t_status']) .sort({ tc_start_time: 1, tc_session: 1 });
        return res.status(STATUS.OK).json({status:STATUS.OK,data});
    }catch (ex) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({status:STATUS.INTERNAL_SERVER_ERROR,message:ex.message});
    }
}

exports.getMaterials=async (req,res)=>{
    const {trainingId}=req.params;
    try{
        const course=await TrainingCourse.find({t_program:trainingId}).select('_id').lean();
        const courseId=course.map(c=>c._id);

        const materials=await Material.find({course:{$in:courseId}})
            .lean();
        return res.json({status:STATUS.OK,materials});

    }catch (e) {
        return  res.status(STATUS.INTERNAL_SERVER_ERROR).json({status:STATUS.INTERNAL_SERVER_ERROR,message:e.message})
    }
}


























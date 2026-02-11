const TrainingCourse=require('../../models/training_course_model');
const STATUS=require('../../utils/httpStatus');
const TrainingMaterial=require('../../models/materials_model');
const Enrollment=require('../../models/enrollment_model');
const Attendance=require('../../models/attendance_model');
const TrainingProgram=require('../../models/training_program_model');
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
exports.getMyTraining = async (req, res) => {
    try {
        const trainerId = req.user.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const statusFilter = req.query.status; // e.g., 'Upcoming', 'Completed'

        let pipeline = [
            // Filter by trainer ID first
            { $match: { trainer: new mongoose.Types.ObjectId(trainerId) } },

            // Join with t_programs (t_program is the local field)
            {
                $lookup: {
                    from: 'trainingprograms', // Ensure this matches your actual MongoDB collection name for Programs
                    localField: 't_program',
                    foreignField: '_id',
                    as: 't_program'
                }
            },
            { $unwind: '$t_program' },
            {
                $lookup: {
                    from: 'trainingrooms',
                    localField: 't_program.t_room',
                    foreignField: '_id',
                    as:'t_program.t_room'
                }
            },
            { $unwind: {
                path:'$t_program.t_room',
                    preserveNullAndEmptyArrays:true
                }}
        ];
        if (statusFilter) {
            pipeline.push({
                $match: { 't_program.t_status': statusFilter }
            });
        }
        const countPipeline = [...pipeline, { $count: "total" }];

        pipeline.push(
            { $sort: { tc_date: -1 } }, // Sort by date ascending
            { $skip: skip },
            { $limit: limit }
        );
        const [data, countResult] = await Promise.all([
            TrainingCourse.aggregate(pipeline),
            TrainingCourse.aggregate(countPipeline)
        ]);
        const total = countResult.length > 0 ? countResult[0].total : 0;

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            data: data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error in getMyTraining:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: 'Server Error'
        });
    }
};

exports.uploadMaterial = async (req, res) => {

    try {
        const {title}=req.body;
        const { courseId } = req.params;

        if (!req.files || req.files.length === 0) {
            return res.status(STATUS.OK).json({ message: "No files uploaded",status:STATUS.BAD_REQUEST });
        }

        // Ensure course exists
        const course = await TrainingCourse.findById(courseId);
        if (!course) {
            return res.status(STATUS.OK).json({ message: "Course not found",status:STATUS.NOT_FOUND});
        }

        // Save each file to Materials collection
        const savedMaterials = await Promise.all(
            req.files.map(async (file) => {
                const material = new TrainingMaterial({
                    title:title,
                    file_name: file.filename,
                    file_url: `/uploads/${file.filename}`, // public url or local path
                    course: courseId,
                    mime_type: file.mimetype,
                });
                return await material.save();
            })
        );

        return res.status(STATUS.OK).json({
            message: "Materials uploaded successfully",
            status:STATUS.CREATED
        });
    } catch (err) {
        return res.status(STATUS.OK).json({ message: err.message ,status:STATUS.INTERNAL_SERVER_ERROR});
    }
};
exports.getTrainingById=async(req,res)=>{
    try{
        const {courseId}=req.params;
        const course=await TrainingCourse.findById(courseId).populate('t_program').populate('materials').sort({tc_date:-1});
        if(!course){
            return res.status(STATUS.OK).json({
                status:STATUS.NOT_FOUND,
                message:'Course not found'
            });
        }
        return res.status(STATUS.OK).json({
            status:STATUS.OK,
            course
        });
    }catch(error){
        console.error('Error in getTrainingById:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status:STATUS.INTERNAL_SERVER_ERROR,
            message:'Server Error'
        });
    }
}
exports.getSessionTrainees = async (req, res) => {
    try {
        const { sessionId } = req.params;

        // 1. Find the session to get the program ID and the specific date
        const session = await TrainingCourse.findById(sessionId);

        if (!session) {
            return res.status(STATUS.OK).json({
                message: "Session not found",
                status: STATUS.NOT_FOUND
            });
        }

        // Normalize date to midnight (00:00:00) to match the Attendance unique index
      const sessionDate=  dayjs(session.tc_date).startOf('day').toDate();
        // const sessionDate = new Date(session.tc_date);
        // sessionDate.setUTCHours(0, 0, 0, 0);

        // 2. Fetch all approved enrollments for this program
        const enrollments = await Enrollment.find({
            training_program: session.t_program,
            status: 'Approved'
        }).populate('user', 'full_name email mobile');

        // 3. Fetch existing attendance records for this program on this specific date
        const attendanceRecords = await Attendance.find({
            sessionId: sessionId,
            date: sessionDate
        });

        // 4. Map enrollments and attach attendance status
        const traineeList = enrollments.map(enrol => {
            // Convert current enrollment user ID to string for comparison
            const enrollmentUserId = enrol.user._id.toString();

            // Check if this specific user has an attendance record for this session
            const attendance = attendanceRecords.find(a =>
                // Use .toString() or .equals() for MongoDB ObjectIDs
                a.user.toString() === enrollmentUserId
            );

            // Debugging (Optional: only logs if found)
            if (attendance) console.log(`Found attendance for: ${enrol.user.full_name}`);

            return {
                _id: enrol.user._id,
                name: enrol.user.full_name,
                email: enrol.user.email,
                phone: enrol.user.mobile,
                enrollmentId: enrol._id,
                programId: enrol.training_program,
                // Since you are now creating records one-by-one,
                // status is 'Present' if found, otherwise 'Absent'
                status: attendance ? attendance.status : 'Absent',
                isMarked: !!attendance,
                signInTime: attendance ? attendance.createdAt : null
            };
        });

        return res.status(200).json({
            status: STATUS.OK,
            session_topic: session.tc_topic,
            session_date: sessionDate,
            trainees: traineeList
        });

    } catch (error) {
        console.error('Error in getSessionTrainees:', error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.markAttendance = async (req, res) => {
    try {

        const {userId,sessionId, enrollmentId, status } = req.body;


        const existingAttendance = await Attendance.findOne({
            user: userId,
            sessionId: sessionId
        });

        if (existingAttendance) {
            return res.status(STATUS.OK).json({
                status: STATUS.BAD_REQUEST,
                message: "Attendance already recorded for this session."
            });
        }

        // 2. Fetch Session for Time Validation
        const session = await TrainingCourse.findById(sessionId);
        if (!session) return res.status(STATUS.OK).json({ message: "Session not found." ,status:STATUS.NOT_FOUND});

        // 3. Time-Window Validation
        const now = dayjs();
        const sessionDateStr = dayjs(session.tc_date).format('YYYY-MM-DD');
        const startTime = dayjs(`${sessionDateStr} ${session.tc_start_time}`, 'YYYY-MM-DD HH:mm');
        const endTime = dayjs(`${sessionDateStr} ${session.tc_end_time}`, 'YYYY-MM-DD HH:mm');

        // if (!now.isSame(dayjs(session.tc_date), 'day') || now.isBefore(startTime) || now.isAfter(endTime)) {
        //     return res.status(STATUS.OK).json({
        //         message: "Attendance window is closed or not yet open.",
        //         status:STATUS.CONFLICT,
        //     });
        // }

        // 4. Create the Record
        // We use .create() instead of findOneAndUpdate
        const attendance = await Attendance.create({
            user: userId,
            enrollmentId: enrollmentId,
            trainingId: session.t_program, // Keep program ID for global reports
            sessionId: sessionId,          // Specific session link
            date: dayjs(session.tc_date).startOf('day').toDate(),
            status: status,
            signInTime: now.toDate(),
            notes: `Session ${session.tc_session} marked at ${now.format('HH:mm')}`
        });

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: "Attendance recorded successfully",
            data: attendance
        });

    } catch (error) {
        console.error('Create Attendance Error:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
    }
};
exports.getMyMaterials=async (req, res) => {
    try{
        const {programId}=req.params;
       const userId=req.user.user.id;
        const query = {
            program: new mongoose.Types.ObjectId(programId),
            uploadedBy: new mongoose.Types.ObjectId(userId)
        };
        const materials=await TrainingMaterial.find(query).sort({createdAt:-1});
        return res.status(STATUS.OK).json({data:materials,status:STATUS.OK});
    }catch(error){
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({message: "Server Error"});
    }
};
exports.getProgramName=async(req,res)=>{
    try{
        const {programId}=req.params;
        const program=await TrainingProgram.findById(programId);
        return res.status(STATUS.OK).json({data:program,status:STATUS.OK});
    }catch (error){}
}







































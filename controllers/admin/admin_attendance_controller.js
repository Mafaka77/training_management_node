const Attendance=require('../../models/attendance_model');
const Trainer=require('../../models/user_model');
const Enrollment=require('../../models/enrollment_model');
const Session=require('../../models/training_course_model');
const TrainingCourse = require("../../models/training_course_model");
const STATUS = require("../../utils/httpStatus");
const dayjs = require("dayjs");
const mongoose=require("mongoose");

exports.getSessionAttendance = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await TrainingCourse.findById(sessionId);
        if (!session) {
            return res.status(STATUS.OK).json({
                message: "Session not found",
                status: STATUS.NOT_FOUND
            });
        }
        const sessionDate=  dayjs(session.tc_date).startOf('day').toDate();
        const enrollments = await Enrollment.find({
            training_program: session.t_program,
            status: 'Approved'
        }).populate('user', 'full_name email mobile');
        const attendanceRecords = await Attendance.find({
            sessionId: sessionId,
            date: sessionDate
        });
        const traineeList = enrollments.map(enrol => {
            const enrollmentUserId = enrol.user._id.toString();
            const attendance = attendanceRecords.find(a =>
                a.user.toString() === enrollmentUserId
            );
            if (attendance) console.log(`Found attendance for: ${enrol.user.full_name}`);

            return {
                _id: enrol.user._id,
                name: enrol.user.full_name,
                email: enrol.user.email,
                phone: enrol.user.mobile,
                enrollmentId: enrol._id,
                programId: enrol.training_program,
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


exports.getFullAttendance = async (req, res) => {
    try {
        const { programId } = req.params; // Ensure sessionId is passed if checking "Today"

        if (!mongoose.Types.ObjectId.isValid(programId)) {
            return res.status(STATUS.OK).json({
                status: STATUS.BAD_REQUEST,
                message: "Invalid Program ID format"
            });
        }
        const [enrollments, currentAttendance, attendanceStats, totalSessionsCount] = await Promise.all([
            Enrollment.find({ training_program: programId,status:'Approved' }).populate("user", "full_name image").lean(),
            Attendance.find({ trainingId: programId }).lean(),
            Attendance.aggregate([
                { $match: { trainingId: new mongoose.Types.ObjectId(programId) } },
                { $group: { _id: "$enrollmentId", count: { $sum: 1 } } }
            ]),
            Session.countDocuments({ t_program: programId })
        ]);
        const statsMap = (Array.isArray(attendanceStats) ? attendanceStats : []).reduce((acc, curr) => {
            if (curr._id) {
                acc[curr._id.toString()] = curr.count;
            }
            return acc;
        }, {});
        const presentTodaySet = new Set(
            (currentAttendance || []).map(a => a.enrollmentId.toString())
        );
        const registry = enrollments.map(trainee => {
            const traineeIdStr = trainee._id.toString();
            const attendedCount = statsMap[traineeIdStr] || 0;

            return {
                _id: trainee._id,
                user: trainee.user,
                attendedCount: attendedCount,
                isPresentToday: presentTodaySet.has(traineeIdStr),
                percentage: totalSessionsCount > 0
                    ? Math.round((attendedCount / totalSessionsCount) * 100)
                    : 0
            };
        });
        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            totalSessions: totalSessionsCount,
            data: registry
        });

    } catch (ex) {
        console.error("Attendance Sync Error:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: ex.message
        });
    }
};
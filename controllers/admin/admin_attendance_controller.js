const Attendance=require('../../models/attendance_model');
const User=require('../../models/user_model');
const Enrollment=require('../../models/enrollment_model');
const Session=require('../../models/training_course_model');
const TrainingCourse = require("../../models/training_course_model");
const STATUS = require("../../utils/httpStatus");
const TrainingProgram = require("../../models/training_program_model");
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

exports.getTraineeAttendanceDetails = async (req, res) => {
    const { traineeId } = req.params;
    const { trainingId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(traineeId) || !mongoose.Types.ObjectId.isValid(trainingId)) {
        return res.status(STATUS.OK).json({
            status: STATUS.BAD_REQUEST,
            message: "Invalid Trainee ID or Training ID format"
        });
    }

    try {
        const [program, sessions,traineeName] = await Promise.all([
            TrainingProgram.findById(trainingId).select('t_name').lean(),
            Session.find({ t_program: trainingId }).sort({ tc_date: 1 }).lean(),
            User.findById(traineeId).select('full_name').lean(),
        ]);

        if (!program) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Program not found"
            });
        }

        const attendanceRecords = await Attendance.find({
            user: traineeId,
            trainingId: trainingId
        }).lean();
        const attendanceMap = new Map(
            attendanceRecords.map(rec => [rec.sessionId.toString(), rec])
        );

        const totalSessions = sessions.length;
        let presentCount = 0;

        const sessionDetails = sessions.map(session => {
            const record = attendanceMap.get(session._id.toString());
            const isPresent = record && record.status === 'Present';

            if (isPresent) presentCount++;

            return {
                sessionId: session._id,
                sessionTopic: session.tc_topic,
                sessionDate: session.tc_date,
                startTime: session.tc_start_time,
                endTime: session.tc_end_time,
                // Logic: If no record in Attendance collection, they are "Absent"
                status: record ? record.status : "Absent",
                signInTime: record ? record.createdAt : null,
                remarks: record ? record.remarks : ""
            };
        });

        // 4. Detailed Analytics
        const attendancePercentage = totalSessions > 0
            ? parseFloat(((presentCount / totalSessions) * 100).toFixed(2))
            : 0;

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            data: {
                traineeId,
                traineeName,
                programName: program.t_name,
                stats: {
                    totalSessions,
                    presentCount,
                    absentCount: totalSessions - presentCount,
                    attendancePercentage: attendancePercentage, // Returning as number for easier UI logic
                    isEligible: attendancePercentage >= 75
                },
                records: sessionDetails
            }
        });

    } catch (ex) {
        console.error("Trainee Attendance Details Error:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: ex.message
        });
    }
}
const Attendance = require('../../models/attendance_model');
const User = require('../../models/user_model');
const Enrollment = require('../../models/enrollment_model');
const Session = require('../../models/training_course_model');
const TrainingCourse = require("../../models/training_course_model");
const STATUS = require("../../utils/httpStatus");
const TrainingProgram = require("../../models/training_program_model");
const dayjs = require("dayjs");
const mongoose = require("mongoose");
const Certificate = require("../../models/certificate_model");
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
        const sessionDate = dayjs(session.tc_date).startOf('day').toDate();
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
        const { programId } = req.params;

        // 1. Extract query parameters with defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'user.full_name'; // Default sort
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        if (!mongoose.Types.ObjectId.isValid(programId)) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "Invalid Program ID format" });
        }

        // 2. Fast count of total sessions
        const totalSessionsCount = await Session.countDocuments({ t_program: programId });

        // 3. The Aggregation Pipeline
        const pipeline = [
            // A. Match specific training program and approved enrollments
            { $match: { training_program: new mongoose.Types.ObjectId(programId), status: 'Approved' } },

            // 🚨 NEW: Check Certificates Collection 🚨
            // We do this BEFORE unwinding the user so we can match the raw ObjectIds safely
            {
                $lookup: {
                    from: 'certificates', // IMPORTANT: Verify this is your exact MongoDB collection name (usually pluralized)
                    let: { traineeId: '$user', pId: '$training_program' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user', '$$traineeId'] },
                                        { $eq: ['$training_program', '$$pId'] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1 } } // Optimization: We only need to know it exists, don't fetch the whole doc
                    ],
                    as: 'certificateDocs'
                }
            },

            // B. Join User Details
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

            // C. Join Attendance Records to calculate counts
            {
                $lookup: {
                    from: 'attendances',
                    localField: '_id',
                    foreignField: 'enrollmentId',
                    as: 'attendanceRecords'
                }
            },

            // D. Calculate total attended, percentage, AND set the certificate flag
            {
                $addFields: {
                    attendedCount: { $size: "$attendanceRecords" },
                    percentage: totalSessionsCount > 0
                        ? { $round: [{ $multiply: [{ $divide: [{ $size: "$attendanceRecords" }, totalSessionsCount] }, 100] }, 0] }
                        : 0,
                    // 🚨 NEW: Boolean flag based on whether the certificate lookup found anything 🚨
                    isCertificateGenerated: { $gt: [{ $size: "$certificateDocs" }, 0] }
                }
            },

            // E. Apply Search Filter
            ...(search ? [{
                $match: {
                    "user.full_name": { $regex: search, $options: 'i' }
                }
            }] : []),

            // F. Sort
            { $sort: { [sortBy]: sortOrder } },

            // G. Split into Pagination Data and Overall Metadata
            {
                $facet: {
                    metadata: [
                        {
                            $group: {
                                _id: null,
                                totalTrainees: { $sum: 1 },
                                avgPercentage: { $avg: "$percentage" }
                            }
                        }
                    ],
                    data: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        // Clean up the output by hiding the heavy arrays we used for calculations
                        { $project: { attendanceRecords: 0, certificateDocs: 0 } }
                    ]
                }
            }
        ];

        const result = await Enrollment.aggregate(pipeline);

        const metadata = result[0].metadata[0] || { totalTrainees: 0, avgPercentage: 0 };
        const data = result[0].data;

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            data: data,
            totalSessions: totalSessionsCount,
            totalItems: metadata.totalTrainees,
            totalPages: Math.ceil(metadata.totalTrainees / limit),
            currentPage: page,
            averagePercentage: Math.round(metadata.avgPercentage)
        });

    } catch (ex) {
        console.error("Attendance Sync Error:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: ex.message
        });
    }
},

    exports.getTraineeAttendanceDetails = async (req, res) => {
        const { traineeId } = req.params;
        const { trainingId } = req.query;
        let isCertificate = false;
        if (!mongoose.Types.ObjectId.isValid(traineeId) || !mongoose.Types.ObjectId.isValid(trainingId)) {
            return res.status(STATUS.OK).json({
                status: STATUS.BAD_REQUEST,
                message: "Invalid Trainee ID or Training ID format"
            });
        }
        const certificate = await Certificate.find({ user: traineeId, training_program: trainingId }).lean();

        if (certificate.length == 0) {
            isCertificate = false;
        } else {
            isCertificate = true;
        }
        console.log(isCertificate)
        try {
            const [program, sessions, traineeName, trainingCategory] = await Promise.all([
                TrainingProgram.findById(trainingId).select('t_name').lean(),
                Session.find({ t_program: trainingId }).sort({ tc_date: 1 }).lean(),
                User.findById(traineeId).select('full_name').lean(),
                TrainingProgram.findById(trainingId).populate('t_category').lean(),
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
                    trainingCategory: trainingCategory.t_category.name,
                    stats: {
                        totalSessions,
                        presentCount,
                        absentCount: totalSessions - presentCount,
                        attendancePercentage: attendancePercentage, // Returning as number for easier UI logic
                        isEligible: attendancePercentage >= 75
                    },
                    records: sessionDetails,
                    isCertificate: isCertificate
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
        const session = await TrainingCourse.findById(sessionId);
        if (!session) return res.status(STATUS.OK).json({ message: "Session not found." ,status:STATUS.NOT_FOUND});


        const now = dayjs();
        const sessionDateStr = dayjs(session.tc_date).format('YYYY-MM-DD');
        const startTime = dayjs(`${sessionDateStr} ${session.tc_start_time}`, 'YYYY-MM-DD HH:mm');
        const endTime = dayjs(`${sessionDateStr} ${session.tc_end_time}`, 'YYYY-MM-DD HH:mm');

        const attendance = await Attendance.create({
            user: userId,
            enrollmentId: enrollmentId,
            trainingId: session.t_program,
            sessionId: sessionId,
            date: dayjs(session.tc_date).startOf('day').toDate(),
            status: status,
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
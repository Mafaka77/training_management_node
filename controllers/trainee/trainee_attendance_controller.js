const Training=require('../../models/training_program_model');
const Session=require('../../models/training_course_model');
const Enrollment=require('../../models/enrollment_model');
const Attendance=require('../../models/attendance_model');
const mongoose=require("mongoose");
const STATUS=require('../../utils/httpStatus');
const Room=require('../../models/training_room_model');
const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
exports.getAttendance = async (req, res) => {
    try {
        const { trainingId } = req.params;
        const { date } = req.query;
        const userId = req.user.user.id;

        if (!mongoose.Types.ObjectId.isValid(trainingId)) {
            return res.status(STATUS.OK).json({ status: STATUS.BAD_REQUEST, message: "Invalid Training ID" });
        }

        // 1. Fetch Enrollment and ALL sessions for this program (to calculate global stats)
        const [enrollmentRecord, globalSessions] = await Promise.all([
            Enrollment.findOne({
                training_program: trainingId,
                user: userId,
                status: 'Approved'
            }).lean(),
            Session.find({ t_program: trainingId }).select('_id').lean()
        ]);

        if (!enrollmentRecord) {
            return res.status(STATUS.OK).json({ status: STATUS.NOT_FOUND, message: "No approved enrollment found." });
        }

        // 2. Get GLOBAL attendance for the dashboard header
        const globalAttendance = await Attendance.find({
            enrollmentId: enrollmentRecord._id,
            trainingId: trainingId // Ensure your model uses this field
        }).select('sessionId').lean();

        const globalAttendedCount = globalAttendance.length;
        const globalTotalSessions = globalSessions.length;
        const globalPercentage = globalTotalSessions > 0
            ? Math.round((globalAttendedCount / globalTotalSessions) * 100)
            : 0;

        // 3. Setup Date Filter for the List
        let sessionMatch = { t_program: new mongoose.Types.ObjectId(trainingId) };

        // Safety: Only filter if date is a valid string and not "null"/"undefined"
        if (date && date !== "null" && !isNaN(Date.parse(date))) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            sessionMatch.tc_date = { $gte: startOfDay, $lte: endOfDay };
        }

        // 4. Fetch the specific sessions for the selected day
        const filteredSessions = await Session.find(sessionMatch).sort({ tc_start_time: 1 }).lean();

        // 5. Create a set of attended session IDs for fast lookup
        const attendedSessionIds = new Set(globalAttendance.map(a => a.sessionId.toString()));

        // 6. Map only the filtered sessions for the UI list
        const sessionsData = filteredSessions.map(s => {
            const isPresent = attendedSessionIds.has(s._id.toString());
            return {
                sessionId: s._id,
                topic: s.tc_topic,
                date: s.tc_date,
                start_time: s.tc_start_time,
                end_time: s.tc_end_time,
                status: isPresent ? 'Present' : 'Absent',
                // If you need details, you'd need to fetch them, but for a daily list, status is usually enough
            };
        });

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            selectedDate: date || "All",
            // Global stats for the Dashboard Header
            totalSessions: globalTotalSessions,
            attendedCount: globalAttendedCount,
            percentage: globalPercentage,
            // List for the specific date
            sessions: sessionsData
        });

    } catch (ex) {
        console.error("Attendance API Error:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ status: STATUS.INTERNAL_SERVER_ERROR, message: ex.message });
    }
};

exports.markAttendance=async (req, res) => {
    try{
        const RADIUS_LIMIT = 50;
        const {sessionId,programId,lat,lng}=req.body;
        if (!mongoose.Types.ObjectId.isValid(programId)) {
            return res.status(STATUS.OK).json({ status: STATUS.BAD_REQUEST, message: "Invalid Training ID" });
        }
        const program=await Training.findOne({_id:programId}).lean();
        const session=await Session.findOne({_id:sessionId}).lean();
        const userId=req.user.user.id;
        const enrollment=await Enrollment.findOne({user:userId}).lean();
        if (!session.tc_start_time || !session.tc_end_time) {
            return res.status(STATUS.OK).json({
                status: STATUS.BAD_REQUEST,
                message: "This session does not have a valid start/end time set."
            });
        }
        const now = dayjs();
        const startTime = dayjs(session.tc_start_time, "HH:mm");
        const endTime = dayjs(session.tc_end_time, "HH:mm");
        const isTimeValid = now.isBetween(startTime, endTime, null, '[]');

        if (!isTimeValid) {
            if (now.isBefore(startTime)) {
                return res.status(STATUS.OK).json({
                    status: STATUS.FORBIDDEN,
                    message: `Too early! Attendance starts at ${session.tc_start_time}`
                });
            } else {
                return res.status(STATUS.OK).json({
                    status: STATUS.FORBIDDEN,
                    message: `Too late! Attendance closed at ${session.tc_end_time}`
                });
            }
        }
        const roomResults = await Room.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)] // [Long, Lat]
                    },
                    distanceField: "distInMeters", // New field added to response
                    maxDistance: RADIUS_LIMIT,
                    query: { _id: new mongoose.Types.ObjectId(program.t_room) },
                    spherical: true
                }
            }
        ]);

        if (roomResults.length === 0) {
            return res.status(STATUS.OK).json({
                status:STATUS.FORBIDDEN,
                message: "You are out of range"
            });
        }
        const roomWithDistance = roomResults[0];

        //MARK ATTENDANCE
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
        const attendance = await Attendance.create({
            user: userId,
            enrollmentId: enrollment._id,
            trainingId: programId,
            sessionId: sessionId,
            date: dayjs(session.tc_date).startOf('day').toDate(),
            status: 'Present',
            notes: `Session ${session.tc_session} marked at ${now.format('HH:mm')}`
        });
        return res.status(STATUS.OK).json({
            status:STATUS.OK,
            message: "Attendance marked!",
            distanceFromRoom: `${roomWithDistance.distInMeters.toFixed(2)} meters`
        });
    }catch(err){
        console.log(err);
    }
}
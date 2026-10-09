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
            const [program, sessions, trainee, trainingCategory, enrollment] = await Promise.all([
                TrainingProgram.findById(trainingId).select('t_name').lean(),
                Session.find({ t_program: trainingId }).sort({ tc_date: 1 }).lean(),
                User.findById(traineeId).select('full_name email mobile').lean(),
                TrainingProgram.findById(trainingId).populate('t_category').lean(),
                Enrollment.findOne({ user: traineeId, training_program: trainingId }).lean()
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
                    remarks: record ? record.remarks : "",
                    isMarked: !!record
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
                    traineeName: trainee,
                    enrollmentId: enrollment?._id || null,
                    programName: program.t_name,
                    trainingCategory: trainingCategory?.t_category?.name || '',
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
        let { userId, sessionId, enrollmentId, status } = req.body;
        status = status || 'Present';

        const session = await TrainingCourse.findById(sessionId);
        if (!session) return res.status(STATUS.OK).json({ message: "Session not found.", status: STATUS.NOT_FOUND });

        if (!enrollmentId && userId) {
            const enr = await Enrollment.findOne({ user: userId, training_program: session.t_program });
            if (enr) enrollmentId = enr._id;
        }

        const existingAttendance = await Attendance.findOne({
            user: userId,
            sessionId: sessionId
        });

        if (existingAttendance) {
            existingAttendance.status = status;
            if (enrollmentId) existingAttendance.enrollmentId = enrollmentId;
            await existingAttendance.save();
            return res.status(STATUS.OK).json({
                status: STATUS.OK,
                message: `Attendance updated to ${status}`,
                data: existingAttendance
            });
        }

        const now = dayjs();
        const attendance = await Attendance.create({
            user: userId,
            enrollmentId: enrollmentId,
            trainingId: session.t_program,
            sessionId: sessionId,
            date: dayjs(session.tc_date).startOf('day').toDate(),
            status: status,
            notes: `Session ${session.tc_session || ''} marked at ${now.format('HH:mm')}`
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

const ExcelJS = require('exceljs');

exports.exportProgramAttendance = async (req, res) => {
    try {
        const { programId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(programId)) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "Invalid Program ID format" });
        }

        const program = await TrainingProgram.findById(programId).lean();
        if (!program) {
            return res.status(STATUS.NOT_FOUND).json({ message: "Training program not found" });
        }

        // Fetch all sessions sorted chronologically
        const sessions = await Session.find({ t_program: programId })
            .sort({ tc_date: 1, tc_start_time: 1 })
            .lean();

        // Fetch all approved enrollments with user details
        const enrollments = await Enrollment.find({
            training_program: programId,
            status: 'Approved'
        })
            .populate('user', 'full_name email mobile department designation')
            .sort({ 'user.full_name': 1 })
            .lean();

        // Fetch all attendance records for this program
        const attendanceRecords = await Attendance.find({
            trainingId: programId
        }).lean();

        // Map attendance by `${userId}_${sessionId}`
        const attendanceMap = new Map();
        attendanceRecords.forEach(rec => {
            if (rec.user && rec.sessionId) {
                attendanceMap.set(`${rec.user.toString()}_${rec.sessionId.toString()}`, rec);
            }
        });

        // Group sessions by date
        const dateMap = new Map();
        sessions.forEach(s => {
            const dateStr = s.tc_date ? dayjs(s.tc_date).format('DD/MM/YYYY') : 'No Date';
            if (!dateMap.has(dateStr)) {
                dateMap.set(dateStr, []);
            }
            dateMap.get(dateStr).push(s);
        });

        // Create ExcelJS Workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Administrative Training Institute';
        workbook.created = new Date();
        const worksheet = workbook.addWorksheet('Attendance Sheet', {
            views: [{ showGridLines: true }]
        });

        // Palette of soft pastel colors for date groups
        const dateColorThemes = [
            { headerBg: 'DBEAFE', sessionBg: 'EFF6FF', text: '1E3A8A' }, // Soft Blue
            { headerBg: 'DCFCE7', sessionBg: 'F0FDF4', text: '14532D' }, // Soft Green
            { headerBg: 'FEF3C7', sessionBg: 'FFFBEB', text: '78350F' }, // Soft Amber
            { headerBg: 'EDE9FE', sessionBg: 'F5F3FF', text: '4C1D95' }, // Soft Purple
            { headerBg: 'FFEDD5', sessionBg: 'FFF7ED', text: '7C2D12' }, // Soft Orange
            { headerBg: 'FCE7F3', sessionBg: 'FDF2F8', text: '831843' }, // Soft Pink
            { headerBg: 'CFFAFE', sessionBg: 'ECFEFF', text: '164E63' }, // Soft Cyan
            { headerBg: 'E2E8F0', sessionBg: 'F8FAFC', text: '0F172A' }  // Soft Slate
        ];

        const thinBorder = {
            top: { style: 'thin', color: { argb: 'CBD5E1' } },
            left: { style: 'thin', color: { argb: 'CBD5E1' } },
            bottom: { style: 'thin', color: { argb: 'CBD5E1' } },
            right: { style: 'thin', color: { argb: 'CBD5E1' } }
        };

        const headerBorder = {
            top: { style: 'thin', color: { argb: '94A3B8' } },
            left: { style: 'thin', color: { argb: '94A3B8' } },
            bottom: { style: 'thin', color: { argb: '94A3B8' } },
            right: { style: 'thin', color: { argb: '94A3B8' } }
        };

        // Header Row 1: Base info columns + Date groups
        const row1 = worksheet.getRow(1);
        const row2 = worksheet.getRow(2);
        row1.height = 28;
        row2.height = 24;

        // Base static columns
        const baseHeaders = ['Sl No', 'Name', 'Designation', 'Office/Department'];
        baseHeaders.forEach((title, idx) => {
            const colNum = idx + 1;
            worksheet.mergeCells(1, colNum, 2, colNum);
            const cell = worksheet.getCell(1, colNum);
            cell.value = title;
            cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: '0F172A' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F1F5F9' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            cell.border = headerBorder;

            worksheet.getCell(2, colNum).border = headerBorder;
        });

        let currentCol = 5;
        const orderedSessions = [];
        let dateIndex = 0;

        for (const [dateStr, dateSessions] of dateMap.entries()) {
            const theme = dateColorThemes[dateIndex % dateColorThemes.length];
            dateIndex++;

            const startCol = currentCol;
            const endCol = currentCol + dateSessions.length - 1;

            // Merge Date header on Row 1
            if (dateSessions.length > 1) {
                worksheet.mergeCells(1, startCol, 1, endCol);
            }
            const dateCell = worksheet.getCell(1, startCol);
            dateCell.value = dateStr;
            dateCell.font = { name: 'Segoe UI', size: 10.5, bold: true, color: { argb: theme.text } };
            dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: theme.headerBg } };
            dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

            for (let c = startCol; c <= endCol; c++) {
                worksheet.getCell(1, c).border = headerBorder;
            }

            // Subheaders for Sessions on Row 2
            dateSessions.forEach((s, idx) => {
                orderedSessions.push({ ...s, theme });
                const sessionLabel = s.tc_session ? `Session ${s.tc_session}` : `Session ${idx + 1}`;
                const sessionCell = worksheet.getCell(2, currentCol);
                sessionCell.value = sessionLabel;
                sessionCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: theme.text } };
                sessionCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: theme.sessionBg } };
                sessionCell.alignment = { vertical: 'middle', horizontal: 'center' };
                sessionCell.border = headerBorder;
                currentCol++;
            });
        }

        // Summary columns at the end
        const summaryHeaders = [
            { title: 'Total Sessions', bg: 'F1F5F9', text: '334155' },
            { title: 'Attended', bg: 'DCFCE7', text: '14532D' },
            { title: 'Absent', bg: 'FEE2E2', text: '991B1B' },
            { title: 'Percentage', bg: 'E0E7FF', text: '3730A3' }
        ];

        summaryHeaders.forEach(sh => {
            worksheet.mergeCells(1, currentCol, 2, currentCol);
            const cell = worksheet.getCell(1, currentCol);
            cell.value = sh.title;
            cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: sh.text } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: sh.bg } };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            cell.border = headerBorder;
            worksheet.getCell(2, currentCol).border = headerBorder;
            currentCol++;
        });

        // Populate Trainee Data Rows
        enrollments.forEach((enr, index) => {
            const user = enr.user || {};
            const userIdStr = user._id ? user._id.toString() : '';
            const rowNumber = index + 3;
            const dataRow = worksheet.getRow(rowNumber);
            dataRow.height = 22;

            // Sl No
            const slCell = dataRow.getCell(1);
            slCell.value = index + 1;
            slCell.alignment = { vertical: 'middle', horizontal: 'center' };
            slCell.font = { name: 'Segoe UI', size: 9.5 };
            slCell.border = thinBorder;

            // Name
            const nameCell = dataRow.getCell(2);
            nameCell.value = user.full_name || 'N/A';
            nameCell.alignment = { vertical: 'middle', horizontal: 'left' };
            nameCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: '0F172A' } };
            nameCell.border = thinBorder;

            // Designation
            const desigCell = dataRow.getCell(3);
            desigCell.value = user.designation || 'N/A';
            desigCell.alignment = { vertical: 'middle', horizontal: 'left' };
            desigCell.font = { name: 'Segoe UI', size: 9 };
            desigCell.border = thinBorder;

            // Department
            const deptCell = dataRow.getCell(4);
            deptCell.value = user.department || 'N/A';
            deptCell.alignment = { vertical: 'middle', horizontal: 'left' };
            deptCell.font = { name: 'Segoe UI', size: 9 };
            deptCell.border = thinBorder;

            // Sessions
            let presentCount = 0;
            let colIdx = 5;
            orderedSessions.forEach(s => {
                const sIdStr = s._id.toString();
                const record = attendanceMap.get(`${userIdStr}_${sIdStr}`);
                const isPresent = record && record.status === 'Present';
                if (isPresent) presentCount++;

                const cell = dataRow.getCell(colIdx);
                cell.value = isPresent ? 'Present' : 'Absent';
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = thinBorder;

                if (isPresent) {
                    cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: '15803D' } };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F0FDF4' } };
                } else {
                    cell.font = { name: 'Segoe UI', size: 9, color: { argb: 'DC2626' } };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF2F2' } };
                }
                colIdx++;
            });

            const totalSessionsCount = orderedSessions.length;
            const absentCount = totalSessionsCount - presentCount;
            const pct = totalSessionsCount > 0 ? Math.round((presentCount / totalSessionsCount) * 100) : 0;

            // Total Sessions
            const totalCell = dataRow.getCell(colIdx++);
            totalCell.value = totalSessionsCount;
            totalCell.alignment = { vertical: 'middle', horizontal: 'center' };
            totalCell.font = { name: 'Segoe UI', size: 9.5 };
            totalCell.border = thinBorder;

            // Attended
            const attendedCell = dataRow.getCell(colIdx++);
            attendedCell.value = presentCount;
            attendedCell.alignment = { vertical: 'middle', horizontal: 'center' };
            attendedCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: '15803D' } };
            attendedCell.border = thinBorder;

            // Absent
            const absentCell = dataRow.getCell(colIdx++);
            absentCell.value = absentCount;
            absentCell.alignment = { vertical: 'middle', horizontal: 'center' };
            absentCell.font = { name: 'Segoe UI', size: 9.5, color: absentCount > 0 ? { argb: 'DC2626' } : { argb: '64748B' } };
            absentCell.border = thinBorder;

            // Percentage
            const pctCell = dataRow.getCell(colIdx++);
            pctCell.value = `${pct}%`;
            pctCell.alignment = { vertical: 'middle', horizontal: 'center' };
            pctCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: '4338CA' } };
            pctCell.border = thinBorder;
        });

        // Set generous, auto-fitted column widths
        worksheet.columns.forEach((column, i) => {
            let maxLen = 10;
            column.eachCell({ includeEmpty: false }, (cell) => {
                const cellLen = cell.value ? String(cell.value).length : 0;
                if (cellLen > maxLen) maxLen = cellLen;
            });
            if (i === 0) column.width = 8;        // Sl No
            else if (i === 1) column.width = Math.max(maxLen + 3, 24); // Name
            else if (i === 2) column.width = Math.max(maxLen + 3, 20); // Designation
            else if (i === 3) column.width = Math.max(maxLen + 3, 24); // Department
            else column.width = Math.max(maxLen + 3, 14);              // Sessions & metrics
        });

        const sanitizedProgramName = (program.t_name || 'attendance')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 50);

        const filename = `attendance-${sanitizedProgramName}-${dayjs().format('YYYY-MM-DD')}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        const buffer = await workbook.xlsx.writeBuffer();
        return res.status(200).send(buffer);

    } catch (ex) {
        console.error("Export Program Attendance Error:", ex);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Failed to export attendance"
        });
    }
};
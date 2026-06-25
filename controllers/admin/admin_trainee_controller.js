const User = require('../../models/user_model');
const STATUS = require('../../utils/httpStatus');
const Role = require("../../models/role_model");
const Group = require('../../models/group_model');
const District = require('../../models/district_model');
const bcrypt = require("bcryptjs");

exports.exportTraineeReport = async (req, res) => {
    try {
        const { reportType, completionStatus, groupId } = req.query;

        const traineeRole = await Role.findOne({ name: "Trainee" });
        if (!traineeRole) {
            return res.status(STATUS.NOT_FOUND).json({ message: "Trainee role not found" });
        }

        const query = { roles: traineeRole._id };

        // 1. Group Filter
        if (groupId && groupId !== 'all') {
            query.group = groupId;
        }

        // 2. Report Type Filters
        if (reportType === 'completion') {
            query.mandatory_completion = (completionStatus === 'completed');
        }

        // We fetch the users
        let users = await User.find(query)
            .populate('district', 'name')
            .populate('group', 'group_name')
            .lean();

        // 3. If "Latest Dues", calculate due date and filter/sort
        if (reportType === 'dues') {
            const now = new Date();
            // Filter to those who have NOT completed mandatory training yet
            users = users.filter(u => !u.mandatory_completion);

            // Add calculated due date
            users = users.map(user => {
                let dueDate = null;
                if (user.date_of_entry_in_present_grade) {
                    const entryDate = new Date(user.date_of_entry_in_present_grade);
                    dueDate = new Date(entryDate);
                    dueDate.setFullYear(entryDate.getFullYear() + 2);
                } else if (user.date_of_entry) {
                     const entryDate = new Date(user.date_of_entry);
                     dueDate = new Date(entryDate);
                     dueDate.setFullYear(entryDate.getFullYear() + 2);
                }
                return { ...user, mandatoryCourseDueDate: dueDate };
            });

            // Sort by earliest dues first (most overdue at top)
            users.sort((a, b) => {
                if (!a.mandatoryCourseDueDate) return 1;
                if (!b.mandatoryCourseDueDate) return -1;
                return a.mandatoryCourseDueDate - b.mandatoryCourseDueDate;
            });
        }

        // Create CSV String
        const headers = [
            "Name", "Email", "Mobile", "Department", "Designation", 
            "Group", "Mandatory Completed", "Date of Entry", "Due Date"
        ];
        
        const rows = users.map(u => {
            const groupName = u.group ? u.group.group_name : 'N/A';
            const mandatoryCompleted = u.mandatory_completion ? 'Yes' : 'No';
            let entryDate = 'N/A';
            if (u.date_of_entry_in_present_grade) {
                entryDate = new Date(u.date_of_entry_in_present_grade).toLocaleDateString('en-GB');
            } else if (u.date_of_entry) {
                entryDate = new Date(u.date_of_entry).toLocaleDateString('en-GB');
            }
            
            let dueDate = 'N/A';
            if (reportType === 'dues' && u.mandatoryCourseDueDate) {
                dueDate = new Date(u.mandatoryCourseDueDate).toLocaleDateString('en-GB');
            } else if (u.date_of_entry_in_present_grade) {
                const ed = new Date(u.date_of_entry_in_present_grade);
                ed.setFullYear(ed.getFullYear() + 2);
                dueDate = ed.toLocaleDateString('en-GB');
            } else if (u.date_of_entry) {
                const ed = new Date(u.date_of_entry);
                ed.setFullYear(ed.getFullYear() + 2);
                dueDate = ed.toLocaleDateString('en-GB');
            }

            // Escape quotes and wrap in quotes to handle commas in data
            const escapeCSV = (str) => `"${(str || '').toString().replace(/"/g, '""')}"`;

            return [
                escapeCSV(u.full_name),
                escapeCSV(u.email),
                escapeCSV(u.mobile),
                escapeCSV(u.department),
                escapeCSV(u.designation),
                escapeCSV(groupName),
                escapeCSV(mandatoryCompleted),
                escapeCSV(entryDate),
                escapeCSV(dueDate)
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=trainee-report-${Date.now()}.csv`);
        return res.status(200).send(csvContent);

    } catch (e) {
        console.error("Export Error: ", e);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to export report",
            status: STATUS.INTERNAL_SERVER_ERROR
        });
    }
};

exports.getAllTrainee = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;

        page = Math.max(1, parseInt(page));
        limit = parseInt(limit);
        const traineeRole = await Role.findOne({ name: "Trainee" });
        if (!traineeRole) {
            return res.status(STATUS.OK).json({ trainees: [], status: STATUS.NOT_FOUND });
        }
        const query = { roles: traineeRole._id };
        if (search) {
            query.$or = [
                { full_name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobile: { $regex: search, $options: "i" } },
                { department: { $regex: search, $options: "i" } }
            ];
        }
        const [total, trainees] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .populate('district', 'name')
                .populate('group', 'group_name')
                .select("-password -__v")
                .sort({ _id: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(STATUS.OK).json({
            success: true,
            trainees,
            pagination: {
                total,
                page,
                limit,
                totalPages: totalPages || 1,
            },
            status: STATUS.OK,
        });
    } catch (e) {
        console.log(e);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR,
        });
    }
};

exports.createTrainee = async (req, res) => {
    try {
        // 1. Destructure groups from req.body
        const { full_name, email, mobile, password, department, district, group, gender, designation, mandatory_completion, dob, date_of_entry, date_of_entry_in_present_grade, date_of_superannuation, recruitment, confirmation, service_cadre, disclaimer, is_govt_employee, service, category, qualification } = req.body;

        // Basic validation
        if (!full_name || !email || !mobile || !password) {
            return res.status(STATUS.OK).json({
                message: "All fields are required",
                status: STATUS.BAD_REQUEST,
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(STATUS.OK).json({
                message: "User with this email already exists",
                status: STATUS.CONFLICT,
            });
        }

        const role = await Role.findOne({ name: "Trainee" });
        if (!role) {
            return res.status(STATUS.OK).json({
                message: "Trainee role not found in database",
                status: STATUS.NOT_FOUND,
            });
        }
        const ngo = await Group.findOne({ group_name: 'NGO' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Create new trainee with groups array
        const newTrainee = new User({
            full_name,
            gender,
            email,
            mobile,
            department,
            designation,
            district,
            mandatory_completion: mandatory_completion || false,
            password: hashedPassword,
            roles: [role._id], // Roles is usually an array in your model
            group: is_govt_employee ? group : ngo._id,
            dob,
            date_of_entry,
            date_of_entry_in_present_grade,
            date_of_superannuation,
            recruitment,
            confirmation,
            service_cadre,
            disclaimer: disclaimer || false,
            is_govt_employee: is_govt_employee || false,
            service,
            category,
            qualification
        });

        await newTrainee.save();
        return res.status(STATUS.OK).json({
            message: "Trainee created successfully",
            status: STATUS.CREATED,
        });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR,
        });
    }
}

exports.getTraineeById = async (req, res) => {
    try {
        const trainee = await User.findById(req.params.traineeId).populate('district').populate('group');
        if (!trainee) {
            return res.status(STATUS.OK).json({
                message: "Trainee not found",
                status: STATUS.NOT_FOUND,
            });
        }
        return res.status(STATUS.OK).json({
            trainee,
            status: STATUS.OK,
        });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR,
        });
    }
}
exports.blacklistTrainee = async (req, res) => {
    try {
        const trainee = await User.findById(req.params.traineeId);

        if (!trainee) {
            return res.status(STATUS.OK).json({
                message: "Trainee not found",
                status: STATUS.NOT_FOUND,
            });
        }
        if (req.body.revoke === true) {
            trainee.is_blacklisted = false;
            trainee.blacklist_details = {
                reason: null,
                end_date: null
            };
            await trainee.save();
            return res.status(STATUS.OK).json({
                message: "Trainee restriction revoked successfully",
                status: STATUS.OK,
            });
        }
        trainee.is_blacklisted = true;
        trainee.blacklist_details = {
            reason: req.body.reason,
            end_date: req.body.end_date,
            created_at: new Date()
        };
        await trainee.save();
        return res.status(STATUS.OK).json({
            message: "Trainee blacklisted successfully",
            status: STATUS.OK,
        });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR,
        });
    }
}
exports.updateTrainee = async (req, res) => {
    try {
        const trainee = await User.findById(req.params.traineeId);

        if (!trainee) {
            return res.status(STATUS.OK).json({
                message: "Trainee not found",
                status: STATUS.NOT_FOUND,
            });
        }
        trainee.full_name = req.body.full_name;
        trainee.email = req.body.email;
        trainee.mobile = req.body.mobile;
        trainee.department = req.body.department;
        trainee.designation = req.body.designation;
        trainee.district = req.body.district;
        trainee.group = req.body.group;
        trainee.gender = req.body.gender;
        trainee.mandatory_completion = req.body.mandatory_completion;
        await trainee.save();
        return res.status(STATUS.OK).json({
            message: "Trainee updated successfully",
            status: STATUS.OK,
        });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR,
        });
    }
}
exports.deleteTrainee = async (req, res) => {
    try {
        const trainee = await User.findByIdAndDelete(req.params.traineeId);
        if (!trainee) {
            return res.status(STATUS.OK).json({
                message: "Trainee not found",
                status: STATUS.NOT_FOUND,
            });
        }
        return res.status(STATUS.OK).json({
            message: "Trainee deleted successfully",
            status: STATUS.OK,
        });
    } catch (e) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: e.message,
            status: STATUS.INTERNAL_SERVER_ERROR,
        });
    }
}




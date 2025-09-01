const User=require('../../models/user_model');
const Enrollment=require('../../models/enrollment_model');
const STATUS=require('../../utils/httpStatus');

exports.getAllEnrollment = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 10,
            search = "",
            sortOrder = "asc", // asc | desc
            status = "" // filter by enrollment status
        } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        // Build filter object
        let filter = {};

        if (status) {
            filter.status = status; // e.g., Pending, Approved, Rejected
        }

        if (search) {
            // Case-insensitive search in user name or training program name
            filter.$or = [
                { "user.name": { $regex: search, $options: "i" } },
                { "training_program.title": { $regex: search, $options: "i" } }
            ];
        }

        // Sorting (status ascending/descending)
        let sort = { status: sortOrder === "desc" ? -1 : 1 };

        // Query with population
        const enrollments = await Enrollment.find(filter)
            .populate("user")
            .populate("training_program")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        // Count total for pagination
        const total = await Enrollment.countDocuments(filter);

        res.status(STATUS.OK).json({
            status: STATUS.OK,
            enrollments,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Server Error"
        });
    }
};
exports.getEnrollmentById= async (req, res) => {
    try {
        const { enrollmentId } = req.params;

        const enrollment = await Enrollment.findById(enrollmentId)
            .populate("user")
            .populate("training_program");

        if (!enrollment) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Enrollment not found"
            });
        }

        res.status(STATUS.OK).json({
            status: STATUS.OK,
            enrollment
        });
    } catch (error) {
        console.error("Error fetching enrollment by ID:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Server Error"
        });
    }
}
exports.updateEnrollmentStatus= async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ["Pending", "Approved", "Rejected", "Waitlisted"];
        if (!validStatuses.includes(status)) {
            return res.status(STATUS.OK).json({
                status: STATUS.BAD_REQUEST,
                message: "Invalid status value"
            });
        }

        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Enrollment not found"
            });
        }

        enrollment.status = status;
        await enrollment.save();

        res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: "Enrollment status updated successfully",
            enrollment
        });
    } catch (error) {
        console.error("Error updating enrollment status:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Server Error"
        });
    }
}
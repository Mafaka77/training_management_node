const User=require('../../models/user_model');
const Enrollment=require('../../models/enrollment_model');
const TrainingProgram=require('../../models/training_program_model');
const STATUS=require('../../utils/httpStatus');
const mongoose=require('mongoose');
exports.getAllEnrollment = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 10,
            search = "",
            sortOrder = "desc",
            status = ""
        } = req.query;

        page = Math.max(1, parseInt(page));
        limit = parseInt(limit);
        console.log(req.query);
        const pipeline = [
            {
                $lookup: {
                    from: 'users', 
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'trainingprograms', 
                    localField: 'training_program',
                    foreignField: '_id',
                    as: 'training_program'
                }
            },
            { $unwind: { path: '$training_program', preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    ...(status && status !== 'All' ? { status: status } : {}),
                    ...(search ? {
                        $or: [
                            { "user.full_name": { $regex: search, $options: "i" } },
                            { "training_program.t_name": { $regex: search, $options: "i" } }
                        ]
                    } : {})
                }
            }
        ];
        const countResult = await mongoose.model('Enrollment').aggregate([
            ...pipeline, 
            { $count: "total" }
        ]);
        const total = countResult.length > 0 ? countResult[0].total : 0;
        pipeline.push(
            { $sort: { createdAt: sortOrder === "desc" ? -1 : 1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
        );

        const enrollments = await mongoose.model('Enrollment').aggregate(pipeline);

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
        console.error("Aggregation Error:", error);
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Error fetching paginated enrollments"
        });
    }
};
exports.getEnrollmentById= async (req, res) => {
    try {
        const { enrollmentId } = req.params;

        const enrollment = await Enrollment.findById(enrollmentId)
            .populate({
                path:'user',
                select:'full_name email department designation mobile',
                populate:{
                    path:'group',
                    select:'group_name'
                }
            })
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
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Server Error"
        });
    }
}
exports.updateEnrollmentStatus = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        // Destructure 'status' directly from req.body
        const { status } = req.body; 
        console.log(status);
        // 1. Validation: Ensure status exists and is valid
        const validStatuses = ["Pending", "Approved", "Rejected", "Waitlisted"];
        if (!status || !validStatuses.includes(status)) {
            return res.status(STATUS.OK).json({
                status: STATUS.BAD_REQUEST,
                message: `Invalid status. Please choose: ${validStatuses.join(", ")}`
            });
        }

        // 2. Fetch Enrollment with User and Training info
        const enrollment = await Enrollment.findById(enrollmentId).populate('training_program');
        if (!enrollment) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Enrollment not found"
            });
        }

        // 3. Capacity Logic (Only if the admin is trying to Approve)
        if (status === "Approved") {
            const training = enrollment.training_program;
            
            // Count currently approved users, excluding THIS user 
            // (in case they were already approved, we don't want to double count)
            const approvedCount = await Enrollment.countDocuments({
                training_program: training._id,
                status: 'Approved',
                _id: { $ne: enrollmentId } 
            });

            if (approvedCount >= training.t_capacity) {
                console.log('a khat');
                return res.status(STATUS.OK).json({
                    status: STATUS.BAD_REQUEST,
                    message: `Training Capacity full (${training.t_capacity}).`
                });
            }
        }
        // 4. Save Status
        enrollment.status = status;
        await enrollment.save();
        // 6. Final Response
        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: `Enrollment marked as ${status} successfully`,
        });

    } catch (error) {
        console.error("Enrollment Update Error:", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Something went wrong on the server."
        });
    }
};
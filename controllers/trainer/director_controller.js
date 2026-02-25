const TrainingProgram=require('../../models/training_program_model');
const STATUS=require('../../utils/httpStatus');
exports.getPrograms = async (req, res) => {
    try {
        // 1. Extract params with defaults
        let { page = 1, limit = 4, search = "", status = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const directorId = req.user.user.id;
        const filter = { t_director: directorId };

        // 3. Add Search functionality (Case-insensitive)
        if (search) {
            filter.t_name = { $regex: search, $options: "i" };
        }

        // 4. Add Status filtering
        if (status && status !== "All") {
            filter.t_status = status;
        }

        // 5. Get total count for this specific Director + Filters
        const total = await TrainingProgram.countDocuments(filter);

        // 6. Fetch paginated and populated programs
        const programs = await TrainingProgram.find(filter)
            .populate("t_director") // Full director details
            .populate("t_category", "name")
            .populate("t_room", "room_name")
            .populate("t_eligibility", "group_name")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        return res.status(STATUS.OK).json({
            programs,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            status: STATUS.OK,
        });

    } catch (error) {
        console.error('Error in getPrograms:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: error.message || 'Server Error'
        });
    }
};
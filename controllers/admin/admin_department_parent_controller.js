const DepartmentParent = require('../../models/department_parent_model');
const STATUS = require('../../utils/httpStatus');

exports.getAllDepartmentParents = async (req, res) => {
    try {
        const departmentParents = await DepartmentParent.find().sort({ name: 1 });
        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            departmentParents
        });
    } catch (error) {
        console.error("Error fetching department parents:", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Internal server error"
        });
    }
};

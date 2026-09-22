const DepartmentParent = require('../../models/department_parent_model');
const User = require('../../models/user_model');
const STATUS = require('../../utils/httpStatus');

exports.getAllDepartmentParents = async (req, res) => {
    try {
        let { page, limit, search = "" } = req.query;

        const filter = {};
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { code: { $regex: search, $options: "i" } }
            ];
        }

        // If pagination is requested
        if (page) {
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const skip = (page - 1) * limit;

            const departmentParents = await DepartmentParent.find(filter)
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit);

            const total = await DepartmentParent.countDocuments(filter);

            return res.status(STATUS.OK).json({
                status: STATUS.OK,
                departmentParents,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        }

        // If no pagination requested (dropdown compatibility and full listings)
        const departmentParents = await DepartmentParent.find(filter).sort({ name: 1 });
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

exports.getDepartmentParentById = async (req, res) => {
    try {
        const { id } = req.params;
        const departmentParent = await DepartmentParent.findById(id);
        if (!departmentParent) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Department not found"
            });
        }
        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            departmentParent
        });
    } catch (error) {
        console.error("Error fetching department parent by ID:", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Internal server error"
        });
    }
};

exports.createDepartmentParent = async (req, res) => {
    try {
        const { name, code } = req.body;

        if (!name || !name.trim()) {
            return res.status(STATUS.OK).json({
                status: STATUS.BAD_REQUEST,
                message: "Department name is required"
            });
        }

        const trimmedName = name.trim();
        const trimmedCode = code ? code.trim() : undefined;

        const existing = await DepartmentParent.findOne({
            name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        });

        if (existing) {
            return res.status(STATUS.OK).json({
                status: STATUS.CONFLICT,
                message: "A department with this name already exists"
            });
        }

        const departmentParent = new DepartmentParent({
            name: trimmedName,
            code: trimmedCode
        });

        await departmentParent.save();

        return res.status(STATUS.OK).json({
            status: STATUS.CREATED,
            message: "Department created successfully",
            departmentParent
        });
    } catch (error) {
        console.error("Error creating department parent:", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Internal server error"
        });
    }
};

exports.updateDepartmentParent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code } = req.body;

        const departmentParent = await DepartmentParent.findById(id);
        if (!departmentParent) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Department not found"
            });
        }

        if (name && name.trim()) {
            const trimmedName = name.trim();
            const existing = await DepartmentParent.findOne({
                _id: { $ne: id },
                name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
            });

            if (existing) {
                return res.status(STATUS.OK).json({
                    status: STATUS.CONFLICT,
                    message: "A department with this name already exists"
                });
            }
            departmentParent.name = trimmedName;
        }

        if (code !== undefined) {
            departmentParent.code = code ? code.trim() : '';
        }

        await departmentParent.save();

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: "Department updated successfully",
            departmentParent
        });
    } catch (error) {
        console.error("Error updating department parent:", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Internal server error"
        });
    }
};

exports.deleteDepartmentParent = async (req, res) => {
    try {
        const { id } = req.params;

        const departmentParent = await DepartmentParent.findById(id);
        if (!departmentParent) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: "Department not found"
            });
        }

        const userCount = await User.countDocuments({ departmentParent: id });
        if (userCount > 0) {
            return res.status(STATUS.OK).json({
                status: STATUS.CONFLICT,
                message: `Cannot delete: ${userCount} user(s) are currently assigned to this department.`
            });
        }

        await DepartmentParent.findByIdAndDelete(id);

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: "Department deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting department parent:", error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: "Internal server error"
        });
    }
};


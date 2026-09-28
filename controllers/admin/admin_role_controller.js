const Role = require('../../models/role_model');
const User = require('../../models/user_model');
const STATUS = require('../../utils/httpStatus');

/**
 * Get all roles (with optional pagination, search, and user counts)
 */
exports.getAllRoles = async (req, res) => {
    try {
        let { page, limit, search = '' } = req.query;

        const filter = {};
        if (search && search.trim()) {
            filter.name = { $regex: search.trim(), $options: 'i' };
        }

        if (page) {
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;
            const skip = (page - 1) * limit;

            const roles = await Role.find(filter)
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit)
                .lean();

            // Attach user counts for each role
            const rolesWithCount = await Promise.all(
                roles.map(async (role) => {
                    const userCount = await User.countDocuments({ roles: role._id });
                    return {
                        ...role,
                        userCount
                    };
                })
            );

            const total = await Role.countDocuments(filter);

            return res.status(STATUS.OK).json({
                status: STATUS.OK,
                roles: rolesWithCount,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        }

        // If no pagination requested (e.g. for dropdowns or full list)
        const roles = await Role.find(filter).sort({ name: 1 }).lean();
        const rolesWithCount = await Promise.all(
            roles.map(async (role) => {
                const userCount = await User.countDocuments({ roles: role._id });
                return {
                    ...role,
                    userCount
                };
            })
        );

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            roles: rolesWithCount
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: 'Internal server error'
        });
    }
};

/**
 * Get single role by ID
 */
exports.getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findById(id).lean();

        if (!role) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: 'Role not found'
            });
        }

        const userCount = await User.countDocuments({ roles: id });

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            role: {
                ...role,
                userCount
            }
        });
    } catch (error) {
        console.error('Error fetching role by ID:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: 'Internal server error'
        });
    }
};

/**
 * Create a new role
 */
exports.createRole = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(STATUS.OK).json({
                status: STATUS.BAD_REQUEST,
                message: 'Role name is required'
            });
        }

        const trimmedName = name.trim();
        const existing = await Role.findOne({
            name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
        });

        if (existing) {
            return res.status(STATUS.OK).json({
                status: STATUS.CONFLICT,
                message: 'A role with this name already exists'
            });
        }

        const role = new Role({
            name: trimmedName,
            description: description ? description.trim() : ''
        });

        await role.save();

        return res.status(STATUS.OK).json({
            status: STATUS.CREATED,
            message: 'Role created successfully',
            role
        });
    } catch (error) {
        console.error('Error creating role:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: 'Internal server error'
        });
    }
};

/**
 * Update an existing role
 */
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const role = await Role.findById(id);
        if (!role) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: 'Role not found'
            });
        }

        if (name && name.trim()) {
            const trimmedName = name.trim();
            const existing = await Role.findOne({
                _id: { $ne: id },
                name: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
            });

            if (existing) {
                return res.status(STATUS.OK).json({
                    status: STATUS.CONFLICT,
                    message: 'A role with this name already exists'
                });
            }
            role.name = trimmedName;
        }

        if (description !== undefined) {
            role.description = description ? description.trim() : '';
        }

        await role.save();

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: 'Role updated successfully',
            role
        });
    } catch (error) {
        console.error('Error updating role:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: 'Internal server error'
        });
    }
};

/**
 * Delete a role
 */
exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findById(id);
        if (!role) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: 'Role not found'
            });
        }

        // Prevent deletion if users are currently assigned to this role
        const userCount = await User.countDocuments({ roles: id });
        if (userCount > 0) {
            return res.status(STATUS.OK).json({
                status: STATUS.CONFLICT,
                message: `Cannot delete: ${userCount} user(s) are currently assigned to this role.`
            });
        }

        // Prevent deleting core system Admin role
        if (role.name.toLowerCase() === 'admin') {
            return res.status(STATUS.OK).json({
                status: STATUS.FORBIDDEN,
                message: 'The Admin role is a core system role and cannot be deleted.'
            });
        }

        await Role.findByIdAndDelete(id);

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            message: 'Role deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting role:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: 'Internal server error'
        });
    }
};

/**
 * Get users assigned to a specific role
 */
exports.getRoleUsers = async (req, res) => {
    try {
        const { id } = req.params;
        let { page = 1, limit = 10, search = '' } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const role = await Role.findById(id);
        if (!role) {
            return res.status(STATUS.OK).json({
                status: STATUS.NOT_FOUND,
                message: 'Role not found'
            });
        }

        const filter = { roles: id };
        if (search && search.trim()) {
            filter.$or = [
                { full_name: { $regex: search.trim(), $options: 'i' } },
                { email: { $regex: search.trim(), $options: 'i' } },
                { mobile: { $regex: search.trim(), $options: 'i' } },
                { designation: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        const users = await User.find(filter)
            .populate('district', 'name')
            .populate('departmentParent', 'name code')
            .populate('roles', 'name')
            .sort({ full_name: 1 })
            .skip(skip)
            .limit(limit)
            .select('-password');

        const total = await User.countDocuments(filter);

        return res.status(STATUS.OK).json({
            status: STATUS.OK,
            role,
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching role users:', error);
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            status: STATUS.INTERNAL_SERVER_ERROR,
            message: 'Internal server error'
        });
    }
};

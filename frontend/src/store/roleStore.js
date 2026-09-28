import { defineStore } from "pinia";
import api from "../api/axios.js";

export const useRoleStore = defineStore('roleStore', {
    state: () => ({
        roles: [],
        isLoading: false,
        currentRole: null,
        roleUsers: [],
        isUsersLoading: false,
        pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1,
        },
        usersPagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1,
        }
    }),

    actions: {
        /**
         * Fetch paginated list of roles with search
         */
        async fetchRoles(page = 1, search = '', limit = 10) {
            this.isLoading = true;
            try {
                const response = await api.get('/roles', {
                    params: {
                        page,
                        search,
                        limit
                    }
                });

                if (response.data.status === 200 && response.data.roles) {
                    this.roles = response.data.roles;
                    if (response.data.pagination) {
                        this.pagination = response.data.pagination;
                    } else {
                        this.pagination = {
                            total: response.data.roles.length,
                            page: 1,
                            limit: response.data.roles.length,
                            totalPages: 1,
                        };
                    }
                } else {
                    this.roles = [];
                    this.pagination = { total: 0, page: 1, limit: 10, totalPages: 1 };
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
                this.roles = [];
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Fetch all roles without pagination (e.g. for select dropdowns)
         */
        async fetchAllRoles() {
            try {
                const response = await api.get('/roles');
                if (response.data.status === 200 && response.data.roles) {
                    return response.data.roles;
                }
                return [];
            } catch (error) {
                console.error("Error fetching all roles:", error);
                return [];
            }
        },

        /**
         * Fetch a single role by ID
         */
        async fetchRole(id) {
            this.isLoading = true;
            try {
                const response = await api.get(`/role/${id}`);
                if (response.data.status === 200 && response.data.role) {
                    this.currentRole = response.data.role;
                    return { success: true, role: response.data.role };
                }
                return { success: false, message: response.data.message || "Role not found" };
            } catch (error) {
                console.error("Error fetching role:", error);
                return { success: false, message: error.response?.data?.message || "Failed to load role details" };
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Create a new role
         */
        async createRole(roleData) {
            this.isLoading = true;
            try {
                const response = await api.post('/role', roleData);
                if (response.data.status === 201) {
                    return { success: true, message: response.data.message || "Role created successfully", role: response.data.role };
                }
                return { success: false, message: response.data.message || "Failed to create role" };
            } catch (error) {
                console.error("Error creating role:", error);
                return {
                    success: false,
                    message: error.response?.data?.message || "Failed to create role"
                };
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Update an existing role
         */
        async updateRole(id, roleData) {
            this.isLoading = true;
            try {
                const response = await api.put(`/role/${id}`, roleData);
                if (response.data.status === 200) {
                    return { success: true, message: response.data.message || "Role updated successfully", role: response.data.role };
                }
                return { success: false, message: response.data.message || "Failed to update role" };
            } catch (error) {
                console.error("Error updating role:", error);
                return {
                    success: false,
                    message: error.response?.data?.message || "Failed to update role"
                };
            } finally {
                this.isLoading = false;
            }
        },

        /**
         * Delete a role
         */
        async deleteRole(id) {
            try {
                const response = await api.delete(`/role/${id}`);
                if (response.data.status === 200) {
                    return { success: true, message: response.data.message || "Role deleted successfully" };
                }
                return { success: false, message: response.data.message || "Failed to delete role" };
            } catch (error) {
                console.error("Error deleting role:", error);
                return {
                    success: false,
                    message: error.response?.data?.message || "Failed to delete role"
                };
            }
        },

        /**
         * Fetch users assigned to a specific role
         */
        async fetchRoleUsers(id, page = 1, search = '', limit = 10) {
            this.isUsersLoading = true;
            try {
                const response = await api.get(`/role/${id}/users`, {
                    params: {
                        page,
                        search,
                        limit
                    }
                });

                if (response.data.status === 200) {
                    this.roleUsers = response.data.users || [];
                    this.currentRole = response.data.role || this.currentRole;
                    this.usersPagination = response.data.pagination || {
                        total: this.roleUsers.length,
                        page: 1,
                        limit: 10,
                        totalPages: 1
                    };
                    return { success: true, users: this.roleUsers, role: response.data.role };
                }
                return { success: false, message: response.data.message || "Failed to load role users" };
            } catch (error) {
                console.error("Error fetching role users:", error);
                this.roleUsers = [];
                return {
                    success: false,
                    message: error.response?.data?.message || "Failed to fetch assigned users"
                };
            } finally {
                this.isUsersLoading = false;
            }
        }
    }
});

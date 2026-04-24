import { defineStore } from "pinia";
import api from "../api/axios.js";

export const useEnrollmentStore = defineStore('enrollment', {
    state: () => ({
        enrollments: [],
        enrollment: {},
        isLoading: false,
        isEnrollmentLoading: false,
        pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1
        },
        filters: {
            status: 'All',
            search: '',
        },
        isFoundation: false,
        foundationUsers: [],
        foundationPagination: {
            totalRecords: 0,
            currentPage: 1,
            totalPages: 1,
            limit: 12
        },
        userHistory: [],


    }),
    actions: {

        async fetchEnrollments(params) {
            try {
                const response = await api.get('/enrollments', { params });
                if (response.data.status === 200) {
                    this.enrollments = response.data.enrollments;
                    this.pagination = response.data.pagination;
                }
            } catch (error) {
                console.error("Fetch Error", error);
            }
        },
        async fetchEnrollmentsByProgram(id, params) {
            this.isEnrollmentLoading = true;
            try {
                const response = await api.get(`/enrollments/${id}`, { params });

                if (response.data.status === 200) {
                    this.enrollments = response.data.enrollments;
                    this.pagination = response.data.pagination;
                    this.isFoundation = response.data.isFoundation;
                }
            } catch (error) {
                console.error("Fetch Error", error);
            } finally {
                this.isEnrollmentLoading = false;
            }
        },
        async fetchEnrollmentById(id) {
            this.isLoading = true
            try {
                const response = await api.get(`/enrollment/${id}`);

                this.enrollment = response.data.enrollment;
                this.userHistory = response.data.userHistory;
                this.isLoading = false;
            } catch (ex) {
                this.isLoading = false;
            }
        },
        async updateEnrollmentStatus(id, data) {

            try {
                const response = await api.patch(`/enrollment/${id}`, {
                    status: data
                });
                const statusCode = response.status === 200 && response.data.status === 200;
                if (statusCode) {
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }

            } catch (ex) {
                return { success: false, message: ex }
            }
        },
        async searchFoundationUsers(query) {
            this.isLoading = true;
            try {
                const response = await api.get(`/enrollment/foundation-users?search=${query}`);
                if (response.data.status === 200) {
                    this.foundationUsers = response.data.users;
                }
            } catch (ex) { }
            finally {
                this.isLoading = false;
            }
        },
        async enrollInTraining(trainingId, userId) {
            this.isLoading = true;
            try {
                const response = await api.post(`/enrollment/${trainingId}`, {
                    userId: userId
                });
                if (response.status === 200 && response.data.status === 201) {
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            } catch (ex) {
                return { success: false, message: ex.message }
            }
            finally {
                this.isLoading = false;
            }
        },
        async getFoundationUsersByGroup(trainingId, params = {}) {
            this.isLoading = true;
            try {
                // Construct the query parameters
                const queryParams = {
                    page: params.page || 1,
                    limit: params.limit || 12, // 12 fits nicely in a 1, 2, or 3 column grid
                    search: params.search || '',
                    sortBy: params.sortBy || 'mandatoryCourseDueDate',
                    sortOrder: params.sortOrder || 'asc'
                };

                const response = await api.get(`/enrollment/foundation-users/group/${trainingId}`, {
                    params: queryParams
                });

                if (response.status === 200 && response.data.status === 200) {
                    this.foundationUsers = response.data.data;
                    this.foundationPagination = response.data.pagination;
                    console.log(this.foundationUsers);
                }
            } catch (ex) {
                console.error("Failed to fetch foundation users:", ex);
            } finally {
                this.isLoading = false;
            }
        },
        async fetchTraineeEnrollmentHistory(userId) {
            this.isLoading = true;
            try {
                const response = await api.get(`/enrollment/history/${userId}`);
                if (response.status === 200 && response.data.status === 200) {
                    this.userHistory = response.data.data;
                    return { success: true, message: 'History Found' }
                }
                if (response.status === 200 && response.data.status === 204) {
                    return { success: false, message: 'No history found' }
                }
                return { success: false, message: 'Error Occured' }
            } catch (ex) {
                return { success: false, message: ex.message }
            }
            finally {
                this.isLoading = false;
            }
        },
        async fetchEnrollmentDetails(enrollmentId) {
            try {
                var response = await api.get(`/enrollment/${enrollmentId}/details`);
                if (response.status === 200 && response.data.status === 200) {
                    this.enrollment = response.data.enrollment;
                    this.userHistory = response.data.userHistory;
                    return { success: true, message: 'Enrollment Details Found' }
                }
                return { success: false, message: 'Enrollment Details Not Found' }
            } catch (ex) {
                return { success: false, message: ex.message }
            }
        }

    }
});
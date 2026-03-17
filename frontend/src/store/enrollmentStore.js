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
                return { success: false, message: response.ex.message }
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
        }
    }
});
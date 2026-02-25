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
        }
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
        async fetchEnrollmentsByProgram(id,params) {
            try {
                const response = await api.get(`/enrollments/${id}`, { params });
                if (response.data.status === 200) {
                    this.enrollments = response.data.enrollments;
                    this.pagination = response.data.pagination;
                }
            } catch (error) {
                console.error("Fetch Error", error);
            }
        },
        async fetchEnrollmentById(id) {
            this.isLoading = true
            try {
                const response = await api.get(`/enrollment/${id}`);
                console.log(response.data);
                this.enrollment = response.data.enrollment;
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
                console.log(response.data);
                if (response.status === 200) {
                    if (response.data.status === 400) {
                        return { success: false, message: response.data.message }
                    } else if (response.data.status === 404) {
                        return { success: false, message: response.data.message }
                    } else if (response.data.status === 200) {
                        return { success: true, message: response.data.message }
                    }

                }
                return { success: false, message: response.data.message }
            } catch (ex) {
                return { success: false, message: response.ex.message }
            }
        }
    }
});
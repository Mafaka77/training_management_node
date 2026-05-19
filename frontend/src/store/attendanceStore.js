import { defineStore } from "pinia";
import api from "../api/axios.js";

export const useAttendanceStore = defineStore('attendance', {
    state: () => ({
        isAttendanceLoading: false,
        trainees: [],
        sessionTopic: '',
        attendanceData: [],
        totalSessions: 0,
        traineeAttendance: {},
        isCertificate: false,
        currentPage: 1,
        itemsPerPage: 10,
        searchQuery: '',
        sortBy: 'user.full_name',
        sortOrder: 'asc',
        totalItems: 0,
        totalPages: 1,


    }),
    actions: {
        async fetchSessionAttendance(id) {
            this.isAttendanceLoading = true;
            try {
                const response = await api.get(`/session/${id}/attendance`);
                console.log(response.data);
                this.trainees = response.data.trainees;
                this.sessionTopic = response.data.session_topic;
            } catch (e) {

            } finally {
                this.isAttendanceLoading = false;
            }
        },
        // Make sure you add these to your state():
        // totalItems: 0, totalPages: 1, currentPage: 1, averagePercentage: 0, isAttendanceLoading: false

        async fetchAttendances(id) {
            this.isAttendanceLoading = true;
            try {
                // The API reads the parameters directly from the store's state
                const response = await api.get(`/training/${id}/attendance`, {
                    params: {
                        page: this.currentPage,
                        limit: this.itemsPerPage,
                        search: this.searchQuery,
                        sortBy: this.sortBy,
                        sortOrder: this.sortOrder
                    }
                });
                console.log(response.data)
                if (response.status === 200) {
                    this.attendanceData = response.data.data;
                    this.totalSessions = response.data.totalSessions;
                    this.totalItems = response.data.totalItems;
                    this.totalPages = response.data.totalPages;

                    // The backend might return 0 pages if the search is empty, ensure minimum 1
                    this.currentPage = response.data.currentPage || 1;
                    this.averagePercentage = response.data.averagePercentage;
                }
            } catch (e) {
                console.error("Fetch Attendance Error:", e);
            } finally {
                this.isAttendanceLoading = false;
            }
        },
        // Helper action to reset filters when leaving a specific training program entirely
        resetQueryState() {
            this.currentPage = 1;
            this.searchQuery = '';
            this.sortBy = 'user.full_name';
            this.sortOrder = 'asc';
        },
        async fetchTraineeAttendance(id, trainingId) {
            this.isAttendanceLoading = true;
            try {
                const response = await api.get(`/trainee/${id}/attendance`, {
                    params: {
                        trainingId: trainingId
                    }
                });
                console.log(response.data.data)
                this.traineeAttendance = response.data.data;
                this.isCertificate = response.data.data.isCertificate || false;

            } catch (e) { } finally {
                this.isAttendanceLoading = false;
            }
        },

    }
})
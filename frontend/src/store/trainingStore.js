import { defineStore } from "pinia";
import api from "../api/axios.js";

export const useTrainingStore = defineStore('training', {
    state: () => ({
        isLoading: false,
        programs: [],
        categories: [],
        rooms: [],
        groups: [],
        directors: [],
        page: 1,
        total: 0,
        totalPages: 1,
        search: '',
        status: 'All',
    }),
    actions: {
        async fetchTrainings(targetPage) {
            this.isLoading = true;
            try {
                if (targetPage !== null) {
                    this.page = targetPage;
                }
                const response = await api.get('/get-all-training-program', {
                    params: {
                        page: this.page,
                        search: this.search,
                        status: this.status,
                    }
                });
                this.programs = response.data.programs;
                this.page = response.data.page;
                this.total = response.data.total;
                this.totalPages = response.data.totalPages;

            } catch (error) {
                console.error('Error fetching trainings:', error);
            } finally {
                this.isLoading = false;
            }
        },
        async fetchTraining(id) {

            try {
                const response = await api.get(`/program/${id}`);
                console.log(response.data.training);
                return response.data.training;
            } catch (error) {
                console.error('Error fetching training:', error);
            }
        },
        async fetchCategories() {
            try {
                const response = await api.get('/get-training-category');
                this.categories = response.data.categories;

            } catch (error) { }
        },
        async fetchRooms() {
            try {
                const response = await api.get('/get-training-room');
                this.rooms = response.data.rooms;

            } catch (e) {

            }
        },
        async fetchGroups() {
            try {
                const response = await api.get('/get-all-groups');
                this.groups = response.data.groups;
            } catch (e) {

            }
        },
        async submitTraining(formData) {
            console.log(formData);
            try {
                const response = await api.post('/submit-training-program', formData);
                if (response.status === 200) {
                    if (response.data.status === 400) {
                        return { success: false, message: response.data.message }
                    } else if (response.data.status === 409) {
                        return { success: false, message: response.data.message }
                    } else if (response.data.status === 201) {
                        return { success: true, message: response.data.message }
                    } else {
                        return { success: false, message: response.data.message || 'Error Occured' }
                    }
                } else {
                    return { success: false, message: e.message || 'Error Occured' }
                }
            } catch (e) {
                console.log(e);
                return { success: false, message: e.message || 'Error Occured' }
            }
        },
        async updateTraining(id, formData) {
            console.log(formData);
            try {
                const response = await api.put(`/program/${id}`, formData);
                const statusCode = response.status === 200 || response.data.status === 200;
                if (statusCode) {
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            } catch (e) {
                return { success: false, message: e.message || 'Error Occured' }
            }
        },
        async updateStatus(id) {
            try {
                const response = await api.put(`/program/${id}/status`)
                const statusCode = response.status || response.data.status;
                if (statusCode === 200) {
                    return { success: true, message: response.data.message }
                } else {
                    return { success: false, message: response.data.message }
                }
            } catch (ex) {
                return { success: false, message: ex.message }
            }
        },
        async fetchDirectors() {
            try {
                const response = await api.get('/directors');
                this.directors = response.data.data;
                console.log(response.data.data);
            } catch (error) {
                console.error('Error fetching directors:', error);
            }
        },
    },
});






















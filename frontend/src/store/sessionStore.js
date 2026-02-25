import { defineStore } from "pinia";
import api from "../api/axios";


export const useSessionStore = defineStore('session', {
    state: () => ({
        sessions: [],
        isSessionLoading: false,
        trainers: [],
        materials: [],
        isMaterialLoading: false,
        expandedDates:new Set(),
        activeTab:'schedule'
    }),
    actions: {
        async fetchSession(id) {
            try {
                const response = await api.get(`/programs/${id}/courses`);
                this.sessions = response.data.courses;
            } catch (ex) { }
        },
        async getTrainers() {
            try {
                var response = await api.get('/trainers');
                this.trainers = response.data.trainers;
            } catch (ex) { }
        },
        async submitSession(formData) {
            console.log(formData);
            try {
                const response = await api.post('/submit-training-course', formData);
                const statusCode = response.data.status || response.status;
                if (statusCode === 201 || statusCode === 200) {
                    return { success: true, message: response.data.message };
                }

                return { success: false, message: response.data.message };
            } catch (ex) {
                return { success: false, message: ex.message }
            }
        },
        async updateSession(formData, id) {
            try {
                const response = await api.put(`/course/${id}`, formData);
                const statusCode = response.data.status || response.status;
                if (statusCode === 200) {
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            } catch (ex) {
                return { success: false, message: ex.message }
            }
        },
        async fetchMaterials(id) {
            try {
                var response = await api.get(`/materials/${id}`);
                console.log(response.data);
                this.materials = response.data.materials
            } catch (ex) { }
        },
        async submitMaterial(formData) {
            console.log(formData)
            try {
                const response = await api.post("/material", formData);
                const statusCode = response.status || response.data.status;
                if (statusCode === 200 || statusCode === 201) {
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            } catch (ex) {
                return { success: false, message: ex.message }
            }
        },
        async deleteMaterial(id) {
            try {
                const response = await api.delete(`/material/${id}`);
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
        async deleteSession(id) {
            try {
                const response = await api.delete(`/course/${id}`);
                const statusCode = response.status === 200 || response.data.status === 200;
                if (statusCode) {
                    return { success: true, message: response.data.message }
                }
                return { success: false, nessage: response.data.message }
            } catch (ex) {
                return { success: false, message: ex.message }
            }
        },

    }
})
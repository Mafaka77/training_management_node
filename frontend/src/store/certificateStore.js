import { defineStore } from "pinia";
import api from "../api/axios";
export const useCertificateStore = defineStore('certificate', {
    state: () => ({
        certificates: {},
        isLoading: false,
        training: {},
        users: [],
    }),
    actions: {
        async generateReleaseOrder(trainingId) {
            this.isLoading = true;
            try {
                const response = await api.get(`/training/${trainingId}/release-order/generate`)
                console.log(response.data);
                if (response.status === 200 && response.data.status === 200) {
                    this.training = response.data.training
                    this.users = response.data.users
                    // return { success: true, data: response.data, message: response.data.message }
                }
                // return { success: false, message: response.data.message }
            } catch (ex) {
                // return { success: false, message: ex.response.data.message }
            } finally {
                this.isLoading = false;
            }
        },
        async downloadReleaseOrder(trainingId) {
            try {
                const response = await api.get(`/training/${trainingId}/release-order/download`, {
                    responseType: 'blob'
                })
                return response
            } catch (ex) { }
        }
    },
});
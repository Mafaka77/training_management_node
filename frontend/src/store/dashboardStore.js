import { defineStore } from "pinia";
import api from '../api/axios';
import {useAuthStore} from "./authStore.js";
export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        notifications: [],
        stats:[],
        trainings:[],

    }),
    actions: {
        async fetchNotification() {
            try {
                const response = await api.get('/notifications');
                this.notifications = response.data.notifications;
            } catch (ex) { }
        },
        async readNotification(id) {
            try {
                const response = await api.patch(`/notification/${id}/read`);
                const statusCode = response.status === 200 || response.data.status === 200;
                if (statusCode) {
                    return { success: true }
                }
                return { success: false, message: 'Something went wrong!!' }
            } catch (ex) {
                return { success: false, message: 'Something went wrong!!' }
            }
        },
       async fetchHomeStats() {
            try{
                const response = await api.get('/stats');
                console.log(response.data);
                this.stats = response.data.stats;
                this.trainings = response.data.trainings;
            }catch(err){}
        }
    }
})
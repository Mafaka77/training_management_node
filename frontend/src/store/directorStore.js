import { defineStore } from 'pinia';
import api from '../api/axios.js';

export const useDirectorStore = defineStore('directorStore', {
    state: () => ({
        programs: [],
    }),
    actions: {
        async fetchPrograms() {
            try {
                const response = await api.get('/director/program');
                console.log(response.data);
                this.programs = response.data.programs;
            } catch (error) {
                console.error('Failed to fetch programs:', error);
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
    },
}); 
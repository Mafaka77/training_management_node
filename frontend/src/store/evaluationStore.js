import { defineStore } from "pinia";
import api from "../api/axios";
export const useEvaluationStore = defineStore('evaluation', {
    state: () => ({
        evaluations: [],
        isLoading: false,
        isSaving: false
    }),
    actions: {
        async fetchEvaluationQuestions() {
            this.isLoading = true;
            try {
                const response = await api.get(`/evaluation-questions`)

                if (response.status === 200 && response.data.status === 200) {
                    this.evaluations = response.data.data;
                }
            } catch (ex) {
            } finally {
                this.isLoading = false;
            }
        },
        async storeEvaluation(payload) {
            this.isSaving = true;
            try {
                const response = await api.post('/evaluation-question', payload);
                if (response.status === 200 & response.data.status === 201) {
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            } catch (ex) {
                return { success: false, message: ex.message }
            } finally {
                this.isSaving = false
            }
        },
        async deleteEvaluationQuestion(id) {
            try {
                const response = await api.delete(`/evaluation-question/${id}`)
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            } catch (ex) {
                return { success: false, message: ex.message }
            }
        }
    },
});
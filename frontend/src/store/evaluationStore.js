import { defineStore } from "pinia";
import api from "../api/axios";
export const useEvaluationStore = defineStore('evaluation', {
    state: () => ({
        evaluations: [],
        isLoading: false,
        isSaving: false,
        traineeEvaluations: [],
        traineeEvaluationIsLoading: false,
        currentPage: 1,
        totalPages: 0,
        total: 0,
        itemsPerPage: 10,
        sortKey: 'createdAt',
        sortOrder: 'desc',
        evaluation: {},

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
        },
        async fetchTraineeEvaluation(id) {
            this.traineeEvaluationIsLoading = true;
            try {
                const response = await api.get(`/evaluations/training/${id}`, {
                    params: {
                        page: this.currentPage,
                        limit: this.itemsPerPage,
                        sortBy: this.sortKey,
                        sortOrder: this.sortOrder,
                    }
                });

                if (response.status === 200 && response.data.status === 200) {
                    this.traineeEvaluations = response.data.data;
                    this.currentPage = response.data.meta.currentPage;
                    this.totalPages = response.data.meta.totalPages;
                    this.totalItems = response.data.meta.totalItems;
                    this.itemsPerPage = response.data.meta.itemsPerPage;
                }
            } catch (ex) {
                console.error("Fetch Evaluations Error:", ex);
            } finally {
                this.traineeEvaluationIsLoading = false;
            }
        },
        async fetchEvaluationById(id) {
            this.isLoading = true;
            try {
                const response = await api.get(`/evaluations/${id}`);
                console.log(response.data)
                if (response.status === 200 && response.data.status === 200) {
                    this.evaluation = response.data.data;
                }
            } catch (ex) {
                console.error("Fetch Evaluation Error:", ex);
            } finally {
                this.isLoading = false;
            }
        }
    },
});
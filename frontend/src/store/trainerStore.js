import { defineStore } from "pinia";
import api from "../api/axios.js";

export const useTrainerStore = defineStore("trainer", {
    state: () => ({
        trainings: [],
        loading: false,
        status: 'Ongoing', // Default to All
        pagination: {
            total: 0,
            page: 1,
            totalPages: 1,
            limit: 10,
        },
        trainees:[],
        sessionTopic:'',
        isAttendanceLoading:false,
        isSubmitLoading:false,
        materials:[],
        isMaterialLoading:false,
    }),
    actions: {
        async fetchTrainings() {
            this.loading = true;
            try {
                // Map 'All' to an empty string so the backend filter doesn't trigger
                const statusParam = this.status === 'All' ? '' : this.status;

                const response = await api.get("/trainer/training/program", {
                    params: {
                        page: this.pagination.page,
                        status: statusParam,
                        limit: this.pagination.limit
                    }
                });
                console.log(response);
                this.trainings = response.data.data;
                this.pagination = response.data.pagination;
            } catch (error) {
                console.error("Failed to fetch trainings:", error);
                // You could link this to an alertStore here
            } finally {
                this.loading = false;
            }
        },

        // Action to change page
        async setPage(newPage) {
            if (newPage >= 1 && newPage <= this.pagination.totalPages) {
                this.pagination.page = newPage;
                await this.fetchTrainings();
            }
        },

        // Action to change status filter
        async setStatus(newStatus) {
            this.status = newStatus;
            this.pagination.page = 1; // Reset to page 1 when filter changes
            await this.fetchTrainings();
        },

        async fetchTrainees(id){
            this.isAttendanceLoading = true;
            try{
                const response=await api.get(`/trainer/session/${id}/trainees`)
                this.trainees = response.data.trainees;
                this.sessionTopic = response.data.session_topic;
            }catch(error){}finally {
        this.isAttendanceLoading = false;
            }
        },
        async markAttendance(data,sessionId){
            this.isAttendanceLoading = true;
            try{
                const response=await api.post(`/trainer/attendance/trainee/${sessionId}`,data);
                const statusCode=response.status===200 && response.data.status===200;
                if(statusCode){
                    return {success:true,message:response.data.message};
                }
                return {success:false,message:response.data.message};
            }catch(error){
                return {success:false,message:error.message};
            }finally {
                this.isAttendanceLoading = false;
            }
        },
        async fetchMaterials(programId){
            try{
                const response=await api.get(`/trainer/training/${programId}/materials`);
                console.log(response)
                this.materials = response.data.data;

            }catch(error){

            }finally {

            }
        },
        async submitMaterial(formData) {
            try {
                const response = await api.post("/material", formData);
                const statusCode = response.status===200 && response.data.status===201;
                if (statusCode) {
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            } catch (ex) {
                return { success: false, message: ex.message }
            }
        },
        async deleteMaterial(id) {
            this.isMaterialLoading = true;
            try {
                const response = await api.delete(`/material/${id}`);
                const statusCode = response.status===200 && response.data.status===200;
                if (statusCode) {
                    return { success: true, message: response.data.message }
                } else {
                    return { success: false, message: response.data.message }
                }
            } catch (ex) {
                return { success: false, message: ex.message }
            }finally {
                this.isMaterialLoading = false;
            }
        },

    }
});
































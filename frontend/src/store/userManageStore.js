import {defineStore} from "pinia";
import api from "../api/axios.js";

export const useUserManageStore=defineStore('userManageStore',{
    state:()=>({
        trainers:[],
        isLoading:true,
        districts:[],
        trainees:[],
        isTraineeLoading:true,
        groups:[],
        traineePage:1,
        traineeTotalPages:1,
        traineesTotal:0,
        employees:[],

    
    }),
    actions:{
        async fetchTrainers(){
            try{
                this.isLoading=true;
                const response=await api.get('/trainers');
                this.trainers=response.data.trainers;
                this.isLoading=false;
            }catch (e) {
                this.isLoading=false;
            }
        },
        async fetchDistricts(){
            try{
                const response=await api.get('/districts');
                this.districts=response.data.districts;
            }catch (e) {

            }
        },
        async submitTrainer(trainerData){
            try{
                const response=await api.post('/trainer',trainerData);
                if(response.status === 200){
                    if(response.data.status === 400){
                        return {success:false,message:response.data.message};
                    }else if(response.data.status === 409){
                        return {success:false,message:response.data.message};
                    }else if(response.data.status === 201){
                        return {success:true,message:response.data.message};
                    }
                }else{
                    return {success:false,message:"Server Error. Please try again later."};
                }
            }catch (e) {
               return {success:false,message:"Server Error. Please try again later."};
            }
        },

        async deleteTrainer(trainerId){
            try{
                const response=await api.delete(`/trainer/${trainerId}`);
                if(response.status === 200){
                    if(response.data.status === 200){
                        return {success:true,message:response.data.message};
                    }else{
                        return {success:false,message:response.data.message};
                    }
                }else{
                    return {success:false,message:"Server Error. Please try again later."};
                }
            }catch (e) {
                return {success: false, message: "Server Error. Please try again later."};
            }
        },
        async fetchTrainee(page=1,search=''){
            this.isTraineeLoading=true;
            try{
                const response=await api.get('/trainees',{
                    params:{
                        page:page,
                        search:search,
                        limit:3
                    }
                });
                console.log(response.data);
                this.trainees=response.data.trainees;
                this.traineePage=response.data.pagination.page;
                this.traineeTotalPages=response.data.pagination.totalPages;
                this.traineesTotal=response.data.pagination.total;
                this.isTraineeLoading=false;
            }catch (e) {
                this.isTraineeLoading=false;
            }
        },
        async submitTrainee(traineeData){
            try{
                const response=await api.post('/trainee',traineeData);
                if(response.status === 200){
                    if(response.data.status === 400){
                        return {success:false,message:response.data.message};
                    }else if(response.data.status === 409){
                        return {success:false,message:response.data.message};
                    }else if(response.data.status === 201){
                        return {success:true,message:response.data.message};
                    }
                }else{
                    return {success:false,message:"Server Error. Please try again later."};
                }
            }catch (e) {
               return {success:false,message:"Server Error. Please try again later."};
            }
        },
        async fetchGroups(){
            try{
                const response=await api.get('/get-all-groups');
                this.groups=response.data.groups;
            }catch (e) {

            }
        },
        async deleteTrainee(traineeId){
            try{}catch (e) {}
        },
        async submitEmployee(data){
            try{
                const response=await api.post('/employee',data);
                const statusCode=response.status===200 && response.data.status===201;
                if(statusCode){
                    return {success:true,message:response.data.message};
                }
                return {success:false,message:response.data.message};
            }catch (e) {
                return {success:false,message:"Server Error. Please try again later."};
            }
        },
        async fetchEmployees(){
            try{
                this.isLoading=true;
                const response=await api.get('/employees');
                this.employees=response.data.trainers;
                console.log(response.data);
                this.isLoading=false;
            }catch (e) {
                this.isLoading=false;
            }
        }

    }

});
























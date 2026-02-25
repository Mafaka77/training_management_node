import {defineStore} from "pinia";
import api from "../api/axios.js";

export const useAttendanceStore=defineStore('attendance',{
    state:()=>({
        isAttendanceLoading:false,
        trainees:[],
        sessionTopic:'',
        attendanceData:[],
        totalSessions:0,
        traineeAttendance:{}


    }),
    actions:{
        async fetchSessionAttendance(id){
            this.isAttendanceLoading = true;
            try{
                const response=await api.get(`/session/${id}/attendance`);
                console.log(response.data);
                this.trainees=response.data.trainees;
                this.sessionTopic=response.data.session_topic;
            }catch (e) {

            }finally {
                this.isAttendanceLoading = false;
            }
        },
        async fetchAttendances(id){
            try{
                const response=await api.get(`/training/${id}/attendance`);
                console.log(response.data.data);
                this.attendanceData=response.data.data;
                this.totalSessions=response.data.totalSessions
            }catch (e) {}finally {

            }
        },
        async fetchTraineeAttendance(id,trainingId){
            try{
                const response=await api.get(`/trainee/${id}/attendance`,{
                    params:{
                        trainingId:trainingId
                    }
                });
                this.traineeAttendance=response.data.data;
                console.log(response.data.data);
            }catch (e) {}finally {

            }
        }
 
    }
})
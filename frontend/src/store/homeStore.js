import {defineStore} from "pinia";
import axios from "axios";
const URL=import.meta.env.VITE_BASE_URL;
export const useHomeStore = defineStore('home',{
    state:()=>({
        trainings:[],
        loading:false,
        hasMore:true
    }),
    actions:{
        async fetchPrograms(page=1){
            try{
                const response=await axios.get(`${URL}/api/programs?page=${page}&limit=6`);
                const newTrainings=response.data.data;
                if(page===1){
                    this.trainings = newTrainings;
                }else{
                    this.trainings = [...this.trainings,...newTrainings];
                }
                this.hasMore=newTrainings.length === 6;
            }catch(err){
                console.log(err);
            }finally {
                this.loading=false;
            }

        },
        async fetchCalendar(month, year) {
            const res = await axios.get(`${URL}/api/trainings/calendar`, {
                params: { month, year }
            });
            console.log(res.data);
            this.trainings = res.data.data;
        }
    },

})
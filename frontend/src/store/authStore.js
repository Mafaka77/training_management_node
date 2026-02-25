import { defineStore } from "pinia"
import api from "../api/axios.js"

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: localStorage.getItem("token") || null,
        user: (() => {
            try {
                return JSON.parse(localStorage.getItem("user"))
            } catch {
                return null
            }
        })(),
        roles: (() => {
            try {
                return JSON.parse(localStorage.getItem("role"))
            } catch {
                return null
            }
        })(),
        loading: false,
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
        isAdmin: (state) => state.roles === "Admin",
        isTrainer: (state) => state.roles === "Trainer",
        isTrainee: (state) => state.roles === "Trainee",
        isEmployee: (state) => state.roles === "Employee",
        isDirector:(state)=>state.roles === "Director",
    },

    actions: {
        async login(email, password) {
            this.loading = true
            try {
                const res = await api.post("/login", {
                    email,
                    password,
                })
                const statusCode=res.status===200 && res.data.status===200;
                if(statusCode){
                    this.token = res.data.token
                    this.user = res.data.user
                    this.roles = res.data.user.roles
                    localStorage.setItem("token", this.token)
                    localStorage.setItem("user", JSON.stringify(this.user))
                    localStorage.setItem("role", JSON.stringify(this.roles))
                    return {success:true, message:res.data.message}
                }
                return {success:false, message:res.data.message}
            } catch (err) {
                return {success:false, message:err.message}
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.token = null
            this.user = null

            localStorage.removeItem("token")
            localStorage.removeItem("user")
        },
    },
})

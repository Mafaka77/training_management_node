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
        role: (() => {
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
        isAdmin: (state) => state.role === "Admin",
        isTrainer: (state) => state.role === "Trainer",
        isTrainee: (state) => state.role === "Trainee",
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
                    this.role = res.data.user.roles[0]
                    localStorage.setItem("token", this.token)
                    localStorage.setItem("user", JSON.stringify(this.user))
                    localStorage.setItem("role", JSON.stringify(this.role))
                    return {success:true, message:res.data.message}
                }
                return {success:false, message:"An error occurred during login."}
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

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
        // Initialize as an array to prevent .includes() / .some() crashes
        roles: (() => {
            try {
                const stored = JSON.parse(localStorage.getItem("role"));
                if (!stored) return [];
                return Array.isArray(stored) ? stored : [stored];
            } catch {
                return []
            }
        })(),
        loading: false,
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
        // Update getters to handle the array structure
        isAdmin: (state) => state.roles.includes("Admin"),
        isTrainer: (state) => state.roles.includes("Trainer"),
        isTrainee: (state) => state.roles.includes("Trainee"),
        isEmployee: (state) => state.roles.includes("Employee"),
        isDirector: (state) => state.roles.includes("Director"),
    },

    actions: {
        async login(email, password) {
            this.loading = true
            try {
                const res = await api.post("/login", { email, password })

                // Simplified check: checking res.data.success or status
                if (res.status === 200 && res.data.token) {
                    this.token = res.data.token
                    this.user = res.data.user

                    // Ensure roles is always saved/set as an array
                    const userRoles = res.data.user.roles;
                    this.roles = Array.isArray(userRoles) ? userRoles : [userRoles];

                    localStorage.setItem("token", this.token)
                    localStorage.setItem("user", JSON.stringify(this.user))
                    localStorage.setItem("role", JSON.stringify(this.roles))

                    return { success: true, message: res.data.message }
                }
                return { success: false, message: res.data?.message || "Login failed" }
            } catch (err) {
                return { success: false, message: err.response?.data?.message || err.message }
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.token = null
            this.user = null
            this.roles = []
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("role")
        },
    },
})
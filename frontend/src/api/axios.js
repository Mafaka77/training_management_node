import axios from "axios"
import router from "../router/index.js"
import { useAuthStore } from "../store/authStore.js"

// create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
})

api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore()

        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)
api.interceptors.response.use(
    (response) => response,

    (error) => {
        const authStore = useAuthStore()

        // auto logout if unauthorized
        if (error.response?.status === 401) {
            authStore.logout()
            router.push("/login")
        }

        return Promise.reject(error)
    }
)

export default api

import { useAuthStore } from "../../store/authStore"

export default function auth({ next }) {
    const authStore = useAuthStore()

    if (!authStore.isLoggedIn) {
        return next({ name: "login" })
    }

    return next()
}
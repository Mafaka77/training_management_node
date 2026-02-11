import { useAuthStore } from "../../store/authStore"

export default function guest({ next }) {
    const authStore = useAuthStore()

    if (authStore.isLoggedIn) {
        // if(authStore.isTrainer){
        //     return next({ name: "trainer.dashboard" })
        // }
        return next({ name: "admin.dashboard" })
    }

    return next()
}
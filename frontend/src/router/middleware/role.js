import { useAuthStore } from "../../store/authStore"

export default function role({ to, next }) {
    const authStore = useAuthStore()
    const userRole = authStore.role

    if (!to.meta.roles) {
        return next()
    }
    if (authStore.isLoggedIn && !userRole) {
        return next()
    }
    if(userRole==='Trainer') {
        if (to.name === 'trainer.dashboard') {
            return next()
        }
        if (to.meta.roles && !to.meta.roles.includes('Trainer')) {
            return next({ name: 'trainer.dashboard' })
        }
    }
    if (!to.meta.roles.includes(userRole)) {
        console.warn("Access Denied: Insufficient Permissions")
        return next({ name: "admin.dashboard" })
    }

    return next()
}

import { defineStore } from "pinia"

let id = 0

export const useAlertStore = defineStore("alert", {
    state: () => ({
        alerts: [],
    }),

    actions: {
        add(type, message, timeout = 3000) {
            const alert = {
                id: id++,
                type,
                message,
            }

            this.alerts.push(alert)

            if (timeout) {
                setTimeout(() => {
                    this.remove(alert.id)
                }, timeout)
            }
        },

        success(msg) {
            this.add("success", msg)
        },

        error(msg) {
            this.add("error", msg)
        },

        warning(msg) {
            this.add("warning", msg)
        },

        info(msg) {
            this.add("info", msg)
        },

        remove(id) {
            this.alerts = this.alerts.filter(a => a.id !== id)
        },
    },
})

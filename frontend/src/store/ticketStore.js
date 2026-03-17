import { defineStore } from "pinia";
import api from "../api/axios.js";

export const useTicketStore = defineStore('ticket', {
    state: () => ({
        tickets: [],
        isTicketLoading: false,
        pagination: {
            totalPages: 1,
            limit: 10,
            total: 0,
            page: 1,
        },
        ticket: {},

    }),
    actions: {
        async fetchTickets(page = 1, search = '') {
            this.isTicketLoading = true;
            try {
                const response = await api.get('/tickets', {
                    params: {
                        page: page,
                        search: search,
                    }
                });
                console.log(response.data);
                this.tickets = response.data.tickets;
                this.pagination = response.data.pagination;
            }
            catch (error) {
                console.error('Error fetching tickets:', error);
            }
            finally {
                this.isTicketLoading = false;
            }
        },
        async fetchTicket(id) {
            this.isTicketLoading = true;
            try {
                const response = await api.get(`/ticket/${id}`);
                this.ticket = response.data.ticket;
            }
            catch (error) {
                console.error('Error fetching ticket:', error);
            }
            finally {
                this.isTicketLoading = false;
            }
        },
        async replyTicket(id, message) {
            try {
                const response = await api.post(`/ticket/${id}/replies`, message);
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            }
            catch (error) {
                console.error('Error replying to ticket:', error);
                return { success: false, message: error.message }
            }
        },
        async updateTicketStatus(id, status) {
            try {
                const response = await api.put(`/ticket/${id}/status`, {
                    status: status
                });
                if (response.status === 200 && response.data.status === 200) {
                    return { success: true, message: response.data.message }
                }
                return { success: false, message: response.data.message }
            }
            catch (error) {
                console.error('Error updating ticket:', error);
                return { success: false, message: error.message }
            }
        },

    }
});
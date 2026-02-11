import { defineStore } from "pinia";
import api from "../api/axios.js";

export const useTicketStore = defineStore('ticket', {
    state: () => ({
        tickets: [],
        isTicketLoading: false,
        ticketPage: 1,
        ticketTotalPages: 1,
        ticketTotal: 0,
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
            }
            catch (error) {
                console.error('Error fetching tickets:', error);
            }
            finally {
                this.isTicketLoading = false;
            }
        },
        async fetchTicket(id) {
            try {
                const response = await api.get(`/tickets/${id}`);
                this.ticket = response.data.ticket;
            }
            catch (error) {
                console.error('Error fetching ticket:', error);
            }
        },
        async fetchTicketMessages(id) {
            try {
                const response = await api.get(`/tickets/${id}/messages`);
                this.ticketMessages = response.data.messages;
            }
            catch (error) {
                console.error('Error fetching ticket messages:', error);
            }
        },
        async fetchTicketMessages(id) {
            try {
                const response = await api.get(`/tickets/${id}/messages`);
                this.ticketMessages = response.data.messages;
            }
            catch (error) {
                console.error('Error fetching ticket messages:', error);
            }
        }
    }
});
<template>
    <div class="max-w-7xl mx-auto pb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 class="text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight italic">Support
                    Tickets</h1>
                <p class="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-1">Manage and respond to trainee
                    inquiries</p>
            </div>

            <div class="flex items-center gap-3">
                <div class="relative">
                    <input type="text" placeholder="Search tickets..."
                        class="pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none w-64 transition-all" />
                    <svg class="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div
                class="p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-sm">
                <p class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Total Open</p>
                <p class="text-2xl font-black text-zinc-900 dark:text-zinc-100">{{ pagination.total || 0 }}</p>
            </div>
        </div>

        <div
            class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div v-if="isTicketLoading" class="flex flex-col items-center justify-center py-20">
                <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p class="mt-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Syncing Tickets...</p>
            </div>

            <div v-else-if="tickets.length > 0" class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-zinc-50/50 dark:bg-white/[0.02] border-b border-zinc-100 dark:border-white/5">
                            <th class="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                Reference</th>
                            <th class="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Subject
                            </th>
                            <th class="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Trainee
                            </th>
                            <th
                                class="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">
                                Status</th>
                            <th
                                class="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-100 dark:divide-white/5">
                        <tr v-for="ticket in tickets" :key="ticket._id"
                            class="group hover:bg-zinc-50/50 dark:hover:bg-white/[0.01] transition-colors">
                            <td class="px-6 py-4">
                                <span class="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">#{{
                                    ticket.ticket_id || ticket._id.slice(-6).toUpperCase() }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[200px]">{{
                                    ticket.subject }}</p>
                                <p class="text-[10px] text-zinc-500 font-medium italic mt-0.5">{{
                                    formatDate(ticket.createdAt) }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-6 h-6 rounded-full bg-zinc-200 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold">
                                        {{ ticket.user?.full_name?.charAt(0) }}
                                    </div>
                                    <span class="text-xs font-bold text-zinc-600 dark:text-zinc-400">{{
                                        ticket.user?.full_name }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex justify-center">
                                    <span :class="getStatusClass(ticket.status)"
                                        class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border">
                                        {{ ticket.status }}
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <router-link :to="{ name: 'ticket.edit', params: { id: ticket._id } }"
                                    class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-500 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 transition-all shadow-sm">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                            d="M9 5l7 7-7 7" />
                                    </svg>
                                </router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else class="py-20 text-center">
                <p class="text-xs font-bold text-zinc-400 uppercase tracking-widest italic">No tickets found in the
                    system</p>
            </div>

            <div
                class="p-4 border-t border-zinc-100 dark:border-white/5 bg-zinc-50/30 dark:bg-white/[0.01] flex items-center justify-between">
                <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
                </p>
                <div class="flex gap-2">
                    <button @click="prevPage" :disabled="pagination.currentPage === 1"
                        class="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border border-zinc-200 dark:border-white/10 disabled:opacity-30 hover:bg-white dark:hover:bg-white/5 transition-all">
                        Prev
                    </button>
                    <button @click="nextPage" :disabled="pagination.currentPage === pagination.totalPages"
                        class="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border border-zinc-200 dark:border-white/10 disabled:opacity-30 hover:bg-white dark:hover:bg-white/5 transition-all">
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useAlertStore } from '../../store/alertStore';
import { useTicketStore } from '../../store/ticketStore';

const alert = useAlertStore();
const store = useTicketStore();
const { tickets, pagination, isTicketLoading } = storeToRefs(store);

const getStatusClass = (status) => {
    switch (status) {
        case 'Open': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        case 'Pending': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'Resolved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        case 'Closed': return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        default: return 'bg-zinc-100 text-zinc-400';
    }
};

const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    }) : '---';
};

const prevPage = () => { if (pagination.value.currentPage > 1) store.fetchTickets(pagination.value.currentPage - 1); };
const nextPage = () => { if (pagination.value.currentPage < pagination.value.totalPages) store.fetchTickets(pagination.value.currentPage + 1); };

onMounted(() => {
    store.fetchTickets();
});
</script>
<template>
    <div class="max-w-5xl mx-auto pb-16 px-4">
        <div class="flex items-center gap-4 mb-6 py-2">
            <button @click="router.back()"
                class="p-3 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            <div v-if="isTicketLoading" class="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-lg"></div>
            <h1 v-else class="text-2xl font-medium text-zinc-900 dark:text-zinc-100">Ticket Details</h1>

            <div class="ml-auto flex gap-2">
                <button v-if="ticket?.status === 'Closed' && !isTicketLoading" @click="updateStatus('Open')"
                    class="px-6 py-2.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-semibold hover:shadow-md transition-all">
                    Reopen Ticket
                </button>

                <template v-else-if="!isTicketLoading">
                    <button v-if="ticket?.status !== 'Resolved'" @click="updateStatus('Resolved')"
                        class="px-6 py-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-semibold hover:shadow-md transition-all">
                        Mark Resolved
                    </button>
                    <button @click="updateStatus('Closed')"
                        class="px-6 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full text-sm font-semibold hover:shadow-md transition-all">
                        Close Ticket
                    </button>
                </template>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-4">

                <div v-if="isTicketLoading"
                    class="bg-zinc-100 dark:bg-zinc-900 rounded-[28px] p-8 space-y-4 animate-pulse">
                    <div class="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    <div class="h-10 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    <div class="h-20 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                </div>

                <template v-else>
                    <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-[28px] p-8">
                        <div class="flex items-center gap-3 mb-4">
                            <span
                                class="px-3 py-1 bg-white dark:bg-zinc-800 rounded-lg text-[11px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                                {{ ticket?.category }}
                            </span>
                            <span class="text-xs text-zinc-500 font-medium">{{ formatDate(ticket?.createdAt) }}</span>
                        </div>
                        <h2
                            class="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 leading-tight mb-4 tracking-tight">
                            {{ ticket?.subject }}
                        </h2>
                        <p class="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {{ ticket?.description }}
                        </p>
                    </div>

                    <div class="space-y-3">
                        <div v-for="reply in ticket?.replies" :key="reply._id"
                            :class="reply.sender.roles[0].name === 'Admin' ? 'bg-indigo-200 dark:bg-zinc-800/50' : 'bg-indigo-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'"
                            class="p-6 rounded-[24px] transition-all">
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center gap-3">
                                    <div :class="reply.sender.roles[0].name === 'Admin' ? 'bg-indigo-600' : 'bg-zinc-400'"
                                        class="w-2 h-2 rounded-full"></div>
                                    <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100">{{
                                        reply.sender.full_name }}</span>
                                </div>
                                <span class="text-[11px] text-zinc-500">{{ formatTime(reply.createdAt) }}</span>
                            </div>
                            <p class="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{{ reply.message }}</p>
                        </div>
                    </div>

                    <div v-if="ticket?.status !== 'Closed'"
                        class="bg-zinc-100 dark:bg-zinc-800/50 rounded-[28px] p-4 mt-8 shadow-sm">
                        <textarea v-model="replyMessage" rows="4"
                            class="w-full bg-transparent border-none outline-none p-4 text-zinc-800 dark:text-zinc-200 placeholder-zinc-500 resize-none"
                            placeholder="Type your response..."></textarea>
                        <div class="flex justify-end p-2">
                            <button @click="sendReply" :disabled="!replyMessage.trim() || isSubmitting"
                                class="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50">
                                {{ isSubmitting ? 'Sending...' : 'Send Reply' }}
                            </button>
                        </div>
                    </div>

                    <div v-else
                        class="mt-8 p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[28px] text-center">
                        <p class="text-zinc-500 text-sm font-medium">This ticket is closed. Reopen it to continue the
                            conversation.</p>
                    </div>
                </template>
            </div>

            <div class="space-y-4">
                <div v-if="isTicketLoading" class="h-64 bg-zinc-100 dark:bg-zinc-900 rounded-[28px] animate-pulse">
                </div>
                <template v-else>
                    <div
                        class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[28px] p-6 shadow-sm">
                        <h3 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Requester</h3>
                        <div class="flex items-center gap-4 mb-6">
                            <div
                                class="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-xl font-bold text-indigo-600">
                                {{ ticket?.user?.full_name?.charAt(0) }}
                            </div>
                            <div>
                                <p class="font-bold text-zinc-900 dark:text-zinc-100">{{ ticket?.user?.full_name }}</p>
                                <p class="text-xs text-zinc-500">{{ ticket?.user?.email }}</p>
                            </div>
                        </div>
                        <div class="space-y-4 py-4 border-t border-zinc-100 dark:border-zinc-800">
                            <div class="flex justify-between items-center">
                                <span
                                    class="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Priority</span>
                                <span :class="ticket?.priority === 'High' ? 'text-rose-500' : 'text-indigo-500'"
                                    class="text-xs font-bold">{{ ticket?.priority }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Status</span>
                                <span class="text-xs font-bold text-zinc-700 dark:text-zinc-300">{{ ticket?.status
                                    }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAlertStore } from '../../store/alertStore';
import { useTicketStore } from '../../store/ticketStore';

const route = useRoute();
const router = useRouter();
const store = useTicketStore();
const alert = useAlertStore();

const { ticket, isTicketLoading } = storeToRefs(store);
const replyMessage = ref('');
const isSubmitting = ref(false);

const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '---';
const formatTime = (date) => date ? new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';

const sendReply = async () => {
    if (!replyMessage.value.trim()) return;
    isSubmitting.value = true;
    try {
        const res = await store.replyTicket(ticket.value._id, { message: replyMessage.value });
        if (res.success) {
            replyMessage.value = '';
            alert.success("Message sent");
            store.fetchTicket(route.params.id);
        }
    } finally {
        isSubmitting.value = false;
    }
};

const updateStatus = async (status) => {
    try {
        const response = await store.updateTicketStatus(route.params.id, status);
        if (response.success) {
            alert.success(`Ticket marked as ${status}`);
            store.fetchTicket(route.params.id);
        } else {
            alert.error(response.message);
        }
    } catch (e) {
        alert.error("Process failed");
    }
};

onMounted(() => {
    store.fetchTicket(route.params.id);
});
</script>
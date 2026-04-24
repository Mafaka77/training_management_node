<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">

                <div class="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm transition-opacity"
                    @click="$emit('close')"></div>

                <div
                    class="relative w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh]">

                    <div
                        class="px-6 py-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 flex items-start justify-between shrink-0">
                        <div>
                            <h3 class="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Enrollment
                                History</h3>
                            <p class="text-xs text-zinc-500 mt-0.5">
                                Records for <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ user?.full_name
                                    || 'Trainee' }}</span>
                            </p>
                        </div>
                        <button @click="$emit('close')"
                            class="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-zinc-950">

                        <div v-if="loading" class="py-16 flex flex-col items-center gap-3">
                            <div
                                class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin">
                            </div>
                            <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">Fetching
                                Logs...</span>
                        </div>

                        <div v-else-if="history && history.length > 0" class="relative">
                            <div class="absolute left-[15px] top-4 bottom-4 w-0.5 bg-zinc-200 dark:bg-white/10"></div>

                            <div class="space-y-6">
                                <div v-for="log in history" :key="log._id" class="relative pl-10">

                                    <div class="absolute left-0 top-1 w-[30px] h-[30px] rounded-full border-[4px] border-white dark:border-zinc-950 flex items-center justify-center shadow-sm"
                                        :class="log.status === 'Approved' ? 'bg-emerald-500' : (log.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500')">
                                        <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path v-if="log.status === 'Approved'" stroke-linecap="round"
                                                stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                            <path v-else-if="log.status === 'Rejected'" stroke-linecap="round"
                                                stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>

                                    <div
                                        class="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-xl p-3.5 transition-all hover:shadow-sm">
                                        <div
                                            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                                            <h4 class="font-bold text-zinc-900 dark:text-white text-sm leading-tight">{{
                                                log.training_program?.t_name || 'Training Program' }}</h4>
                                            <span
                                                class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border"
                                                :class="log.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : (log.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400' : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400')">
                                                {{ log.status }}
                                            </span>
                                        </div>
                                        <div class="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {{ new Date(log.createdAt || log.enrolledAt).toLocaleDateString('en-GB', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            }) }}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div v-else class="py-16 flex flex-col items-center justify-center text-center">
                            <svg class="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h4 class="font-bold text-sm text-zinc-900 dark:text-white">No History Found</h4>
                            <p class="text-xs text-zinc-500 mt-1 max-w-[250px]">This trainee hasn't applied for or
                                participated in any
                                programs yet.</p>
                        </div>

                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
defineProps({
    show: {
        type: Boolean,
        required: true
    },
    user: {
        type: Object,
        default: null
    },
    history: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

defineEmits(['close']);
</script>
<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">

                <div class="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm transition-opacity"
                    @click="$emit('close')"></div>

                <div
                    class="relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col bg-white dark:bg-zinc-950 rounded-xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden transform transition-all">

                    <div
                        class="px-6 py-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 flex items-start justify-between shrink-0">
                        <div>
                            <h3 class="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Enrollment
                                Details</h3>
                            <p class="text-xs text-zinc-500 mt-0.5">Detailed information and history for this
                                application.</p>
                        </div>
                        <button @click="$emit('close')"
                            class="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-white dark:bg-zinc-950">
                        <div v-if="enrollment" class="max-w-4xl mx-auto space-y-8">

                            <div
                                class="flex items-start sm:items-center gap-5 p-6 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-xl">
                                <div class="flex-1 min-w-0">
                                    <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-1">
                                        <h4 class="text-2xl font-black text-zinc-900 dark:text-white truncate">{{
                                            enrollment.training_program.t_name }}</h4>
                                        <span :class="getStatusClass(enrollment.status)"
                                            class="w-max px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border">
                                            {{ enrollment.status }}
                                        </span>
                                    </div>
                                    <p class="text-sm text-zinc-600 dark:text-zinc-400 font-medium mt-1 truncate">{{
                                        enrollment.training_program.t_description || 'No Description Provided' }}</p>
                                    <div class="flex items-center gap-2 mt-3">
                                        <span
                                            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">
                                            {{ formatDate(enrollment.training_program.t_start_date) }}
                                        </span>
                                        <span class="text-zinc-400 text-xs font-medium">to</span>
                                        <span
                                            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-zinc-200 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">
                                            {{ formatDate(enrollment.training_program.t_end_date) }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h5
                                    class="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-3 px-1">
                                    Trainee Details</h5>
                                <div
                                    class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm divide-y divide-zinc-100 dark:divide-white/5">
                                    <div
                                        class="flex flex-col sm:flex-row sm:items-center px-6 py-4 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <dt class="w-1/3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                            Name</dt>
                                        <dd
                                            class="mt-1 sm:mt-0 flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {{ enrollment.user.full_name || 'Not Provided' }}</dd>
                                    </div>
                                    <div
                                        class="flex flex-col sm:flex-row sm:items-center px-6 py-4 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <dt class="w-1/3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                            Email Address</dt>
                                        <dd
                                            class="mt-1 sm:mt-0 flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {{ enrollment.user.email || 'Not Provided' }}</dd>
                                    </div>
                                    <div
                                        class="flex flex-col sm:flex-row sm:items-center px-6 py-4 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <dt class="w-1/3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                            Mobile Number</dt>
                                        <dd
                                            class="mt-1 sm:mt-0 flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {{ enrollment.user.mobile || 'Not Provided' }}</dd>
                                    </div>
                                    <div
                                        class="flex flex-col sm:flex-row sm:items-center px-6 py-4 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <dt class="w-1/3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                            Date of Entry</dt>
                                        <dd
                                            class="mt-1 sm:mt-0 flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {{ formatDate(enrollment.user.date_of_entry_in_present_grade) }}</dd>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h5
                                    class="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-3 px-1">
                                    Past Enrollment History</h5>

                                <div v-if="userHistory && userHistory.length > 0"
                                    class="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
                                    <div class="absolute left-[39px] top-8 bottom-8 w-0.5 bg-zinc-200 dark:bg-white/10">
                                    </div>

                                    <div class="space-y-6">
                                        <div v-for="log in userHistory" :key="log._id" class="relative pl-12">
                                            <div class="absolute left-[-11px] top-1 w-6 h-6 rounded-full border-[4px] border-white dark:border-zinc-900 flex items-center justify-center shadow-sm"
                                                :class="log.status === 'Approved' ? 'bg-emerald-500' : (log.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500')">
                                            </div>

                                            <div
                                                class="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 rounded-lg p-3.5 transition-all hover:shadow-sm">
                                                <div
                                                    class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                                                    <h4 class="font-bold text-zinc-900 dark:text-white text-sm">{{
                                                        log.training_program?.t_name || 'Unknown Program' }}</h4>
                                                    <span
                                                        class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border"
                                                        :class="log.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : (log.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400' : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400')">
                                                        {{ log.status }}
                                                    </span>
                                                </div>
                                                <div
                                                    class="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                                                        stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {{ formatDate(log.createdAt || log.enrolledAt) }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-else
                                    class="bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                                    <svg class="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-3" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h4 class="font-bold text-sm text-zinc-900 dark:text-white">No Previous History</h4>
                                    <p class="text-xs text-zinc-500 mt-1">This trainee has not applied for other
                                        programs.</p>
                                </div>
                            </div>

                        </div>

                        <div v-else class="py-32 flex flex-col items-center justify-center text-center">
                            <svg class="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p class="text-sm font-bold text-zinc-500">Unable to load trainee details.</p>
                        </div>
                    </div>

                    <div v-if="enrollment"
                        class="px-6 py-4 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between shrink-0">

                        <button @click="$emit('close')"
                            class="px-5 py-2 text-zinc-600 hover:bg-zinc-200 dark:hover:bg-white/10 dark:text-zinc-400 dark:hover:text-white rounded-md text-sm font-bold transition-colors">
                            Close
                        </button>

                        <div class="flex items-center gap-3">

                            <template v-if="enrollment.status === 'Pending'">
                                <button @click="$emit('update-status', enrollment._id, 'Rejected')"
                                    class="px-5 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-md text-sm font-bold transition-colors">
                                    Reject
                                </button>
                                <button @click="$emit('update-status', enrollment._id, 'Approved')"
                                    class="inline-flex items-center gap-2 px-5 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded-md text-sm font-bold transition-colors shadow-sm">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                            d="M5 13l4 4L19 7" />
                                    </svg>
                                    Approve
                                </button>
                            </template>

                            <template v-else>
                                <button @click="$emit('update-status', enrollment._id, 'Pending')"
                                    class="inline-flex items-center gap-2 px-5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded-md text-sm font-bold transition-colors shadow-sm">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reset to Pending
                                </button>
                            </template>

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
    enrollment: {
        type: Object,
        default: null
    },
    userHistory: {
        type: Array,
        default: () => []
    }
});

defineEmits(['close', 'update-status']);

// Get color classes for the current status badge
const getStatusClass = (status) => {
    const map = {
        'Approved': 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400',
        'Pending': 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400',
        'Rejected': 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400',
        'Waitlisted': 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400'
    };
    return map[status] || 'bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400';
};

// Safe date formatter
const formatDate = (dateString) => {
    if (!dateString) return 'Not Recorded';
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};
</script>
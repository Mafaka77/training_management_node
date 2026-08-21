<template>
    <div class="max-w-7xl mx-auto space-y-6 pb-16">
        <!-- EHMS-Style Breadcrumb Navigation Header -->
        <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs">
            <nav class="flex items-center gap-2 text-xs">
                <router-link to="/admin/training/program"
                    class="font-semibold text-zinc-500 hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                    <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 11H5m7 7l-7-7 7-7" />
                    </svg>
                    Programs Registry
                </router-link>
                <span class="text-zinc-300 dark:text-zinc-700">/</span>
                <span class="font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px] sm:max-w-xs">{{
                    form.t_name || 'Program Overview' }}</span>
            </nav>

            <div class="flex items-center gap-2 shrink-0">
                <router-link :to="{ name: 'training.program.edit', params: { id: route.params.id } }"
                    class="px-3.5 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200/80 dark:hover:bg-white/10 rounded-xl border border-zinc-200/60 dark:border-white/5 transition-all flex items-center gap-1.5 shadow-xs">
                    <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2.5 2.5 0 113.536 3.536L12 20.364H8v-4.364l9.293-9.293z" />
                    </svg>
                    Edit Program
                </router-link>
                <!-- <button @click="openAddSessionModal"
                    class="px-3.5 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md shadow-emerald-700/20 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Session
                </button> -->
            </div>
        </div>

        <!-- Full Page Skeleton Loader -->
        <div v-if="isLoading" class="space-y-6 animate-pulse">
            <section
                class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-white/10 p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 w-full">
                    <div class="w-28 h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
                    <div class="space-y-3 flex-1 w-full">
                        <div class="flex items-center gap-2">
                            <div class="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
                            <div class="h-5 w-20 bg-zinc-100 dark:bg-zinc-800/60 rounded-md"></div>
                        </div>
                        <div class="h-7 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                        <div class="flex items-center gap-4 pt-1">
                            <div class="h-6 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                            <div class="h-6 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded-lg"></div>
                        </div>
                    </div>
                </div>

                <div
                    class="grid grid-cols-3 gap-3 w-full lg:w-auto p-4 bg-zinc-50 dark:bg-white/[0.02] rounded-2xl border border-zinc-200/60 dark:border-white/5 shrink-0">
                    <div class="text-center px-4 space-y-2">
                        <div class="h-3 w-12 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto"></div>
                        <div class="h-6 w-8 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto"></div>
                        <div class="h-3 w-10 bg-zinc-100 dark:bg-zinc-800/60 rounded mx-auto"></div>
                    </div>
                    <div class="text-center px-4 space-y-2 border-x border-zinc-200/60 dark:border-white/5">
                        <div class="h-3 w-12 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto"></div>
                        <div class="h-6 w-8 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto"></div>
                        <div class="h-3 w-14 bg-zinc-100 dark:bg-zinc-800/60 rounded mx-auto"></div>
                    </div>
                    <div class="text-center px-4 space-y-2">
                        <div class="h-3 w-12 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto"></div>
                        <div class="h-6 w-8 bg-zinc-200 dark:bg-zinc-800 rounded mx-auto"></div>
                        <div class="h-3 w-10 bg-zinc-100 dark:bg-zinc-800/60 rounded mx-auto"></div>
                    </div>
                </div>
            </section>

            <div
                class="h-12 w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-white/10">
            </div>

            <div class="space-y-4">
                <div v-for="i in 3" :key="`view-skeleton-${i}`"
                    class="h-24 w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-white/10">
                </div>
            </div>
        </div>

        <template v-else>
            <!-- EHMS Hero Record Banner -->
            <section
                class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-white/10 p-6 shadow-xs relative overflow-hidden">
                <!-- Ambient Gradient Glow -->
                <div
                    class="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none">
                </div>

                <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                    <!-- Left Banner Info -->
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
                        <div
                            class="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 border border-zinc-200/80 dark:border-white/10 shadow-xs bg-zinc-100 dark:bg-zinc-800">
                            <img :src="getImageUrl(form.t_banner)" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <span
                                class="absolute bottom-2 left-2 text-[9px] font-mono font-bold text-white uppercase px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-xs">
                                #TRG-{{ form._id?.slice(-5).toUpperCase() }}
                            </span>
                        </div>

                        <div class="space-y-2 flex-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <span
                                    :class="['inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border', getStatusStyle(form.t_status).badge]">
                                    <span
                                        :class="['w-1.5 h-1.5 rounded-full', getStatusStyle(form.t_status).dot]"></span>
                                    {{ form.t_status }}
                                </span>
                                <span v-if="form.t_category"
                                    class="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 text-[10px] font-bold uppercase tracking-wider border border-zinc-200/60 dark:border-white/5">
                                    {{ form.t_category.name || 'General' }}
                                </span>
                            </div>

                            <h1
                                class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                                {{ form.t_name }}
                            </h1>

                            <div
                                class="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                <span
                                    class="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-500/20">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {{ formatDateRange(form.t_start_date, form.t_end_date) }}
                                </span>
                                <span v-if="form.t_organizer" class="flex items-center gap-1">
                                    <svg class="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {{ form.t_organizer }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Right Quick Metrics Box (EHMS Grid Style) -->
                    <div
                        class="grid grid-cols-3 gap-3 w-full lg:w-auto p-4 bg-zinc-50/80 dark:bg-white/[0.02] rounded-2xl border border-zinc-200/60 dark:border-white/5 shrink-0">
                        <div class="text-center px-3 border-r border-zinc-200/60 dark:border-white/5">
                            <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                                Capacity</p>
                            <p class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{{ form.t_capacity || 0
                            }}
                            </p>
                            <p class="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">Seats</p>
                        </div>
                        <div class="text-center px-3 border-r border-zinc-200/60 dark:border-white/5">
                            <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                                Sessions</p>
                            <p class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{{ sessions.length }}
                            </p>
                            <p class="text-[10px] text-zinc-500 font-medium mt-0.5">Scheduled</p>
                        </div>
                        <div class="text-center px-3">
                            <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                                Duration</p>
                            <p class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{{ form.t_duration ||
                                '1'
                            }}</p>
                            <p class="text-[10px] text-zinc-500 font-medium mt-0.5">Days</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- EHMS Segmented Tabs Navigation -->
            <div
                class="flex items-center gap-1.5 p-1.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs overflow-x-auto custom-scrollbar">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                    'flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer',
                    activeTab === tab.id
                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-100'
                ]">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
                    </svg>
                    {{ tab.label }}
                </button>
            </div>

            <!-- Tab Contents Container -->
            <div class="min-h-[420px]">
                <!-- 1. Schedule Tab -->
                <div v-if="activeTab === 'schedule'" class="space-y-6">
                    <SessionsIndex :program-id="route.params.id" :embedded="true" />
                </div>

                <!-- 2. Materials Tab -->
                <div v-if="activeTab === 'materials'" class="space-y-6">
                    <Materials :program-id="route.params.id" />
                </div>

                <!-- 3. Enrollments Tab -->
                <div v-if="activeTab === 'enrollments'" class="space-y-6">
                    <EnrollmentsIndex :program-id="route.params.id" />
                </div>

                <!-- 4. Attendance Tab -->
                <div v-if="activeTab === 'attendance'" class="space-y-6">
                    <div v-if="form.t_status === 'Upcoming' || form.t_status === 'Draft'"
                        class="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl text-center shadow-xs">
                        <div
                            class="w-14 h-14 mb-3 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-xs border border-amber-200/60 dark:border-amber-500/20">
                            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Attendance Registry Locked</h2>
                        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm leading-relaxed"> Attendance
                            tracking becomes
                            active once the course status moves to <span
                                class="text-emerald-700 dark:text-emerald-400 font-bold">Ongoing</span>. </p>
                    </div>
                    <div v-else>
                        <AttendanceComponent :program-id="route.params.id" />
                    </div>
                </div>

                <!-- 5. Release Order Tab -->
                <div v-if="activeTab === 'release-order'" class="space-y-6">
                    <div v-if="form.t_status === 'Upcoming' || form.t_status === 'Draft' || form.t_status === 'Ongoing'"
                        class="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl text-center shadow-xs">
                        <div
                            class="w-14 h-14 mb-3 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-xs border border-amber-200/60 dark:border-amber-500/20">
                            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Release Order Locked</h2>
                        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm leading-relaxed"> Release order
                            generation
                            becomes available once the course status moves to <span
                                class="text-emerald-700 dark:text-emerald-400 font-bold">Completed</span>. </p>
                    </div>
                    <div v-else>
                        <ReleaseOrderComponent :program-id="route.params.id" />
                    </div>
                </div>

                <!-- 6. Certificate Tab -->
                <div v-if="activeTab === 'certificate'" class="space-y-6">
                    <div v-if="form.t_status === 'Upcoming' || form.t_status === 'Draft' || form.t_status === 'Ongoing'"
                        class="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl text-center shadow-xs">
                        <div
                            class="w-14 h-14 mb-3 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-xs border border-amber-200/60 dark:border-amber-500/20">
                            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Certificates Locked</h2>
                        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm leading-relaxed"> Certificate
                            issuing becomes
                            available once the course status moves to <span
                                class="text-emerald-700 dark:text-emerald-400 font-bold">Completed</span>. </p>
                    </div>
                    <div v-else>
                        <CertificateComponent :program-id="route.params.id" />
                    </div>
                </div>

                <!-- 7. Evaluation Tab -->
                <div v-if="activeTab === 'evaluation'" class="space-y-6">
                    <div v-if="form.t_status === 'Upcoming' || form.t_status === 'Draft' || form.t_status === 'Ongoing'"
                        class="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl text-center shadow-xs">
                        <div
                            class="w-14 h-14 mb-3 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-xs border border-amber-200/60 dark:border-amber-500/20">
                            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Evaluation Locked</h2>
                        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm leading-relaxed"> Program
                            evaluation becomes
                            available once the course status moves to <span
                                class="text-emerald-700 dark:text-emerald-400 font-bold">Completed</span>. </p>
                    </div>
                    <div v-else>
                        <EvaluationComponent :program-id="route.params.id" />
                    </div>
                </div>
            </div>
        </template>

        <!-- Add/Edit Session Modal -->
        <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
            leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="showModal"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
                <div
                    class="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-white/10 overflow-hidden transform transition-all">
                    <div
                        class="px-6 py-4 border-b border-zinc-200/60 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-white/[0.02]">
                        <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100">
                            {{ isEditMode ? 'Edit Training Session' : 'Add New Training Session' }}
                        </h3>
                        <button @click="closeModal"
                            class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 cursor-pointer">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                        <BaseInput v-model="sessionForm.tc_topic" label="Topic"
                            placeholder="e.g. Fundamental Administrative Rules" />
                        <div class="grid grid-cols-2 gap-4">
                            <div class="col-span-2">
                                <label
                                    class="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Date</label>
                                <input v-model="sessionForm.tc_date" type="date" required
                                    class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-zinc-900 dark:text-zinc-100" />
                            </div>
                            <BaseInput v-model="sessionForm.tc_start_time" label="Start Time" type="time" />
                            <BaseInput v-model="sessionForm.tc_end_time" label="End Time" type="time" />
                        </div>
                        <BaseInput v-model="sessionForm.tc_session" label="Session Number" placeholder="eg. 1"
                            type="number" />
                        <SearchSelect v-model="sessionForm.trainer" :options="trainers" label="Trainer"
                            placeholder="Search faculty / staff..." />

                        <div
                            class="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-zinc-100 dark:border-white/5">
                            <button type="button" @click="closeModal"
                                class="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer">Cancel</button>
                            <button type="submit" :disabled="isSubmitting"
                                class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer">
                                <span v-if="isSubmitting"
                                    class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                {{ isEditMode ? 'Update Session' : 'Save Session' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>

        <DeleteDialog :show="showDeleteModal" :loading="isDeleting" title="Delete Training Session"
            :message="`Are you sure you want to delete '${selectionItem?.tc_topic}'?`" confirmText="Yes, Delete Session"
            @close="showDeleteModal = false" @confirm="onConfirmDelete" />
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AttendanceComponent from "./attendance/Index.vue";
import EvaluationComponent from '../../../components/trainingTabs/EvaluationComponent.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import DeleteDialog from '../../../components/ui/DeleteDialog.vue';
import SearchSelect from '../../../components/ui/SearchSelect.vue';
import { useAlertStore } from '../../../store/alertStore';
import { useCertificateStore } from '../../../store/certificateStore';
import { useSessionStore } from '../../../store/sessionStore';
import { useTrainingStore } from '../../../store/trainingStore';
import CertificateComponent from './certificate/Index.vue';
import EnrollmentsIndex from "./enrollments/Index.vue";
import Materials from './materials/Index.vue';
import ReleaseOrderComponent from "./release_order/Index.vue";
import SessionsIndex from './session/Index.vue';

const selectionItem = ref(null);
const route = useRoute();
const router = useRouter();
const trainingStore = useTrainingStore();
const sessionStore = useSessionStore();
const alert = useAlertStore();
const certificateStore = useCertificateStore();
const showModal = ref(false);
const isSubmitting = ref(false);
const editingId = ref(null);
const loading = ref(false);
const showDeleteModal = ref(false);
const isDeleting = ref(false);
const { sessions, trainers, expandedDates, activeTab, isLoading, isSessionLoading } = storeToRefs(sessionStore);
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const tabs = [
    {
        id: 'schedule',
        label: 'Schedule',
        icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    {
        id: 'materials',
        label: 'Materials',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    },
    {
        id: 'enrollments',
        label: 'Enrollments',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    },
    {
        id: 'attendance',
        label: 'Attendance',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
    },
    {
        id: 'release-order',
        label: 'Release Order',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    },
    {
        id: 'certificate',
        label: 'Certificate',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    {
        id: 'evaluation',
        label: 'Evaluation',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    }
];

const statusStyles = {
    Draft: {
        dot: "bg-amber-500",
        badge: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20",
    },
    Upcoming: {
        dot: "bg-rose-500",
        badge: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/60 dark:border-rose-500/20",
    },
    Ongoing: {
        dot: "bg-emerald-600 animate-pulse",
        badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20",
    },
    Completed: {
        dot: "bg-emerald-500",
        badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20",
    },
};

const getStatusStyle = (status) => statusStyles[status] || statusStyles.Upcoming;

const initialForm = reactive({
    id: '',
    tc_topic: '',
    tc_date: '',
    tc_start_time: '',
    tc_end_time: '',
    tc_session: 1,
    trainer: '',
    t_program: route.params.id
});

const form = reactive({
    _id: '',
    t_name: '',
    t_banner: '',
    t_description: '',
    t_capacity: 0,
    t_duration: 1,
    t_start_date: '',
    t_end_date: '',
    t_status: 'Upcoming',
    t_organizer: '',
    t_category: null,
    t_director: null,
});

const isEditMode = ref(false);
const sessionForm = reactive({ ...initialForm });

// Helpers
const getImageUrl = (path, name) => path ? `${IMAGE_URL}${path}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'ATI')}&background=047857&color=fff`;
const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const formatDateRange = (start, end) => {
    if (!start || !end) return "Dates TBA";
    const options = { month: "short", day: "numeric" };
    const s = new Date(start).toLocaleDateString("en-US", options);
    const e = new Date(end).toLocaleDateString("en-US", { ...options, year: "numeric" });
    return `${s} - ${e}`;
};

const closeModal = () => {
    showModal.value = false;
};

const toggleDate = (date) => {
    if (expandedDates.value.has(date)) {
        expandedDates.value.delete(date);
    } else {
        expandedDates.value.add(date);
    }
};

// Data Fetching
async function fetchProgramData(id) {
    loading.value = true;
    try {
        const data = await trainingStore.fetchTraining(id);
        Object.assign(form, data);
        await sessionStore.fetchSession(id);
    } catch (err) {
        console.log(err);
        alert.warning('Failed to load program details');
    } finally {
        loading.value = false;
    }
}

const handleSubmit = async () => {
    isSubmitting.value = true;
    const formData = new FormData();
    Object.keys(sessionForm).forEach((key) => {
        const value = sessionForm[key];
        if (value !== null && value !== undefined && value !== '') {
            const cleanValue = (typeof value === 'object' && value._id) ? value._id : value;
            formData.append(key, cleanValue);
        }
    });

    try {
        if (isEditMode.value) {
            const response = await sessionStore.updateSession(formData, sessionForm.id);
            if (response.success) {
                await sessionStore.fetchSession(route.params.id);
                showModal.value = false;
                alert.success(response.message);
            } else {
                alert.error(response.message);
            }
        } else {
            const response = await sessionStore.submitSession(formData);
            if (response.success) {
                alert.success(response.message);
                showModal.value = false;
                await sessionStore.fetchSession(route.params.id);
            } else {
                alert.warning(response.message);
            }
        }
    } catch (ex) {
        alert.warning("Error saving session");
    } finally {
        isSubmitting.value = false;
    }
};

const openAddSessionModal = () => {
    isEditMode.value = false;
    Object.assign(sessionForm, initialForm);
    showModal.value = true;
};

const editSession = (session) => {
    isEditMode.value = true;
    sessionForm.id = session._id;
    sessionForm.tc_topic = session.tc_topic;
    sessionForm.tc_date = session.tc_date ? new Date(session.tc_date).toISOString().split('T')[0] : '';
    sessionForm.tc_start_time = session.tc_start_time;
    sessionForm.tc_end_time = session.tc_end_time;
    sessionForm.tc_session = session.tc_session;
    sessionForm.trainer = session.trainer || session.trainer;
    showModal.value = true;
};

const deleteSession = async (data) => {
    selectionItem.value = data;
    showDeleteModal.value = true;
    sessionForm.id = data._id;
    sessionForm.t_program = data.t_program?._id || data.t_program || route.params.id;
};

const onConfirmDelete = async () => {
    isDeleting.value = true;
    try {
        const response = await sessionStore.deleteSession(sessionForm.id);
        if (response.success) {
            showDeleteModal.value = false;
            await sessionStore.fetchSession(sessionForm.t_program);
            alert.success(response.message);
        } else {
            alert.error(response.message);
        }
    } catch (ex) {
        alert.error(ex);
    } finally {
        isDeleting.value = false;
    }
};

// Computed
const groupedSessions = computed(() => {
    if (!sessions.value.length) return {};
    const groups = sessions.value.reduce((acc, session) => {
        const dateKey = new Date(session.tc_date).toDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(session);
        return acc;
    }, {});
    Object.keys(groups).forEach(date => {
        groups[date].sort((a, b) => a.tc_start_time.localeCompare(b.tc_start_time));
    });
    return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => new Date(a) - new Date(b)));
});

onMounted(() => {
    sessionStore.getTrainers();
    if (route.params.id) fetchProgramData(route.params.id);
});

const navigateToAttendance = (sessId) => {
    router.push({
        name: 'training.session.attendance',
        params: {
            id: route.params.id,
            sessionId: sessId
        }
    });
};

watch(() => route.params.id, (newId) => {
    if (newId) fetchProgramData(newId);
});
</script>

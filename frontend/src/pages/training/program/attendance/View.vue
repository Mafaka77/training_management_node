<template>
    <div class="max-w-6xl mx-auto space-y-6 pb-16 text-zinc-900 dark:text-zinc-100">

        <!-- Top Navigation & Breadcrumb -->
        <nav class="flex items-center justify-between p-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs"
            aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1.5 md:space-x-2 text-xs">
                <li class="inline-flex items-center">
                    <router-link to="/admin/training/program"
                        class="font-semibold text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center transition-colors">
                        <svg class="w-4 h-4 me-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
                        </svg>
                        Trainings
                    </router-link>
                </li>
                <li class="flex items-center space-x-1.5">
                    <svg class="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
                    </svg>
                    <router-link :to="{ name: 'training.program.view', params: { id: route.params.id } }"
                        class="font-semibold text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                        Program Details
                    </router-link>
                </li>
                <li aria-current="page" class="flex items-center space-x-1.5">
                    <svg class="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
                    </svg>
                    <span class="font-semibold text-zinc-400 dark:text-zinc-500">Trainee Attendance</span>
                </li>
            </ol>

            <div class="flex items-center gap-2">
                <button @click="refreshData" :disabled="isAttendanceLoading"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                    title="Refresh Attendance Data">
                    <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': isAttendanceLoading }" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span class="hidden sm:inline">Refresh</span>
                </button>

                <router-link :to="{ name: 'training.program.view', params: { id: route.params.id } }"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span class="hidden sm:inline">Back</span>
                </router-link>
            </div>
        </nav>

        <!-- Skeleton Loading State -->
        <div v-if="isAttendanceLoading && !traineeAttendance?.records" class="space-y-6 animate-pulse">
            <div class="h-44 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-white/5 p-6">
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="i in 4" :key="i"
                    class="h-28 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-white/5">
                </div>
            </div>
            <div class="space-y-3">
                <div v-for="i in 3" :key="`skel-row-${i}`"
                    class="h-24 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-white/5">
                </div>
            </div>
        </div>

        <template v-else>
            <!-- Trainee Profile & Program Card -->
            <div
                class="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-white/10 shadow-xs p-6 md:p-8">
                <!-- Ambient background gradient -->
                <div
                    class="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none">
                </div>

                <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div class="flex items-start gap-4 md:gap-5">
                        <!-- Trainee Avatar -->
                        <div
                            class="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-xl md:text-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 shrink-0">
                            {{ getInitials(traineeName) }}
                        </div>

                        <div class="space-y-1.5">
                            <div class="flex items-center gap-2.5 flex-wrap">
                                <h1
                                    class="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                    {{ traineeName }}
                                </h1>
                                <span v-if="trainingCategory"
                                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700">
                                    {{ trainingCategory }}
                                </span>
                            </div>

                            <p
                                class="text-xs md:text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {{ traineeAttendance?.programName || 'Training Program' }}
                            </p>

                            <div
                                class="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap pt-0.5">
                                <span v-if="traineeEmail" class="flex items-center gap-1">
                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {{ traineeEmail }}
                                </span>
                                <span v-if="traineePhone" class="flex items-center gap-1">
                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {{ traineePhone }}
                                </span>
                                <span
                                    class="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-500">
                                    ID: {{ route.params.traineeId?.slice(-6) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Certificate Action / Qualification Status -->
                    <div class="flex flex-wrap items-center gap-3 lg:self-center">
                        <!-- Qualification Badge -->
                        <div v-if="stats?.isEligible"
                            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 rounded-full text-emerald-700 dark:text-emerald-400">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span class="text-xs font-bold uppercase tracking-wider">Attendance Qualified (≥75%)</span>
                        </div>
                        <div v-else
                            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 rounded-full text-amber-700 dark:text-amber-400">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span class="text-xs font-bold uppercase tracking-wider">Below Threshold (&lt;75%)</span>
                        </div>

                        <!-- Certificate Button (Commented Out) -->
                        <!-- <div v-if="stats?.isEligible">
                            <router-link v-if="!isCertificate" :to="{
                                name: 'training.certificate',
                                params: {
                                    id: route.params.id,
                                    traineeId: route.params.traineeId,
                                }
                            }" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-700/20 transition-all active:scale-95 cursor-pointer">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Generate Certificate
                            </router-link>

                            <button v-else disabled
                                class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-semibold border border-emerald-200/60 dark:border-emerald-500/20 cursor-default">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Certificate Issued
                            </button>
                        </div> -->
                    </div>
                </div>
            </div>

            <!-- Quick Metrics Grid -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4" v-if="stats">
                <!-- Metric 1: Attendance Percentage -->
                <div
                    class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 p-5 rounded-2xl shadow-xs relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                    <div class="flex items-center justify-between">
                        <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                            Attendance Rate</p>
                        <div class="w-2 h-2 rounded-full"
                            :class="stats.attendancePercentage >= 75 ? 'bg-emerald-500' : 'bg-amber-500'"></div>
                    </div>
                    <p class="text-3xl font-black mt-2 tracking-tight"
                        :class="stats.attendancePercentage >= 75 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
                        {{ stats.attendancePercentage }}%
                    </p>
                    <div class="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-700"
                            :class="stats.attendancePercentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'"
                            :style="{ width: `${Math.min(stats.attendancePercentage, 100)}%` }"></div>
                    </div>
                </div>

                <!-- Metric 2: Total Sessions -->
                <div
                    class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 p-5 rounded-2xl shadow-xs group hover:border-emerald-500/30 transition-all">
                    <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Total
                        Sessions</p>
                    <div class="flex items-baseline justify-between mt-2">
                        <p class="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                            {{ stats.totalSessions }}
                        </p>
                        <span class="text-xs text-zinc-400 font-medium">Classes</span>
                    </div>
                    <p class="text-[11px] text-zinc-400 dark:text-zinc-500 mt-3 flex items-center gap-1">
                        <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Complete syllabus
                    </p>
                </div>

                <!-- Metric 3: Present Count -->
                <div
                    class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 p-5 rounded-2xl shadow-xs group hover:border-emerald-500/30 transition-all">
                    <p class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        Present</p>
                    <div class="flex items-baseline justify-between mt-2">
                        <p class="text-3xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">
                            {{ stats.presentCount }}
                        </p>
                        <span class="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-semibold">Attended</span>
                    </div>
                    <p class="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-3 flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Verified presence
                    </p>
                </div>

                <!-- Metric 4: Absent Count -->
                <div
                    class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 p-5 rounded-2xl shadow-xs group hover:border-emerald-500/30 transition-all">
                    <p class="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Absent / Pending</p>
                    <div class="flex items-baseline justify-between mt-2">
                        <p class="text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
                            {{ stats.absentCount }}
                        </p>
                        <span class="text-xs text-rose-500/70 font-semibold">Missed</span>
                    </div>
                    <p class="text-[11px] text-zinc-400 dark:text-zinc-500 mt-3 flex items-center gap-1">
                        <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {{ stats.absentCount === 0 ? 'Flawless attendance' : 'Can be marked below' }}
                    </p>
                </div>
            </div>

            <!-- Filter Controls & Bulk Action Bar -->
            <div
                class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs">
                <!-- Search Input -->
                <div class="relative flex-1 max-w-md">
                    <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input v-model="searchQuery" type="text" placeholder="Search sessions by topic or date..."
                        class="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                </div>

                <div class="flex flex-wrap items-center gap-2 justify-between md:justify-end">
                    <!-- Status Filter Tabs -->
                    <div
                        class="flex items-center gap-1 bg-zinc-100 dark:bg-white/5 p-1 rounded-xl border border-zinc-200/60 dark:border-white/5">
                        <button @click="filterStatus = 'all'" :class="[
                            'px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                            filterStatus === 'all'
                                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                        ]">
                            All ({{ totalRecordsCount }})
                        </button>
                        <button @click="filterStatus = 'Present'" :class="[
                            'px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                            filterStatus === 'Present'
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400'
                        ]">
                            Present ({{ stats?.presentCount || 0 }})
                        </button>
                        <button @click="filterStatus = 'Absent'" :class="[
                            'px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer',
                            filterStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400'
                        ]">
                            Absent ({{ stats?.absentCount || 0 }})
                        </button>
                    </div>

                    <!-- Expand / Collapse All & Bulk Mark -->
                    <div class="flex items-center gap-2">
                        <button @click="toggleAllDates"
                            class="px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer">
                            {{ isAllExpanded ? 'Collapse All' : 'Expand All' }}
                        </button>

                        <!-- Bulk Mark All Present Button -->
                        <button @click="markAllPresent" :disabled="isBulkProcessing || stats?.absentCount === 0"
                            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
                            title="Mark all sessions for this trainee as Present">
                            <span v-if="isBulkProcessing"
                                class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Mark All Present</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Grouped Sessions List -->
            <div class="space-y-4">
                <div v-if="Object.keys(groupedRecords).length === 0"
                    class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-3xl p-12 text-center shadow-xs">
                    <div
                        class="mx-auto w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 class="text-zinc-900 dark:text-zinc-100 font-bold text-sm">No Sessions Found</h3>
                    <p class="text-zinc-500 dark:text-zinc-400 text-xs mt-1">No sessions match your search or filter
                        criteria.</p>
                </div>

                <div v-for="(sessions, date) in groupedRecords" :key="date"
                    class="border border-zinc-200/80 dark:border-white/10 rounded-2xl bg-white dark:bg-zinc-900 shadow-xs overflow-hidden transition-all">

                    <!-- Date Accordion Header -->
                    <button @click="toggleDate(date)"
                        class="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors cursor-pointer text-left">
                        <div class="flex items-center gap-4 sm:gap-6 flex-wrap">
                            <div class="flex items-center gap-3">
                                <div
                                    class="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 shrink-0">
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <span
                                        class="block text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                                        Session Date
                                    </span>
                                    <span class="text-sm font-bold text-zinc-900 dark:text-zinc-100">{{ date }}</span>
                                </div>
                            </div>

                            <div class="h-8 w-px bg-zinc-200 dark:bg-white/10 hidden sm:block"></div>

                            <div class="flex items-center gap-2">
                                <span
                                    class="px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700">
                                    {{ sessions.length }} {{ sessions.length === 1 ? 'Session' : 'Sessions' }}
                                </span>
                                <span
                                    class="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                                    {{sessions.filter(s => s.status === 'Present').length}} Present
                                </span>
                                <span v-if="sessions.filter(s => s.status !== 'Present').length > 0"
                                    class="px-2.5 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-[10px] font-semibold text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/20">
                                    {{sessions.filter(s => s.status !== 'Present').length}} Absent
                                </span>
                            </div>
                        </div>

                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5 text-zinc-400 transition-transform duration-300"
                                :class="{ 'rotate-180 text-emerald-700 dark:text-emerald-400': expandedDates.includes(date) }"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>

                    <!-- Accordion Body: Session Cards -->
                    <Transition name="expand">
                        <div v-if="expandedDates.includes(date)"
                            class="border-t border-zinc-100 dark:border-white/5 bg-zinc-50/40 dark:bg-black/20 p-4 sm:p-5 space-y-3">
                            <div v-for="record in sessions" :key="record.sessionId"
                                class="flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border transition-all duration-200 shadow-xs gap-4"
                                :class="record.status === 'Present'
                                    ? 'border-emerald-200/80 dark:border-emerald-500/20 hover:border-emerald-500/50'
                                    : 'border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20'">

                                <!-- Left Info Section -->
                                <div class="flex items-start sm:items-center gap-4">
                                    <!-- Status Indicator Bar -->
                                    <div
                                        :class="['w-1.5 self-stretch min-h-[44px] rounded-full shrink-0', record.status === 'Present' ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-rose-500']">
                                    </div>

                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                {{ record.sessionTopic }}
                                            </h4>
                                            <span
                                                :class="record.status === 'Present'
                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20'
                                                    : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/60 dark:border-rose-500/20'"
                                                class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border">
                                                {{ record.status === 'Present' ? 'Present' : 'Absent' }}
                                            </span>
                                        </div>

                                        <div
                                            class="flex items-center gap-3 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex-wrap">
                                            <span class="font-mono">Session ID: {{ record.sessionId.slice(-6) }}</span>
                                            <span class="text-zinc-300 dark:text-zinc-700">•</span>
                                            <span class="flex items-center gap-1">
                                                <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {{ record.startTime }} - {{ record.endTime }}
                                            </span>
                                            <template v-if="record.signInTime">
                                                <span class="text-zinc-300 dark:text-zinc-700">•</span>
                                                <span
                                                    class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono">
                                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                                                        stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Check-in: {{ formatTime(record.signInTime) }}
                                                </span>
                                            </template>
                                        </div>
                                    </div>
                                </div>

                                <!-- Right Action Section: Give Attendance Controls -->
                                <div
                                    class="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-white/5">
                                    <div class="text-left md:text-right">
                                        <p
                                            class="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-wider">
                                            Attendance</p>
                                        <p class="text-xs font-semibold"
                                            :class="record.status === 'Present' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'">
                                            {{ record.status === 'Present' ? 'Marked Present' : 'Not Recorded' }}
                                        </p>
                                    </div>

                                    <!-- Mark Attendance Buttons -->
                                    <div class="flex items-center gap-2">
                                        <!-- Toggle Present Button -->
                                        <button v-if="record.status !== 'Present'"
                                            @click="markAttendance(record.sessionId, 'Present')"
                                            :disabled="activeLoadingSessionId === record.sessionId"
                                            class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-700/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                                            title="Mark trainee as Present for this session">
                                            <span v-if="activeLoadingSessionId === record.sessionId"
                                                class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Mark Present</span>
                                        </button>

                                        <!-- If already Present, show active badge + option to switch to Absent -->
                                        <template v-else>
                                            <button disabled
                                                class="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-200/60 dark:border-emerald-500/20 cursor-default">
                                                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor" stroke-width="2.5">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Present</span>
                                            </button>

                                            <button @click="markAttendance(record.sessionId, 'Absent')"
                                                :disabled="activeLoadingSessionId === record.sessionId"
                                                class="inline-flex items-center gap-1 px-2.5 py-2 text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl text-xs font-semibold border border-zinc-200/80 dark:border-zinc-700 transition-all active:scale-95 cursor-pointer"
                                                title="Change status to Absent">
                                                <span v-if="activeLoadingSessionId === record.sessionId"
                                                    class="w-3.5 h-3.5 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></span>
                                                <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <span>Set Absent</span>
                                            </button>
                                        </template>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAlertStore } from '../../../../store/alertStore';
import { useAttendanceStore } from '../../../../store/attendanceStore';

const route = useRoute();
const attendanceStore = useAttendanceStore();
const alertStore = useAlertStore();

const { traineeAttendance, isAttendanceLoading, isCertificate } = storeToRefs(attendanceStore);

const expandedDates = ref([]);
const searchQuery = ref('');
const filterStatus = ref('all');
const activeLoadingSessionId = ref(null);
const isBulkProcessing = ref(false);

const traineeName = computed(() => {
    return traineeAttendance.value?.traineeName?.full_name || 'Trainee';
});

const traineeEmail = computed(() => {
    return traineeAttendance.value?.traineeName?.email || '';
});

const traineePhone = computed(() => {
    return traineeAttendance.value?.traineeName?.mobile || '';
});

const trainingCategory = computed(() => {
    return traineeAttendance.value?.trainingCategory || '';
});

const stats = computed(() => {
    return traineeAttendance.value?.stats || null;
});

const totalRecordsCount = computed(() => {
    return traineeAttendance.value?.records?.length || 0;
});

const getInitials = (name) => {
    if (!name) return 'TR';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
};

const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit', hour12: true
    });
};

const toggleDate = (date) => {
    const index = expandedDates.value.indexOf(date);
    if (index > -1) {
        expandedDates.value.splice(index, 1);
    } else {
        expandedDates.value.push(date);
    }
};

const isAllExpanded = computed(() => {
    const allDates = Object.keys(groupedRecords.value);
    return allDates.length > 0 && expandedDates.value.length === allDates.length;
});

const toggleAllDates = () => {
    const allDates = Object.keys(groupedRecords.value);
    if (isAllExpanded.value) {
        expandedDates.value = [];
    } else {
        expandedDates.value = [...allDates];
    }
};

const groupedRecords = computed(() => {
    const records = traineeAttendance.value?.records;
    if (!records || !Array.isArray(records)) return {};

    const query = searchQuery.value.trim().toLowerCase();

    // Apply filtering
    const filtered = records.filter(rec => {
        // Search query filter
        const matchesSearch = !query ||
            (rec.sessionTopic && rec.sessionTopic.toLowerCase().includes(query)) ||
            (rec.sessionId && rec.sessionId.toLowerCase().includes(query)) ||
            (rec.sessionDate && formatDate(rec.sessionDate).toLowerCase().includes(query));

        if (!matchesSearch) return false;

        // Status filter
        if (filterStatus.value === 'Present') return rec.status === 'Present';
        if (filterStatus.value === 'Absent') return rec.status !== 'Present';

        return true;
    });

    // Sort chronological
    const sorted = [...filtered].sort((a, b) =>
        new Date(`${a.sessionDate.split('T')[0]}T${a.startTime}`) -
        new Date(`${b.sessionDate.split('T')[0]}T${b.startTime}`)
    );

    // Group by formatted date
    const groups = sorted.reduce((acc, record) => {
        const date = formatDate(record.sessionDate);
        if (!acc[date]) acc[date] = [];
        acc[date].push(record);
        return acc;
    }, {});

    // Expand first date by default if nothing expanded yet
    const dates = Object.keys(groups);
    if (dates.length > 0 && expandedDates.value.length === 0) {
        expandedDates.value.push(dates[0]);
    }

    return groups;
});

// Single session attendance action
const markAttendance = async (sessionId, status = 'Present') => {
    activeLoadingSessionId.value = sessionId;

    try {
        const formData = new FormData();
        formData.append('sessionId', sessionId);
        formData.append('userId', route.params.traineeId);
        if (traineeAttendance.value?.enrollmentId) {
            formData.append('enrollmentId', traineeAttendance.value.enrollmentId);
        }
        formData.append('status', status);

        const response = await attendanceStore.markAttendance(formData);
        if (response && response.success) {
            alertStore.success(response.message || `Attendance marked as ${status}`);
            await attendanceStore.fetchTraineeAttendance(route.params.traineeId, route.params.id);
        } else {
            alertStore.error(response?.message || 'Failed to update attendance');
        }
    } catch (error) {
        alertStore.error(error.message || 'Error updating attendance');
    } finally {
        activeLoadingSessionId.value = null;
    }
};

// Bulk mark all absent sessions as Present
const markAllPresent = async () => {
    const records = traineeAttendance.value?.records;
    if (!records || !Array.isArray(records)) return;

    const absentSessions = records.filter(r => r.status !== 'Present');
    if (absentSessions.length === 0) {
        alertStore.info('All sessions are already marked Present.');
        return;
    }

    isBulkProcessing.value = true;
    let successCount = 0;

    try {
        for (const session of absentSessions) {
            const formData = new FormData();
            formData.append('sessionId', session.sessionId);
            formData.append('userId', route.params.traineeId);
            if (traineeAttendance.value?.enrollmentId) {
                formData.append('enrollmentId', traineeAttendance.value.enrollmentId);
            }
            formData.append('status', 'Present');

            const res = await attendanceStore.markAttendance(formData);
            if (res && res.success) {
                successCount++;
            }
        }

        await attendanceStore.fetchTraineeAttendance(route.params.traineeId, route.params.id);
        alertStore.success(`Successfully marked ${successCount} session(s) as Present.`);
    } catch (error) {
        alertStore.error(error.message || 'Error during bulk attendance marking');
    } finally {
        isBulkProcessing.value = false;
    }
};

const refreshData = () => {
    if (route.params.traineeId && route.params.id) {
        attendanceStore.fetchTraineeAttendance(route.params.traineeId, route.params.id);
    }
};

onMounted(() => {
    refreshData();
});
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-height: 2500px;
}

.expand-enter-from,
.expand-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-8px);
}
</style>

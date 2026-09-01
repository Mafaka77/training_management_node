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

                            <!-- Trainee Expansion Tiles Section -->
                            <div class="space-y-4">
                                <div class="flex items-center justify-between px-1">
                                    <h5 class="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                        <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Trainee Full Profile & Details
                                    </h5>
                                    <div class="flex items-center gap-2 text-xs">
                                        <button @click="toggleAllTiles" type="button"
                                            class="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer">
                                            {{ areAllExpanded ? 'Collapse All' : 'Expand All' }}
                                        </button>
                                    </div>
                                </div>

                                <!-- Trainee Header Overview Card -->
                                <div class="p-4 bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div class="flex items-center gap-3.5">
                                        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
                                            {{ getInitials(enrollment.user?.full_name) }}
                                        </div>
                                        <div>
                                            <h4 class="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                                {{ enrollment.user?.full_name || 'N/A' }}
                                                <span v-if="enrollment.user?.gender" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">
                                                    {{ enrollment.user?.gender }}
                                                </span>
                                            </h4>
                                            <p class="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                                                {{ enrollment.user?.designation || 'No Designation' }} • {{ enrollment.user?.department || 'No Department' }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex flex-wrap items-center gap-2">
                                        <span v-if="getGroupName(enrollment.user?.group)"
                                            class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                                            Group: {{ getGroupName(enrollment.user?.group) }}
                                        </span>
                                        <span v-if="getDistrictName(enrollment.user?.district)"
                                            class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-300 border border-zinc-200 dark:border-white/5">
                                            📍 {{ getDistrictName(enrollment.user?.district) }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Tile 1: Personal & Contact Information -->
                                <div class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-xl overflow-hidden shadow-xs transition-all">
                                    <button @click="tiles.personal = !tiles.personal" type="button"
                                        class="w-full px-5 py-3.5 flex items-center justify-between text-left bg-zinc-50/50 dark:bg-white/[0.02] hover:bg-zinc-100/60 dark:hover:bg-white/[0.04] transition-colors cursor-pointer">
                                        <div class="flex items-center gap-3">
                                            <div class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-500/20">
                                                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                                </svg>
                                            </div>
                                            <div>
                                                <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Personal & Contact Details</span>
                                                <span class="text-[11px] text-zinc-400 ml-2 hidden sm:inline">Phone, Email, DOB, District, Category</span>
                                            </div>
                                        </div>
                                        <svg class="w-4 h-4 text-zinc-400 transition-transform duration-200" :class="tiles.personal ? 'rotate-180 text-emerald-600' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <div v-show="tiles.personal" class="p-5 border-t border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900">
                                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Full Name</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ enrollment.user?.full_name || 'N/A' }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Email Address</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 break-all">{{ enrollment.user?.email || 'N/A' }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Mobile Number</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ enrollment.user?.mobile || 'N/A' }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Gender</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ enrollment.user?.gender || 'N/A' }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Date of Birth</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ formatDate(enrollment.user?.dob) }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">District</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ getDistrictName(enrollment.user?.district) || 'N/A' }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Category</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ enrollment.user?.category || 'General' }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Highest Qualification</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ enrollment.user?.qualification || 'Not Specified' }}</dd>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Tile 2: Service & Employment Details -->
                                <div class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-xl overflow-hidden shadow-xs transition-all">
                                    <button @click="tiles.employment = !tiles.employment" type="button"
                                        class="w-full px-5 py-3.5 flex items-center justify-between text-left bg-zinc-50/50 dark:bg-white/[0.02] hover:bg-zinc-100/60 dark:hover:bg-white/[0.04] transition-colors cursor-pointer">
                                        <div class="flex items-center gap-3">
                                            <div class="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-500/20">
                                                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Service & Employment Details</span>
                                                <span class="text-[11px] text-zinc-400 ml-2 hidden sm:inline">Designation, Cadre, Service Dates, Confirmation</span>
                                            </div>
                                        </div>
                                        <svg class="w-4 h-4 text-zinc-400 transition-transform duration-200" :class="tiles.employment ? 'rotate-180 text-indigo-600' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <div v-show="tiles.employment" class="p-5 border-t border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900">
                                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Department</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ enrollment.user?.department || 'N/A' }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Designation</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ enrollment.user?.designation || 'N/A' }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Group / Cadre Group</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ getGroupName(enrollment.user?.group) || 'N/A' }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Service Type</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ enrollment.user?.service || 'State' }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Service Cadre</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ enrollment.user?.service_cadre || 'Not Specified' }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Govt Employee Status</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                                                    <span :class="enrollment.user?.is_govt_employee !== false ? 'text-emerald-600' : 'text-zinc-500'">
                                                        {{ enrollment.user?.is_govt_employee !== false ? 'Yes (Government)' : 'No / Non-Govt' }}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Mode of Recruitment</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ enrollment.user?.recruitment || 'Direct' }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Confirmation Status</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ enrollment.user?.confirmation || 'Confirmed' }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Date of Entry into Service</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ formatDate(enrollment.user?.date_of_entry) }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Date of Entry in Present Grade</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ formatDate(enrollment.user?.date_of_entry_in_present_grade) }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Date of Superannuation (Retirement)</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ formatDate(enrollment.user?.date_of_superannuation) }}</dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Mandatory Training Status</dt>
                                                <dd class="text-xs font-bold mt-0.5">
                                                    <span :class="enrollment.user?.mandatory_completion ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'">
                                                        {{ enrollment.user?.mandatory_completion ? '✓ Completed' : 'Pending Completion' }}
                                                    </span>
                                                </dd>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Tile 3: Eligibility & Blacklist Check -->
                                <div class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-xl overflow-hidden shadow-xs transition-all">
                                    <button @click="tiles.status = !tiles.status" type="button"
                                        class="w-full px-5 py-3.5 flex items-center justify-between text-left bg-zinc-50/50 dark:bg-white/[0.02] hover:bg-zinc-100/60 dark:hover:bg-white/[0.04] transition-colors cursor-pointer">
                                        <div class="flex items-center gap-3">
                                            <div class="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-200/50 dark:border-amber-500/20">
                                                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Discipline & Blacklist Check</span>
                                                <span class="text-[11px] text-zinc-400 ml-2 hidden sm:inline">Eligibility, Active Status, Penalty Records</span>
                                            </div>
                                        </div>
                                        <svg class="w-4 h-4 text-zinc-400 transition-transform duration-200" :class="tiles.status ? 'rotate-180 text-amber-600' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <div v-show="tiles.status" class="p-5 border-t border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900">
                                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Account Status</dt>
                                                <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                                                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold"
                                                        :class="enrollment.user?.is_active !== false ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'">
                                                        <span class="w-1.5 h-1.5 rounded-full" :class="enrollment.user?.is_active !== false ? 'bg-emerald-600' : 'bg-rose-600'"></span>
                                                        {{ enrollment.user?.is_active !== false ? 'Active' : 'Inactive' }}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Blacklist Status</dt>
                                                <dd class="text-xs font-bold mt-0.5">
                                                    <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold"
                                                        :class="enrollment.user?.is_blacklisted ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'">
                                                        {{ enrollment.user?.is_blacklisted ? '⚠️ Blacklisted' : '✓ Clean Record' }}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div v-if="enrollment.user?.is_blacklisted">
                                                <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Blacklist Reason</dt>
                                                <dd class="text-xs font-medium text-rose-600 dark:text-rose-400 mt-0.5">{{ enrollment.user?.blacklist_details?.reason || 'No Reason Stated' }}</dd>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Past Enrollment History -->
                            <div>
                                <h5 class="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-3 px-1">
                                    Past Enrollment History
                                </h5>

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
import { computed, reactive } from 'vue';

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

// Expansion tiles state
const tiles = reactive({
    personal: true,
    employment: true,
    status: true,
});

const areAllExpanded = computed(() => {
    return tiles.personal && tiles.employment && tiles.status;
});

const toggleAllTiles = () => {
    const nextState = !areAllExpanded.value;
    tiles.personal = nextState;
    tiles.employment = nextState;
    tiles.status = nextState;
};

// Trainee name initials
const getInitials = (name) => {
    if (!name) return 'TR';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// District name helper
const getDistrictName = (district) => {
    if (!district) return '';
    if (typeof district === 'object') return district.name || '';
    return String(district);
};

// Group name helper
const getGroupName = (group) => {
    if (!group) return '';
    if (typeof group === 'object') return group.group_name || group.name || '';
    return String(group);
};

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
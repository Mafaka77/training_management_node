<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-12">
    <nav class="flex p-3 bg-white/5 border border-slate-100 dark:border-slate-800 rounded-xl mb-6" aria-label="Breadcrumb">
      <div v-if="isLoading" class="flex items-center space-x-2 w-full animate-pulse">
        <div class="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div class="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div class="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>
      <ol v-else class="inline-flex items-center space-x-1 md:space-x-2">
        <li class="inline-flex items-center">
          <router-link to="/admin/training/program"
            class="text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center">
            <svg class="w-4 h-4 me-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1-1v3h3a1 1 0 0 0 1-1v-8.5" />
            </svg>
            Trainings
          </router-link>
        </li>
        <li aria-current="page" class="flex items-center space-x-1.5">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
          </svg>
          <span class="text-sm font-medium text-slate-400 dark:text-slate-500">Program Details</span>
        </li>
      </ol>
    </nav>

    <!-- Program Details Hero EHMS Card -->
    <section class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow relative overflow-hidden group">
      <!-- EHMS Decorative Circle -->
      <div class="absolute -right-4 -top-4 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
      
      <div v-if="isLoading" class="relative z-10 flex flex-col md:flex-row items-center gap-6 animate-pulse">
        <div class="w-full md:w-48 h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        <div class="flex-1 space-y-3">
          <div class="flex items-center gap-3">
            <div class="h-7 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div class="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          </div>
          <div class="h-8 w-40 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
        </div>
        <div class="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
          <div class="h-10 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          <div class="h-10 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        </div>
      </div>

      <div v-else class="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div class="relative w-full md:w-48 h-32 shrink-0">
          <img :src="getImageUrl(form.t_banner)"
            class="w-full h-full object-cover rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm" />
        </div>
        <div class="flex-1 space-y-2">
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{{ form.t_name }}</h1>
            <span
              class="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 uppercase tracking-wider">{{
                form.t_status }}</span>
          </div>
          <div class="flex items-center gap-4 mt-2">
            <span
              class="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <svg class="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDateRange(form.t_start_date, form.t_end_date) }}
            </span>
          </div>
        </div>
        <div class="flex gap-6 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div class="text-center px-2">
            <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Capacity</p>
            <p class="text-xl font-bold text-slate-900 dark:text-slate-100">{{ form.t_capacity }}</p>
          </div>
          <div class="w-px h-10 bg-slate-100 dark:bg-slate-800 self-center"></div>
          <div class="text-center px-2">
            <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Sessions</p>
            <p class="text-xl font-bold text-slate-900 dark:text-slate-100">{{ sessions.length }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabs Area -->
    <div
      class="flex items-center gap-1 p-1.5 bg-white dark:bg-slate-900 rounded-2xl w-fit border border-slate-100 dark:border-slate-800 shadow-sm">
      <template v-if="isLoading">
        <div v-for="i in 4" :key="i" class="h-10 w-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
      </template>
      <template v-else>
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
          'flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
          activeTab === tab.id ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
        ]">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
          </svg>
          {{ tab.label }}
        </button>
      </template>
    </div>

    <!-- Tab Content -->
    <div>
      <div v-if="activeTab === 'schedule'" class="space-y-6">
        <div v-if="isSessionLoading" class="space-y-6 animate-pulse">
          <div class="flex justify-between items-center">
            <div class="space-y-2">
              <div class="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div class="h-4 w-64 bg-slate-100 dark:bg-slate-800 rounded"></div>
            </div>
            <div class="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
          <div v-for="i in 3" :key="i"
            class="h-20 w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          </div>
        </div>

        <template v-else>
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Training Schedule</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Manage daily sessions and facilitators.</p>
            </div>
            <button @click="openAddSessionModal"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Session
            </button>
          </div>

          <div v-if="Object.keys(groupedSessions).length === 0"
            class="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div class="mx-auto w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <h3 class="text-slate-900 dark:text-slate-100 font-medium text-lg">No sessions scheduled</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Get started by creating your first session.</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="(daySessions, date) in groupedSessions" :key="date"
              class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-all"
              :class="{ 'ring-1 ring-indigo-500 border-indigo-500': expandedDates.has(date) }">
              <button @click="toggleDate(date)"
                class="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors text-left bg-slate-50/30 dark:bg-slate-800/20">
                <div class="flex items-center gap-4">
                  <div
                    class="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs font-semibold font-mono text-slate-700 dark:text-slate-300 shadow-sm">
                    {{ formatDate(date) }}
                  </div>
                  <span class="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                    {{ new Date(date).toLocaleDateString('en-US', { weekday: 'long' }) }}
                  </span>
                  <span
                    class="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-500/20">
                    {{ daySessions.length }} {{ daySessions.length === 1 ? 'Session' : 'Sessions' }}
                  </span>
                </div>
                <svg class="w-5 h-5 text-slate-400 transition-transform duration-300"
                  :class="{ 'rotate-180': expandedDates.has(date) }" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                </svg>
              </button>

              <div v-show="expandedDates.has(date)" class="border-t border-slate-100 dark:border-slate-800">
                <table class="w-full text-left">
                  <thead
                    class="bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th class="px-6 py-4 w-16">Session</th>
                      <th class="px-6 py-4">Time</th>
                      <th class="px-6 py-4">Topic</th>
                      <th class="px-6 py-4">Trainer</th>
                      <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr v-for="session in daySessions" :key="session._id"
                      class="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td class="px-6 py-4">
                        <span class="text-xs font-bold text-slate-400 dark:text-slate-500">{{ session.tc_session }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                          {{ session.tc_start_time }} - {{ session.tc_end_time }}
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ session.tc_topic }}</span>
                      </td>
                      <td class="px-6 py-4">
                        <div v-if="session.trainer" class="flex items-center gap-3">
                          <img :src="getImageUrl(session.trainer?.image, session.trainer?.full_name)"
                            class="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
                          <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{
                            session.trainer?.full_name
                            }}</span>
                        </div>
                        <span v-else class="text-sm italic text-slate-400 dark:text-slate-500">Unassigned</span>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button v-if="form.t_status === 'Ongoing' || form.t_status === 'Completed'"
                            @click="navigateToAttendance(session._id)"
                            class="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all active:scale-95 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800"
                            title="View Attendance">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                              stroke-width="2">
                              <path
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </button>
                          <button @click="editSession(session)"
                            class="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors active:scale-95 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </button>
                          <button @click="deleteSession(session)"
                            class="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors active:scale-95 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                              <path
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div v-if="activeTab === 'materials'" class="space-y-6">
        <Materials :program-id="route.params.id" />
      </div>

      <div v-if="activeTab === 'enrollments'" class="space-y-6">
        <EnrollmentComponent :program-id="route.params.id" />
      </div>

      <div v-if="activeTab === 'attendance'" class="space-y-6">
        <div v-if="form.t_status === 'Upcoming' || form.t_status === 'Draft'"
          class="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl text-center">
          <div
            class="w-16 h-16 mb-4 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Registry Locked</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm leading-relaxed"> Attendance tracking becomes
            available once the training status moves to <span class="text-indigo-600 dark:text-indigo-400 font-semibold">Ongoing</span>. </p>
        </div>
        <div v-else>
          <AttendanceComponent :program-id="route.params.id" />
        </div>
      </div>
      <div v-if="activeTab === 'release-order'" class="space-y-6">

        <div v-if="form.t_status === 'Upcoming' || form.t_status === 'Draft' || form.t_status === 'Ongoing'"
          class="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl text-center">
          <div
            class="w-16 h-16 mb-4 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Release Order Locked</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm leading-relaxed"> Release Order becomes
            available once the training status moves to <span class="text-indigo-600 dark:text-indigo-400 font-semibold">Completed</span>. </p>
        </div>
        <div v-else>
          <ReleaseOrderComponent :program-id="route.params.id" />
        </div>


      </div>
      <div v-if="activeTab === 'certificate'" class="space-y-6">
        <div v-if="form.t_status === 'Upcoming' || form.t_status === 'Draft' || form.t_status === 'Ongoing'"
          class="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl text-center">
          <div
            class="w-16 h-16 mb-4 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Certificate Generation Locked
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm leading-relaxed"> Certificate generation becomes
            available once the training status moves to <span class="text-indigo-600 dark:text-indigo-400 font-semibold">Completed</span>. </p>
        </div>
        <div v-else>
          <CertificateComponent :program-id="route.params.id" />
        </div>
      </div>
      <div v-if="activeTab === 'evaluation'" class="space-y-6">
        <div v-if="form.t_status === 'Upcoming' || form.t_status === 'Draft' || form.t_status === 'Ongoing'"
          class="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl text-center">
          <div
            class="w-16 h-16 mb-4 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Evaluation Locked
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm leading-relaxed"> Evaluation becomes
            available once the training status moves to <span class="text-indigo-600 dark:text-indigo-400 font-semibold">Completed</span>. </p>
        </div>
        <div v-else>
          <EvaluationComponent :program-id="route.params.id" />
        </div>
      </div>
      <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div
            class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transform transition-all">
            <div
              class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
                {{ isEditMode ? 'Edit Session' : 'Add New Session' }}
              </h3>
              <button @click="closeModal"
                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
              <BaseInput v-model="sessionForm.tc_topic" label="Topic" placeholder="e.g. Fundamental Logic" />
              <div class="grid grid-cols-2 gap-5">
                <div class="col-span-2">
                  <label class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Date</label>
                  <input v-model="sessionForm.tc_date" type="date" required
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100" />
                </div>
                <BaseInput v-model="sessionForm.tc_start_time" label="Start Time" type="time" />
                <BaseInput v-model="sessionForm.tc_end_time" label="End Time" type="time" />
              </div>
              <BaseInput v-model="sessionForm.tc_session" label="Session Number" placeholder="eg. 1" type="number" />
              <SearchSelect v-model="sessionForm.trainer" :options="trainers" label="Trainer"
                placeholder="Search staff..." />

              <div class="flex items-center justify-end gap-3 pt-5 mt-2 border-t border-slate-100 dark:border-slate-800">
                <button type="button" @click="closeModal"
                  class="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">Cancel</button>
                <button type="submit" :disabled="isSubmitting"
                  class="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2">
                  <span v-if="isSubmitting"
                    class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
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
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AttendanceComponent from "../../../../components/trainingTabs/AttendanceComponent.vue";
import CertificateComponent from '../../../../components/trainingTabs/CertificateComponent.vue';
import EnrollmentComponent from "../../../../components/trainingTabs/EnrollmentComponent.vue";
import EvaluationComponent from '../../../../components/trainingTabs/EvaluationComponent.vue';
import Materials from '../../../../components/trainingTabs/Materials.vue';
import ReleaseOrderComponent from "../../../../components/trainingTabs/ReleaseOrderComponent.vue";
import BaseInput from '../../../../components/ui/BaseInput.vue';
import SearchSelect from '../../../../components/ui/SearchSelect.vue';
import { useAlertStore } from '../../../../store/alertStore';
import { useCertificateStore } from '../../../../store/certificateStore';
import { useSessionStore } from '../../../../store/sessionStore';
import { useTrainingStore } from '../../../../store/trainingStore';

const selectionItem = ref(null);
const route = useRoute();
const router = useRouter();
const trainingStore = useTrainingStore();
const sessionStore = useSessionStore();
const alert = useAlertStore();
const certificateStore = useCertificateStore()
const showModal = ref(false);
const isSubmitting = ref(false);
const editingId = ref(null)
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
  t_name: '',
  t_banner: '',
  t_description: '',
  t_capacity: 0,
  t_start_date: '',
  t_end_date: '',
  t_status: '',
  release_order: false,
});
const isEditMode = ref(false);
const sessionForm = reactive({ ...initialForm });
// Helpers
const getImageUrl = (path, name) => path ? `${IMAGE_URL}${path}` : `https://ui-avatars.com/api/?name=${name}`;
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
}
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
        alert.success(response.message)
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
  sessionForm.t_program = data.t_program._id;

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

}
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

const generateReleaseOrder = async () => {
  router.push({ name: 'training.release-order', params: { id: route.params.id } });
  // try {
  //   const response = await certificateStore.generateReleaseOrder(route.params.id);
  //   if (response.success) {

  //   } else {
  //     alert.warning(response.message);
  //   }
  // } catch (ex) {
  //   alert.error(ex.message);
  // }

}

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
<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Header & Navigation -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
          <router-link to="/admin/notification"
            class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Notifications
          </router-link>
          <span>/</span>
          <span class="text-zinc-900 dark:text-zinc-100 font-bold">Compose</span>
        </div>
        <h1 class="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2.5">
          <span class="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </span>
          Send Push Notification
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Dispatch instant FCM push notifications to enrolled training program trainees, broadcast to all users, or
          target specific individuals.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <router-link to="/admin/notification"
          class="px-4 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all">
          Cancel
        </router-link>
        <button @click="openConfirmModal" :disabled="!isFormValid || store.isSending"
          class="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-sm hover:shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
          <svg v-if="store.isSending" class="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          {{ store.isSending ? 'Sending...' : 'Send Notification' }}
        </button>
      </div>
    </div>

    <!-- Main Grid: Form Left, Preview Right -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Form Column (7 cols) -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Target Selection Card -->
        <div
          class="p-5 rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-white/10 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              1. Select Target Audience
            </label>
            <span
              class="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              Required
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- Option 1: Program Enrollees -->
            <button type="button" @click="targetType = 'Program'"
              class="p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer"
              :class="targetType === 'Program'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                : 'border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 bg-zinc-50/50 dark:bg-white/[0.02]'">
              <div class="flex items-center justify-between mb-3">
                <span class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  :class="targetType === 'Program' ? 'bg-emerald-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-600'">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                <span v-if="targetType === 'Program'" class="w-2 h-2 rounded-full bg-emerald-600"></span>
              </div>
              <div>
                <p class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Program Enrollees</p>
                <p class="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Enrolled trainees for a specific training
                  course</p>
              </div>
            </button>

            <!-- Option 2: All Users Broadcast -->
            <button type="button" @click="targetType = 'All'"
              class="p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer"
              :class="targetType === 'All'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                : 'border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 bg-zinc-50/50 dark:bg-white/[0.02]'">
              <div class="flex items-center justify-between mb-3">
                <span class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  :class="targetType === 'All' ? 'bg-emerald-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-600'">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </span>
                <span v-if="targetType === 'All'" class="w-2 h-2 rounded-full bg-emerald-600"></span>
              </div>
              <div>
                <p class="text-xs font-bold text-zinc-900 dark:text-zinc-100">All Users (Broadcast)</p>
                <p class="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Broadcast push to all registered devices
                </p>
              </div>
            </button>

            <!-- Option 3: Individual User -->
            <button type="button" @click="targetType = 'User'"
              class="p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer"
              :class="targetType === 'User'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                : 'border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 bg-zinc-50/50 dark:bg-white/[0.02]'">
              <div class="flex items-center justify-between mb-3">
                <span class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  :class="targetType === 'User' ? 'bg-emerald-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-600'">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <span v-if="targetType === 'User'" class="w-2 h-2 rounded-full bg-emerald-600"></span>
              </div>
              <div>
                <p class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Specific User</p>
                <p class="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Direct push to a single user's device</p>
              </div>
            </button>
          </div>

          <!-- Dynamic Target Configuration Panel -->
          <!-- 1. Program Enrollees Selector -->
          <div v-if="targetType === 'Program'" class="pt-3 border-t border-zinc-100 dark:border-white/5 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Select Training Program *
              </label>

              <!-- Searchable Program Combobox -->
              <div class="relative" ref="programDropdownRef">
                <!-- Trigger Bar -->
                <div @click="toggleProgramDropdown"
                  class="w-full min-h-[42px] px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 hover:border-zinc-300 dark:hover:border-white/20 transition-all flex items-center justify-between cursor-pointer gap-2"
                  :class="{ 'ring-2 ring-emerald-500/20 border-emerald-500 dark:border-emerald-500': isProgramDropdownOpen }">
                  <div class="flex items-center gap-2 flex-1 min-w-0">
                    <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>

                    <div v-if="selectedProgram" class="truncate flex items-center gap-2 flex-1 min-w-0">
                      <span class="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {{ selectedProgram.t_name }}
                      </span>
                      <span
                        class="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 shrink-0">
                        {{ selectedProgram.t_code || 'ID: ' + selectedProgram._id.slice(-5) }}
                      </span>
                    </div>
                    <span v-else class="text-zinc-400 dark:text-zinc-500 truncate">
                      -- Choose or search a training program --
                    </span>
                  </div>

                  <div class="flex items-center gap-1 shrink-0">
                    <button v-if="selectedProgramId" type="button" @click.stop="clearProgram"
                      class="p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-200/60 dark:hover:bg-white/10 transition-colors"
                      title="Clear selection">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <svg class="w-4 h-4 text-zinc-400 transition-transform duration-200"
                      :class="{ 'rotate-180 text-emerald-600': isProgramDropdownOpen }" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <!-- Dropdown Search Panel -->
                <div v-if="isProgramDropdownOpen"
                  class="absolute z-50 left-0 right-0 mt-1.5 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl backdrop-blur-xl overflow-hidden divide-y divide-zinc-100 dark:divide-white/5">
                  <!-- Search Bar inside dropdown -->
                  <div
                    class="p-2.5 bg-zinc-50/80 dark:bg-zinc-900/80 sticky top-0 z-10 border-b border-zinc-100 dark:border-white/5">
                    <div class="relative">
                      <svg class="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400 pointer-events-none" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input ref="programSearchInputRef" v-model="programSearchQuery" type="text"
                        placeholder="Search program by name or code..."
                        class="w-full pl-8.5 pr-8 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        @keydown.esc="isProgramDropdownOpen = false" @click.stop />
                      <button v-if="programSearchQuery" type="button" @click.stop="programSearchQuery = ''"
                        class="absolute right-2.5 top-2.5 p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Program Options List -->
                  <div class="max-h-60 overflow-y-auto divide-y divide-zinc-100 dark:divide-white/5">
                    <div v-if="filteredPrograms.length === 0" class="py-8 px-4 text-center">
                      <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        No programs found matching "{{ programSearchQuery }}"
                      </p>
                      <p class="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                        Try a different program name or course code.
                      </p>
                    </div>

                    <div v-for="program in filteredPrograms" :key="program._id" @click="selectProgram(program)"
                      class="p-3 hover:bg-emerald-50/60 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between text-xs transition-colors group"
                      :class="{ 'bg-emerald-50 dark:bg-emerald-950/20': selectedProgramId === program._id }">
                      <div class="space-y-0.5 pr-2 min-w-0">
                        <div class="flex items-center gap-2">
                          <span
                            class="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate"
                            :class="{ 'text-emerald-700 dark:text-emerald-400': selectedProgramId === program._id }">
                            {{ program.t_name }}
                          </span>
                          <span v-if="program.t_code"
                            class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 shrink-0">
                            {{ program.t_code }}
                          </span>
                        </div>
                        <p v-if="program.t_start_date || program.venue"
                          class="text-[11px] text-zinc-500 dark:text-zinc-400">
                          <span v-if="program.t_start_date">{{ formatDate(program.t_start_date) }}</span>
                          <span v-if="program.t_start_date && program.venue"> • </span>
                          <span v-if="program.venue">{{ program.venue }}</span>
                        </p>
                      </div>

                      <div v-if="selectedProgramId === program._id" class="shrink-0 text-emerald-600">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enrollment Status Filter -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Recipients Enrollment Status
                </label>
                <select v-model="programStatusFilter" @change="handleProgramChange"
                  class="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option value="Approved">Approved Enrollees Only (Recommended)</option>
                  <option value="All">All Enrolled Trainees (Approved & Pending)</option>
                  <option value="Pending">Pending Trainees</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Auto-fill Action URL
                </label>
                <button type="button" @click="autoFillProgramUrl" :disabled="!selectedProgramId"
                  class="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-left flex items-center justify-between">
                  <span class="truncate">Set target to Program Details</span>
                  <svg class="w-3.5 h-3.5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Enrollee Intelligence Card -->
            <div v-if="selectedProgramId"
              class="p-3.5 rounded-xl bg-zinc-100/70 dark:bg-white/[0.03] border border-zinc-200/70 dark:border-white/10">
              <div v-if="store.isEnrolleesSummaryLoading" class="flex items-center gap-2 text-xs text-zinc-500">
                <svg class="animate-spin h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Calculating enrollees and device tokens...
              </div>

              <div v-else-if="store.enrolleesSummary"
                class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div class="space-y-0.5">
                  <span class="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {{ store.enrolleesSummary.program?.t_name }}
                  </span>
                  <span class="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                    {{ formatDate(store.enrolleesSummary.program?.t_start_date) }} - {{
                      formatDate(store.enrolleesSummary.program?.t_end_date) }}
                  </span>
                </div>

                <div class="flex items-center gap-2 flex-wrap">
                  <span
                    class="px-2.5 py-1 rounded-lg font-bold bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-white/10 shadow-2xs">
                    👥 {{ store.enrolleesSummary.totalEnrolled }} Enrollees
                  </span>
                  <span
                    class="px-2.5 py-1 rounded-lg font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    📱 {{ store.enrolleesSummary.usersWithTokens }} Devices Ready
                  </span>
                </div>
              </div>

              <div v-else class="text-xs text-zinc-500">
                Select a program to check recipient eligibility.
              </div>
            </div>
          </div>

          <!-- 2. Individual User Selector -->
          <div v-else-if="targetType === 'User'" class="pt-3 border-t border-zinc-100 dark:border-white/5 space-y-3">
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Select Specific User *
            </label>
            <div class="relative">
              <input v-model="userSearchQuery" @input="handleUserSearch" type="text"
                placeholder="Search user by name or email..."
                class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
              <div v-if="isSearchingUsers" class="absolute right-3 top-3">
                <svg class="animate-spin h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              </div>
            </div>

            <!-- User Search Results Dropdown -->
            <div v-if="userSearchResults.length > 0"
              class="max-h-48 overflow-y-auto rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 divide-y divide-zinc-100 dark:divide-white/5 shadow-lg">
              <div v-for="user in userSearchResults" :key="user._id" @click="selectUser(user)"
                class="p-2.5 hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between text-xs transition-colors"
                :class="{ 'bg-emerald-50/50 dark:bg-emerald-950/20': selectedUserId === user._id }">
                <div>
                  <p class="font-bold text-zinc-900 dark:text-zinc-100">{{ user.full_name || user.name }}</p>
                  <p class="text-[11px] text-zinc-500 dark:text-zinc-400">{{ user.email }} • {{ user.mobile || 'No' +
                    'Mobile' }}</p>
                </div>
                <span
                  class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300">
                  {{ user.roles?.[0]?.name || user.designation || 'User' }}
                </span>
              </div>
            </div>

            <div v-if="selectedUserObj"
              class="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between">
              <div>
                <span class="text-[10px] uppercase font-extrabold text-emerald-700 dark:text-emerald-400">Target
                  Selected</span>
                <p class="text-xs font-bold text-zinc-900 dark:text-zinc-100">{{ selectedUserObj.full_name ||
                  selectedUserObj.name }}</p>
                <p class="text-[11px] text-zinc-500 dark:text-zinc-400">{{ selectedUserObj.email }}</p>
              </div>
              <button @click="clearSelectedUser"
                class="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer">
                Change
              </button>
            </div>
          </div>

          <!-- 3. Broadcast Info Panel -->
          <div v-else class="pt-3 border-t border-zinc-100 dark:border-white/5">
            <div
              class="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/20 flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="text-xs text-blue-900 dark:text-blue-200">
                <p class="font-bold">System Broadcast Mode</p>
                <p class="text-[11px] opacity-80 mt-0.5">This notification will be transmitted via FCM topic to all
                  authenticated mobile apps and web push clients.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Message Content -->
        <div
          class="p-5 rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-white/10 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              2. Notification Content
            </label>
            <span class="text-[11px] text-zinc-400 font-mono">{{ title.length }}/100</span>
          </div>

          <!-- Notification Type -->
          <div>
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Notification Category / Type
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button v-for="t in ['Training', 'Announcement', 'Reminder', 'General']" :key="t" type="button"
                @click="notificationType = t"
                class="px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer"
                :class="notificationType === t
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500'
                  : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5'">
                {{ t }}
              </button>
            </div>
          </div>

          <!-- Title Input -->
          <div>
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Title *
            </label>
            <input v-model="title" type="text" maxlength="100"
              placeholder="e.g., Training Schedule Updated, Urgent Announcement..."
              class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" />
          </div>

          <!-- Body / Message Textarea -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Message Body *
              </label>
              <span class="text-[11px] text-zinc-400 font-mono">{{ messageBody.length }}/500</span>
            </div>
            <textarea v-model="messageBody" rows="4" maxlength="500"
              placeholder="Enter your detailed notification message here..."
              class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y leading-relaxed font-normal"></textarea>
          </div>

          <!-- Target URL / Action Link -->
          <div>
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Action URL / Route (Optional)
            </label>
            <div class="relative">
              <input v-model="targetUrl" type="text"
                placeholder="e.g., /trainings, /trainer/trainings, /admin/training/program..."
                class="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-[11px]" />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
            <p class="text-[11px] text-zinc-400 mt-1">Users tapping this notification on mobile/web will be navigated
              directly to this destination.</p>
          </div>

          <!-- Notification Image Attachment -->
          <div class="pt-1">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Notification Banner / Image (Optional)
              </label>

              <!-- Switch mode: Upload File vs Image URL -->
              <div
                class="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[10px] font-bold">
                <button type="button" @click="imageInputMode = 'file'"
                  class="px-2 py-0.5 rounded-md transition-all cursor-pointer"
                  :class="imageInputMode === 'file' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'">
                  Upload File
                </button>
                <button type="button" @click="imageInputMode = 'url'"
                  class="px-2 py-0.5 rounded-md transition-all cursor-pointer"
                  :class="imageInputMode === 'url' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'">
                  Image URL
                </button>
              </div>
            </div>

            <!-- Program Database Banner Default Indicator -->
            <div v-if="isUsingProgramDbBanner && !selectedImageFile && !imageUrlInput"
              class="mb-3 p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-2xs">
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-emerald-500/30 bg-zinc-100 dark:bg-zinc-800 shadow-inner">
                  <img :src="programDbBanner" alt="Program Banner" class="w-full h-full object-cover" />
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span class="text-[10px] uppercase font-extrabold text-emerald-700 dark:text-emerald-400">
                      Program Banner Attached
                    </span>
                  </div>
                  <p class="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate mt-0.5">
                    {{ selectedProgram?.t_name || store.enrolleesSummary?.program?.t_name }}
                  </p>
                  <p class="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Will send the program's saved database banner. You can upload below to override.
                  </p>
                </div>
              </div>
            </div>

            <!-- Upload File Mode -->
            <div v-if="imageInputMode === 'file'" class="space-y-2">
              <input ref="fileInputRef" type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                class="hidden" @change="handleFileSelect" />

              <!-- When image is uploaded -->
              <div v-if="selectedImageFile && imagePreviewUrl"
                class="relative rounded-2xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 p-3 flex items-center gap-3.5 group">
                <div
                  class="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 shrink-0 relative">
                  <img :src="imagePreviewUrl" alt="Notification Banner Preview" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {{ selectedImageFile.name }}
                    </p>
                    <span
                      class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold shrink-0">
                      Ready
                    </span>
                  </div>
                  <p class="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {{ formatFileSize(selectedImageFile.size) }} • {{
                      selectedImageFile.type.split('/')[1]?.toUpperCase() }}
                  </p>
                  <div class="flex items-center gap-3 mt-1.5">
                    <button type="button" @click="triggerFileInput"
                      class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                      Replace Image
                    </button>
                    <button type="button" @click="removeImage"
                      class="text-[11px] font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <!-- Upload Dropzone -->
              <div v-else @click="triggerFileInput" @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop"
                class="border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                :class="isDragging ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-zinc-200 dark:border-white/10 hover:border-emerald-500/50 hover:bg-zinc-50/80 dark:hover:bg-white/[0.02]'">
                <div
                  class="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-emerald-500/10 text-zinc-400 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    <span class="text-emerald-600 dark:text-emerald-400">Click to upload</span> or drag and drop
                  </p>
                  <p class="text-[11px] text-zinc-400 mt-0.5">PNG, JPG, JPEG, WebP, GIF (Max 10MB)</p>
                </div>
              </div>
            </div>

            <!-- Image URL Mode -->
            <div v-else class="space-y-2">
              <div class="relative">
                <input v-model="imageUrlInput" type="url" placeholder="https://example.com/images/banner.jpg"
                  class="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-[11px]" />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <button v-if="imageUrlInput" type="button" @click="imageUrlInput = ''"
                  class="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Preview for URL -->
              <div v-if="imageUrlInput.trim()"
                class="rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 max-h-32 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center relative group">
                <img :src="imageUrlInput" alt="Notification Banner Preview" class="w-full h-32 object-cover"
                  @error="onUrlImageError" />
              </div>
            </div>
            <p class="text-[11px] text-zinc-400 mt-1">Image will be rendered as a rich expand card in Android, iOS, and
              Web push trays.</p>
          </div>

          <!-- Extra Custom Payload / Key-Values (Collapsible) -->
          <div class="pt-2">
            <button type="button" @click="showAdvanced = !showAdvanced"
              class="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer">
              <svg class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-90': showAdvanced }" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              Advanced FCM Data Payload (Optional)
            </button>

            <div v-if="showAdvanced"
              class="mt-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-semibold text-zinc-500">Custom Key-Value Attributes for Mobile App
                  handlers</span>
                <button type="button" @click="addPayloadField"
                  class="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                  + Add Key
                </button>
              </div>

              <div v-for="(item, idx) in customPayload" :key="idx" class="flex items-center gap-2">
                <input v-model="item.key" type="text" placeholder="Key (e.g. priority)"
                  class="w-1/2 px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 font-mono text-[11px]" />
                <input v-model="item.value" type="text" placeholder="Value (e.g. high)"
                  class="w-1/2 px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 font-mono text-[11px]" />
                <button @click="removePayloadField(idx)" class="p-1 text-red-500 hover:text-red-700">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Live Push Notification Mockup & Info (5 cols) -->
      <div class="lg:col-span-5 space-y-6">
        <!-- Push Mockup Card -->
        <div
          class="p-5 rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-white/10 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-zinc-100 dark:border-white/5 pb-3">
            <span
              class="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Push Notification Preview
            </span>
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300">
              Mobile & Web
            </span>
          </div>

          <!-- Smartphone / Lockscreen Simulation Card -->
          <div
            class="rounded-2xl p-4 bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white shadow-xl border border-zinc-800 relative overflow-hidden">
            <!-- Subtle backdrop glow -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none">
            </div>

            <div class="flex items-center justify-between text-[10px] text-zinc-400 font-mono mb-3">
              <span>PUSH NOTIFICATION</span>
              <span>NOW</span>
            </div>

            <!-- Notification Banner inside Mockup -->
            <div class="p-3.5 rounded-xl bg-zinc-800/90 border border-white/10 backdrop-blur-md space-y-2.5 shadow-lg">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-5 h-5 rounded-md flex items-center justify-center shadow-xs">
                    <img src="../../assets/ati_gom.png" alt="ATI Logo" class="h-full w-full object-contain" />
                  </div>
                  <span class="text-xs font-bold text-zinc-100">ATI Training Portal</span>
                </div>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  {{ notificationType }}
                </span>
              </div>

              <!-- Media Banner in Mockup -->
              <div v-if="effectivePreviewImage"
                class="w-full h-32 rounded-lg overflow-hidden border border-white/10 bg-black/40 relative shadow-inner">
                <img :src="effectivePreviewImage" alt="Push Banner" class="w-full h-full object-cover" />
                <div
                  class="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono text-zinc-300">
                  Rich Media
                </div>
              </div>

              <div>
                <p class="text-xs font-bold text-white line-clamp-1">
                  {{ title || 'Notification Title' }}
                </p>
                <p class="text-[11px] text-zinc-300 mt-0.5 line-clamp-3 leading-relaxed font-light">
                  {{ messageBody || 'Your notification message body preview will be displayed here in real-time as you'
                    + 'type...' }}
                </p>
              </div>

              <div v-if="targetUrl"
                class="pt-1.5 border-t border-white/5 flex items-center gap-1 text-[10px] text-emerald-400 font-mono truncate">
                <svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span class="truncate">{{ targetUrl }}</span>
              </div>
            </div>

            <div class="mt-3 text-center text-[10px] text-zinc-500 font-sans">
              Tap notification to open application route
            </div>
          </div>

          <!-- Dispatch Overview Meta -->
          <div class="space-y-2 pt-2 text-xs">
            <div class="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-white/5">
              <span class="text-zinc-500 dark:text-zinc-400">Target Strategy</span>
              <span class="font-bold text-zinc-900 dark:text-zinc-100">
                {{ targetType === 'Program' ? 'Program Enrollees' : targetType === 'All' ? 'Topic Broadcast (All)' :
                  'Direct User' }}
              </span>
            </div>
            <div v-if="targetType === 'Program'"
              class="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-white/5">
              <span class="text-zinc-500 dark:text-zinc-400">Estimated Audience</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">
                {{ store.enrolleesSummary?.usersWithTokens || 0 }} Devices Ready
              </span>
            </div>
            <div class="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-white/5">
              <span class="text-zinc-500 dark:text-zinc-400">Media Attachment</span>
              <span class="font-bold"
                :class="effectivePreviewImage ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'">
                {{ isUsingProgramDbBanner ? 'Program Banner (Database)' : selectedImageFile ? 'Attached (File Upload)' :
                  imageUrlInput ? 'Attached (Image URL)' : 'None' }}
              </span>
            </div>
            <div class="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-white/5">
              <span class="text-zinc-500 dark:text-zinc-400">Priority Channel</span>
              <span class="font-bold text-zinc-900 dark:text-zinc-100">high_importance_channel</span>
            </div>
          </div>
        </div>

        <!-- FCM Delivery Engine Info Card -->
        <div
          class="p-5 rounded-2xl border bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-white/10 shadow-xs space-y-3">
          <div class="flex items-center gap-2">
            <div
              class="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">FCM Push Architecture</h3>
          </div>
          <ul class="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-2 list-disc pl-4 leading-relaxed">
            <li>Multicasts notifications in optimized batches of 500 tokens per round.</li>
            <li>Supports rich image banners directly in lockscreen and notification centers.</li>
            <li>Stale, uninstalled, or invalid FCM tokens are automatically cleaned up from the database.</li>
            <li>Notifications are also saved into trainee in-app inboxes for viewing inside the portal.</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Confirm Dispatch Modal -->
    <BaseModal :show="isConfirmModalOpen" confirmVariant="primary" @close="isConfirmModalOpen = false"
      @confirm="executeSendNotification">
      <template #icon>
        <div
          class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
      </template>

      <template #title>Confirm Push Notification Dispatch</template>

      <template #content>
        <div class="space-y-3 text-left">
          <p class="text-sm text-zinc-600 dark:text-zinc-300">
            Are you sure you want to send this push notification to
            <span class="font-bold text-zinc-900 dark:text-zinc-100">
              {{ targetType === 'Program' ? 'all enrollees of ' + (store.enrolleesSummary?.program?.t_name || 'selected'
                + 'program') : targetType === 'All' ? 'ALL registered devices across the platform' :
                (selectedUserObj?.full_name || 'selected user') }}
            </span>?
          </p>

          <!-- Modal Image Preview -->
          <div v-if="effectivePreviewImage"
            class="rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 max-h-36 bg-zinc-100 dark:bg-zinc-800">
            <img :src="effectivePreviewImage" alt="Attached Banner" class="w-full h-36 object-cover" />
          </div>

          <div class="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs space-y-1">
            <p><strong class="text-zinc-900 dark:text-zinc-100">Title:</strong> {{ title }}</p>
            <p class="line-clamp-2"><strong class="text-zinc-900 dark:text-zinc-100">Message:</strong> {{ messageBody }}
            </p>
            <p v-if="targetUrl" class="font-mono text-[11px] truncate text-emerald-600 dark:text-emerald-400">
              <strong>URL:</strong> {{ targetUrl }}
            </p>
          </div>
        </div>
      </template>

      <template #confirm-text>
        {{ store.isSending ? 'Sending...' : 'Confirm & Send' }}
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api/axios';
import BaseModal from '../../components/ui/BaseModal.vue';
import { useAlertStore } from '../../store/alertStore';
import { useNotificationStore } from '../../store/notificationStore';

const router = useRouter();
const store = useNotificationStore();
const alert = useAlertStore();

// Form State
const targetType = ref('Program'); // 'Program' | 'All' | 'User'
const selectedProgramId = ref('');
const programStatusFilter = ref('Approved'); // 'Approved' | 'All' | 'Pending'
const programsList = ref([]);
const programSearchQuery = ref('');
const isProgramDropdownOpen = ref(false);
const programDropdownRef = ref(null);
const programSearchInputRef = ref(null);

const selectedUserId = ref('');
const selectedUserObj = ref(null);
const userSearchQuery = ref('');
const userSearchResults = ref([]);
const isSearchingUsers = ref(false);

const notificationType = ref('Training');
const title = ref('');
const messageBody = ref('');
const targetUrl = ref('');
const showAdvanced = ref(false);
const customPayload = ref([]);

// Image State
const imageInputMode = ref('file'); // 'file' | 'url'
const selectedImageFile = ref(null);
const imagePreviewUrl = ref('');
const imageUrlInput = ref('');
const fileInputRef = ref(null);
const isDragging = ref(false);

const isConfirmModalOpen = ref(false);

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || '';

// Form Validation
const isFormValid = computed(() => {
  if (!title.value.trim() || !messageBody.value.trim()) return false;
  if (targetType.value === 'Program' && !selectedProgramId.value) return false;
  if (targetType.value === 'User' && !selectedUserId.value) return false;
  return true;
});

const programDbBanner = computed(() => {
  if (targetType.value !== 'Program') return '';
  const rawPath = selectedProgram.value?.t_banner || store.enrolleesSummary?.program?.t_banner;
  if (!rawPath) return '';
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) return rawPath;
  return `${IMAGE_URL}${rawPath}`.replace(/([^:]\/)\/+/g, "$1");
});

const isUsingProgramDbBanner = computed(() => {
  return targetType.value === 'Program' &&
    !selectedImageFile.value &&
    !imageUrlInput.value.trim() &&
    !!programDbBanner.value;
});

const effectivePreviewImage = computed(() => {
  if (imageInputMode.value === 'file' && imagePreviewUrl.value) {
    return imagePreviewUrl.value;
  }
  if (imageInputMode.value === 'url' && imageUrlInput.value.trim()) {
    return imageUrlInput.value.trim();
  }
  if (targetType.value === 'Program' && programDbBanner.value) {
    return programDbBanner.value;
  }
  return '';
});

// Image handlers
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    processImageFile(file);
  }
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    processImageFile(file);
  }
};

const processImageFile = (file) => {
  if (!file.type.startsWith('image/')) {
    alert.warning('Please select a valid image file (PNG, JPG, JPEG, WebP, GIF).');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    alert.warning('Image size exceeds maximum limit of 10MB.');
    return;
  }
  selectedImageFile.value = file;
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }
  imagePreviewUrl.value = URL.createObjectURL(file);
};

const removeImage = () => {
  selectedImageFile.value = null;
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
    imagePreviewUrl.value = '';
  }
  imageUrlInput.value = '';
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const onUrlImageError = () => {
  alert.warning('Unable to load preview from provided image URL. Please verify the URL.');
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Program Selection Handlers
const selectedProgram = computed(() => {
  return programsList.value.find(p => p._id === selectedProgramId.value) || null;
});

const filteredPrograms = computed(() => {
  const q = programSearchQuery.value.toLowerCase().trim();
  if (!q) return programsList.value;
  return programsList.value.filter(p =>
    (p.t_name && p.t_name.toLowerCase().includes(q)) ||
    (p.t_code && p.t_code.toLowerCase().includes(q)) ||
    (p._id && p._id.toLowerCase().includes(q)) ||
    (p.venue && p.venue.toLowerCase().includes(q))
  );
});

const toggleProgramDropdown = () => {
  isProgramDropdownOpen.value = !isProgramDropdownOpen.value;
  if (isProgramDropdownOpen.value) {
    nextTick(() => {
      programSearchInputRef.value?.focus();
    });
  }
};

const selectProgram = (program) => {
  selectedProgramId.value = program._id;
  isProgramDropdownOpen.value = false;
  programSearchQuery.value = '';
  handleProgramChange();
};

const clearProgram = () => {
  selectedProgramId.value = '';
  programSearchQuery.value = '';
  if (store.enrolleesSummary) {
    store.enrolleesSummary = null;
  }
};

const fetchPrograms = async () => {
  try {
    const response = await api.get('/get-all-training-program', {
      params: { limit: 100 }
    });
    programsList.value = response.data.programs || [];
  } catch (err) {
    console.error('Error loading training programs:', err);
  }
};

const handleProgramChange = async () => {
  if (!selectedProgramId.value) return;
  await store.fetchProgramEnrolleesSummary(selectedProgramId.value, programStatusFilter.value);
};

const autoFillProgramUrl = () => {
  if (selectedProgramId.value) {
    targetUrl.value = `/training-details/${selectedProgramId.value}`;
  }
};

// User Search Handlers
let searchTimeout = null;
const handleUserSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  if (!userSearchQuery.value.trim()) {
    userSearchResults.value = [];
    return;
  }
  searchTimeout = setTimeout(async () => {
    isSearchingUsers.value = true;
    try {
      const response = await api.get('/users', {
        params: { search: userSearchQuery.value.trim(), limit: 8 }
      });
      userSearchResults.value = response.data.users || [];
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      isSearchingUsers.value = false;
    }
  }, 300);
};

const selectUser = (user) => {
  selectedUserId.value = user._id;
  selectedUserObj.value = user;
  userSearchResults.value = [];
  userSearchQuery.value = '';
};

const clearSelectedUser = () => {
  selectedUserId.value = '';
  selectedUserObj.value = null;
  userSearchQuery.value = '';
};

// Custom Payload Handlers
const addPayloadField = () => {
  customPayload.value.push({ key: '', value: '' });
};

const removePayloadField = (index) => {
  customPayload.value.splice(index, 1);
};

const getExtraDataMap = () => {
  const map = {};
  customPayload.value.forEach(item => {
    if (item.key && item.key.trim()) {
      map[item.key.trim()] = item.value;
    }
  });
  return map;
};

// Dispatch Action
const openConfirmModal = () => {
  if (!isFormValid.value) {
    alert.warning('Please fill in all required fields.');
    return;
  }
  isConfirmModalOpen.value = true;
};

const executeSendNotification = async () => {
  if (store.isSending) return;
  isConfirmModalOpen.value = false;

  let result;
  const extraData = getExtraDataMap();

  const formData = new FormData();
  formData.append('title', title.value.trim());
  formData.append('body', messageBody.value.trim());
  formData.append('target_url', targetUrl.value.trim());
  formData.append('type', notificationType.value);
  formData.append('extraData', JSON.stringify(extraData));

  if (selectedImageFile.value) {
    formData.append('image', selectedImageFile.value);
  } else if (imageUrlInput.value.trim()) {
    formData.append('imageUrl', imageUrlInput.value.trim());
  }

  if (targetType.value === 'Program') {
    formData.append('programId', selectedProgramId.value);
    formData.append('statusFilter', programStatusFilter.value);
    result = await store.sendToProgram(formData);
  } else if (targetType.value === 'All') {
    result = await store.sendToAllUsers(formData);
  } else if (targetType.value === 'User') {
    formData.append('userId', selectedUserId.value);
    result = await store.sendToUser(formData);
  }

  if (result?.success) {
    alert.success(result.message || 'Push notification sent successfully!');
    router.push('/admin/notification');
  } else {
    alert.error(result?.message || 'Failed to dispatch notification.');
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const handleClickOutside = (e) => {
  if (programDropdownRef.value && !programDropdownRef.value.contains(e.target)) {
    isProgramDropdownOpen.value = false;
  }
};

onMounted(() => {
  fetchPrograms();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }
  document.removeEventListener('click', handleClickOutside);
});
</script>

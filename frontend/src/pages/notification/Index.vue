<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
          <span class="text-zinc-900 dark:text-zinc-100 font-bold">Notifications</span>
          <span>/</span>
          <span>Overview</span>
        </div>
        <h1 class="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2.5">
          <span class="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </span>
          Notifications & Push Hub
        </h1>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Monitor dispatch history, FCM tokens, and send targeted notifications to enrolled program trainees or broadcast to all users.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <router-link
          to="/admin/notification/create"
          class="px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Compose Notification
        </router-link>
      </div>
    </div>

    <!-- Statistics Overview Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Notifications -->
      <div class="p-4.5 rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total Dispatched</p>
          <p class="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {{ store.stats.totalNotifications || 0 }}
          </p>
          <p class="text-[10px] text-zinc-400">Recorded push & system alerts</p>
        </div>
        <div class="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      <!-- Active Device Tokens -->
      <div class="p-4.5 rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Registered Devices</p>
          <p class="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {{ store.stats.totalTokens || 0 }}
          </p>
          <div class="flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400">
            <span>🤖 {{ store.stats.androidTokens || 0 }} Android</span>
            <span>•</span>
            <span>🍏 {{ store.stats.iosTokens || 0 }} iOS</span>
          </div>
        </div>
        <div class="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <!-- Broadcast Alerts -->
      <div class="p-4.5 rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center justify-between">
        <div class="space-y-1">
          <p class="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Broadcasts</p>
          <p class="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {{ store.stats.broadcastCount || 0 }}
          </p>
          <p class="text-[10px] text-zinc-400">Global topic announcements</p>
        </div>
        <div class="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
      </div>

      <!-- Quick Action Card -->
      <div class="p-4.5 rounded-2xl border bg-gradient-to-tr from-emerald-900/40 via-emerald-800/20 to-zinc-900 border-emerald-500/30 text-white shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Quick Push</span>
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <div>
          <p class="text-xs font-bold text-white">Target Program Trainees</p>
          <p class="text-[11px] text-zinc-300 mt-0.5">Send instant updates directly to course cohorts.</p>
        </div>
        <router-link
          to="/admin/notification/create"
          class="mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          Send to Program &rarr;
        </router-link>
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="p-4 rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search by title or message content..."
          class="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
      </div>

      <!-- Filters -->
      <div class="flex items-center gap-2.5 flex-wrap">
        <!-- Type Filter -->
        <select
          v-model="typeFilter"
          @change="handleFilterChange"
          class="px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
        >
          <option value="All">All Types</option>
          <option value="Training">Training</option>
          <option value="Announcement">Announcement</option>
          <option value="Reminder">Reminder</option>
          <option value="Broadcast">Broadcast</option>
          <option value="Ticket">Ticket</option>
          <option value="General">General</option>
        </select>

        <!-- Target Strategy Filter -->
        <select
          v-model="targetFilter"
          @change="handleFilterChange"
          class="px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
        >
          <option value="All">All Targets</option>
          <option value="Program">Program Enrollees</option>
          <option value="User">Specific User</option>
          <option value="All">All Users (Broadcast)</option>
        </select>

        <button
          @click="refreshData"
          class="p-2 rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
          title="Refresh List"
        >
          <svg class="w-4 h-4" :class="{ 'animate-spin': store.isLoading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Notification List Section -->
    <div class="rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-white/10 shadow-xs overflow-hidden">
      <!-- Loading Skeleton -->
      <div v-if="store.isLoading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="i" class="h-16 w-full rounded-xl bg-zinc-100 dark:bg-white/5 animate-pulse"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="store.notifications.length === 0" class="py-16 text-center space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-400 mx-auto flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">No Notifications Found</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
          No notifications match your current filter criteria or have been sent yet.
        </p>
        <router-link
          to="/admin/notification/create"
          class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all mt-2"
        >
          Send Your First Notification
        </router-link>
      </div>

      <!-- Notifications Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-zinc-200 dark:border-white/5 bg-zinc-50/75 dark:bg-white/[0.02] text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px] tracking-wider">
              <th class="py-3 px-4">Notification Details</th>
              <th class="py-3 px-4">Type</th>
              <th class="py-3 px-4">Target Audience</th>
              <th class="py-3 px-4">Action URL</th>
              <th class="py-3 px-4">FCM Delivery</th>
              <th class="py-3 px-4">Date & Time</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-white/5 text-zinc-700 dark:text-zinc-300">
            <tr
              v-for="item in store.notifications"
              :key="item._id"
              class="hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors group"
            >
              <!-- Details: Title & Message -->
              <td class="py-3.5 px-4 max-w-xs sm:max-w-sm">
                <div class="flex items-start gap-3">
                  <div v-if="item.image_url"
                    class="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800">
                    <img :src="resolveImageUrl(item.image_url)" alt="Banner" class="w-full h-full object-cover" />
                  </div>
                  <div class="space-y-0.5 min-w-0 flex-1">
                    <p class="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {{ item.title }}
                    </p>
                    <p class="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {{ item.message }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Category Badge -->
              <td class="py-3.5 px-4">
                <span
                  class="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide border inline-block"
                  :class="getTypeBadgeClass(item.type)"
                >
                  {{ item.type || 'General' }}
                </span>
              </td>

              <!-- Target Audience -->
              <td class="py-3.5 px-4">
                <div v-if="item.target_type === 'Program'" class="space-y-0.5">
                  <span class="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                    <span>👥</span>
                    {{ item.training_program?.t_name || 'Program Trainees' }}
                  </span>
                  <span v-if="item.recipient_count" class="block text-[10px] text-zinc-400">
                    {{ item.recipient_count }} enrollees targeted
                  </span>
                </div>

                <div v-else-if="item.target_type === 'All'" class="space-y-0.5">
                  <span class="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 text-xs">
                    <span>🌍</span> All Registered Users
                  </span>
                  <span class="block text-[10px] text-zinc-400">Topic Broadcast</span>
                </div>

                <div v-else-if="item.recipient_id" class="space-y-0.5">
                  <span class="font-bold text-zinc-900 dark:text-zinc-100 text-xs block">
                    👤 {{ item.recipient_id?.full_name || 'Single User' }}
                  </span>
                  <span class="text-[10px] text-zinc-400 block">{{ item.recipient_id?.email }}</span>
                </div>

                <div v-else class="text-zinc-400 text-xs font-medium">
                  General Notification
                </div>
              </td>

              <!-- Action URL -->
              <td class="py-3.5 px-4 font-mono text-[11px] max-w-[150px] truncate">
                <span v-if="item.target_url" class="text-emerald-600 dark:text-emerald-400 hover:underline" :title="item.target_url">
                  {{ item.target_url }}
                </span>
                <span v-else class="text-zinc-400 font-sans text-xs">-</span>
              </td>

              <!-- FCM Stats -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-1.5 text-[11px] font-semibold">
                  <span v-if="item.sent_count > 0" class="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    ✓ {{ item.sent_count }} Delivered
                  </span>
                  <span v-if="item.failed_count > 0" class="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                    ✗ {{ item.failed_count }} Failed
                  </span>
                  <span v-if="!item.sent_count && !item.failed_count" class="text-zinc-400 text-xs font-normal">
                    Saved
                  </span>
                </div>
              </td>

              <!-- Date -->
              <td class="py-3.5 px-4 text-[11px] text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {{ formatDateTime(item.createdAt) }}
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <!-- View Details -->
                  <button
                    @click="viewNotificationDetails(item)"
                    class="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    title="View Full Details"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <!-- Delete -->
                  <button
                    @click="openDeleteModal(item)"
                    class="p-1.5 rounded-lg text-zinc-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-colors"
                    title="Delete Record"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div v-if="store.totalPages > 1" class="p-4 border-t border-zinc-200 dark:border-white/5 flex items-center justify-between text-xs">
        <span class="text-zinc-500 dark:text-zinc-400">
          Showing page <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ store.page }}</span> of <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ store.totalPages }}</span> ({{ store.total }} total)
        </span>

        <div class="flex items-center gap-1">
          <button
            @click="store.fetchNotifications(store.page - 1)"
            :disabled="store.page <= 1"
            class="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-white/5 transition-all text-xs font-semibold"
          >
            Previous
          </button>
          <button
            @click="store.fetchNotifications(store.page + 1)"
            :disabled="store.page >= store.totalPages"
            class="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-white/5 transition-all text-xs font-semibold"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- View Details Modal -->
    <BaseModal
      :show="isDetailsModalOpen"
      confirmVariant="primary"
      @close="isDetailsModalOpen = false"
      @confirm="isDetailsModalOpen = false"
    >
      <template #icon>
        <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </template>

      <template #title>Notification Details</template>

      <template #content>
        <div v-if="selectedNotification" class="space-y-4 text-left text-xs">
          <!-- Attached Banner Preview -->
          <div v-if="selectedNotification.image_url"
            class="rounded-xl overflow-hidden border border-zinc-200 dark:border-white/10 max-h-48 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <img :src="resolveImageUrl(selectedNotification.image_url)" alt="Notification Banner" class="w-full h-auto max-h-48 object-cover" />
          </div>

          <!-- Title & Type -->
          <div class="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-extrabold text-zinc-400 tracking-wider">Title</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" :class="getTypeBadgeClass(selectedNotification.type)">
                {{ selectedNotification.type }}
              </span>
            </div>
            <p class="text-sm font-bold text-zinc-900 dark:text-zinc-100">{{ selectedNotification.title }}</p>
          </div>

          <!-- Message Body -->
          <div class="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 space-y-1">
            <span class="text-[10px] uppercase font-extrabold text-zinc-400 tracking-wider">Message Content</span>
            <p class="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{{ selectedNotification.message }}</p>
          </div>

          <!-- Meta Grid -->
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 space-y-0.5">
              <span class="text-[10px] text-zinc-400 uppercase font-bold">Target Audience</span>
              <p class="font-bold text-zinc-900 dark:text-zinc-100">
                {{ selectedNotification.target_type === 'Program' ? 'Program Trainees' : selectedNotification.target_type === 'All' ? 'All Users Broadcast' : (selectedNotification.recipient_id?.full_name || 'Individual') }}
              </p>
            </div>

            <div class="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 space-y-0.5">
              <span class="text-[10px] text-zinc-400 uppercase font-bold">Sent On</span>
              <p class="font-bold text-zinc-900 dark:text-zinc-100">{{ formatDateTime(selectedNotification.createdAt) }}</p>
            </div>
          </div>

          <!-- Action URL -->
          <div v-if="selectedNotification.target_url" class="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 space-y-0.5">
            <span class="text-[10px] text-zinc-400 uppercase font-bold">Target Action URL</span>
            <p class="font-mono text-emerald-600 dark:text-emerald-400 truncate">{{ selectedNotification.target_url }}</p>
          </div>

          <!-- Extra payload -->
          <div v-if="selectedNotification.extra_data && Object.keys(selectedNotification.extra_data).length" class="p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/10 space-y-1">
            <span class="text-[10px] text-zinc-400 uppercase font-bold">FCM Payload Data</span>
            <pre class="font-mono text-[10px] text-zinc-600 dark:text-zinc-400 overflow-x-auto bg-black/5 dark:bg-black/20 p-2 rounded-lg">{{ JSON.stringify(selectedNotification.extra_data, null, 2) }}</pre>
          </div>
        </div>
      </template>

      <template #confirm-text>Close</template>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :show="isDeleteModalOpen"
      confirmVariant="danger"
      @close="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    >
      <template #icon>
        <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-4">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      </template>

      <template #title>Delete Notification Record</template>

      <template #content>
        Are you sure you want to delete this notification record <span class="font-bold text-zinc-900 dark:text-zinc-100">"{{ notificationToDelete?.title }}"</span>?
        This action cannot be undone.
      </template>

      <template #confirm-text>Delete Permanently</template>
    </BaseModal>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import BaseModal from '../../components/ui/BaseModal.vue';
import { useAlertStore } from '../../store/alertStore';
import { useNotificationStore } from '../../store/notificationStore';

const store = useNotificationStore();
const alert = useAlertStore();

const searchQuery = ref('');
const typeFilter = ref('All');
const targetFilter = ref('All');

const selectedNotification = ref(null);
const isDetailsModalOpen = ref(false);

const notificationToDelete = ref(null);
const isDeleteModalOpen = ref(false);

let debounceTimer = null;
const handleSearch = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    store.search = searchQuery.value;
    store.fetchNotifications(1);
  }, 300);
};

const handleFilterChange = () => {
  store.typeFilter = typeFilter.value;
  store.targetFilter = targetFilter.value;
  store.fetchNotifications(1);
};

const refreshData = () => {
  store.fetchNotifications();
  store.fetchStats();
};

const viewNotificationDetails = (item) => {
  selectedNotification.value = item;
  isDetailsModalOpen.value = true;
};

const openDeleteModal = (item) => {
  notificationToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!notificationToDelete.value) return;
  const result = await store.deleteNotification(notificationToDelete.value._id);
  if (result.success) {
    alert.success(result.message);
    isDeleteModalOpen.value = false;
    store.fetchNotifications();
    store.fetchStats();
  } else {
    alert.error(result.message);
  }
};

const getTypeBadgeClass = (type) => {
  switch (type) {
    case 'Training':
      return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
    case 'Announcement':
      return 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20';
    case 'Reminder':
      return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
    case 'Broadcast':
      return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
    case 'Ticket':
      return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
    default:
      return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
  }
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || '';
const resolveImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${IMAGE_URL}${path}`.replace(/([^:]\/)\/+/g, "$1");
};

onMounted(() => {
  store.fetchNotifications();
  store.fetchStats();
});
</script>
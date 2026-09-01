<template>
  <header class="sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300"
    :class="isDark ? 'border-white/10 bg-zinc-950/80 text-zinc-100' : 'border-zinc-200/80 bg-white/80 text-zinc-900'">
    <div class="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-2.5 sm:px-6">

      <!-- Left Brand & Sidebar Toggle -->
      <div class="flex items-center gap-3 sm:gap-4">
        <button @click="$emit('toggleSidebar')"
          class="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
          title="Toggle Navigation Sidebar">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="flex items-center gap-3 cursor-pointer select-none" @click="router.push('/admin/dashboard')">
          <div
            class="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 p-0.5 shadow-xs flex items-center justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/17/Ashoka_Chakra.svg" alt="ATI Logo"
              class="h-full w-full object-contain filter invert brightness-200" />
          </div>
          <div class="hidden sm:block leading-none">
            <div class="text-base font-extrabold tracking-tight">ATI <span
                class="text-emerald-700 dark:text-emerald-400 font-bold">GoM</span></div>
            <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider uppercase">Training
              Portal</span>
          </div>
        </div>
      </div>

      <!-- Center Quick Search Bar -->
      <!-- <div class="hidden md:flex items-center flex-1 max-w-xs mx-6">
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input type="text" placeholder="Search trainings, trainees, records..."
            class="w-full pl-9 pr-12 py-1.5 text-xs rounded-xl transition-all duration-200 bg-zinc-100 dark:bg-white/5 border border-transparent focus:border-emerald-500/50 focus:bg-white dark:focus:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
          <div class="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd class="px-1.5 py-0.5 text-[9px] font-mono font-semibold text-zinc-400 dark:text-zinc-500 bg-zinc-200 dark:bg-white/10 rounded">⌘K</kbd>
          </div>
        </div>
      </div> -->

      <!-- Right Header Actions -->
      <div class="flex items-center gap-2 sm:gap-3">

        <!-- Notifications Dropdown -->
        <div class="relative" ref="notifDropdownRef">
          <button @click="notifOpen = !notifOpen"
            class="w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-95 relative cursor-pointer"
            :class="[
              isDark ? 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100',
              notifOpen ? (isDark ? 'bg-white/10 text-white' : 'bg-zinc-100 text-zinc-900') : ''
            ]" title="Notifications">
            <svg class="w-4 h-4 transition-transform duration-200"
              :class="notifications.length > 0 ? 'animate-wiggle' : ''" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="notifications.length > 0" class="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 ring-2"
                :class="isDark ? 'ring-zinc-950' : 'ring-white'"></span>
            </span>
          </button>

          <transition name="pop">
            <div v-if="notifOpen"
              class="absolute right-0 mt-2.5 w-[22rem] sm:w-[26rem] rounded-2xl border shadow-2xl overflow-hidden z-50 transition-all backdrop-blur-2xl"
              :class="isDark ? 'bg-zinc-900/95 border-white/10 shadow-black/60' : 'bg-white/95 border-zinc-200/90 shadow-zinc-900/15'">

              <!-- Header -->
              <div class="px-4 py-3.5 border-b flex justify-between items-center"
                :class="isDark ? 'border-white/10 bg-zinc-900/50' : 'border-zinc-100 bg-zinc-50/70'">
                <div class="flex items-center gap-2.5">
                  <div class="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                    :class="isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <span class="text-xs font-bold tracking-tight" :class="isDark ? 'text-zinc-100' : 'text-zinc-900'">
                    Notifications
                  </span>
                  <span v-if="notifications.length > 0"
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-xs"
                    :class="isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'">
                    {{ notifications.length }} new
                  </span>
                </div>

                <button v-if="notifications.length > 0" @click="handleClearAll"
                  class="inline-flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer px-2 py-1 rounded-lg"
                  :class="isDark ? 'text-zinc-400 hover:text-emerald-400 hover:bg-white/5' : 'text-zinc-500 hover:text-emerald-700 hover:bg-zinc-100'"
                  title="Mark all as read">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Mark all read</span>
                </button>
              </div>

              <!-- Notification List -->
              <div class="max-h-[340px] overflow-y-auto custom-scrollbar divide-y"
                :class="isDark ? 'divide-white/5' : 'divide-zinc-100'">

                <!-- Empty State -->
                <div v-if="notifications.length === 0" class="py-12 px-6 text-center">
                  <div class="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner"
                    :class="isDark ? 'bg-zinc-800/80 text-zinc-500 border border-white/5' : 'bg-zinc-100 text-zinc-400 border border-zinc-200/60'">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                  </div>
                  <p class="text-xs font-bold mb-1" :class="isDark ? 'text-zinc-200' : 'text-zinc-800'">
                    All caught up!
                  </p>
                  <p class="text-[11px] leading-relaxed max-w-[200px] mx-auto"
                    :class="isDark ? 'text-zinc-500' : 'text-zinc-400'">
                    You have no unread notifications right now.
                  </p>
                </div>

                <!-- Items -->
                <div v-for="n in notifications" :key="n._id" @click="handleNotifClick(n)"
                  class="group p-3.5 flex gap-3 cursor-pointer transition-all duration-150 relative"
                  :class="isDark ? 'hover:bg-white/[0.03] active:bg-white/[0.05]' : 'hover:bg-zinc-50/90 active:bg-zinc-100'">

                  <!-- Type Icon -->
                  <div
                    class="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border shadow-xs transition-transform group-hover:scale-105"
                    :class="getTypeBadge(n.type).iconBg">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" :d="getTypeBadge(n.type).iconPath" />
                    </svg>
                  </div>

                  <!-- Notification Content -->
                  <div class="flex-1 min-w-0 pr-1">
                    <div class="flex items-center justify-between gap-2 mb-0.5">
                      <span
                        class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border leading-none"
                        :class="getTypeBadge(n.type).badge">
                        {{ n.type || 'General' }}
                      </span>
                      <span class="text-[10px] font-medium" :class="isDark ? 'text-zinc-500' : 'text-zinc-400'">
                        {{ formatTimeAgo(n.createdAt) }}
                      </span>
                    </div>

                    <p class="text-xs font-semibold leading-snug truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                      :class="isDark ? 'text-zinc-100' : 'text-zinc-900'">
                      {{ n.title }}
                    </p>

                    <p class="text-[11px] line-clamp-2 mt-0.5 leading-relaxed"
                      :class="isDark ? 'text-zinc-400' : 'text-zinc-500'">
                      {{ n.message }}
                    </p>
                  </div>

                  <!-- Unread Dot / Action Indicator -->
                  <div class="shrink-0 flex items-center self-center pl-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-600 group-hover:opacity-0 transition-opacity"></span>
                    <svg
                      class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -ml-2 text-emerald-600 transition-all group-hover:translate-x-0.5"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

              </div>

              <!-- Footer -->
              <div class="p-2.5 border-t text-center"
                :class="isDark ? 'border-white/10 bg-zinc-900/60' : 'border-zinc-100 bg-zinc-50/50'">
                <button @click="goToNotificationCenter"
                  class="w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  :class="isDark ? 'text-zinc-300 hover:text-white hover:bg-white/5' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'">
                  <span>View Notification Center</span>
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>

            </div>
          </transition>
        </div>

        <!-- Dark / Light Theme Switcher -->
        <button @click="$emit('toggleTheme')"
          class="w-9 h-9 flex items-center justify-center rounded-xl border transition-all active:scale-95 cursor-pointer"
          :class="isDark
            ? 'border-white/10 bg-white/5 text-amber-400 hover:bg-white/10'
            : 'border-zinc-200 bg-white text-emerald-700 hover:bg-zinc-50 shadow-xs'"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <svg v-if="isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M7.05 7.05l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- User Quick Avatar Badge -->
        <div class="h-6 w-px bg-zinc-200 dark:bg-white/10 mx-1"></div>

        <div class="flex items-center gap-2.5">
          <div
            class="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            {{ user?.email?.charAt(0).toUpperCase() || 'A' }}
          </div>
          <div class="hidden lg:block leading-tight text-left">
            <p class="text-xs font-bold truncate max-w-[120px]" :class="isDark ? 'text-zinc-200' : 'text-zinc-800'">
              {{ user?.name || user?.email?.split('@')[0] }}
            </p>
            <span class="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
              {{ user?.role || 'Admin' }}
            </span>
          </div>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAlertStore } from '../store/alertStore';
import { useDashboardStore } from '../store/dashboardStore';

const store = useDashboardStore();
const alert = useAlertStore();
const { notifications } = storeToRefs(store);

defineProps({
  isDark: Boolean,
  user: Object
});

defineEmits(['toggleTheme', 'toggleSidebar']);
const router = useRouter();

const notifOpen = ref(false);
const notifDropdownRef = ref(null);

const getTypeBadge = (type) => {
  switch (type) {
    case 'Training':
      return {
        badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
        iconBg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20',
        iconPath: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222'
      };
    case 'Ticket':
      return {
        badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20',
        iconBg: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-500/20',
        iconPath: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'
      };
    case 'Broadcast':
    case 'Announcement':
      return {
        badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
        iconBg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20',
        iconPath: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z'
      };
    case 'Reminder':
      return {
        badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
        iconBg: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200/60 dark:border-purple-500/20',
        iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      };
    default:
      return {
        badge: 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20',
        iconBg: 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200/60 dark:border-teal-500/20',
        iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      };
  }
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return 'Just now';
  const date = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDays = Math.floor(diffHour / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const handleNotifClick = async (n) => {
  const response = await store.readNotification(n._id);
  if (response.success) {
    await store.fetchNotification();
    notifOpen.value = false;
    
    let target = n.target_url;
    // Normalize target URL if needed
    if (!target && n.training_program) {
      const progId = typeof n.training_program === 'object' ? n.training_program._id : n.training_program;
      const enrollId = n.extra_data?.enrollment_id;
      target = `/admin/training/${progId}/enrollments` + (enrollId ? `?enrollmentId=${enrollId}` : '');
    }
    
    if (target) {
      router.push(target);
    }
  } else {
    notifOpen.value = false;
    alert.warning(response.message);
  }
};

const handleClearAll = async () => {
  const response = await store.readAllNotifications();
  if (response.success) {
    alert.success(response.message || "All notifications cleared");
  } else {
    alert.warning(response.message);
  }
};

const goToNotificationCenter = () => {
  notifOpen.value = false;
  router.push('/admin/notification');
};

const handleClickOutside = (e) => {
  if (notifDropdownRef.value && !notifDropdownRef.value.contains(e.target)) {
    notifOpen.value = false;
  }
};

onMounted(() => {
  store.fetchNotification();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.pop-enter-active {
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.pop-leave-active {
  transition: all 0.15s ease-in;
}

.pop-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}

.pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

@keyframes wiggle {

  0%,
  100% {
    transform: rotate(0deg);
  }

  20% {
    transform: rotate(8deg);
  }

  40% {
    transform: rotate(-8deg);
  }

  60% {
    transform: rotate(4deg);
  }

  80% {
    transform: rotate(-4deg);
  }
}

.animate-wiggle {
  animation: wiggle 1s ease-in-out infinite;
}
</style>
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
          <div class="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 p-0.5 shadow-xs flex items-center justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/17/Ashoka_Chakra.svg" alt="ATI Logo"
              class="h-full w-full object-contain filter invert brightness-200" />
          </div>
          <div class="hidden sm:block leading-none">
            <div class="text-base font-extrabold tracking-tight">ATI <span class="text-emerald-700 dark:text-emerald-400 font-bold">GoM</span></div>
            <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider uppercase">Training Portal</span>
          </div>
        </div>
      </div>

      <!-- Center Quick Search Bar -->
      <div class="hidden md:flex items-center flex-1 max-w-xs mx-6">
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
      </div>

      <!-- Right Header Actions -->
      <div class="flex items-center gap-2 sm:gap-3">

        <!-- Notifications Dropdown -->
        <div class="relative">
          <button @click="notifOpen = !notifOpen"
            class="w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-95 relative cursor-pointer"
            :class="isDark ? 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'"
            title="Notifications">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="notifications.length > 0"
              class="absolute top-2 right-2 w-2 h-2 bg-emerald-600 rounded-full ring-2"
              :class="isDark ? 'ring-zinc-950' : 'ring-white'"></span>
          </button>

          <transition name="pop">
            <div v-if="notifOpen" class="absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl overflow-hidden z-50 transition-colors"
              :class="isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200'">
              <div class="p-3.5 border-b dark:border-white/5 flex justify-between items-center bg-zinc-50/50 dark:bg-white/[0.02]">
                <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Notifications</span>
                <span class="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  {{ notifications.length }} New
                </span>
              </div>
              <div class="max-h-[320px] overflow-y-auto custom-scrollbar">
                <div v-if="notifications.length === 0" class="p-8 text-center text-zinc-400 text-xs italic">
                  No new notifications
                </div>
                <div v-for="n in notifications" :key="n._id" @click="handleNotifClick(n)"
                  class="p-3.5 border-b dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors">
                  <p class="text-xs font-bold text-zinc-900 dark:text-zinc-100">{{ n.title }}</p>
                  <p class="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">{{ n.message }}</p>
                </div>
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
          <div class="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
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
import { onMounted, ref } from 'vue';
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

const handleNotifClick = async (n) => {
  const response = await store.readNotification(n._id);
  if (response.success) {
    await store.fetchNotification();
    notifOpen.value = false;
    router.push(n.target_url);
  } else {
    notifOpen.value = false;
    alert.warning(response.message);
  }
};

onMounted(() => {
  store.fetchNotification();
});
</script>

<style scoped>
.pop-enter-active {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
</style>
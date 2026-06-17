<template>
  <header class="sticky top-0 z-40 border-b backdrop-blur-xl transition-all"
    :class="isDark ? 'border-white/5 bg-black/40' : 'border-zinc-200 bg-white/80'">
    <div class="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-3 sm:px-6">

      <div class="flex items-center gap-4">
        <button @click="$emit('toggleSidebar')" class="p-2 rounded-lg hover:bg-zinc-500/10 transition-colors"
          title="Toggle Sidebar">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="flex items-center gap-3">
          <div class="h-12 w-12 flex items-center justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/17/Ashoka_Chakra.svg" alt="Ashoka Pillar Symbol"
              class="h-full w-full object-contain" />
          </div>
          <div class="hidden sm:block leading-tight">
            <span class="text-lg font-medium tracking-tight ">ATI<span class="text-zinc-500 font-light">
                GoM</span></span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-4">

        <div class="relative">
          <button @click="notifOpen = !notifOpen"
            class="w-9 h-9 flex items-center justify-center rounded-lg transition-all active:scale-95 relative"
            :class="isDark ? 'text-zinc-400 hover:bg-white/5' : 'text-zinc-600 hover:bg-zinc-100'">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="notifications.length > 0"
              class="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2"
              :class="isDark ? 'border-zinc-950' : 'border-white'"></span>
          </button>

          <transition name="pop">
            <div v-if="notifOpen" class="absolute right-0 mt-3 w-80 rounded-2xl border shadow-2xl overflow-hidden z-50"
              :class="isDark ? 'bg-zinc-950 border-white/10' : 'bg-white border-zinc-200'">
              <div class="p-4 border-b dark:border-white/5 flex justify-between items-center">
                <span class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Notifications</span>
                <span class="text-[9px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold">{{
                  notifications.length }} New</span>
              </div>
              <div class="max-h-[350px] overflow-y-auto">
                <div v-if="notifications.length === 0" class="p-10 text-center text-zinc-500 text-xs italic">
                  No new notifications
                </div>
                <div v-for="n in notifications" :key="n._id" @click="handleNotifClick(n)"
                  class="p-4 border-b dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors">
                  <p class="text-xs font-bold text-zinc-900 dark:text-zinc-100">{{ n.title }}</p>
                  <p class="text-[11px] text-zinc-500 line-clamp-2 mt-0.5">{{ n.message }}</p>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <button @click="$emit('toggleTheme')"
          class="w-9 h-9 flex items-center justify-center rounded-lg border transition-all active:scale-95" :class="isDark
            ? 'border-white/10 bg-white/5 text-yellow-400 hover:bg-white/10'
            : 'border-zinc-200 bg-white text-indigo-600 hover:bg-zinc-50'">
          <svg v-if="isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M7.05 7.05l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>


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
const isLoading = ref(false);
defineProps({
  isDark: Boolean,
  user: Object
});

const emit = defineEmits(['toggleTheme', 'toggleSidebar']);
const router = useRouter();

const notifOpen = ref(false);
const userMenuOpen = ref(false);
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
})
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
  transform: translateY(-10px) scale(0.95);
}

.pop-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.98);
}
</style>
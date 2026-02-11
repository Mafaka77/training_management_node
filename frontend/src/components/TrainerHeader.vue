<template>
  <header
      class="sticky top-0 z-40 border-b backdrop-blur-xl transition-all"
      :class="isDark ? 'border-white/5 bg-black/40' : 'border-zinc-200 bg-white/80'"
  >
    <div class="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-3 sm:px-6">

      <div class="flex items-center gap-4">
        <button @click="$emit('toggleSidebar')" class="md:hidden p-2 rounded-lg hover:bg-zinc-500/10 transition-colors">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span class="text-white font-black text-lg">A</span>
          </div>
          <div class="hidden sm:block leading-tight">
            <h1 class="text-sm font-black tracking-tighter uppercase italic">ATI System</h1>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-4">

        <button
            @click="$emit('toggleTheme')"
            class="w-9 h-9 flex items-center justify-center rounded-lg border transition-all active:scale-95"
            :class="isDark
            ? 'border-white/10 bg-white/5 text-yellow-400 hover:bg-white/10'
            : 'border-zinc-200 bg-white text-indigo-600 hover:bg-zinc-50'"
        >
          <svg v-if="isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M7.05 7.05l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <div class="relative flex items-center gap-3 pl-3 border-l border-zinc-200 dark:border-white/10">
          <div class="text-right hidden md:block">
            <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Welcome</p>
            <p class="text-xs font-bold">{{ user?.email?.split('@')[0] }}</p>
          </div>

          <button
              @click="userMenuOpen = !userMenuOpen"
              class="h-10 w-10 rounded-full border-2 transition-all active:scale-90 overflow-hidden"
              :class="userMenuOpen ? 'border-blue-500' : 'border-transparent hover:border-zinc-300 dark:hover:border-white/20'"
          >
            <div class="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white font-bold text-xs">
              {{ user?.email?.charAt(0).toUpperCase() }}
            </div>
          </button>

          <transition name="pop">
            <div v-if="userMenuOpen"
                 class="absolute right-0 top-full mt-3 w-56 rounded-2xl border shadow-2xl overflow-hidden z-50"
                 :class="isDark ? 'bg-zinc-950 border-white/10' : 'bg-white border-zinc-200'">

              <div class="p-4 border-b dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02]">
                <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Signed in as</p>
                <p class="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{{ user?.email }}</p>
              </div>

              <div class="p-2">
                <button class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors hover:bg-zinc-100 dark:hover:bg-white/5">
                  <svg class="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </button>

                <button
                    @click="isLogoutDialog=true"
                    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout Session
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
  <Dialog
      :show="isLogoutDialog"
      :loading="isLoading"
      title="Logout"
      message="Are you sure?"
      confirm-text="Logout"
      @close="isLogoutDialog = false"
      @confirm="handleLogout"
  />
</template>

<script setup>
import { ref ,onMounted} from 'vue';
import { useRouter } from 'vue-router';
import { useDashboardStore } from '../store/dashboardStore';
import { storeToRefs } from 'pinia';
import { useAlertStore } from '../store/alertStore';
import Dialog from "./ui/Dialog.vue";
const isLogoutDialog=ref(false);
const store=useDashboardStore();
const alert=useAlertStore();
const {notifications}=storeToRefs(store);
const isLoading=ref(false);
defineProps({
  isDark: Boolean,
  user: Object
});

const emit = defineEmits(['toggleTheme', 'toggleSidebar']);
const router = useRouter();

const notifOpen = ref(false);
const userMenuOpen = ref(false);
const handleNotifClick = async(n) => {
  const response=await store.readNotification(n._id);
  if(response.success){
    await store.fetchNotification();
    notifOpen.value = false;
    router.push(n.target_url);
  }else{
    notifOpen.value = false;
    alert.warning(response.message);
  }

};
const handleLogout=async ()=>{
  try {
    // 1. Clear local data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    store.$reset();
    window.location.href = "/";

  } catch (err) {
    console.error("Logout error:", err);
    window.location.href = "/";
  }
}
onMounted(()=>{
  // store.fetchNotification();
})
</script>

<style scoped>
.pop-enter-active { transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.pop-leave-active { transition: all 0.15s ease-in; }
.pop-enter-from { opacity: 0; transform: translateY(-10px) scale(0.95); }
.pop-leave-to { opacity: 0; transform: translateY(-5px) scale(0.98); }
</style>
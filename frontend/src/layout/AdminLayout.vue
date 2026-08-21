<script setup>
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AdminHeader from "../components/AdminHeader.vue";
import SidebarContent from "../components/SidebarContent.vue";
import Dialog from "../components/ui/Dialog.vue";
import { useAuthStore } from "../store/authStore.js";
import { useDashboardStore } from "../store/dashboardStore.js";

const isLogoutDialog = ref(false);
const dashboardStore = useDashboardStore();
const authStore = useAuthStore();
const { user, loading } = storeToRefs(authStore);
const router = useRouter();

const handleLogout = async () => {
  try {
    authStore.logout();
    dashboardStore.$reset();
    isLogoutDialog.value = false;
    router.push('/login');
  } catch (err) {
    console.error("Logout error:", err);
    router.push('/login');
  }
};

const sidebarOpen = ref(false); // Controls mobile off-canvas menu
const isSidebarCollapsed = ref(false); // Controls desktop sidebar collapse (false = expanded by default)
const trainingOpen = ref(false);
const masterOpen = ref(false);

const THEME_KEY = "ati.theme";
const isDark = ref(false);

const applyTheme = () => {
  document.documentElement.classList.toggle("dark", isDark.value);
};

const initTheme = () => {
  const saved = localStorage.getItem(THEME_KEY);
  isDark.value = saved !== null ? saved === "dark" : false;
  applyTheme();
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem(THEME_KEY, isDark.value ? "dark" : "light");
  applyTheme();
};

// Handle sidebar toggle for both desktop and mobile
const handleSidebarToggle = () => {
  if (window.innerWidth >= 768) {
    // On desktop: collapse/expand the grid sidebar
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  } else {
    // On mobile: open the modal overlay
    sidebarOpen.value = true;
  }
};

onMounted(() => {
  initTheme();
  window.addEventListener("keydown", (e) => e.key === "Escape" && (sidebarOpen.value = false));
});
</script>

<template>
  <div class="min-h-screen flex flex-col transition-colors duration-300 font-sans"
    :class="isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50/80 text-zinc-900'">

    <AdminHeader :isDark="isDark" :user="user" @toggleTheme="toggleTheme" @toggleSidebar="handleSidebarToggle" />

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <div class="animate-spin rounded-full h-9 w-9 border-2 border-emerald-600 border-t-transparent"></div>
        <span class="text-xs font-semibold text-zinc-500">Loading session...</span>
      </div>
    </div>

    <div v-else class="flex-1 grid max-w-[96rem] mx-auto w-full relative z-10 transition-all duration-300"
      :class="!isSidebarCollapsed ? 'grid-cols-1 md:grid-cols-[16rem_1fr]' : 'grid-cols-1 md:grid-cols-[4.5rem_1fr]'">

      <!-- Desktop Sidebar -->
      <aside class="hidden md:block border-r transition-all duration-300"
        :class="isDark ? 'border-white/10 bg-zinc-950/60' : 'border-zinc-200/80 bg-white/70 backdrop-blur-md'">
        <div class="sticky top-14 h-[calc(100vh-3.5rem)] flex flex-col justify-between overflow-hidden"
          :class="isSidebarCollapsed ? 'p-2.5' : 'p-4'">
          <div class="flex-1 overflow-y-auto custom-scrollbar pr-0.5">
            <SidebarContent 
              v-model:trainingOpen="trainingOpen" 
              v-model:masterOpen="masterOpen" 
              :isDark="isDark" 
              :isCollapsed="isSidebarCollapsed" 
            />
          </div>

          <!-- User Profile Footer -->
          <div class="pt-3 border-t mt-auto" :class="isDark ? 'border-white/10' : 'border-zinc-200/80'">
            <div
              class="flex items-center rounded-xl bg-zinc-100/80 dark:bg-white/[0.03] border border-zinc-200/60 dark:border-white/5 transition-all"
              :class="isSidebarCollapsed ? 'p-1.5 justify-center' : 'p-2.5 justify-between'">
              <div class="flex items-center gap-2.5 min-w-0" :title="user?.email">
                <!-- Avatar -->
                <div
                  class="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs flex-shrink-0">
                  {{ user?.email?.charAt(0).toUpperCase() }}
                </div>
                <!-- User Details -->
                <div v-if="!isSidebarCollapsed" class="leading-tight min-w-0">
                  <p class="text-xs font-bold truncate" :class="isDark ? 'text-zinc-200' : 'text-zinc-800'">
                    {{ user?.name || user?.email?.split('@')[0] }}
                  </p>
                  <p class="text-[10px] truncate" :class="isDark ? 'text-zinc-400' : 'text-zinc-500'">
                    {{ user?.email }}
                  </p>
                </div>
              </div>
              <!-- Logout Button -->
              <button v-if="!isSidebarCollapsed" @click="isLogoutDialog = true"
                class="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                title="Logout Session">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="min-w-0 px-4 py-6 sm:px-8">
        <router-view v-slot="{ Component, route }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Mobile Off-Canvas Drawer -->
    <teleport to="body">
      <Transition name="fade">
        <div v-if="sidebarOpen" class="fixed inset-0 z-[60] flex">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="sidebarOpen = false" />
          <Transition name="slide-right">
            <aside v-if="sidebarOpen" class="relative w-[270px] h-full flex flex-col shadow-2xl transition-colors"
              :class="isDark ? 'bg-zinc-950 border-r border-white/10' : 'bg-white'">
              <div class="p-4 flex justify-between items-center border-b dark:border-white/10">
                <span class="font-bold text-xs uppercase tracking-wider text-zinc-500">Navigation Menu</span>
                <button @click="sidebarOpen = false"
                  class="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors">✕</button>
              </div>
              <div class="p-4 flex flex-col justify-between flex-1 overflow-hidden">
                <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
                  <SidebarContent v-model:trainingOpen="trainingOpen" v-model:masterOpen="masterOpen"
                    :isDark="isDark" :isCollapsed="false" />
                </div>
                <!-- Mobile User Profile Section -->
                <div class="pt-4 border-t mt-auto" :class="isDark ? 'border-white/10' : 'border-zinc-200'">
                  <div
                    class="flex items-center justify-between p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/5">
                    <div class="flex items-center gap-3 min-w-0">
                      <div
                        class="h-9 w-9 rounded-lg bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs flex-shrink-0">
                        {{ user?.email?.charAt(0).toUpperCase() }}
                      </div>
                      <div class="leading-tight min-w-0">
                        <p class="text-xs font-bold truncate" :class="isDark ? 'text-zinc-200' : 'text-zinc-800'">
                          {{ user?.email?.split('@')[0] }}
                        </p>
                        <p class="text-[10px] truncate" :class="isDark ? 'text-zinc-400' : 'text-zinc-500'">
                          {{ user?.email }}
                        </p>
                      </div>
                    </div>
                    <button @click="isLogoutDialog = true"
                      class="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 active:scale-95 transition-all cursor-pointer flex-shrink-0"
                      title="Logout Session">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </Transition>
        </div>
      </Transition>
    </teleport>

    <Dialog :show="isLogoutDialog" title="Logout Session" message="Are you sure you want to end your active session?" confirm-text="Logout"
      @close="isLogoutDialog = false" @confirm="handleLogout" />
  </div>
</template>
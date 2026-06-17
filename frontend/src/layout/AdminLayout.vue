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
const isSidebarCollapsed = ref(true); // Controls desktop sidebar collapse
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
  <div class="min-h-screen flex flex-col transition-colors duration-500 font-sansSelection"
    :class="isDark ? 'bg-[#09090b] text-zinc-100' : 'bg-[#f4f4f5] text-zinc-900'">

    <AdminHeader :isDark="isDark" :user="user" @toggleTheme="toggleTheme" @toggleSidebar="handleSidebarToggle" />

    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="flex-1 grid max-w-[90rem] mx-auto w-full relative z-10 transition-all duration-300"
      :class="!isSidebarCollapsed ? 'grid-cols-1 md:grid-cols-[17rem_1fr]' : 'grid-cols-1'">

      <aside v-show="!isSidebarCollapsed" class="hidden md:block border-r transition-colors"
        :class="isDark ? 'border-white/5 bg-[#09090b]' : 'border-zinc-200 bg-white'">
        <div class="p-5 sticky top-16 h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
          <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
            <SidebarContent v-model:trainingOpen="trainingOpen" v-model:masterOpen="masterOpen" :isDark="isDark" />
          </div>
          <!-- User Profile Section -->
          <div class="pt-4 border-t mt-auto" :class="isDark ? 'border-white/5' : 'border-zinc-200'">
            <div
              class="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/5 dark:bg-white/[0.02] border border-zinc-200/50 dark:border-white/5">
              <div class="flex items-center gap-3 min-w-0">
                <!-- Avatar -->
                <div
                  class="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                  {{ user?.email?.charAt(0).toUpperCase() }}
                </div>
                <!-- User Details -->
                <div class="leading-tight min-w-0">
                  <p class="text-xs font-bold truncate" :class="isDark ? 'text-zinc-200' : 'text-zinc-800'">
                    {{ user?.email?.split('@')[0] }}
                  </p>
                  <p class="text-[10px] truncate" :class="isDark ? 'text-zinc-500' : 'text-zinc-500'">
                    {{ user?.email }}
                  </p>
                </div>
              </div>
              <!-- Logout Button -->
              <button @click="isLogoutDialog = true"
                class="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 active:scale-95 transition-all cursor-pointer flex-shrink-0"
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

      <main class="min-w-0 px-4 py-8 sm:px-8">
        <router-view v-slot="{ Component, route }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>
      </main>
    </div>

    <teleport to="body">
      <Transition name="fade">
        <div v-if="sidebarOpen" class="fixed inset-0 z-[60] flex">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="sidebarOpen = false" />
          <Transition name="slide-right">
            <aside v-if="sidebarOpen" class="relative w-[260px] h-full flex flex-col shadow-2xl transition-colors"
              :class="isDark ? 'bg-zinc-950 border-r border-white/10' : 'bg-white'">
              <div class="p-4 flex justify-between items-center border-b dark:border-white/10">
                <span class="font-bold text-[10px] uppercase tracking-widest text-zinc-500">Menu</span>
                <button @click="sidebarOpen = false"
                  class="p-1 rounded hover:bg-zinc-500/10 transition-colors">✕</button>
              </div>
              <div class="p-4 flex flex-col justify-between flex-1 overflow-hidden">
                <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
                  <SidebarContent v-model:trainingOpen="trainingOpen" v-model:masterOpen="masterOpen"
                    :isDark="isDark" />
                </div>
                <!-- User Profile Section -->
                <div class="pt-4 border-t mt-auto" :class="isDark ? 'border-white/5' : 'border-zinc-200'">
                  <div
                    class="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/5 dark:bg-white/[0.02] border border-zinc-200/50 dark:border-white/5">
                    <div class="flex items-center gap-3 min-w-0">
                      <!-- Avatar -->
                      <div
                        class="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                        {{ user?.email?.charAt(0).toUpperCase() }}
                      </div>
                      <!-- User Details -->
                      <div class="leading-tight min-w-0">
                        <p class="text-xs font-bold truncate" :class="isDark ? 'text-zinc-200' : 'text-zinc-800'">
                          {{ user?.email?.split('@')[0] }}
                        </p>
                        <p class="text-[10px] truncate" :class="isDark ? 'text-zinc-500' : 'text-zinc-500'">
                          {{ user?.email }}
                        </p>
                      </div>
                    </div>
                    <!-- Logout Button -->
                    <button @click="isLogoutDialog = true"
                      class="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 active:scale-95 transition-all cursor-pointer flex-shrink-0"
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

    <Dialog :show="isLogoutDialog" title="Logout" message="Are you sure?" confirm-text="Logout"
      @close="isLogoutDialog = false" @confirm="handleLogout" />
  </div>
</template>
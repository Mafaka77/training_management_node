<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/authStore.js";
import SidebarContent from "../components/SidebarContent.vue";
import AdminHeader from "../components/AdminHeader.vue";
import TrainerHeader from "../components/TrainerHeader.vue"; // [New Import]

const sidebarOpen = ref(false);
const trainingOpen = ref(false); // Changed to false by default as requested
const masterOpen = ref(false);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

/** THEME LOGIC remains same... **/
const THEME_KEY = "ati.theme";
const isDark = ref(false);
const applyTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark'; // Force scrollbars & system elements to dark
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
};

const initTheme = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved !== null) {
    isDark.value = saved === "dark";
  } else {
    isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  applyTheme();
};
const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem(THEME_KEY, isDark.value ? "dark" : "light");
  applyTheme();
};
/** ... **/

onMounted(() => {
  initTheme();
  window.addEventListener("keydown", (e) => e.key === "Escape" && (sidebarOpen.value = false));
});
</script>

<template>
  <div
      class="min-h-screen flex flex-col transition-colors duration-500 font-sansSelection"
      :class="isDark ? 'bg-[#09090b] text-zinc-100' : 'bg-[#f4f4f5] text-zinc-900'"
  >
    <div v-if="isDark" class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
    </div>

    <TrainerHeader
        :isDark="isDark"
        :user="user"
        @toggleTheme="toggleTheme"
        @toggleSidebar="sidebarOpen = true"
    />

    <div class="flex-1 grid grid-cols-1 md:grid-cols-[17rem_1fr] max-w-[90rem] mx-auto w-full relative z-10">
      <aside class="hidden md:block border-r transition-colors" :class="isDark ? 'border-white/5 bg-black/10' : 'border-zinc-200 bg-zinc-50/30'">
        <div class="p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          <SidebarContent v-model:trainingOpen="trainingOpen" v-model:masterOpen="masterOpen" :isDark="isDark" />
        </div>
      </aside>

      <main class="min-w-0 px-4 py-8 sm:px-8">
        <router-view v-slot="{ Component, route }">
<!--          <transition name="page-fade" mode="out-in">-->
            <component :is="Component" :key="route.fullPath" />
<!--          </transition>-->
        </router-view>
      </main>
    </div>

    <teleport to="body">
      <Transition name="fade">
        <div v-if="sidebarOpen" class="fixed inset-0 z-[60] flex">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="sidebarOpen = false" />
          <Transition name="slide-right">
            <aside v-if="sidebarOpen" class="relative w-[260px] h-full flex flex-col shadow-2xl transition-colors" :class="isDark ? 'bg-zinc-950 border-r border-white/10' : 'bg-white'">
              <div class="p-4 flex justify-between items-center border-b dark:border-white/10">
                <span class="font-bold text-[10px] uppercase tracking-widest text-zinc-500">Menu</span>
                <button @click="sidebarOpen = false" class="p-1 rounded hover:bg-zinc-500/10 transition-colors">✕</button>
              </div>
              <div class="p-4 overflow-y-auto flex-1">
                <SidebarContent v-model:trainingOpen="trainingOpen" v-model:masterOpen="masterOpen" :isDark="isDark" />
              </div>
            </aside>
          </Transition>
        </div>
      </Transition>
    </teleport>
  </div>
</template>
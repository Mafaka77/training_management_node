<template>
  <div class="bg-zinc-950 min-h-screen p-6 lg:px-20 lg:py-12 font-sans selection:bg-blue-500/30">
    <div class="max-w-7xl mx-auto mb-20 text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500/60 shadow-[0_0_8px_rgba(59,130,246,0.3)]"></span>
        <span class="text-[10px] font-medium text-blue-400/80 uppercase tracking-[0.2em]">ATI Mizoram • Official Training Portal</span>
      </div>
      <h1 class="text-4xl md:text-5xl font-light text-white tracking-tight mb-4">
        Excellence in <span class="text-blue-400 font-normal">Public Service</span>
      </h1>
      <p class="text-zinc-500 text-base max-w-2xl mx-auto leading-relaxed font-light">
        Strengthening administrative efficiency through specialized foundation courses,
        mid-career training, and systematic skill development for the Government of Mizoram.
      </p>
    </div>

    <div v-if="loading && trainings.length === 0" class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="bg-zinc-900/40 border border-white/[0.05] rounded-[1.5rem] overflow-hidden animate-pulse">
        <div class="h-56 bg-zinc-800/50"></div>
        <div class="p-7 space-y-6">
          <div class="h-3 w-24 bg-zinc-800 rounded"></div>
          <div class="h-6 w-full bg-zinc-800 rounded"></div>
          <div class="grid grid-cols-2 gap-4 py-5 border-y border-white/[0.04]">
            <div class="space-y-2"><div class="h-2 w-10 bg-zinc-800 rounded"></div><div class="h-3 w-20 bg-zinc-800 rounded"></div></div>
            <div class="space-y-2"><div class="h-2 w-10 bg-zinc-800 rounded ml-auto"></div><div class="h-3 w-20 bg-zinc-800 rounded ml-auto"></div></div>
          </div>
          <div class="space-y-3">
            <div class="h-2 w-16 bg-zinc-800 rounded"></div>
            <div class="flex gap-2">
              <div class="h-6 w-16 bg-zinc-800 rounded-md"></div>
              <div class="h-6 w-16 bg-zinc-800 rounded-md"></div>
            </div>
          </div>
          <div class="h-12 w-full bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
          v-for="training in trainings"
          :key="training.id"
          class="group relative flex flex-col bg-zinc-900/20 border border-white/[0.05] rounded-[1.5rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-sm hover:shadow-2xl"
      >
        <div class="relative h-56 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent z-10"></div>
          <img
              :src="getImageUrl(training.t_banner)"
              :alt="training.t_name"
              class="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
          />

          <div class="absolute top-5 right-5 z-20">
            <span :class="['px-3 py-1.5 rounded-lg text-[10px] font-medium uppercase tracking-widest backdrop-blur-md border shadow-xl', getStatusStyle(training.t_status).badge]">
              {{ training.t_status }}
            </span>
          </div>
        </div>

        <div class="p-7 flex flex-col flex-1 relative z-20 -mt-8">
          <div class="mb-3">
            <span class="text-blue-500/80 text-[10px] font-medium uppercase tracking-[0.1em]">
              {{ training.t_organizer }}
            </span>
          </div>

          <h3 class="text-xl font-normal text-zinc-100 mb-6 leading-snug group-hover:text-white transition-colors">
            {{ training.t_name }}
          </h3>

          <div class="grid grid-cols-2 gap-4 py-5 border-y border-white/[0.04] mb-6">
            <div class="space-y-1">
              <p class="text-[9px] text-zinc-600 uppercase tracking-widest font-medium">Timeline</p>
              <p class="text-[12px] text-zinc-400 font-light">{{ formatDateRange(training.t_start_date, training.t_end_date) }}</p>
            </div>
            <div class="space-y-1 text-right">
              <p class="text-[9px] text-zinc-600 uppercase tracking-widest font-medium">Capacity</p>
              <p class="text-[12px] text-zinc-400 font-light">{{ training.t_capacity }} Participants</p>
            </div>
          </div>

          <div class="mb-8">
            <p class="text-[9px] text-zinc-600 uppercase tracking-widest font-medium mb-3">Target Group</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="group in training.t_eligibility" :key="group._id"
                    class="px-2.5 py-1 rounded-md text-[10px] font-normal bg-white/[0.03] text-zinc-400 border border-white/[0.05]"
              >
                {{ group.group_name }}
              </span>
            </div>
          </div>

          <div class="mt-auto">
            <router-link
                :to="`/programs/${training.id}`"
                class="group/btn relative w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-100 text-zinc-950 rounded-xl font-medium text-[11px] uppercase tracking-wider transition-all hover:bg-blue-600 hover:text-white active:scale-[0.98]"
            >
              Access Program
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-20 flex flex-col items-center gap-6 pb-20">
      <button
          v-if="store.hasMore"
          @click="loadMore"
          :disabled="store.loading"
          class="px-10 py-4 bg-transparent border border-white/10 rounded-xl font-medium text-zinc-400 transition-all hover:border-blue-500/40 hover:text-blue-400 disabled:opacity-30"
      >
        <div class="flex items-center gap-3">
          <span v-if="store.loading" class="w-4 h-4 border border-blue-500 border-t-transparent rounded-full animate-spin"></span>
          <span class="tracking-[0.15em] uppercase text-[10px]">{{ store.loading ? 'Syncing Catalog...' : 'Load More Programs' }}</span>
        </div>
      </button>
      <p v-else-if="trainings.length > 0" class="text-zinc-700 font-medium text-[9px] uppercase tracking-[0.4em]">
        End of official catalog
      </p>
    </div>
  </div>
</template>

<script setup>
import { useHomeStore } from "../../store/homeStore.js";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const store = useHomeStore();
const { trainings,loading } = storeToRefs(store);
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const currentPage = ref(1);

const loadMore = async () => {
  currentPage.value++;
  await store.fetchPrograms(currentPage.value);
};

function getImageUrl(path) {
  if (!path) return "https://via.placeholder.com/400x400?text=No+Banner"
  return `${IMAGE_URL}${path}`
}

const statusStyles = {
  Draft: { badge: "bg-amber-500/5 text-amber-500 border-amber-500/10" },
  Upcoming: { badge: "bg-rose-500/5 text-rose-400 border-rose-500/10" },
  Ongoing: { badge: "bg-blue-500/5 text-blue-400 border-blue-500/10" },
  Completed: { badge: "bg-emerald-500/5 text-emerald-400 border-emerald-500/10" },
}

const getStatusStyle = (status) => statusStyles[status] || statusStyles.Upcoming

const formatDateRange = (start, end) => {
  if (!start) return "To be announced"
  const opt = { month: "short", day: "numeric" }
  const s = new Date(start).toLocaleDateString("en-US", opt)
  const e = new Date(end).toLocaleDateString("en-US", { ...opt, year: "numeric" })
  return `${s} — ${e}`
}

onMounted(() => {
  currentPage.value = 1;
  store.fetchPrograms(1);
});
</script>
<style scoped>
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-pulse {
  background: linear-gradient(90deg, #18181b 25%, #27272a 50%, #18181b 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}
</style>
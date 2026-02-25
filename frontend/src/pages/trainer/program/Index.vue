<template>
  <div class="space-y-6 max-w-6xl mx-auto q-pa-md">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1">
        <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          My Training Programs
        </h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          Manage sessions where you are assigned as the Training Director.
        </p>
      </div>

      <!-- <router-link
        to="/trainer/trainings/create"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Session
      </router-link> -->
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <button 
          v-for="s in ['All', 'Draft', 'Upcoming', 'Ongoing', 'Completed']" 
          :key="s"
          @click="handleStatusFilter(s)"
          :class="[
            status === s 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/10 hover:border-blue-500/50',
            'px-4 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95'
          ]"
        >
          {{ s }}
        </button>
      </div>

      <div class="relative max-w-md">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          v-model="search"
          type="text"
          placeholder="Search your programs..."
          class="block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-all
                 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10
                 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
        />
      </div>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 gap-4">
      <div v-for="i in 3" :key="i" class="h-40 w-full animate-pulse bg-zinc-100 dark:bg-white/5 rounded-2xl"></div>
    </div>

    <div v-else-if="programs.length === 0"
         class="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-white/10">
      <div class="p-4 rounded-full bg-zinc-100 dark:bg-white/10 mb-4 text-zinc-400">
        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="text-zinc-900 dark:text-zinc-100 font-semibold">No assigned programs</h3>
      <p class="text-zinc-500 text-sm mt-1">You haven't been assigned to any training sessions yet.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <div
        v-for="program in programs"
        :key="program._id"
        class="group relative flex flex-col md:flex-row md:items-center gap-6 p-5 rounded-2xl border transition-all duration-300
               bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10 hover:shadow-xl hover:border-blue-500/40"
      >
        <div class="relative shrink-0">
          <img
            :src="getImageUrl(program.t_banner)"
            class="w-full md:w-32 h-32 rounded-2xl object-cover shadow-md border border-zinc-100 dark:border-white/5"
          />
          <div :class="['absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm animate-pulse', getStatusStyle(program.t_status).color]"></div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-2">
            <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {{ program.t_name }}
            </h3>
            <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap', getStatusStyle(program.t_status).badge]">
              {{ program.t_status }}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-y-2 gap-x-4 mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            <span class="flex items-center gap-1.5 font-medium">
               <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               {{ formatDateRange(program.t_start_date, program.t_end_date) }}
            </span>
            <span v-if="program.t_category" class="flex items-center gap-1.5 font-medium">
               <svg class="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
               {{ program.t_category.name || 'General' }}
            </span>
          </div>

          <div class="flex flex-wrap gap-2">
            <span v-for="group in program.t_eligibility" :key="group._id"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-blue-50/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20"
            >
              {{ group.group_name }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-white/5">
          <router-link 
            :to="{ name: 'trainer.programs.edit', params: { id: program._id } }"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Manage Session
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue';
import { useDirectorStore } from '../../../store/directorStore';
import { storeToRefs } from "pinia";
import debounce from "lodash.debounce";

const store = useDirectorStore();
const { programs, search, status, isLoading } = storeToRefs(store);
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

// Helper to handle images
const getImageUrl = (path) => path ? `${IMAGE_URL}${path}` : "https://via.placeholder.com/400x400?text=No+Banner";

// Status Visuals
const statusStyles = {
  Draft: { color: "bg-amber-500", badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  Upcoming: { color: "bg-red-400", badge: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" },
  Ongoing: { color: "bg-blue-500", badge: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  Completed: { color: "bg-emerald-500", badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500" },
};
const getStatusStyle = (s) => statusStyles[s] || statusStyles.Upcoming;

// Date Formatter
const formatDateRange = (start, end) => {
  if(!start) return "TBA";
  const opt = { month: "short", day: "numeric" };
  return `${new Date(start).toLocaleDateString("en-US", opt)} - ${new Date(end).toLocaleDateString("en-US", { ...opt, year: "numeric" })}`;
};

// Filter Logic
const handleStatusFilter = (newStatus) => {
  store.status = newStatus;
  store.fetchPrograms(1);
};

const doSearch = debounce(() => store.fetchPrograms(), 500);

watch([search, status], () => doSearch());

onMounted(() => {
    store.fetchPrograms();
});
</script>
<template>
  <div class="space-y-6 max-w-6xl mx-auto">
    <div class="flex flex-col gap-6 mb-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Training Programs
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Monitor and manage educational sessions and eligibility.
          </p>
        </div>

        <router-link
            to="/admin/training/program/create"
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Program
        </router-link>
      </div>

      <div class="relative max-w-md">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>

        <div class="flex flex-wrap items-center gap-2 mb-4">
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
        <input
            v-model="search"
            type="text"
            placeholder="Search programs by name..."
            class="block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-all
                   bg-white dark:bg-zinc-900/50
                   border-zinc-200 dark:border-white/10
                   text-zinc-900 dark:text-zinc-100
                   focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
        />
      </div>
    </div>

    <div v-if="programs.length === 0"
         class="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-white/10">
      <div class="p-4 rounded-full bg-zinc-100 dark:bg-white/10 mb-4 text-zinc-400">
        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="text-zinc-900 dark:text-zinc-100 font-semibold">No programs found</h3>
      <p class="text-zinc-500 text-sm mt-1">Try a different search or create a new session.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <div
          v-for="program in programs"
          :key="program._id"
          class="group relative flex flex-col md:flex-row md:items-center gap-6 p-5 rounded-2xl border transition-all duration-300
               bg-white dark:bg-zinc-900/50
               border-zinc-200 dark:border-white/10
               hover:shadow-xl hover:border-blue-500/40"
      >
        <div class="relative flex-shrink-0">
          <img
              :src="getImageUrl(program.t_banner)"
              class="w-full md:w-32 h-32 md:h-32 rounded-2xl object-cover shadow-md border border-zinc-100 dark:border-white/5"
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
            <span class="flex items-center gap-1.5 font-medium">
               <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
               Cap: {{ program.t_capacity }}
            </span>
          </div>

         <div class="flex flex-wrap gap-2">
        <span v-for="group in program.t_eligibility" :key="group._id"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight bg-blue-50/50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20"
          >
    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    {{ group.group_name }}
  </span>
</div>
<div class="mt-4 pt-4 border-t border-zinc-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
  <div class="flex items-center gap-3">
    <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
      Status:
    </label>
    <div class="relative">
      <select 
        :value="program.t_status"
        @change="handleStatusChange(program, $event.target.value)"
        class="appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-semibold
               bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10
               text-zinc-700 dark:text-zinc-300 outline-none cursor-pointer transition-all"
      >
        <option value="Draft">Draft</option>
        <option value="Upcoming">Upcoming</option>
        <option value="Ongoing">Ongoing</option>
        <option value="Finished">Finished</option>
      </select>
      <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-zinc-400">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>

  <router-link 
    :to="{name:'training.session',params:{id: program._id}}"
    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold
           bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400
           border border-emerald-100 dark:border-emerald-500/20
           hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
  >
    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
    </svg>
    Manage Session
  </router-link>
</div>
        </div>

        <div class="flex md:flex-col gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-white/5">
          <router-link
              :to="{ name: 'training.program.edit', params: { id: program._id }}"
              class="flex-1 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            <svg class="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2.5 2.5 0 113.536 3.536L12 20.364H8v-4.364l9.293-9.293z" /></svg>
          </router-link>
          <button
              @click="handleDelete(program)"
              class="flex-1 p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            <svg class="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>

    <nav v-if="totalPages >= 1" class="flex justify-end pt-8">
      <ul class="flex items-center gap-2">
        <li>
          <button @click="goToPage(page - 1)" :disabled="page === 1"
                  class="p-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/10 disabled:opacity-30 transition-all">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
        </li>
        <li v-for="p in pages" :key="p">
          <button @click="goToPage(p)"
                  :class="[p === page ? 'bg-blue-600 text-white border-blue-600' : 'text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/10', 'w-10 h-10 rounded-xl border text-sm font-bold transition-all']">
            {{ p }}
          </button>
        </li>
        <li>
          <button @click="goToPage(page + 1)" :disabled="page === totalPages"
                  class="p-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/10 disabled:opacity-30 transition-all">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useTrainingStore } from "../../../store/trainingStore.js";
import { computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import debounce from "lodash.debounce"

const store = useTrainingStore();
const { programs, page, totalPages, search,status } = storeToRefs(store);
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

function getImageUrl(path) {
  if (!path) return "https://via.placeholder.com/400x400?text=No+Banner"
  return `${IMAGE_URL}${path}`
}

const statusStyles = {
  Draft:{
    color: "bg-amber-500",
    badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20",
  },
  Upcoming: {
    color: "bg-red-400",
    badge: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-amber-500/20",
  },
  Ongoing: {
    color: "bg-blue-500",
    badge: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
  },
  Completed: {
    color: "bg-emerald-500",
    badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-100 dark:border-emerald-500/20",
  },
}

const getStatusStyle = (status) => statusStyles[status] || statusStyles.Upcoming

const formatDateRange = (start, end) => {
  if(!start) return "TBA"
  const opt = { month: "short", day: "numeric" }
  const s = new Date(start).toLocaleDateString("en-US", opt)
  const e = new Date(end).toLocaleDateString("en-US", { ...opt, year: "numeric" })
  return `${s} - ${e}`
}
// Handle status change
const handleStatusFilter = (newStatus) => {
  store.status = newStatus;
  store.fetchTrainings(1); // Always reset to page 1 when filtering
};
const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

const goToPage = async (p) => {
  if (p >= 1 && p <= totalPages.value){
    await store.fetchTrainings(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const doSearch = debounce(() => store.fetchTrainings(), 500)
watch([search,status] ,() =>{
  doSearch()
});

onMounted(() => store.fetchTrainings())

const handleDelete = (program) => {
  // Logic for opening delete modal would go here
  console.log("Delete triggered for", program.t_name)
}
</script>
<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Header Section -->
    <div class="flex flex-col gap-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1.5">
          <h2 class="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            Training Programs
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Monitor, organize, and manage ATI educational programs and group eligibility.
          </p>
        </div>
        <div>
          <router-link to="/admin/training/program/create"
            class="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Program
          </router-link>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div
        class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-white/5">
        <div class="flex flex-wrap items-center gap-2">
          <button v-for="s in ['All', 'Draft', 'Upcoming', 'Ongoing', 'Completed']" :key="s"
            @click="handleStatusFilter(s)" :class="[
              status === s
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border-blue-600'
                : 'bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white',
              'px-4 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95'
            ]">
            {{ s }}
          </button>
        </div>

        <div class="relative w-full lg:max-w-md">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input v-model="search" type="text" placeholder="Search programs by name..." class="block w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border transition-all
                     bg-white dark:bg-zinc-900/50
                     border-zinc-200 dark:border-white/10
                     text-zinc-900 dark:text-zinc-100
                     placeholder-zinc-400
                     focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="relative min-h-[400px]">
      <!-- Loading State Skeletons -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i"
          class="animate-pulse flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50">
          <div class="w-full h-44 bg-zinc-200 dark:bg-zinc-800"></div>
          <div class="p-5 flex-1 space-y-4">
            <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
            <div class="space-y-2">
              <div class="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
              <div class="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
            </div>
            <div class="flex gap-2 pt-2">
              <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-16"></div>
              <div class="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-20"></div>
            </div>
            <div class="mt-6 pt-4 border-t border-zinc-100 dark:border-white/5 flex justify-between gap-3">
              <div class="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-xl flex-1"></div>
              <div class="flex gap-2">
                <div class="w-9 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
                <div class="w-9 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="programs.length === 0"
        class="flex flex-col items-center justify-center py-24 bg-zinc-50 dark:bg-zinc-900/20 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-white/10">
        <div class="p-5 rounded-full bg-zinc-100 dark:bg-zinc-850 mb-4 text-zinc-400">
          <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 class="text-zinc-900 dark:text-zinc-100 font-bold text-lg">No programs found</h3>
        <p class="text-zinc-500 text-sm mt-1 text-center max-w-xs">Try adjusting your filters or create a new program to
          get started.</p>
      </div>

      <!-- Programs Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="program in programs" :key="program._id"
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/5 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/80 transition-all duration-300 hover:shadow-lg hover:shadow-zinc-200/40 dark:hover:shadow-black/40 hover:border-zinc-300 dark:hover:border-white/10">

          <!-- Banner & Status Overlay -->
          <div class="relative w-full h-40 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
            <img :src="getImageUrl(program.t_banner)"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102" />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent"></div>

            <!-- Status Badge Overlay -->
            <div class="absolute top-3 right-3">
              <span
                :class="['px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 shadow-sm', getStatusStyle(program.t_status).badge]">
                <span class="w-1.5 h-1.5 rounded-full animate-pulse"
                  :class="getStatusStyle(program.t_status).dot"></span>
                {{ program.t_status }}
              </span>
            </div>

            <!-- Date Range & Duration Overlay -->
            <div class="absolute bottom-3 left-3 text-white flex items-center gap-2">
              <div
                class="bg-black/40 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                <svg class="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDateRange(program.t_start_date, program.t_end_date) }}
              </div>
              <div v-if="program.t_duration" class="bg-blue-600/95 px-2 py-1 rounded-lg text-[10px] font-bold">
                {{ program.t_duration }} Days
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between text-[11px] font-medium text-zinc-500">
                <span v-if="program.t_category"
                  class="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                  {{ program.t_category.name || 'General' }}
                </span>
                <span v-else class="text-zinc-400 uppercase tracking-wider">General</span>

                <span class="flex items-center gap-1 text-zinc-600 dark:text-zinc-300 font-semibold">
                  <svg class="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Limit: {{ program.t_capacity }}
                </span>
              </div>

              <h3
                class="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                {{ program.t_name }}
              </h3>

              <!-- Director & Coordinator info if available -->
              <div v-if="program.t_director" class="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Course Director : <span class="text-zinc-700 dark:text-zinc-200 font-semibold">{{ program.t_director.full_name || 'Assigned' }}</span>
              </div>

              <!-- Eligibility groups info if available -->
              <div v-if="program.t_eligibility && program.t_eligibility.length" class="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Group : <span class="text-zinc-700 dark:text-zinc-200 font-semibold">{{ program.t_eligibility.map(g => g.group_name).join(', ') }}</span>
              </div>
            </div>

            <!-- Action Buttons Strip -->
            <div class="pt-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between gap-3">
              <router-link :to="{ name: 'training.session', params: { id: program._id } }"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all">
                Manage Course
              </router-link>

              <div class="flex gap-2">
                <router-link :to="{ name: 'training.program.edit', params: { id: program._id } }"
                  class="p-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-zinc-200/40 dark:border-white/5 transition-all active:scale-95"
                  title="Edit Program">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2.5 2.5 0 113.536 3.536L12 20.364H8v-4.364l9.293-9.293z" />
                  </svg>
                </router-link>
                <button @click="handleDelete(program)"
                  class="p-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-zinc-200/40 dark:border-white/5 transition-all active:scale-95"
                  title="Delete Program">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Section -->
      <nav v-if="!isLoading && totalPages >= 1" class="flex justify-end pt-8">
        <ul class="flex items-center gap-2">
          <li>
            <button @click="goToPage(page - 1)" :disabled="page === 1"
              class="p-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/10 disabled:opacity-30 transition-all">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
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
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import debounce from "lodash.debounce";
import { storeToRefs } from "pinia";
import { computed, onMounted, watch } from "vue";
import { useAuthStore } from "../../../store/authStore.js";
import { useTrainingStore } from "../../../store/trainingStore.js";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const store = useTrainingStore();

// Extract isLoading from the store refs
const { programs, page, totalPages, search, status, isLoading } = storeToRefs(store);

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

function getImageUrl(path) {
  if (!path) return "https://via.placeholder.com/400x400?text=No+Banner"
  return `${IMAGE_URL}${path}`
}

const statusStyles = {
  Draft: {
    dot: "bg-amber-500",
    badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20",
  },
  Upcoming: {
    dot: "bg-red-500",
    badge: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20",
  },
  Ongoing: {
    dot: "bg-blue-500",
    badge: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
  },
  Completed: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-100 dark:border-emerald-500/20",
  },
}

const getStatusStyle = (status) => statusStyles[status] || statusStyles.Upcoming

const formatDateRange = (start, end) => {
  if (!start) return "TBA"
  const opt = { month: "short", day: "numeric" }
  const s = new Date(start).toLocaleDateString("en-US", opt)
  const e = new Date(end).toLocaleDateString("en-US", { ...opt, year: "numeric" })
  return `${s} - ${e}`
}

const handleStatusFilter = (newStatus) => {
  store.status = newStatus;
  store.fetchTrainings(1);
};

const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

const goToPage = async (p) => {
  if (p >= 1 && p <= totalPages.value) {
    await store.fetchTrainings(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const doSearch = debounce(() => store.fetchTrainings(), 500)

watch([search, status], () => {
  doSearch()
});

onMounted(() => store.fetchTrainings())

const userRole = computed(() => authStore.roles || 'Guest')

const handleDelete = (program) => {
  console.log("Delete triggered for", program.t_name)
}
</script>
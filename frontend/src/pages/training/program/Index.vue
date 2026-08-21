<template>
  <div class="max-w-[90rem] mx-auto pb-12 space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Training Programs
          </h2>
          <span
            class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 text-[10px] font-bold uppercase">
            {{ programs?.length || 0 }} Active / Total
          </span>
        </div>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">
          Monitor, organize, and manage ATI educational curriculums, sessions, and trainee cohorts.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <router-link to="/admin/training/program/create"
          class="group inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-95 cursor-pointer">
          <div
            class="flex items-center justify-center w-4 h-4 rounded-lg bg-white/20 group-hover:rotate-90 transition-transform duration-300">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span>Create New Program</span>
        </router-link>
      </div>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Status Pills Filter -->
      <div
        class="flex items-center bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl border border-zinc-200/60 dark:border-white/5 overflow-x-auto custom-scrollbar">
        <button v-for="s in ['All', 'Draft', 'Upcoming', 'Ongoing', 'Completed']" :key="s"
          @click="handleStatusFilter(s)" :class="[
            status === s
              ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
              : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium'
          ]" class="px-3.5 py-1.5 text-xs rounded-lg transition-all cursor-pointer shrink-0">
          {{ s }}
        </button>
      </div>

      <!-- Search Bar -->
      <div class="relative w-full md:w-80 group">
        <svg
          class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="search" type="text" placeholder="Search programs by name..."
          class="w-full pl-10 pr-9 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs" />
        <button v-if="search" @click="search = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="relative min-h-[400px]">
      <!-- Skeleton Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="`skeleton-${i}`"
          class="animate-pulse flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xs">
          <div class="w-full h-44 bg-zinc-200 dark:bg-zinc-800"></div>
          <div class="p-5 flex-1 space-y-4">
            <div class="flex justify-between items-center">
              <div class="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-24"></div>
              <div class="h-3.5 bg-zinc-100 dark:bg-zinc-800/60 rounded-md w-16"></div>
            </div>
            <div class="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-4/5"></div>
            <div class="space-y-2 pt-1">
              <div class="h-3 bg-zinc-100 dark:bg-zinc-800/60 rounded-md w-3/5"></div>
              <div class="h-3 bg-zinc-100 dark:bg-zinc-800/60 rounded-md w-2/5"></div>
            </div>
            <div class="pt-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between gap-3">
              <div class="h-9 bg-zinc-200 dark:bg-zinc-800 rounded-xl flex-1"></div>
              <div class="flex gap-1.5">
                <div class="w-9 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
                <div class="w-9 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!programs || programs.length === 0"
        class="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-white/10 text-center px-4">
        <div
          class="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3 border border-emerald-200/60 dark:border-emerald-500/20">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">No Programs Found</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm leading-relaxed">
          {{ search ? `No training programs matched your search query "${search}".` : 'No programs match the selected status filter.' }}
        </p>
        <div class="flex gap-2 mt-4">
          <button v-if="search || status !== 'All'" @click="resetFilters"
            class="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer">
            Reset Filters
          </button>
          <router-link to="/admin/training/program/create"
            class="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-semibold text-white shadow-xs transition-colors">
            Create Program
          </router-link>
        </div>
      </div>

      <!-- Programs Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="program in programs" :key="program._id"
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 hover:border-emerald-600/40 dark:hover:border-emerald-500/30 transition-all duration-300 shadow-xs hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-black/40">

          <!-- Banner & Status Top Overlay -->
          <div class="relative w-full h-44 overflow-hidden bg-zinc-950">
            <img :src="getImageUrl(program.t_banner, program.t_name)"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              @error="$event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(program.t_name || 'Program')}&background=047857&color=fff`" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

            <!-- Top Right: Status Pill -->
            <div class="absolute top-3 right-3">
              <span
                :class="['px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md flex items-center gap-1.5 shadow-xs', getStatusStyle(program.t_status).badge]">
                <span class="w-1.5 h-1.5 rounded-full animate-pulse"
                  :class="getStatusStyle(program.t_status).dot"></span>
                {{ program.t_status || 'Draft' }}
              </span>
            </div>

            <!-- Bottom Left Date & Duration Chips -->
            <div class="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between gap-2">
              <div
                class="bg-black/50 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 text-zinc-200">
                <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDateRange(program.t_start_date, program.t_end_date) }}</span>
              </div>

              <div v-if="program.t_duration"
                class="bg-emerald-700/90 backdrop-blur-md border border-emerald-500/40 px-2 py-1 rounded-lg text-[10px] font-bold text-white shrink-0">
                {{ program.t_duration }} Days
              </div>
            </div>
          </div>

          <!-- Card Content Body -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <!-- Category & Capacity Row -->
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  {{ program.t_category?.name || 'General' }}
                </span>
                <span
                  class="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-200/80 dark:border-zinc-700">
                  <svg class="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Limit: {{ program.t_capacity || 'Open' }}
                </span>
              </div>

              <!-- Title -->
              <router-link :to="{ name: 'training.program.view', params: { id: program._id } }">
                <h3
                  class="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                  {{ program.t_name }}
                </h3>
              </router-link>

              <!-- Course Director -->
              <div class="flex items-center gap-2 pt-1">
                <div
                  class="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 border border-emerald-200/60 dark:border-emerald-500/20">
                  {{ getInitials(program.t_director?.full_name || 'CD') }}
                </div>
                <div class="text-xs truncate">
                  <span class="text-zinc-400 text-[11px]">Director: </span>
                  <span class="font-medium text-zinc-700 dark:text-zinc-300">{{ program.t_director?.full_name ||
                    'Unassigned' }}</span>
                </div>
              </div>

              <!-- Eligible Groups Tags -->
              <div v-if="program.t_eligibility && program.t_eligibility.length"
                class="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span class="text-[10px] text-zinc-400">Eligibility:</span>
                <span v-for="g in program.t_eligibility.slice(0, 3)" :key="g._id"
                  class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700">
                  {{ g.group_name }}
                </span>
                <span v-if="program.t_eligibility.length > 3" class="text-[10px] text-zinc-400 font-semibold">
                  +{{ program.t_eligibility.length - 3 }} more
                </span>
              </div>
            </div>

            <!-- Action Buttons Strip -->
            <div class="pt-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between gap-2.5">
              <router-link :to="{ name: 'training.program.view', params: { id: program._id } }"
                class="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer">
                <span>Manage Course</span>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </router-link>

              <div class="flex items-center gap-1.5">
                <router-link :to="{ name: 'training.program.edit', params: { id: program._id } }"
                  class="p-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 border border-zinc-200 dark:border-zinc-700 shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="Edit Program">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </router-link>
                <button @click="handleDelete(program)"
                  class="p-2 rounded-xl bg-white dark:bg-zinc-800 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 border border-zinc-200 dark:border-zinc-700 shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="Delete Program">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Section -->
      <div v-if="!isLoading && totalPages > 1"
        class="mt-8 px-5 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <span class="text-xs text-zinc-500 font-medium">
          Showing page <strong class="text-zinc-900 dark:text-zinc-100">{{ page }}</strong> of <strong
            class="text-zinc-900 dark:text-zinc-100">{{ totalPages }}</strong>
        </span>

        <div class="flex items-center gap-1">
          <!-- Previous Button -->
          <button @click="goToPage(page - 1)" :disabled="page <= 1 || isLoading"
            class="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors text-zinc-500 cursor-pointer disabled:cursor-not-allowed">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Page indicator pills -->
          <button v-for="p in pages" :key="p" @click="goToPage(p)" :class="[
            p === page
              ? 'bg-emerald-700 text-white font-bold shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium'
          ]"
            class="min-w-[28px] h-7 px-2 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer">
            {{ p }}
          </button>

          <!-- Next Button -->
          <button @click="goToPage(page + 1)" :disabled="page >= totalPages || isLoading"
            class="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors text-zinc-500 cursor-pointer disabled:cursor-not-allowed">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <DeleteDialog :show="showDeleteModal" :loading="isDeleting" title="Delete Training Program"
      :message="`Are you sure you want to delete '${selectedProgram?.t_name}'?`" confirmText="Yes, Delete Program"
      @close="showDeleteModal = false" @confirm="onConfirmDelete" />
  </div>
</template>

<script setup>
import debounce from "lodash.debounce";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import DeleteDialog from '../../../components/ui/DeleteDialog.vue';
import { useAlertStore } from '../../../store/alertStore.js';
import { useAuthStore } from "../../../store/authStore.js";
import { useTrainingStore } from "../../../store/trainingStore.js";

const alert = useAlertStore();
const authStore = useAuthStore();
const store = useTrainingStore();

// Extract state from store
const { programs, page, totalPages, search, status, isLoading } = storeToRefs(store);

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || '';

function getImageUrl(path, name = 'Program') {
  if (!path) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=047857&color=fff`;
  if (path.startsWith('http')) return path;
  return `${IMAGE_URL}${path}`.replace(/([^:]\/)\/+/g, "$1");
}

const getInitials = (name) => {
  if (!name) return 'CD';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const statusStyles = {
  Draft: {
    dot: "bg-amber-500",
    badge: "bg-black/50 text-amber-300 border-amber-500/30",
  },
  Upcoming: {
    dot: "bg-blue-400",
    badge: "bg-black/50 text-blue-300 border-blue-500/30",
  },
  Ongoing: {
    dot: "bg-emerald-400",
    badge: "bg-black/50 text-emerald-300 border-emerald-500/30",
  },
  Completed: {
    dot: "bg-zinc-400",
    badge: "bg-black/50 text-zinc-300 border-zinc-500/30",
  },
};

const getStatusStyle = (status) => statusStyles[status] || statusStyles.Upcoming;

const formatDateRange = (start, end) => {
  if (!start) return "TBA";
  const opt = { month: "short", day: "numeric" };
  const s = new Date(start).toLocaleDateString("en-US", opt);
  const e = end ? new Date(end).toLocaleDateString("en-US", { ...opt, year: "numeric" }) : '';
  return e ? `${s} - ${e}` : s;
};

const handleStatusFilter = (newStatus) => {
  store.status = newStatus;
  store.fetchTrainings(1);
};

const resetFilters = () => {
  store.status = 'All';
  store.search = '';
  store.fetchTrainings(1);
};

const pages = computed(() => {
  const total = totalPages.value || 1;
  const current = page.value || 1;
  const delta = 2;
  const range = [];

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }

  if (current - delta > 2) {
    range.unshift('...');
  }
  if (current + delta < total - 1) {
    range.push('...');
  }

  range.unshift(1);
  if (total > 1) {
    range.push(total);
  }

  return [...new Set(range.filter(p => typeof p === 'number'))];
});

const goToPage = async (p) => {
  if (p >= 1 && p <= totalPages.value) {
    await store.fetchTrainings(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const doSearch = debounce(() => store.fetchTrainings(1), 400);

watch([search, status], () => {
  doSearch();
});

onMounted(() => store.fetchTrainings());

const showDeleteModal = ref(false);
const isDeleting = ref(false);
const selectedProgram = ref(null);

const handleDelete = (program) => {
  selectedProgram.value = program;
  showDeleteModal.value = true;
};

const onConfirmDelete = async () => {
  if (!selectedProgram.value) return;

  isDeleting.value = true;
  try {
    const response = await store.deleteProgram(selectedProgram.value._id);
    if (response.success) {
      alert.success(response.message || 'Program deleted successfully');
      showDeleteModal.value = false;
      selectedProgram.value = null;
      await store.fetchTrainings();
    } else {
      alert.error(response.message);
    }
  } catch (error) {
    alert.error(error.message || 'An error occurred during deletion.');
  } finally {
    isDeleting.value = false;
  }
};
</script>
<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        class="p-4 bg-white text-center dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
        <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Registry Size</p>
        <p class="text-2xl font-black text-slate-900 dark:text-slate-100">{{ store.totalItems || 0 }} Trainees</p>
      </div>
      <div
        class="p-4 bg-white text-center dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
        <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Program Completion</p>
        <p class="text-2xl font-black text-indigo-500">{{ store.averagePercentage || 0 }}% Avg</p>
      </div>
      <div
        class="p-4 bg-white text-center dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
        <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Session</p>
        <p class="text-2xl text-center font-black text-emerald-500">{{ store.totalSessions || 0 }}</p>
      </div>
    </div>

    <div
      class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
      <div class="relative w-full sm:w-96">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="store.searchQuery" @input="debounceSearch" type="text" placeholder="Search by trainee name..."
          class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white" />
      </div>
    </div>

    <div
      class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <table class="w-full text-left">
        <thead class="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
          <tr>
            <th @click="handleSort('user.full_name')"
              class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 w-1/3 cursor-pointer hover:text-indigo-600 transition-colors">
              Trainee <span v-if="store.sortBy === 'user.full_name'">{{ store.sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>

            <th @click="handleSort('attendedCount')"
              class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors">
              Total Appearance <span v-if="store.sortBy === 'attendedCount'">{{ store.sortOrder === 'asc' ? '↑' : '↓'
              }}</span>
            </th>

            <th @click="handleSort('percentage')"
              class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors">
              Persistence <span v-if="store.sortBy === 'percentage'">{{ store.sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>

            <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Action</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100 dark:divide-white/5">
          <tr v-if="store.isAttendanceLoading">
            <td colspan="4" class="px-6 py-8 text-center text-sm font-semibold text-slate-400 animate-pulse">Loading
              attendance data...</td>
          </tr>

          <tr v-else-if="!store.attendanceData?.length">
            <td colspan="4" class="px-6 py-8 text-center text-sm font-semibold text-slate-400">No trainees found.</td>
          </tr>

          <tr v-for="trainee in store.attendanceData" :key="trainee._id"
            class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">

            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                  <span class="text-sm font-bold text-slate-500 uppercase">{{ trainee.user?.full_name?.charAt(0) || '?'
                  }}</span>
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ trainee.user?.full_name }}</p>

                    <span v-if="trainee.isCertificateGenerated"
                      class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider"
                      title="Certificate has been generated">
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      GENERATED
                    </span>
                  </div>

                  <p class="text-[10px] font-mono text-slate-500 uppercase mt-0.5">UID: {{ trainee.user?._id?.slice(-6)
                    || 'N/A' }}</p>
                </div>
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="flex items-baseline gap-1 tabular-nums">
                <span class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ trainee.attendedCount }}</span>
                <span class="text-xs text-slate-400 font-medium">/ {{ store.totalSessions }} Sessions</span>
              </div>
            </td>

            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div class="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden min-w-[100px]">
                  <div class="h-full transition-all duration-700 bg-indigo-500"
                    :style="{ width: trainee.percentage + '%' }"></div>
                </div>
                <span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 w-8">{{ trainee.percentage
                }}%</span>
              </div>
            </td>

            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <router-link
                  :to="{ name: 'training.trainee.attendance', params: { id: props.programId, traineeId: trainee.user?._id } }"
                  class="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all active:scale-95 group border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800"
                  title="View Trainee Attendance">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:scale-110"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </router-link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="store.totalPages > 1"
        class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-slate-500 font-bold uppercase tracking-widest">
          Page {{ store.currentPage }} of {{ store.totalPages }}
        </p>
        <div class="flex gap-2">
          <button @click="changePage(store.currentPage - 1)" :disabled="store.currentPage === 1"
            class="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all">
            Prev
          </button>
          <button @click="changePage(store.currentPage + 1)" :disabled="store.currentPage === store.totalPages"
            class="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAttendanceStore } from "../../store/attendanceStore.js";

const route = useRoute();
const store = useAttendanceStore();

const props = defineProps({
  programId: { type: String, required: true }
});

// Timer stays local to prevent memory leaks!
let searchTimeout = null;

// Core fetch function
const loadData = () => {
  store.fetchAttendances(props.programId);
};

// Handlers directly mutate the store state
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= store.totalPages) {
    store.currentPage = newPage;
    loadData();
  }
};

const handleSort = (key) => {
  if (store.sortBy === key) {
    store.sortOrder = store.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    store.sortBy = key;
    store.sortOrder = 'asc'; // Reset to asc when changing columns
  }
  store.currentPage = 1; // Reset to page 1 on sort change
  loadData();
};

const debounceSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    store.currentPage = 1; // Reset to page 1 on new search
    loadData();
  }, 400);
};

onMounted(() => {
  // Check if we switched to a DIFFERENT training program
  // If so, reset the filters. If it's the same, keep them!
  if (store.currentProgramId !== props.programId) {
    store.resetQueryState();
    store.currentProgramId = props.programId;
  }

  loadData();
});
</script>
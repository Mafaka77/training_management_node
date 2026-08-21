<template>
  <div class="max-w-6xl mx-auto space-y-6 pb-12 text-zinc-900 dark:text-zinc-100">

    <!-- Breadcrumb Header -->
    <nav class="flex p-3 bg-zinc-100/60 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 rounded-xl"
      aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-2">
        <li class="inline-flex items-center">
          <router-link to="/admin/training/program"
            class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center transition-colors">
            <svg class="w-4 h-4 me-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1-1v3h3a1 1 0 0 0 1-1v-8.5" />
            </svg>
            Trainings
          </router-link>
        </li>
        <li class="flex items-center space-x-1.5">
          <svg class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
          </svg>
          <router-link :to="{ name: 'training.program.view', params: { id: route.params.id } }"
            class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
            Program Details
          </router-link>
        </li>
        <li aria-current="page" class="flex items-center space-x-1.5">
          <svg class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
          </svg>
          <span class="text-xs font-semibold text-zinc-400 dark:text-zinc-500">Session Attendance</span>
        </li>
      </ol>
    </nav>

    <!-- Header & Metric Cards Container -->
    <div v-if="isAttendanceLoading && !trainees.length" class="space-y-4 animate-pulse">
      <div class="h-28 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-white/10"></div>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="h-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-white/5"></div>
      </div>
    </div>

    <template v-else>
      <!-- Session Header Card -->
      <div class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden group">
        <!-- Ambient Glow -->
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out pointer-events-none"></div>

        <div class="flex items-start md:items-center gap-4 relative z-10">
          <router-link :to="{ name: 'training.program.view', params: { id: route.params.id } }"
            class="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all border border-zinc-200/60 dark:border-white/5 shrink-0 cursor-pointer"
            title="Back to Program">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </router-link>
          <div class="space-y-1">
            <div class="flex items-center gap-2.5 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                Attendance Registry
              </span>
            </div>
            <h1 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {{ sessionTopic || 'Classroom Session Attendance' }}
            </h1>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              Verify trainee attendance records and sign-in timestamps for this session.
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Metric 1: Total Enrolled -->
        <div class="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Enrolled Trainees</p>
            <p class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">{{ trainees.length }}</p>
          </div>
          <div class="p-3 bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 rounded-xl border border-zinc-200/60 dark:border-white/5">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        <!-- Metric 2: Present Trainees -->
        <div class="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Present Trainees</p>
            <div class="flex items-baseline gap-2 mt-1">
              <p class="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{{ presentCount }}</p>
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400">({{ attendanceRate }}%)</span>
            </div>
          </div>
          <div class="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200/60 dark:border-emerald-500/20">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <!-- Metric 3: Absent / Pending -->
        <div class="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Pending / Absent</p>
            <p class="text-2xl font-bold text-zinc-700 dark:text-zinc-300 mt-1">{{ absentCount }}</p>
          </div>
          <div class="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-xl border border-zinc-200/60 dark:border-white/5">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Search & Filter Controls -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs">
        <div class="relative flex-1 max-w-md">
          <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Filter trainees by name or email..."
            class="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
        </div>

        <div class="flex items-center gap-2 self-end sm:self-auto">
          <button @click="filterStatus = 'all'" :class="[
            'px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer',
            filterStatus === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
          ]">
            All ({{ trainees.length }})
          </button>
          <button @click="filterStatus = 'Present'" :class="[
            'px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer',
            filterStatus === 'Present'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
          ]">
            Present ({{ presentCount }})
          </button>
          <button @click="filterStatus = 'Absent'" :class="[
            'px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer',
            filterStatus === 'Absent'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
          ]">
            Absent ({{ absentCount }})
          </button>
        </div>
      </div>

      <!-- Attendance Table Container -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-zinc-50/80 dark:bg-white/[0.02] border-b border-zinc-200/80 dark:border-white/5 text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold">
              <th class="px-6 py-4">Trainee</th>
              <th class="px-6 py-4 text-center">Sign-in Time</th>
              <th class="px-6 py-4 text-center">Status</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-zinc-100 dark:divide-white/5 text-xs">
            <template v-if="isAttendanceLoading">
              <tr v-for="i in 5" :key="`attn-skel-${i}`" class="animate-pulse">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
                    <div class="space-y-1.5">
                      <div class="h-4 w-36 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                      <div class="h-3 w-48 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="mx-auto h-6 w-20 bg-zinc-100 dark:bg-zinc-800/60 rounded-lg"></div>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="mx-auto h-6 w-20 bg-zinc-100 dark:bg-zinc-800/60 rounded-full"></div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="ml-auto h-9 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
                </td>
              </tr>
            </template>

            <template v-else-if="filteredTrainees.length === 0">
              <tr>
                <td colspan="4" class="py-16 text-center">
                  <div class="mx-auto w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 class="text-zinc-900 dark:text-zinc-100 font-bold text-sm">No Trainees Found</h3>
                  <p class="text-zinc-500 dark:text-zinc-400 text-xs mt-1">No trainee records match your current search or filter criteria.</p>
                </td>
              </tr>
            </template>

            <template v-else>
              <tr v-for="trainee in filteredTrainees" :key="trainee._id" class="group hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-200/60 dark:border-emerald-500/20 shrink-0">
                      {{ getInitials(trainee.name) }}
                    </div>
                    <div>
                      <p class="text-xs font-bold text-zinc-900 dark:text-zinc-100">{{ trainee.name }}</p>
                      <p class="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{{ trainee.email }}</p>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 text-center">
                  <span v-if="trainee.signInTime" class="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-500/20">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatTime(trainee.signInTime) }}
                  </span>
                  <span v-else class="text-[11px] text-zinc-400 font-mono">--:--</span>
                </td>

                <td class="px-6 py-4 text-center">
                  <span :class="trainee.status === 'Present' ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/60 dark:border-emerald-500/20' : 'text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'" class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border">
                    {{ trainee.status === 'Present' ? 'Present' : 'Absent' }}
                  </span>
                </td>

                <td class="px-6 py-4 text-right">
                  <button
                    @click="handleMarkAttendance(trainee)"
                    :disabled="trainee.isProcessing"
                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    :class="trainee.status === 'Present'
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-800'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-700 hover:text-white transition-colors border border-zinc-200/80 dark:border-white/10'"
                  >
                    <span v-if="trainee.isProcessing" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{{ trainee.status === 'Present' ? 'Marked' : 'Mark Attendance' }}</span>
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAlertStore } from "../../../../store/alertStore.js";
import { useAttendanceStore } from "../../../../store/attendanceStore.js";

const route = useRoute();
const store = useAttendanceStore();
const alertStore = useAlertStore();

const { isAttendanceLoading, trainees, sessionTopic } = storeToRefs(store);

const searchQuery = ref('');
const filterStatus = ref('all');

const presentCount = computed(() => {
  if (!trainees.value || !Array.isArray(trainees.value)) return 0;
  return trainees.value.filter(t => t.status === 'Present').length;
});

const absentCount = computed(() => {
  if (!trainees.value || !Array.isArray(trainees.value)) return 0;
  return trainees.value.length - presentCount.value;
});

const attendanceRate = computed(() => {
  if (!trainees.value || !trainees.value.length) return 0;
  return Math.round((presentCount.value / trainees.value.length) * 100);
});

const filteredTrainees = computed(() => {
  if (!trainees.value || !Array.isArray(trainees.value)) return [];
  return trainees.value.filter(t => {
    const matchesSearch = !searchQuery.value || 
      (t.name && t.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (t.email && t.email.toLowerCase().includes(searchQuery.value.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus.value === 'Present') return t.status === 'Present';
    if (filterStatus.value === 'Absent') return t.status !== 'Present';
    return true;
  });
});

const formatTime = (date) => {
  return date ? dayjs(date).format('hh:mm A') : '--:--';
};

const getInitials = (name) => {
  if (!name) return 'TR';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const handleMarkAttendance = async (trainee) => {
  trainee.isProcessing = true;

  try {
    const formData = new FormData();
    formData.append('sessionId', route.params.sessionId);
    formData.append('userId', trainee._id);
    formData.append('enrollmentId', trainee.enrollmentId);
    formData.append('status', 'Present');

    const response = await store.markAttendance(formData);
    if (response && response.success) {
      await store.fetchSessionAttendance(route.params.sessionId);
      alertStore.success(response.message || 'Attendance marked successfully');
    } else {
      alertStore.error(response?.message || 'Failed to mark attendance');
    }
  } catch (error) {
    alertStore.error(error.message || 'Error marking attendance');
  } finally {
    trainee.isProcessing = false;
  }
};

onMounted(() => {
  if (route.params.sessionId) {
    store.fetchSessionAttendance(route.params.sessionId);
  }
});
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-12 text-slate-900 dark:text-slate-100">

    <nav class="flex p-3 bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-2">
        <li class="inline-flex items-center">
          <router-link to="/admin/training/program" class="text-sm font-medium text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-500 flex items-center transition-colors">
            <svg class="w-4 h-4 me-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
            </svg>
            Trainings
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-5 h-5 text-slate-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/></svg>
            <router-link :to="{ name: 'training.session', params: { id: route.params.id } }" class="ms-1 text-sm font-medium text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-500">
              Sessions
            </router-link>
          </div>
        </li>
        <li aria-current="page" class="flex items-center">
          <svg class="w-5 h-5 text-slate-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/></svg>
          <span class="ms-1 text-sm font-medium text-slate-400 dark:text-zinc-500  tracking-tighter ">Attendance Record</span>
        </li>
      </ol>
    </nav>

    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6" v-if="traineeAttendance">
      <div class="space-y-1">
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
          {{ traineeAttendance.programName }}
        </h1>
        <div class="flex items-center gap-2">
          <div class="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse"></div>
          <p class="text-slate-500 dark:text-zinc-400 text-sm">
            Trainee: <span class="text-slate-900 dark:text-zinc-100 font-bold underline decoration-blue-500/30">
               {{ traineeAttendance.traineeName?.full_name || 'N/A' }}
             </span>
          </p>
        </div>
      </div>

      <div v-if="traineeAttendance.stats?.isEligible" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl text-emerald-700 dark:text-emerald-500 shadow-sm">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
        <span class="text-[10px] font-black uppercase tracking-widest">Qualified</span>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4" v-if="traineeAttendance?.stats">
      <div v-for="(val, label) in mappedStats" :key="label"
           class="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 p-5 rounded-3xl shadow-sm dark:shadow-none relative group hover:ring-2 hover:ring-blue-500/20 transition-all">
        <p class="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{{ label }}</p>
        <p class="text-3xl font-bold mt-2" :class="label === 'Percentage' ? (val >= 75 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400') : 'text-slate-900 dark:text-white'">
          {{ val }}{{ label === 'Percentage' ? '%' : '' }}
        </p>
      </div>
    </div>

    <div class="space-y-6">
      <div v-for="(sessions, date) in groupedRecords" :key="date"
           class="border border-slate-200 dark:border-white/5 rounded-3xl bg-white dark:bg-zinc-900/40 shadow-sm overflow-hidden">

        <button
            @click="toggleDate(date)"
            class="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors"
        >
          <div class="flex items-center gap-5">
            <div class="text-left">
              <span class="block text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-1 leading-none">Session Date</span>
              <span class="text-sm font-bold text-slate-800 dark:text-zinc-200">{{ date }}</span>
            </div>
            <div class="h-8 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
            <div class="flex gap-2">
              <span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-[10px] font-bold text-slate-600 dark:text-zinc-400">
                {{ sessions.length }} Total
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-[10px] font-bold text-emerald-700 dark:text-emerald-500">
                {{ sessions.filter(s => s.status === 'Present').length }} Present
              </span>
            </div>
          </div>

          <svg
              class="w-5 h-5 text-slate-400 transition-transform duration-500"
              :class="{ 'rotate-180 text-blue-600': expandedDates.includes(date) }"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <Transition name="expand">
          <div v-if="expandedDates.includes(date)" class="border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
            <div class="p-4 space-y-3">
              <div v-for="record in sessions" :key="record.sessionId"
                   class="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/5 group hover:border-blue-300 dark:hover:border-white/20 transition-all shadow-sm">

                <div class="flex items-center gap-4">
                  <div :class="['w-1.5 h-10 rounded-full', record.status === 'Present' ? 'bg-emerald-500' : 'bg-rose-500']"></div>
                  <div>
                    <h4 class="text-sm font-bold text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {{ record.sessionTopic }}
                    </h4>
                    <div class="flex items-center gap-3 mt-1 text-[10px] font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-tighter">
                      <span>ID: {{ record.sessionId.slice(-6) }}</span>
                      <span class="text-slate-300 dark:text-zinc-700">•</span>
                      <span class="flex items-center gap-1">
                         <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                         {{ record.startTime }} - {{ record.endTime }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-10 mt-4 md:mt-0">
                  <div class="text-right">
                    <p class="text-[9px] text-slate-400 dark:text-zinc-600 uppercase font-black tracking-widest">Status</p>
                    <span :class="['text-xs font-bold uppercase', record.status === 'Present' ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500']">
                      {{ record.status }}
                    </span>
                  </div>
                  <div class="text-right min-w-[80px]">
                    <p class="text-[9px] text-slate-400 dark:text-zinc-600 uppercase font-black tracking-widest">Check-In</p>
                    <p class="text-xs font-mono text-slate-600 dark:text-zinc-300">
                      {{ record.signInTime ? formatTime(record.signInTime) : '—' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAttendanceStore } from '../../../../store/attendanceStore';
import { storeToRefs } from "pinia";

const attendanceStore = useAttendanceStore();
const { traineeAttendance } = storeToRefs(attendanceStore);
const route = useRoute();

/** * Expansion State
 */
const expandedDates = ref([]);

const toggleDate = (date) => {
  const index = expandedDates.value.indexOf(date);
  if (index > -1) {
    expandedDates.value.splice(index, 1);
  } else {
    expandedDates.value.push(date);
  }
};

/**
 * Grouped and Sorted Records Logic
 */
const groupedRecords = computed(() => {
  const records = traineeAttendance.value?.records;
  if (!records) return {};

  // Sort Chronologically
  const sorted = [...records].sort((a, b) =>
      new Date(`${a.sessionDate.split('T')[0]}T${a.startTime}`) -
      new Date(`${b.sessionDate.split('T')[0]}T${b.startTime}`)
  );

  // Group by Date string
  const groups = sorted.reduce((acc, record) => {
    const date = formatDate(record.sessionDate);
    if (!acc[date]) acc[date] = [];
    acc[date].push(record);
    return acc;
  }, {});

  // Auto-expand the first date if nothing is expanded yet
  const dates = Object.keys(groups);
  if (dates.length > 0 && expandedDates.value.length === 0) {
    expandedDates.value.push(dates[0]);
  }
  return groups;
});

/**
 * Stats Mapping (Fixed .value access)
 */
const mappedStats = computed(() => {
  const stats = traineeAttendance.value?.stats;
  if (!stats) return {};
  return {
    "Total Sessions": stats.totalSessions,
    "Present": stats.presentCount,
    "Absent": stats.absentCount,
    "Percentage": stats.attendancePercentage
  };
});

/**
 * Formatters
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });
};

onMounted(() => {
  attendanceStore.fetchTraineeAttendance(route.params.traineeId, route.params.id);
});
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 2000px;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}
</style>
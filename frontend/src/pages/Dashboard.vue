<template>
  <div class="space-y-8 max-w-[1600px] mx-auto">
    <PageHeader
      title="Dashboard Overview"
      description="Monitor training programs, trainer metrics, and institutional capacity."
      :breadcrumbs="[{ label: 'Dashboard' }]"
    >
      <template #actions>
        <button class="px-4 py-2 text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-all text-zinc-700 dark:text-zinc-300 shadow-xs">
          Export Report
        </button>
        <router-link to="/admin/training/program/create" class="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md shadow-emerald-700/20 transition-all active:scale-95 flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Training
        </router-link>
      </template>
    </PageHeader>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :icon="iconMap[stat.icon]"
        :iconBgClass="stat.colorClass"
      />
    </div>

    <!-- Main Overview Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Trainings Table Card -->
      <div class="lg:col-span-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Recent Training Programs</h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">Latest active and scheduled training sessions</p>
          </div>
          <router-link to="/admin/training/program" class="text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:underline flex items-center gap-1">
            View All
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>

        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase font-bold border-b border-zinc-200/60 dark:border-white/5">
                <th class="pb-3 px-3">Topic / Program</th>
                <th class="pb-3 px-3">Date Range</th>
                <th class="pb-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-white/5 text-xs">
              <tr v-for="(training, index) in trainings" :key="index" class="group hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors">
                <td class="py-3.5 px-3">
                  <div class="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{{ training.t_name }}</div>
                  <div class="text-[11px] text-zinc-500 dark:text-zinc-400">{{ training.t_organizer || 'ATI Department' }}</div>
                </td>
                <td class="py-3.5 px-3 text-zinc-600 dark:text-zinc-400 font-medium">
                  {{ formatDateRange(training.t_start_date, training.t_end_date) }}
                </td>
                <td class="py-3.5 px-3 text-right">
                  <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap', getStatusStyle(training.t_status).badge]">
                    <span :class="['w-1.5 h-1.5 rounded-full', getStatusStyle(training.t_status).dot]"></span>
                    {{ training.t_status }}
                  </span>
                </td>
              </tr>
              <tr v-if="!trainings || trainings.length === 0">
                <td colspan="3" class="py-8 text-center text-zinc-400 italic">No recent trainings found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Trainer Performance Widget -->
      <div class="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Top Faculty & Trainers</h3>
            <span class="text-[10px] uppercase font-bold text-zinc-400">Activity</span>
          </div>

          <div class="space-y-5">
            <div v-for="j in 3" :key="j" class="flex items-center gap-3.5 p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
              <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-white/5 overflow-hidden shrink-0 flex items-center justify-center border border-zinc-200/50 dark:border-white/5">
                <img :src="`https://ui-avatars.com/api/?name=Faculty+${j}&background=047857&color=fff`" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {{ j === 1 ? 'Lalthan Puia' : (j === 2 ? 'Zosang Zuala' : 'Vanlal Hruaia') }}
                </div>
                <div class="w-full bg-zinc-100 dark:bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div class="bg-emerald-700 h-full rounded-full transition-all duration-500" :style="{ width: (j * 30) + '%' }"></div>
                </div>
              </div>
              <div class="text-xs font-bold text-emerald-700 dark:text-emerald-400">{{ j * 30 }}%</div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-zinc-100 dark:border-white/5 text-center">
          <router-link to="/admin/trainer" class="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
            Manage Faculty Roster →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  AcademicCapIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/outline';
import { onMounted } from "vue";
import { useDashboardStore } from "../store/dashboardStore.js";
import { storeToRefs } from "pinia";
import PageHeader from "../components/ui/PageHeader.vue";
import StatCard from "../components/ui/StatCard.vue";

const store = useDashboardStore();
const { stats, trainings } = storeToRefs(store);

const iconMap = {
  AcademicCapIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon
};

const formatDateRange = (start, end) => {
  if (!start) return "TBA";
  const opt = { month: "short", day: "numeric" };
  const s = new Date(start).toLocaleDateString("en-US", opt);
  const e = new Date(end).toLocaleDateString("en-US", { ...opt, year: "numeric" });
  return `${s} - ${e}`;
};

const getStatusStyle = (status) => statusStyles[status] || statusStyles.Upcoming;

const statusStyles = {
  Draft: {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20",
  },
  Upcoming: {
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/60 dark:border-rose-500/20",
  },
  Ongoing: {
    dot: "bg-emerald-600 animate-pulse",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20",
  },
  Completed: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20",
  },
};

onMounted(async () => {
  await store.fetchHomeStats();
});
</script>
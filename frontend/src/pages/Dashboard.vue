<template>
  <div class="p-6 lg:p-10 space-y-10 max-w-[1600px] mx-auto">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Dashboard Overview</h1>
        <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Monitor your training progress and institutional growth.</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="px-4 py-2 text-sm font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">
          Generate Report
        </button>
        <router-link to="/admin/training/program/create" class="px-4 py-2 text-sm font-black bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95">
          + New Training
        </router-link>
      </div>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label"
           class="relative overflow-hidden p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 group hover:border-blue-500/50 transition-all">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/10 transition-all"></div>

        <div class="flex flex-col gap-4">
          <div :class="`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.colorClass}`">
            <component :is="iconMap[stat.icon]" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{{ stat.label }}</p>
            <div class="flex items-baseline gap-2">
              <h2 class="text-3xl font-black text-zinc-900 dark:text-zinc-100">{{ stat.value }}</h2>
<!--              <span v-if="stat.trend" :class="`text-xs font-bold ${stat.trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`">-->
<!--                {{ stat.trend > 0 ? '↑' : '↓' }} {{ Math.abs(stat.trend) }}%-->
<!--              </span>-->
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">Recent Trainings</h3>
          <router-link to="/admin/training/program" class="text-blue-500 text-xs font-bold hover:underline">View All</router-link>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
            <tr class="text-zinc-400 text-[10px] uppercase font-black border-b border-zinc-100 dark:border-white/5">
              <th class="pb-3 px-2">Topic</th>
              <th class="pb-3 px-2">Date</th>
              <th class="pb-3 px-2 text-right">Status</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-zinc-100 dark:divide-white/5">
            <tr v-for="training in trainings" :key="i" class="group hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">
              <td class="py-4 px-2">
                <div class="font-bold text-sm text-zinc-900 dark:text-zinc-200">{{training.t_name}}</div>
                <div class="text-[11px] text-zinc-500">{{training.t_organizer}}</div>
              </td>
              <td class="py-4 px-2 text-xs text-zinc-500 font-medium">{{formatDateRange(training.t_start_date,training.t_end_date)}}</td>
              <td class="py-4 px-2 text-right">
                <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap', getStatusStyle(training.t_status).badge]">{{training.t_status}}</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6">
        <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">Trainer Performance</h3>
        <div class="space-y-6">
          <div v-for="j in 3" :key="j" class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 overflow-hidden flex-shrink-0">
              <img src="https://ui-avatars.com/api/?name=Trainer+X" class="w-full h-full" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">Lalthan Puia</div>
              <div class="w-full bg-zinc-100 dark:bg-white/5 h-1.5 rounded-full mt-1.5">
                <div class="bg-blue-600 h-full rounded-full" :style="{width: (j * 30) + '%'}"></div>
              </div>
            </div>
            <div class="text-xs font-black text-zinc-400">{{ j * 30 }}%</div>
          </div>
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
import {onMounted} from "vue";
import {useDashboardStore} from "../store/dashboardStore.js";
import {storeToRefs} from "pinia";

const store=useDashboardStore()
const {stats,trainings}=storeToRefs(store)
const iconMap = {
  AcademicCapIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon
};
const formatDateRange = (start, end) => {
  if(!start) return "TBA"
  const opt = { month: "short", day: "numeric" }
  const s = new Date(start).toLocaleDateString("en-US", opt)
  const e = new Date(end).toLocaleDateString("en-US", { ...opt, year: "numeric" })
  return `${s} - ${e}`
}
const getStatusStyle = (status) => statusStyles[status] || statusStyles.Upcoming
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
onMounted(async ()=>{
  await store.fetchHomeStats();
})
</script>
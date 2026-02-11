<template>
  <div class="space-y-10">
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Live Instructor Portal</span>
        </div>
        <h1 class="text-3xl font-light text-zinc-900 dark:text-white tracking-tight">
          Welcome back, <span class="font-normal text-blue-600 dark:text-blue-400">{{ user?.name || 'Instructor' }}</span>
        </h1>
        <p class="text-zinc-500 dark:text-zinc-400 text-sm font-light leading-relaxed max-w-md">
          You have <span class="text-zinc-900 dark:text-zinc-300 font-medium">2 sessions</span> scheduled for today.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button class="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white transition-all shadow-sm">
          Download Schedule
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label"
           class="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] hover:border-blue-500/20 transition-all group shadow-sm dark:shadow-none">
        <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 group-hover:text-blue-500 transition-colors">
          {{ stat.label }}
        </p>
        <div class="flex items-end justify-between">
          <h2 class="text-2xl font-light text-zinc-900 dark:text-white">{{ stat.value }}</h2>
          <div :class="['p-2 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400', stat.colorClass]">
            <component :is="stat.icon" class="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>

    <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center justify-between px-2">
          <h3 class="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest">Active Programs</h3>
          <router-link to="/trainer/trainings" class="text-xs text-blue-600 dark:text-blue-400 hover:underline">View All</router-link>
        </div>

        <div class="space-y-4">
          <div v-for="program in activePrograms" :key="program.id"
               class="group relative p-6 rounded-[1.5rem] bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/[0.05] hover:border-blue-500/30 transition-all overflow-hidden shadow-sm dark:shadow-none">

            <div class="absolute -right-20 -top-20 w-40 h-40 bg-blue-500/[0.03] dark:bg-blue-500/5 blur-[50px] rounded-full group-hover:bg-blue-500/10 transition-all"></div>

            <div class="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
              <div class="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 flex flex-col items-center justify-center text-blue-600 dark:text-blue-400">
                <span class="text-lg font-bold leading-none">{{ program.day }}</span>
                <span class="text-[9px] uppercase font-black">{{ program.month }}</span>
              </div>

              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-[9px] font-bold uppercase tracking-tighter">In Progress</span>
                  <span class="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">{{ program.time }}</span>
                </div>
                <h4 class="text-lg font-normal text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ program.title }}</h4>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{{ program.venue }} • {{ program.students }} Enrolled</p>
              </div>

              <button class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                Mark Attendance
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <h3 class="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest px-2">Resources</h3>
        <div class="bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.05] rounded-[1.5rem] p-6 space-y-4 shadow-sm dark:shadow-none">
          <button v-for="action in quickActions" :key="action.title"
                  class="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 border border-transparent hover:border-zinc-200 dark:hover:border-white/5 transition-all text-left group">
            <div class="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <component :is="action.icon" class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm font-medium text-zinc-700 dark:text-zinc-200">{{ action.title }}</p>
              <p class="text-[11px] text-zinc-500 dark:text-zinc-400">{{ action.desc }}</p>
            </div>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../../store/authStore';
import {
  BookOpen, Users, Award, Calendar,
  FileText, Presentation, CheckCircle
} from 'lucide-vue-next';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const stats = ref([
  { label: 'Total Sessions', value: '24', icon: BookOpen, colorClass: 'group-hover:text-blue-400' },
  { label: 'Total Trainees', value: '840', icon: Users, colorClass: 'group-hover:text-emerald-400' },
  { label: 'Avg Rating', value: '4.9', icon: Award, colorClass: 'group-hover:text-amber-400' },
  { label: 'Pending Docs', value: '3', icon: FileText, colorClass: 'group-hover:text-rose-400' },
]);

const activePrograms = ref([
  {
    id: 1,
    day: '10',
    month: 'FEB',
    time: '10:00 AM - 01:00 PM',
    title: 'Advanced Public Administration',
    venue: 'ATI Conference Hall A',
    students: 45
  },
  {
    id: 2,
    day: '12',
    month: 'FEB',
    time: '02:00 PM - 05:00 PM',
    title: 'Digital Governance & Ethics',
    venue: 'IT Smart Lab',
    students: 32
  }
]);

const quickActions = ref([
  { title: 'Upload PPT', desc: 'Add course materials', icon: Presentation },
  { title: 'Attendance Report', desc: 'Generate weekly summary', icon: CheckCircle },
  { title: 'Session Schedule', desc: 'View complete calendar', icon: Calendar },
]);
</script>

<style scoped>
/* Optional: Soft scrollbar for dashboard */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>
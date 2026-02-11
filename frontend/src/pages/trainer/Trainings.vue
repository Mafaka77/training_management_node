<template>
  <div class="space-y-8">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl font-light text-zinc-900 dark:text-white tracking-tight">
          My <span class="font-normal text-blue-600 dark:text-blue-400">Schedule</span>
        </h1>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          Manage your assigned sessions and track participant attendance.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <div class="flex bg-zinc-100 dark:bg-white/5 p-1 rounded-xl border border-zinc-200 dark:border-white/5">
          <button
              v-for="status in ['Ongoing', 'Upcoming', 'Completed']"
              :key="status"
              @click="store.setStatus(status)"
              :class="[
        'px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200',
        store.status === status
          ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-white'
          : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
      ]"
          >
            {{ status }}
          </button>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-6">
      <div v-for="session in trainings" :key="session._id"
           class="group relative bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/[0.05] rounded-[2rem] overflow-hidden transition-all hover:border-blue-500/30 shadow-sm dark:shadow-none">

        <div class="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">

          <div class="flex flex-row md:flex-col items-center justify-center min-w-[100px] gap-4 md:gap-1 p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5">
            <span class="text-2xl font-black text-blue-600 dark:text-blue-400">{{ formatDate(session.tc_date, 'DD') }}</span>
            <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">{{ formatDate(session.tc_date, 'MMM YYYY') }}</span>
            <div class="hidden md:block w-full h-px bg-zinc-200 dark:bg-white/10 my-2"></div>
            <span class="text-[11px] font-bold text-zinc-500 dark:text-zinc-300 whitespace-nowrap">
              {{ session.tc_start_time }} - {{ session.tc_end_time }}
            </span>
          </div>

          <div class="flex-1 space-y-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-tighter">
                  Session:  {{ session.tc_session }}
                </span>
                <span class="text-zinc-300 dark:text-zinc-700 text-xs">•</span>
                <span class="text-xs font-medium text-zinc-500 dark:text-zinc-400">{{ session.t_program.t_organizer }}</span>
              </div>
              <h2 class="text-xl font-normal text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ session.tc_topic }}
              </h2>
              <p class="text-sm text-zinc-500 dark:text-zinc-400 ">
                Part of: {{ session.t_program.t_name }}
              </p>
            </div>

            <div class="flex flex-wrap gap-4 text-[12px]">
              <div class="flex items-center gap-1.5 text-zinc-500">
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Status: {{ session.t_program.t_status }}
              </div>
              <div class="flex items-center gap-1.5 text-zinc-500">
                <MapPinIcon class="w-3.5 h-3.5" />
                Room ID: {{ session.t_program.t_room.room_name }}
              </div>
            </div>
          </div>

          <div class="flex flex-col w-full md:w-auto gap-2">
            <router-link :to="{ name: 'trainer.trainings.attendance', params: { id: session._id }}" v-if="session.t_program.t_status==='Ongoing'" class="w-full md:w-44 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2">
              <QrCodeIcon class="w-4 h-4" />
              Mark Attendance
            </router-link>
            <router-link :to="{name:'trainer.trainings.material',params:{id:session.t_program._id,name:session.t_program.t_name}}" class="w-full md:w-44 px-6 py-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-300 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2">
              <FileTextIcon class="w-4 h-4" />
              Manage Materials
            </router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import dayjs from 'dayjs'; // Recommended for date formatting
import {
  MapPinIcon,
  QrCodeIcon,
  FileTextIcon
} from 'lucide-vue-next';
import {useTrainerStore} from "../../store/trainerStore.js";
import {storeToRefs} from "pinia";
const store=useTrainerStore();
const{trainings,loading}=storeToRefs(store)
const formatDate = (date, format) => {
  return dayjs(date).format(format);
};
onMounted(()=>{
  store.fetchTrainings();
})
</script>
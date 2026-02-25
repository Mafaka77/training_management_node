<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <router-link :to="{name:'trainer.programs.edit',params:{id:route.params.id}}" class="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-500 hover:text-blue-500 transition-colors">
          <ChevronLeftIcon class="w-5 h-5" />
        </router-link>
        <div>
          <div v-if="isAttendanceLoading" class="h-7 w-48 bg-zinc-200 dark:bg-white/10 animate-pulse rounded-lg"></div>
          <h1 v-else class="text-xl font-bold dark:text-white">{{ sessionTopic}}</h1>
          <p class="text-xs text-zinc-500 uppercase tracking-widest font-black">Attendance</p>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 rounded-[2rem] overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
        <tr class="border-b border-zinc-200 dark:border-white/5 text-[10px] uppercase tracking-widest text-zinc-400 font-black">
          <th class="px-8 py-4">Trainee Name</th>
          <th class="px-8 py-4 text-center">Sign-in Time</th>
          <th class="px-8 py-4 text-center">Status</th>
          <th class="px-8 py-4 text-right">Actions</th>
        </tr>
        </thead>

        <tbody class="divide-y divide-zinc-200 dark:divide-white/5">
        <template v-if="isAttendanceLoading">
          <tr v-for="i in 5" :key="i" class="animate-pulse">
            <td class="px-8 py-5">
              <div class="space-y-2">
                <div class="h-4 w-32 bg-zinc-200 dark:bg-white/10 rounded"></div>
                <div class="h-3 w-40 bg-zinc-100 dark:bg-white/5 rounded"></div>
              </div>
            </td>
            <td class="px-8 py-5">
              <div class="mx-auto h-5 w-16 bg-zinc-100 dark:bg-white/5 rounded-md"></div>
            </td>
            <td class="px-8 py-5">
              <div class="mx-auto h-5 w-20 bg-zinc-100 dark:bg-white/5 rounded-full"></div>
            </td>
            <td class="px-8 py-5 text-right">
              <div class="ml-auto h-9 w-32 bg-zinc-200 dark:bg-white/10 rounded-xl"></div>
            </td>
          </tr>
        </template>

        <template v-else>
          <tr v-for="trainee in trainees" :key="trainee._id" class="group hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
            <td class="px-8 py-4">
              <div class="flex items-center gap-3">
                <div>
                  <p class="text-sm font-medium dark:text-zinc-200">{{ trainee.name }}</p>
                  <p class="text-[10px] text-zinc-500">{{ trainee.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-8 py-4 text-center">
                <span v-if="trainee.signInTime" class="font-mono text-[11px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md">
                  {{ formatTime(trainee.signInTime) }}
                </span>
              <span v-else class="text-[10px] text-zinc-400 font-medium">--:--</span>
            </td>
            <td class="px-8 py-4 text-center">
                <span :class="trainee.status === 'Present' ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-400 bg-zinc-400/10'" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-colors">
                  {{ trainee.status }}
                </span>
            </td>
            <td class="px-8 py-4 text-right">
              <button
                  @click="handleMarkAttendance(trainee)"
                  :disabled="trainee.isProcessing"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold transition-all active:scale-95 disabled:opacity-50"
                  :class="trainee.status === 'Present'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10 border border-transparent'"
              >
                <Loader2Icon v-if="trainee.isProcessing" class="w-3.5 h-3.5 animate-spin" />
                <CheckCircleIcon v-else class="w-3.5 h-3.5" />
                {{ trainee.status === 'Present' ? 'Marked' : 'Mark Attendance' }}
              </button>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>


import {storeToRefs} from "pinia";
import {onMounted} from "vue";
import {CheckCircleIcon, ChevronLeftIcon, Loader2Icon} from "lucide-vue-next";
import dayjs from "dayjs";
import {useRoute} from "vue-router";
import {useAttendanceStore} from "../../../store/attendanceStore.js";
const route=useRoute();
const store=useAttendanceStore();
const {isAttendanceLoading,trainees,sessionTopic}=storeToRefs(store);
const formatTime = (date) => {
  return date ? dayjs(date).format('hh:mm A') : '--:--';
};
// const handleMarkAttendance = async (trainee) => {
//   trainee.isProcessing = true;
//
//   try {
//     const formData = new FormData();
//     formData.append('sessionId', route.params.id);
//     formData.append('userId', trainee._id);
//     formData.append('enrollmentId', trainee.enrollmentId);
//     formData.append('status', 'Present');
//     const response=await store.markAttendance(formData);
//     if(response.success){
//       await store.fetchTrainees(route.params.id);
//       alert.success(response.message)
//     }else{
//       alert.error(response.message)
//     }
//   } catch (error) {
//     alert.error(error);
//   } finally {
//     trainee.isProcessing = false;
//   }
// };
onMounted(()=>{
    console.log(route.params.sessionId);
  store.fetchSessionAttendance(route.params.sessionId)
})
</script>

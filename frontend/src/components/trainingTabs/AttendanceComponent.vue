<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-4 bg-white text-center dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl shadow-sm">
        <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Registry Size</p>
        <p class="text-2xl font-black text-zinc-900 dark:text-zinc-100">{{ attendanceData.length }} Trainees</p>
      </div>
      <div class="p-4 bg-white text-center dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl shadow-sm">
        <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Program Completion</p>
        <p class="text-2xl font-black text-blue-500">{{ averagePercentage }}% Avg</p>
      </div>
      <div class="p-4 bg-white text-center dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-2xl shadow-sm">
        <p class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Session</p>
        <p class="text-2xl text-center font-black text-emerald-500">{{ totalSessions }}</p>
      </div>
    </div>

    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
      <table class="w-full text-left">
        <thead class="bg-zinc-50 dark:bg-white/[0.02] border-b border-zinc-100 dark:border-white/5">
        <tr>
          <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 w-1/3">Trainee</th>
          <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Appearance</th>
          <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Persistence</th>
          <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Action</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-zinc-100 dark:divide-white/5">
        <tr v-for="trainee in attendanceData" :key="trainee._id" class="group hover:bg-zinc-50/50 dark:hover:bg-white/[0.01] transition-colors">

          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-white/10">
                <span class="text-sm font-black text-zinc-500 uppercase">{{ trainee.user.full_name.charAt(0) }}</span>
              </div>
              <div>
                <p class="text-sm font-bold text-zinc-900 dark:text-zinc-100">{{ trainee.user.full_name }}</p>
                <p class="text-[10px] font-mono text-zinc-500 uppercase">UID: {{ trainee.user._id.slice(-6) }}</p>
              </div>
            </div>
          </td>

          <td class="px-6 py-4">
            <div class="flex items-baseline gap-1 tabular-nums">
              <span class="text-sm font-black text-zinc-900 dark:text-zinc-100">{{ trainee.attendedCount }}</span>
              <span class="text-xs text-zinc-400 text-bold">/ {{ totalSessions }} Sessions</span>
            </div>
          </td>

          <td class="px-6 py-4">
            <div class="flex items-center gap-4">
              <div class="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden min-w-[100px]">
                <div
                    class="h-full transition-all duration-700 bg-blue-500"
                    :style="{ width: trainee.percentage + '%' }"
                ></div>
              </div>
              <span class="text-[10px] font-black text-zinc-600 dark:text-zinc-400 w-8">{{ trainee.percentage }}%</span>
            </div>
          </td>

          <td class="px-6 py-4 text-right">
            <div class="flex items-center justify-end gap-2">
              <button
                  class="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all active:scale-90"
                  title="View Trainee Profile"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>

<!--              <button-->
<!--                  @click="updateAttendance(trainee)"-->
<!--                  :disabled="isUpdating"-->
<!--                  :class="trainee.isPresentToday-->
<!--          ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-500/20'-->
<!--          : 'bg-white dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20'"-->
<!--                  class="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"-->
<!--              >-->
<!--                <div-->
<!--                    class="w-1.5 h-1.5 rounded-full"-->
<!--                    :class="trainee.isPresentToday ? 'bg-white animate-pulse' : 'bg-zinc-400'"-->
<!--                ></div>-->
<!--                {{ trainee.isPresentToday ? 'Present' : 'Absent' }}-->
<!--              </button>-->
            </div>
          </td>

        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import {useAttendanceStore} from "../../store/attendanceStore.js";
import {storeToRefs} from "pinia";
import {onMounted,computed} from "vue";
import {useRoute} from "vue-router";
const route=useRoute();
const store=useAttendanceStore()
const {attendanceData,totalSessions}=storeToRefs(store);
const props = defineProps({
  programId: { type: String, required: true }
});

// Calculated Stats
const averagePercentage = computed(() => {
  if (!attendanceData.value.length) return 0;
  const total = attendanceData.value.reduce((acc, curr) => acc + curr.percentage, 0);
  return Math.round(total / attendanceData.value.length);
});
const presentTodayCount = computed(() => {
  return attendanceData.value.filter(t => t.isPresentToday).length;
});
onMounted(()=>{
store.fetchAttendances(props.programId);
})
</script>
<style scoped>

</style>
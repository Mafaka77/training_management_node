<template>
  <div class="bg-[#071a13] min-h-screen p-6 lg:px-20 lg:p-12 font-sans selection:bg-emerald-500/30 text-zinc-50">
    <div class="p-4">
      <header class="flex rounded-full justify-between px-6 py-3 p-4 border border-emerald-500/20 bg-[#0a2319]/90 backdrop-blur-xl sticky top-0 z-50 shadow-xl">
        <div class="flex justify-between gap-6 w-full items-center">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/30">
              <CalendarIcon class="w-5 h-5 text-white" />
            </div>
            <h1 class="text-lg font-semibold text-white tracking-tight hidden sm:block">ATI Training Calendar</h1>
          </div>

          <div class="flex items-center gap-2">
            <button
                @click="goToToday"
                class="px-4 py-1.5 text-xs font-bold text-emerald-100 hover:text-white border border-emerald-500/30 rounded-md hover:bg-emerald-500/15 transition-all"
            >
              Today
            </button>
            <div class="flex items-center">
              <button @click="changeMonth(-1)" class="p-2 hover:bg-emerald-500/15 rounded-full text-emerald-300 hover:text-white">
                <ChevronLeftIcon class="w-5 h-5" />
              </button>
              <button @click="changeMonth(1)" class="p-2 hover:bg-emerald-500/15 rounded-full text-emerald-300 hover:text-white">
                <ChevronRightIcon class="w-5 h-5" />
              </button>
            </div>
            <span class="text-xl font-medium text-white ml-2 tabular-nums">
              {{ currentMonthName }} {{ currentYear }}
            </span>
          </div>
        </div>
      </header>

    </div>

    <main class="p-4">
      <div class="bg-[#0a2319]/70 border border-emerald-500/20 rounded-xl overflow-hidden shadow-2xl relative">

        <div v-if="loading" class="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div class="grid grid-cols-7 border-b border-emerald-500/15 bg-white/[0.02]">
          <div v-for="day in weekDays" :key="day" class="py-2.5 text-center text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 divide-x divide-emerald-500/10">
          <div
              v-for="(date, index) in calendarDays"
              :key="index"
              class="min-h-[145px] border-b border-emerald-500/10 relative transition-colors"
              :class="[!date.isCurrentMonth ? 'bg-black/30 opacity-40' : 'bg-transparent']"
          >
            <div class="flex justify-center pt-2 pb-1">
              <span
                  class="text-xs font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-all"
                  :class="date.isToday
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 font-bold'
                  : 'text-emerald-300/70 hover:bg-emerald-500/10 cursor-pointer'"
              >
                {{ date.dayNumber }}
              </span>
            </div>

            <div class="mt-1 flex flex-col gap-[2px]">
              <div
                  v-for="training in getTrainingsForDate(date.fullDate)"
                  :key="training._id"
                  @click="viewDetails(training._id)"
                  class="relative h-6 flex items-center cursor-pointer px-[2px]"
              >
                <div
                    :class="[
                    'h-[22px] w-full flex items-center px-2 text-[10px] font-bold tracking-tight transition-all',
                    getStatusStyle(training.t_status).bar,
                    isStart(training, date.fullDate) ? 'rounded-l-md ml-1 border-l border-y border-white/10' : 'border-y border-white/5',
                    isEnd(training, date.fullDate) ? 'rounded-r-md mr-1 border-r border-y border-white/10' : 'border-y border-white/5'
                  ]"
                >
                  <span v-if="isStart(training, date.fullDate) || isMonday(date.fullDate)" class="truncate">
                    {{ training.t_name }}
                  </span>
                  <span v-else class="w-full h-[1px] bg-white/10"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/vue/24/outline';
import { useHomeStore } from "../../store/homeStore.js";
import { storeToRefs } from "pinia";

const store = useHomeStore();
const { trainings, loading } = storeToRefs(store);

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const currentDate = ref(new Date());

const currentMonthName = computed(() => currentDate.value.toLocaleString('default', { month: 'long' }));
const currentYear = computed(() => currentDate.value.getFullYear());

const syncCalendarData = () => {
  const month = currentDate.value.getMonth() + 1;
  const year = currentDate.value.getFullYear();
  store.fetchCalendar(month, year);
};

const changeMonth = (offset) => {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + offset));
  syncCalendarData();
};

const goToToday = () => {
  currentDate.value = new Date();
  syncCalendarData();
};

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentDate.value.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDate = new Date(year, month, 1 - firstDayOfMonth);

  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDaysInMonth = lastDayOfMonth.getDate();
  const trailingDays = 6 - lastDayOfMonth.getDay();

  const totalGridDays = firstDayOfMonth + totalDaysInMonth + trailingDays;

  const days = [];
  const todayStr = new Date().toDateString();

  for (let i = 0; i < totalGridDays; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    days.push({
      fullDate: d,
      dayNumber: d.getDate(),
      isCurrentMonth: d.getMonth() === month,
      isToday: d.toDateString() === todayStr
    });
  }
  return days;
});

const getTrainingsForDate = (date) => {
  if (!date || !trainings.value) return [];
  const cellTime = new Date(date).setHours(0,0,0,0);

  return trainings.value.filter(t => {
    const start = new Date(t.t_start_date).setHours(0,0,0,0);
    const end = new Date(t.t_end_date).setHours(0,0,0,0);
    return cellTime >= start && cellTime <= end;
  });
};

const isStart = (t, d) => d && new Date(t.t_start_date).toDateString() === d.toDateString();
const isEnd = (t, d) => d && new Date(t.t_end_date).toDateString() === d.toDateString();
const isMonday = (d) => d && d.getDay() === 1;

const getStatusStyle = (status) => {
  const styles = {
    Upcoming: { bar: "bg-teal-500/20 text-teal-300 border-teal-500/30" },
    Ongoing: { bar: "bg-emerald-600 text-white shadow-[0_2px_10px_rgba(16,185,129,0.3)] z-10" },
    Completed: { bar: "bg-[#061811] text-emerald-200/50 border-emerald-500/10" }
  };
  return styles[status] || styles.Upcoming;
};

const viewDetails = (id) => console.log("Training Details:", id);

onMounted(syncCalendarData);
</script>
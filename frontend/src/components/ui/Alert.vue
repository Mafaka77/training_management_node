<script setup>
import { computed } from "vue"
import { useAlertStore } from "../../store/alertStore.js"

const props = defineProps({
  id: Number,
  type: String,
  message: String,
})

const store = useAlertStore()

const theme = computed(() => {
  switch (props.type) {
    case "success":
      return {
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
        accentBg: "bg-emerald-500"
      }
    case "error":
      return {
        icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
        iconColor: "text-rose-600 dark:text-rose-400",
        iconBg: "bg-rose-50 dark:bg-rose-500/10",
        accentBg: "bg-rose-500"
      }
    case "warning":
      return {
        icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        iconColor: "text-amber-600 dark:text-amber-400",
        iconBg: "bg-amber-50 dark:bg-amber-500/10",
        accentBg: "bg-amber-500"
      }
    default:
      return {
        icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        iconColor: "text-blue-600 dark:text-blue-400",
        iconBg: "bg-blue-50 dark:bg-blue-500/10",
        accentBg: "bg-blue-500"
      }
  }
})
</script>

<template>
  <div
    class="pointer-events-auto w-full flex flex-col bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xl shadow-zinc-200/40 dark:shadow-black/30 overflow-hidden relative transition-all duration-300 hover:scale-[1.01]">
    
    <div class="absolute left-0 top-0 bottom-0 w-1" :class="theme.accentBg"></div>

    <div class="flex items-center gap-3.5 p-4 pl-5">
      <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl shadow-sm" :class="theme.iconBg">
        <svg class="w-4.5 h-4.5" :class="theme.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="theme.icon" />
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100 leading-relaxed tracking-wide">
          {{ message }}
        </p>
      </div>

      <div class="flex-shrink-0 flex items-center">
        <button @click="store.remove(id)"
          class="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors focus:outline-none">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div class="h-[2px] w-full bg-zinc-100 dark:bg-white/5 absolute bottom-0 left-0 right-0">
      <div class="h-full origin-left animate-progress" :class="theme.accentBg"></div>
    </div>
  </div>
</template>

<style scoped>
@keyframes progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.animate-progress {
  animation: progress 3s linear forwards;
}
</style>
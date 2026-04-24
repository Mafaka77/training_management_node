<script setup>
import { computed } from "vue"
import { useAlertStore } from "../../store/alertStore.js"; // Adjust path if needed

const props = defineProps({
  id: Number,
  type: String,
  message: String,
})

const store = useAlertStore()

// Map styles and icons dynamically based on the alert type
const theme = computed(() => {
  switch (props.type) {
    case "success":
      return {
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", // Check circle
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-100 dark:bg-emerald-500/20"
      }
    case "error":
      return {
        icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", // X circle
        iconColor: "text-rose-500",
        iconBg: "bg-rose-100 dark:bg-rose-500/20"
      }
    case "warning":
      return {
        icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", // Exclamation triangle
        iconColor: "text-amber-500",
        iconBg: "bg-amber-100 dark:bg-amber-500/20"
      }
    default: // info
      return {
        icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", // Info circle
        iconColor: "text-blue-500",
        iconBg: "bg-blue-100 dark:bg-blue-500/20"
      }
  }
})
</script>

<template>
  <div
    class="pointer-events-auto w-full flex items-center gap-3 p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl shadow-black/5 ring-1 ring-black/5 transition-all">

    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full" :class="theme.iconBg">
      <svg class="w-5 h-5" :class="theme.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="theme.icon" />
      </svg>
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-zinc-800 dark:text-zinc-100 leading-snug">
        {{ message }}
      </p>
    </div>

    <div class="flex-shrink-0 flex items-center">
      <button @click="store.remove(id)"
        class="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-white/10 transition-colors focus:outline-none">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

  </div>
</template>
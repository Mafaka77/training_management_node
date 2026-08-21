<template>
  <div class="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 shadow-xs hover:shadow-md transition-all duration-300 group hover:border-emerald-500/40">
    <div class="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all duration-300"></div>

    <div class="flex items-center justify-between gap-4 mb-3">
      <p class="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {{ label }}
      </p>
      <div v-if="icon" :class="[
        'w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300',
        iconBgClass || 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
      ]">
        <component :is="icon" class="w-5 h-5" />
      </div>
    </div>

    <div class="flex items-baseline justify-between gap-2">
      <h3 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {{ value }}
      </h3>
      
      <div v-if="trend !== undefined && trend !== null" :class="[
        'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border',
        trend >= 0
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20'
          : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/60 dark:border-rose-500/20'
      ]">
        <span>{{ trend >= 0 ? '↑' : '↓' }}</span>
        <span>{{ Math.abs(trend) }}%</span>
      </div>
    </div>

    <p v-if="subtitle" class="text-xs text-zinc-500 dark:text-zinc-400 mt-2 truncate">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: [Object, Function, String],
    default: null
  },
  iconBgClass: {
    type: String,
    default: ''
  },
  trend: {
    type: Number,
    default: null
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>

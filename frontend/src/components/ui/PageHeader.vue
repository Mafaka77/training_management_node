<template>
  <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/60 dark:border-white/5 pb-5">
    <div class="space-y-1">
      <Breadcrumbs v-if="breadcrumbs && breadcrumbs.length" :items="breadcrumbs" class="mb-1" />
      <div class="flex items-center gap-3">
        <slot name="icon" />
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          {{ title }}
        </h1>
        <slot name="badge" />
      </div>
      <p v-if="description" class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2.5 sm:gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
import Breadcrumbs from './Breadcrumbs.vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  breadcrumbs: {
    type: Array,
    default: () => []
  }
});
</script>

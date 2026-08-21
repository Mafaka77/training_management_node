<template>
  <nav class="flex items-center text-xs font-medium text-zinc-500 dark:text-zinc-400 py-1" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1.5 flex-wrap">
      <li v-for="(item, index) in items" :key="index" class="inline-flex items-center">
        <svg 
          v-if="index > 0" 
          class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 mx-1 flex-shrink-0" 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
        </svg>

        <router-link 
          v-if="item.to" 
          :to="item.to" 
          class="inline-flex items-center text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-medium"
        >
          <svg v-if="index === 0 && showHomeIcon" class="w-3.5 h-3.5 me-1 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
          </svg>
          
          {{ item.label }}
        </router-link>

        <span v-else class="font-semibold text-zinc-900 dark:text-zinc-100">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    // Expected format: [{ label: 'Name', to: '/path' }, { label: 'Current' }]
  },
  showHomeIcon: {
    type: Boolean,
    default: true
  }
});
</script>
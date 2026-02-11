<template>
  <nav class="flex p-3 bg-white/5 border border-white/10 rounded-xl mb-6" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2">
      
      <li v-for="(item, index) in items" :key="index" class="inline-flex items-center">
        
        <svg 
          v-if="index > 0" 
          class="w-3.5 h-3.5 text-zinc-500 mx-1" 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
        </svg>

        <router-link 
          v-if="item.to" 
          :to="item.to" 
          class="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-blue-500 transition-colors"
        >
          <svg v-if="index === 0 && showHomeIcon" class="w-4 h-4 me-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
          </svg>
          
          {{ item.label }}
        </router-link>

        <span v-else class="text-sm font-medium text-zinc-500">
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
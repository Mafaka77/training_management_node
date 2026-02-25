<template>
  <router-link :to="to" v-slot="{ isActive }">
    <div :class="[
      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300',
      isChild ? 'ml-7' : '',
      isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-semibold'
        : (isDark ? 'text-zinc-400 hover:bg-white/5 hover:text-white' : 'text-zinc-600 hover:bg-white hover:text-blue-600 hover:shadow-sm')
    ]">
      <svg 
        v-if="icon"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="w-4 h-4 flex-shrink-0"
      >
        <path :d="icon" />
      </svg>

      <slot />
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true
  },
  // Add the icon prop here
  icon: {
    type: String,
    default: ''
  },
  isDark: {
    type: Boolean,
    default: true
  },
  isChild: {
    type: Boolean,
    default: false
  }
})
</script>
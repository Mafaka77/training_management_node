<template>
  <router-link :to="to" v-slot="{ isActive, href, navigate }" custom>
    <a
      :href="href"
      @click="navigate"
      :class="[
        'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 transform hover:translate-x-1 active:scale-[0.98]',
        isChild ? 'ml-7' : '',
        isActive
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-semibold'
          : (isDark ? 'text-zinc-400 hover:bg-white/5 hover:text-white' : 'text-zinc-600 hover:bg-white hover:text-blue-600 hover:shadow-md hover:shadow-black/5')
      ]"
    >
      <svg 
        v-if="icon"
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
        :class="isActive ? 'text-white' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500'"
      >
        <path :d="icon" />
      </svg>

      <slot />
    </a>
  </router-link>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true
  },
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
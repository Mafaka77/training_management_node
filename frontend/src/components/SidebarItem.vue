<template>
  <router-link :to="to" v-slot="{ isActive }">
    <div :class="[
      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300',
      // Now isChild will be recognized correctly
      isChild ? 'ml-7' : '',
      isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-semibold'
        : (isDark ? 'text-zinc-400 hover:bg-white/5 hover:text-white' : 'text-zinc-600 hover:bg-white hover:text-blue-600 hover:shadow-sm')
    ]">
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
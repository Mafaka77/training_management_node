<template>
  <router-link :to="to" v-slot="{ isActive, href, navigate }" custom>
    <a
      :href="href"
      @click="navigate"
      :title="isCollapsed ? labelText : undefined"
      :class="[
        'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.98] relative',
        isChild && !isCollapsed ? 'ml-6' : '',
        isCollapsed ? 'justify-center px-2 py-2.5' : '',
        isActive
          ? (isDark ? 'bg-emerald-700/90 text-white shadow-md shadow-emerald-700/20' : 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25')
          : (isDark ? 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900')
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
        class="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
        :class="isActive ? 'text-white' : (isDark ? 'text-zinc-400 group-hover:text-emerald-400' : 'text-zinc-500 group-hover:text-emerald-700')"
      >
        <path :d="icon" />
      </svg>

      <span v-if="!isCollapsed" class="truncate">
        <slot />
      </span>

      <!-- Active Indicator Dot for Collapsed mode -->
      <span v-if="isCollapsed && isActive" class="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-emerald-500 rounded-full"></span>
    </a>
  </router-link>
</template>

<script setup>
import { useSlots, computed } from 'vue';

const slots = useSlots();

const labelText = computed(() => {
  const defaultSlot = slots.default ? slots.default() : [];
  return defaultSlot.map(node => node.children).join('');
});

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
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <Transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="loading.isActive" class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-900/60 backdrop-blur-md">
      <div class="relative flex flex-col items-center">
        <div class="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        
        <div class="absolute inset-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-ping opacity-20"></div>
        
        <p class="mt-6 text-sm font-bold text-white tracking-widest uppercase animate-pulse">
          {{ loading.message }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useLoadingStore } from '../../store/loadingStore';
const loading = useLoadingStore();
</script>
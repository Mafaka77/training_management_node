<template>
  <Transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div 
        v-click-outside="close"
        class="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden"
      >
        <div class="p-6 text-center">
          <div class="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
</svg>
          </div>

          <h3 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {{ title || 'Confirm Deletion' }}
          </h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
            {{ message || 'Are you sure you want to delete this item? This action cannot be undone.' }}
          </p>

          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="close" 
              class="flex-1 px-5 py-3 text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button 
              @click="confirm" 
              :disabled="loading"
              class="flex-1 px-5 py-3 bg-red-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ confirmText || 'Delete Item' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  loading: Boolean,
  title: String,
  message: String,
  confirmText: String
});

const emit = defineEmits(['close', 'confirm']);

const close = () => emit('close');
const confirm = () => emit('confirm');
</script>
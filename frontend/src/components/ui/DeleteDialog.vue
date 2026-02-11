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
            <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
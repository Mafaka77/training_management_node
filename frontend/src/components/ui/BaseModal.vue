<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
            class="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            @click="$emit('close')"
        ></div>

        <Transition name="scale">
          <div
              v-if="show"
              class="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl"
          >
            <div class="p-6">
              <slot name="icon"></slot>

              <h3 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                <slot name="title">Confirm Action</slot>
              </h3>

              <div class="text-zinc-600 dark:text-zinc-400">
                <slot name="content"></slot>
              </div>

              <div class="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                    @click="$emit('close')"
                    :disabled="confirmLoading"
                    class="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                    @click="$emit('confirm')"
                    :disabled="confirmLoading"
                    :class="[
                    'px-6 py-2 text-sm font-bold text-white rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2',
                    confirmVariant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
                    confirmLoading ? 'opacity-70 cursor-not-allowed' : ''
                  ]"
                >
                  <svg v-if="confirmLoading" class="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <slot name="confirm-text">Confirm</slot>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  confirmVariant: {
    type: String,
    default: 'primary' // 'primary' or 'danger'
  },
  confirmLoading: {
    type: Boolean,
    default: false
  }
});
defineEmits(['close', 'confirm']);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.scale-enter-active, .scale-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scale-enter-from, .scale-leave-to { opacity: 0; transform: scale(0.9) translateY(20px); }
</style>
<template>
  <div class="w-full space-y-1.5 text-left">
    <label
        v-if="label"
        class="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1"
    >
      {{ label }}
    </label>

    <div class="relative group">
      <textarea
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          v-bind="$attrs"
          :placeholder="placeholder"
          :rows="rows"
          class="w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none
               bg-white dark:bg-white/5
               border border-zinc-200 dark:border-white/10
               text-zinc-900 dark:text-zinc-100
               placeholder:text-zinc-400 dark:placeholder:text-zinc-500
               focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40
               disabled:opacity-50 disabled:cursor-not-allowed
               resize-none"
      ></textarea>

      <div class="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 ring-1 ring-blue-500/20 transition-opacity"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ""
  },
  label: {
    type: String,
    default: ""
  },
  placeholder: {
    type: String,
    default: ""
  },
  rows: {
    type: [String, Number],
    default: 4
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
/* Custom Scrollbar for the textarea */
textarea::-webkit-scrollbar {
  width: 6px;
}
textarea::-webkit-scrollbar-track {
  background: transparent;
}
textarea::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.2);
  border-radius: 10px;
}
textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(120, 120, 120, 0.4);
}
</style>
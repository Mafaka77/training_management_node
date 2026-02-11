<template>
  <div class="relative w-full">
    <label v-if="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
    </label>

    <button
        type="button"
        @click="isOpen = !isOpen"
        class="relative w-full cursor-default rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-3 pr-10 text-left text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      <span class="block truncate" :class="!selectedName ? 'text-gray-500' : ''">
        {{ selectedName || placeholder }}
      </span>
      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </span>
    </button>

    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-10"></div>

    <div
        v-show="isOpen"
        class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-gray-700"
    >
      <div
          v-for="option in options"
          :key="option[trackBy]"
          @click="selectOption(option)"
          class="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 dark:text-gray-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
          :class="{ 'bg-blue-50 dark:bg-gray-600': modelValue === option[trackBy] }"
      >
        <span class="block truncate" :class="{ 'font-semibold': modelValue === option[trackBy] }">
          {{ option[optionLabel] }}
        </span>

        <span v-if="modelValue === option[trackBy]" class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 dark:text-blue-400">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: [String, Number],
    options: { type: Array, required: true },
    trackBy: { type: String, default: 'id' },
    optionLabel: { type: String, default: 'name' }, // renamed from 'label' to avoid confusion with prop label
    label: String,
    placeholder: { type: String, default: 'Select an option' }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    selectedName() {
      const selected = this.options.find(opt => opt[this.trackBy] === this.modelValue);
      return selected ? selected[this.optionLabel] : null;
    }
  },
  methods: {
    selectOption(option) {
      this.$emit('update:modelValue', option[this.trackBy]);
      this.isOpen = false; // Auto-close on selection
    }
  }
}
</script>
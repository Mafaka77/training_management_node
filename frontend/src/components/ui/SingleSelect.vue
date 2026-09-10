<template>
  <div class="relative w-full">
    <label v-if="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
    </label>

    <div class="relative w-full">
      <button
          type="button"
          @click="toggleOpen"
          class="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-3 pr-14 text-left text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <span class="block truncate" :class="!selectedName ? 'text-gray-500' : ''">
          {{ selectedName || placeholder }}
        </span>
      </button>

      <div class="absolute inset-y-0 right-0 flex items-center pr-2 gap-1 pointer-events-auto">
        <!-- Clear Button -->
        <button
          v-if="clearable && hasValue"
          type="button"
          @click.stop="clearSelection"
          class="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          title="Clear"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Dropdown Arrow -->
        <button
          type="button"
          @click="toggleOpen"
          class="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
        >
          <svg class="h-4 w-4 transition-transform duration-200" :class="isOpen ? 'rotate-180 text-blue-600' : ''" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-10"></div>

    <div
        v-show="isOpen"
        class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-gray-700 custom-scrollbar"
    >
      <!-- Search Input when searchable is true -->
      <div v-if="searchable" class="sticky top-0 z-10 p-2 bg-white dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
        <div class="relative">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Type to search..."
            class="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 py-1.5 pl-8 pr-3 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            @click.stop
          />
          <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div v-if="filteredOptions.length === 0" class="py-3 text-center text-xs text-gray-500 dark:text-gray-400">
        No options found
      </div>

      <div
          v-for="option in filteredOptions"
          :key="option[trackBy]"
          @click="selectOption(option)"
          class="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 dark:text-gray-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
          :class="{ 'bg-blue-50 dark:bg-gray-600 font-semibold': modelValue === option[trackBy] }"
      >
        <span class="block truncate">
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
    modelValue: [String, Number, Object],
    options: { type: Array, required: true },
    trackBy: { type: String, default: 'id' },
    optionLabel: { type: String, default: 'name' },
    label: String,
    placeholder: { type: String, default: 'Select an option' },
    searchable: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isOpen: false,
      searchQuery: ''
    }
  },
  computed: {
    selectedName() {
      const selected = (this.options || []).find(opt => opt[this.trackBy] === this.modelValue);
      return selected ? selected[this.optionLabel] : null;
    },
    hasValue() {
      return this.modelValue !== null && this.modelValue !== undefined && this.modelValue !== '';
    },
    filteredOptions() {
      if (!this.searchable || !this.searchQuery) return this.options || [];
      const q = this.searchQuery.toLowerCase().trim();
      return (this.options || []).filter(opt => {
        const val = opt[this.optionLabel];
        return val && String(val).toLowerCase().includes(q);
      });
    }
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.searchQuery = '';
        if (this.searchable) {
          this.$nextTick(() => {
            this.$refs.searchInput?.focus();
          });
        }
      }
    },
    selectOption(option) {
      this.$emit('update:modelValue', option[this.trackBy]);
      this.isOpen = false;
      this.searchQuery = '';
    },
    clearSelection() {
      this.$emit('update:modelValue', null);
      this.isOpen = false;
      this.searchQuery = '';
    }
  }
}
</script>
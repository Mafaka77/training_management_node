<template>
  <div class="relative w-full">
     <label v-if="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
    </label>
    <button
        type="button"
        @click="toggleDropdown"
        class="relative w-full cursor-default rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-3 pr-10 text-left text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      <span class="block truncate">
        {{ displayText }}
      </span>
      <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </span>
    </button>

    <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 z-10 w-full h-full"></div>

    <div
        v-show="isOpen"
        class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-gray-700"
    >
      <div
          v-for="option in options"
          :key="option[trackBy]"
          class="relative flex items-center cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-600"
      >
        <label class="flex items-center w-full cursor-pointer">
          <input
              type="checkbox"
              :value="option[trackBy]"
              v-model="proxyValue"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          >
          <span class="ml-3 block truncate font-normal text-gray-900 dark:text-gray-200">
            {{ option[optionLabel] }}
          </span>
        </label>
      </div>

      <div v-if="options.length === 0" class="p-3 text-sm text-gray-500 text-center">
        No options available
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultiSelect',
  props: {
    // The v-model binding
    modelValue: {
      type: Array,
      default: () => []
    },
    // The list of data (e.g. rooms)
    options: {
      type: Array,
      required: true
    },
    optionLabel: { type: String, default: 'name' },
    // Which property to use as the value (e.g. '_id')
    trackBy: {
      type: String,
      default: 'id'
    },
    // Which property to display (e.g. 'room_name')
    label: {
      type: String,
      default: 'name'
    },
    placeholder: {
      type: String,
      default: 'Select options'
    },
   
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    // This creates a writable computed property for v-model
    proxyValue: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      }
    },
    displayText() {
      if (!this.modelValue.length) return this.placeholder;

      // Find selected objects to get their names
      const selectedItems = this.options.filter(opt =>
          this.modelValue.includes(opt[this.trackBy])
      );

      const names = selectedItems.map(opt => opt[this.optionLabel]);

      if (names.length > 2) {
        return `${names.length} Selected`;
      }

      return names.join(', ');
    }
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    }
  }
}
</script>
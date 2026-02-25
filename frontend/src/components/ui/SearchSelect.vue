<template>
  <div class="relative w-full" ref="container">
    <label v-if="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white ml-1">
      {{ label }}
    </label>

    <div 
      @click="toggleDropdown"
      class="relative w-full cursor-default rounded-lg border py-2 pl-3 pr-10 text-left text-sm transition-all
             bg-gray-50 dark:bg-gray-700 
             border-gray-300 dark:border-gray-600 
             text-gray-900 dark:text-white
             focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
    >
      <div class="flex items-center gap-2 overflow-hidden">
        <img v-if="selectedOption" 
             :src="getImageUrl(selectedOption.image, selectedOption[optionLabel])" 
             class="w-5 h-5 rounded-full object-cover" />
        
        <div class="flex-1 min-w-0 relative">
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            class="w-full bg-transparent border-none outline-none p-0 text-sm text-gray-900 dark:text-white focus:ring-0 placeholder-gray-500"
            :placeholder="selectedOption ? '' : placeholder"
            @input="isOpen = true"
          />
          
          <span v-if="selectedOption && !query" 
                class="absolute inset-0 pointer-events-none flex items-center truncate">
            {{ selectedOption[optionLabel] }}
          </span>
        </div>
      </div>

      <span class="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
        <button 
          v-if="selectedOption"
          type="button"
          @click.stop="handleClear"
          class="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </span>
    </div>

    <div
        v-show="isOpen"
        class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-gray-800"
    >
      <div v-if="filteredOptions.length === 0" class="p-3 text-center text-sm text-gray-500">
        No results found
      </div>

      <div
          v-for="option in filteredOptions"
          :key="option._id"
          @click="selectOption(option)"
          class="relative cursor-pointer select-none py-2.5 pl-3 pr-9 text-gray-900 dark:text-gray-200 hover:bg-blue-600 hover:text-white"
          :class="{ 'bg-blue-50 dark:bg-gray-700': selectedOption && selectedOption._id === option._id }"
      >
        <div class="flex items-center gap-3">
          <img :src="getImageUrl(option.image, option[optionLabel])" class="w-6 h-6 rounded-full object-cover" />
          <div class="flex flex-col">
            <span class="block truncate" :class="{ 'font-semibold': selectedOption && selectedOption._id === option._id }">
              {{ option[optionLabel] }}
            </span>
            <span class="text-[10px] opacity-70">{{ option.designation }}</span>
          </div>
        </div>

        <span v-if="selectedOption && selectedOption._id === option._id" class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 dark:text-blue-400">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  modelValue: [String, Object], 
  options: { type: Array, required: true },
  optionLabel: { type: String, default: 'full_name' },
  label: String,
  placeholder: { type: String, default: 'Select an option' }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const query = ref('');
const container = ref(null);
const inputRef = ref(null);
const selectedOption = computed(() => {
  if (!props.modelValue) return null;
  return typeof props.modelValue === 'object' 
    ? props.modelValue 
    : props.options.find(opt => opt._id === props.modelValue);
});

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || '';
const getImageUrl = (path, name) => path ? `${IMAGE_URL}${path}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

const filteredOptions = computed(() => {
  const s = query.value.toLowerCase().trim();
  if (!s) return props.options;
  return props.options.filter(opt => 
    opt[props.optionLabel]?.toLowerCase().includes(s) || 
    opt.department?.toLowerCase().includes(s) || 
    opt.designation?.toLowerCase().includes(s)
  );
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) nextTick(() => inputRef.value?.focus());
};

const selectOption = (option) => {
  emit('update:modelValue', option._id);
  query.value = '';
  isOpen.value = false;
};

const handleClear = () => {
  emit('update:modelValue', null);
  query.value = '';
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (container.value && !container.value.contains(event.target)) {
    isOpen.value = false;
    query.value = '';
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>
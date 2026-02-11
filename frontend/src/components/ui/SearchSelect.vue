<template>
  <div class="relative w-full" ref="container">
    <label v-if="label" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 ml-1">
      {{ label }}
    </label>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform translate-y-2 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-2 opacity-0 scale-95"
    >
      <div v-if="isOpen" 
           class="absolute z-[60] bottom-full mb-2 w-full p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl max-h-64 overflow-y-auto custom-scrollbar">
        
        <div v-if="filteredOptions.length === 0" class="p-4 text-center text-sm text-zinc-500">
          No matches found
        </div>

        <div 
          v-for="item in filteredOptions" 
          :key="item._id"
          @click="selectOption(item)"
          class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10 group"
        >
          <img :src="getImageUrl(item.image,item.full_name)" class="w-10 h-10 rounded-full object-cover border border-zinc-100 dark:border-white/5" />
          
          <div class="flex-1 min-w-0 text-left">
            <div class="flex justify-between items-start">
              <h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{{ item.full_name }}</h4>
              <span class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/5 text-zinc-500">{{ item.department }}</span>
            </div>
            <p class="text-[11px] text-zinc-500 truncate">{{ item.designation }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <div 
      @click="isOpen = !isOpen"
      class="relative flex items-center w-full px-4 py-3 rounded-2xl border transition-all cursor-pointer
             bg-white dark:bg-gray-700
             border-zinc-200 dark:border-white/10
             hover:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 "
    >
      <div class="flex flex-1 items-center gap-3 overflow-hidden ">
        <template v-if="modelValue && !isOpen">
          <img :src="getImageUrl(modelValue.image,modelValue.full_name)" class="w-8 h-8 rounded-full object-cover" />
          <div class="flex flex-col truncate text-left">
            <span class="text-sm font-bold text-zinc-900 dark:text-zinc-100">{{ modelValue.full_name }}</span>
            <span class="text-[10px] text-zinc-500 dark:text-white">{{ modelValue.designation }}</span>
          </div>
        </template>
        
        <input
          v-else
          v-model="query"
          type="text"
          :placeholder="modelValue ? modelValue.full_name : placeholder"
          class="w-full bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-zinc-100 "
          @input="isOpen = true"
        />
      </div>

      <div class="flex items-center gap-2 pr-1 ">
        <button 
          v-if="modelValue"
          type="button"
          @click.stop="clearSelection"
          class="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <svg class="w-4 h-4 text-zinc-400 transition-transform" :class="{ 'rotate-180': isOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: Object,
  options: Array,
  label: String,
  placeholder: { type: String, default: 'Search...' }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const query = ref('');
const container = ref(null);

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || '';
const getImageUrl = (path,name) => path ? `${IMAGE_URL}${path}` : `https://ui-avatars.com/api/?name=${name}`;

const filteredOptions = computed(() => {
  if (!query.value) return props.options;
  const s = query.value.toLowerCase();
  return props.options.filter(opt => 
    opt.full_name.toLowerCase().includes(s) || 
    opt.department?.toLowerCase().includes(s) || 
    opt.designation?.toLowerCase().includes(s)
  );
});

const selectOption = (item) => {
  emit('update:modelValue', item);
  query.value = '';
  isOpen.value = false;
};

// Logic to clear the selection
const clearSelection = () => {
  emit('update:modelValue', null);
  query.value = '';
};

const handleClickOutside = (event) => {
  if (container.value && !container.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
</style>
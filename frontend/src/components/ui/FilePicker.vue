<template>
  <div class="space-y-4">
    <div
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        @click="$refs.fileInput.click()"
        :class="[
        'relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all duration-200 text-center',
        isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
          : 'border-zinc-300 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500/50 bg-white dark:bg-white/5'
      ]"
    >
      <input
          ref="fileInput"
          type="file"
          multiple
          :accept="allowedExtensions.join(',')"
          class="hidden"
          @change="handleFileSelect"
      />

      <div class="flex flex-col items-center">
        <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        <p class="text-zinc-900 dark:text-zinc-100 font-semibold">
          Click to upload or drag and drop
        </p>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">
          PDF, DOCX, PPTX, XLSX (Max 10MB per file)
        </p>
      </div>
    </div>

    <div v-if="files.length > 0" class="space-y-2">
      <div
          v-for="(file, index) in files"
          :key="index"
          class="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10"
      >
        <div class="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
          <svg v-if="file.type.includes('pdf')" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/></svg>
          <svg v-else class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
            {{ file.name }}
          </p>
          <p class="text-xs text-zinc-500">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
        </div>

        <button
            @click="removeFile(index)"
            class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['update:modelValue']);
const isDragging = ref(false);
const files = ref([]);

const allowedExtensions = [
  '.pdf',
  '.doc', '.docx',
  '.ppt', '.pptx',
  '.xls', '.xlsx'
];

const handleFileSelect = (event) => {
  addFiles(event.target.files);
};

const handleDrop = (event) => {
  isDragging.value = false;
  addFiles(event.dataTransfer.files);
};

const addFiles = (newFiles) => {
  const filteredFiles = Array.from(newFiles).filter(file => {
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    return allowedExtensions.includes(extension);
  });

  files.value = [...files.value, ...filteredFiles];
  emit('update:modelValue', files.value);
};

const removeFile = (index) => {
  files.value.splice(index, 1);
  emit('update:modelValue', files.value);
};
</script>
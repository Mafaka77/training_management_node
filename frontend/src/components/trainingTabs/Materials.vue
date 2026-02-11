<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">Study Materials</h2>
        <p class="text-xs text-zinc-500">Upload PDFs, slides, or documents for this program.</p>
      </div>
      <button 
        @click="showUploadModal = true" 
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Upload Material
      </button>
    </div>

    <div v-if="materials.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="file in materials" :key="file._id"
        class="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl flex items-center gap-4 group hover:border-blue-500/50 transition-all shadow-sm"
      >
        <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
          <svg v-if="file.m_type === 'pdf'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        
       <div class="flex-1 min-w-0">
  <h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600 transition-colors">
    {{ file.title }}
  </h4>
  
  <div class="flex flex-col gap-1 mt-0.5">
    <div class="flex items-center gap-2">
      <span class="text-[10px] font-black text-blue-500/80 dark:text-blue-400/80 uppercase tracking-widest">
       {{ getFileLabel(file.mime_type) }}
      </span>
      <span class="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
      <span class="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase">
        {{ formatSize(file.file_size) }}
      </span>
    </div>

    <div class="flex items-center gap-1.5 pt-0.5">
      <div class="w-4 h-4 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center border border-zinc-200 dark:border-white/10">
         <svg class="w-2.5 h-2.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
         </svg>
      </div>
      <span class="text-[10px] text-zinc-500 dark:text-zinc-400 italic">
        Uploaded by <span class="font-bold text-zinc-700 dark:text-zinc-300 not-italic">{{ file.uploadedBy?.full_name }}</span>
      </span>
    </div>
  </div>
</div>

        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <a :href="file.m_url" target="_blank" class="p-2 text-zinc-400 hover:text-blue-500 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/></svg>
          </a>
          <button @click="handleDelete(file._id)" class="p-2 text-zinc-400 hover:text-red-500 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"/></svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="py-24 text-center bg-zinc-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-white/10">
      <p class="text-zinc-500 text-sm">No study materials found for this program.</p>
    </div>

    <Transition 
      enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" 
      leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0"
    >
      <div v-if="showUploadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
          <div class="px-6 py-4 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-white/2">
            <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">Upload Material</h3>
            <button @click="showUploadModal = false" class="text-zinc-400 hover:text-zinc-600 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="handleUpload" class="p-6 space-y-5">
            <BaseInput v-model="uploadForm.title" label="Document Title" placeholder="e.g. Week 1 Logic Exercises" required />
            
            <FilePicker v-model="uploadForm.materials"  />

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-white/5">
              <button type="button" @click="showUploadModal = false" class="px-5 py-2.5 text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all">Cancel</button>
              <button 
  type="submit" 
  :disabled="isSubmitting || !uploadForm.materials" 
  class="group relative px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2 overflow-hidden"
>
  <span v-if="isSubmitting" class="flex items-center gap-2">
    <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Uploading...
  </span>

  <template v-else>
    <svg class="w-4 h-4 transform group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
    <span>Start Upload</span>
  </template>
</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import BaseInput from '../ui/BaseInput.vue';
import { useSessionStore } from '../../store/sessionStore.js';
import { storeToRefs } from 'pinia';
import { useAlertStore } from '../../store/alertStore.js';
import {useLoadingStore} from '../../store/loadingStore.js';

import FilePicker from '../ui/FilePicker.vue';
const alert=useAlertStore();
const store=useSessionStore();
const {materials}=storeToRefs(store);
const loader=useLoadingStore()
const props = defineProps({
  programId: { type: String, required: true }
});

const showUploadModal = ref(false);
const isSubmitting = ref(false);
const isDeleteLoading=ref(false);
const uploadForm = reactive({
  title: '',
  materials:[],
  programId:'',

});

const formatSize = (bytes) => {
  if (!bytes) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
const handleUpload = async () => {
  
  
  isSubmitting.value = true;
  const formData = new FormData();
  uploadForm.materials.forEach(file => {
    formData.append('materials', file);
  });
  formData.append('title', uploadForm.title);
  formData.append('programId', props.programId);

  try {
    const response=await store.submitMaterial(formData);
    if(response.success){
        alert.success(response.message);
        await store.fetchMaterials(props.programId);
        uploadForm.title = '';
        uploadForm.materials = [];
        showUploadModal.value=false;
    }else{
        alert.warning(response.message);
    }
  }catch(ex){
    alert.warning(ex);
  } finally {
    isSubmitting.value = false;
  }
};
async function handleDelete(id){
    loader.show('Deleting material......')
    isDeleteLoading.value=true;
   try{
    const response=await store.deleteMaterial(id);
    if(response.success){
        alert.success(response.message);
        await store.fetchMaterials(props.programId);
    }else{
        alert.warning(response.message);
    }
   }catch(ex){
    alert.error(ex);
   }finally{
    loader.hide();
    isDeleteLoading.value=false
   }
   
}
const getFileLabel = (mimeType) => {
  if (!mimeType) return 'FILE';
  
  const map = {
    // Word
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    // Excel
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    // PowerPoint
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    // Others
    'application/pdf': 'PDF',
    'image/jpeg': 'JPG',
    'image/png': 'PNG'
  };

  return map[mimeType] || mimeType.split('/')[1]?.split('.').pop()?.toUpperCase() || 'DOC';
};
onMounted(async () => {
    store.fetchMaterials(props.programId);
});
</script>
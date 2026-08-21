<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">Study Materials</h2>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">Upload PDFs, slides, or documents for this program.</p>
      </div>
      <button 
        @click="showUploadModal = true" 
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Upload Material
      </button>
    </div>

    <!-- Materials Grid Cards -->
    <div v-if="materials && materials.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="file in materials" :key="file._id"
        class="p-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl flex items-center gap-4 group hover:border-emerald-500/50 transition-all shadow-xs"
      >
        <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 shrink-0">
          <svg v-if="file.m_type === 'pdf'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {{ file.title }}
          </h4>
          
          <div class="flex flex-col gap-1 mt-0.5">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
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
              <span class="text-[10px] text-zinc-500 dark:text-zinc-400 italic truncate">
                Uploaded by <span class="font-bold text-zinc-700 dark:text-zinc-300 not-italic">{{ file.uploadedBy?.full_name || 'Faculty' }}</span>
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-all">
          <a :href="file.m_url" target="_blank" class="p-2 text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 cursor-pointer" title="View Material">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/></svg>
          </a>
          <button @click="handleDelete(file._id)" class="p-2 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 cursor-pointer" title="Delete Material">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="py-20 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs">
      <div class="mx-auto w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">No Study Materials Uploaded</h3>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Upload PDFs, slides, or documents for this program.</p>
    </div>

    <!-- Upload Material Modal -->
    <Transition 
      enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" 
      leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0"
    >
      <div v-if="showUploadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
        <div class="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-white/10 overflow-hidden">
          <div class="px-6 py-4 border-b border-zinc-200/60 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-white/[0.02]">
            <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Upload Study Material</h3>
            <button @click="showUploadModal = false" class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form @submit.prevent="handleUpload" class="p-6 space-y-4">
            <BaseInput v-model="uploadForm.title" label="Document Title" placeholder="e.g. Fundamental Administrative Logic Notes" required />
            
            <FilePicker v-model="uploadForm.materials" />

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-white/5">
              <button type="button" @click="showUploadModal = false" class="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer">Cancel</button>
              <button 
                type="submit" 
                :disabled="isSubmitting || !uploadForm.materials || uploadForm.materials.length === 0" 
                class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <span v-if="isSubmitting" class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>

                <template v-else>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
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
import { storeToRefs } from 'pinia';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import BaseInput from '../../../../components/ui/BaseInput.vue';
import FilePicker from '../../../../components/ui/FilePicker.vue';
import { useAlertStore } from '../../../../store/alertStore.js';
import { useLoadingStore } from '../../../../store/loadingStore.js';
import { useSessionStore } from '../../../../store/sessionStore.js';

const props = defineProps({
  programId: { type: String, default: '' }
});

const route = useRoute();
const targetProgramId = computed(() => props.programId || route.params.id);

const alert = useAlertStore();
const store = useSessionStore();
const { materials } = storeToRefs(store);
const loader = useLoadingStore();

const showUploadModal = ref(false);
const isSubmitting = ref(false);
const isDeleteLoading = ref(false);
const uploadForm = reactive({
  title: '',
  materials: [],
  programId: ''
});

const formatSize = (bytes) => {
  if (!bytes) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const handleUpload = async () => {
  if (!targetProgramId.value) return;
  isSubmitting.value = true;
  const formData = new FormData();
  uploadForm.materials.forEach(file => {
    formData.append('materials', file);
  });
  formData.append('title', uploadForm.title);
  formData.append('programId', targetProgramId.value);

  try {
    const response = await store.submitMaterial(formData);
    if (response.success) {
      alert.success(response.message);
      await store.fetchMaterials(targetProgramId.value);
      uploadForm.title = '';
      uploadForm.materials = [];
      showUploadModal.value = false;
    } else {
      alert.warning(response.message);
    }
  } catch (ex) {
    alert.warning(ex);
  } finally {
    isSubmitting.value = false;
  }
};

async function handleDelete(id) {
  if (!targetProgramId.value) return;
  loader.show('Deleting material...');
  isDeleteLoading.value = true;
  try {
    const response = await store.deleteMaterial(id);
    if (response.success) {
      alert.success(response.message);
      await store.fetchMaterials(targetProgramId.value);
    } else {
      alert.warning(response.message);
    }
  } catch (ex) {
    alert.error(ex);
  } finally {
    loader.hide();
    isDeleteLoading.value = false;
  }
}

const getFileLabel = (mimeType) => {
  if (!mimeType) return 'FILE';
  const map = {
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'application/pdf': 'PDF',
    'image/jpeg': 'JPG',
    'image/png': 'PNG'
  };
  return map[mimeType] || mimeType.split('/')[1]?.split('.').pop()?.toUpperCase() || 'DOC';
};

onMounted(async () => {
  if (targetProgramId.value) {
    store.fetchMaterials(targetProgramId.value);
  }
});

watch(targetProgramId, (newId) => {
  if (newId) store.fetchMaterials(newId);
});
</script>

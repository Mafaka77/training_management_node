<template>
  <div class="max-w-5xl mx-auto pb-12">
    <Breadcrumbs :items="breadcrumbs" />

    <form @submit.prevent="submitForm">
      <section class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        
        <div class="flex items-center gap-2 mb-6 text-amber-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 class="text-lg font-bold tracking-tight">Document Repository</h2>
        </div>

        <div class="grid grid-cols-1 gap-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput 
              v-model="form.title"
              label="Document Title"
              placeholder="e.g. Training Manual 2024"
              type="text"
            />
            <BaseInput 
              v-model="form.description"
              label="Short Description"
              placeholder="Brief overview of the document content"
              type="text"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Upload Files
            </label>
            <div class="p-1 bg-zinc-50 dark:bg-white/[0.02] rounded-xl border-2 border-dashed border-zinc-200 dark:border-white/10">
              <FilePicker v-model="form.documents" />
            </div>
            <p class="text-[11px] text-zinc-500 italic px-1">
              Supported formats: PDF, DOCX, PPTX (Max 10MB per file)
            </p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-zinc-100 dark:border-white/5">
          <button 
            type="button" 
            @click="$router.back()"
            class="px-6 py-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 font-semibold transition-all"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            :disabled="isLoading"
            class="flex items-center justify-center px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Uploading...' : 'Save Document' }}</span>
          </button>
        </div>
      </section>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useMasterStore } from "../../../store/masterStore.js";
import { useAlertStore } from "../../../store/alertStore.js";
import { useRouter } from "vue-router";
import BaseInput from "../../../components/ui/BaseInput.vue";
import FilePicker from "../../../components/ui/FilePicker.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";

const alert = useAlertStore();
const store = useMasterStore();
const router = useRouter();
const isLoading = ref(false);

const form = reactive({
  title: '',
  description: '',
  documents: [],
});

const breadcrumbs = [
  { label: "Documents", to: "/admin/master/documents" },
  { label: "Create Document" }
];

const submitForm = async () => {
  // Basic validation
  if (!form.title || form.documents.length === 0) {
    alert.warning("Please provide a title and at least one document.");
    return;
  }

  isLoading.value = true;
  const formData = new FormData();
  
  formData.append('title', form.title);
  formData.append('description', form.description);
  
  // Handling multiple files
  form.documents.forEach(file => {
    formData.append('documents', file);
  });

  try {
    const response = await store.submitDocument(formData);
    
    if (response.success === false) {
      alert.error(response.message);
    } else {
      alert.success("Document(s) uploaded successfully!");
      router.push({ name: 'master.documents.index' });
      
      // Reset form
      Object.assign(form, {
        title: '',
        description: '',
        documents: []
      });
    }
  } catch (error) {
    alert.error("Upload failed. Please check your connection.");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>
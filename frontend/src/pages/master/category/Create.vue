<template>
  <div class="max-w-5xl mx-auto pb-12">
    <Breadcrumbs :items="breadcrumbs" />

    <form @submit.prevent="submitForm">
      <section class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        
        <div class="flex items-center gap-2 mb-6 text-emerald-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h2 class="text-lg font-bold tracking-tight">Category Details</h2>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <BaseInput 
              v-model="form.name"
              label="Category Name"
              placeholder="e.g. Technical Skills"
              type="text"
            />
          </div>

          <BaseInput 
            v-model="form.description"
            label="Category Description"
            placeholder="Briefly describe what this training category covers..."
            type="text" 
          />
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
            <span>{{ isLoading ? 'Saving...' : 'Save Category' }}</span>
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
import BaseInput from "../../../components/ui/BaseInput.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";

const store = useMasterStore();
const alert = useAlertStore();
const isLoading = ref(false);

const form = reactive({
  name: '',
  description: '',
});

const breadcrumbs = [
  { label: "Categories", to: "/admin/master/category" },
  { label: "Create Category" }
];

const submitForm = async () => {
  if (!form.name) {
    alert.warning("Please enter a category name.");
    return;
  }

  isLoading.value = true;
  try {
    const response = await store.submitCategory(form);
    if (response.success === false) {
      alert.error(response.message);
    } else {
      alert.success(response.message || "Category saved successfully!");
      form.name = '';
      form.description = '';
    }
  } catch (error) {
    alert.error('Failed to create category: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="space-y-4">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div class="space-y-1">
        <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          BANNERS
        </h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          Manage and organize promotional banners
        </p>
      </div>

      <button
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Banner
      </button>
    </div>

    <div v-if="isBannerLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i"
           class="h-48 w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 animate-pulse"
      ></div>
    </div>

    <div v-else-if="banners.length === 0"
         class="flex flex-col items-center justify-center py-16 bg-zinc-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-white/10"
    >
      <div class="p-4 rounded-full bg-zinc-100 dark:bg-white/5 mb-3 text-zinc-400">
        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-zinc-900 dark:text-zinc-100 font-medium">No Banners found</h3>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
          v-for="banner in banners"
          :key="banner._id"
          class="group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300
               bg-white dark:bg-zinc-900
               border-zinc-200 dark:border-white/10
               hover:shadow-xl hover:border-blue-500/50"
      >
        <div class="relative h-44 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img 
            :src="`${BASE_URL}${banner.image_url}`" 
            :alt="banner.title"
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            @error="(e) => e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found'"
          />
          
          <div class="absolute top-3 left-3">
            <span :class="banner.is_active ? 'bg-green-500' : 'bg-zinc-400'"
                  class="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
              {{ banner.is_active ? 'Active' : 'Draft' }}
            </span>
          </div>
        </div>

        <div class="p-4 flex items-center justify-between">
          <div class="min-w-0">
            <h4 class="text-sm font-semibold text-zinc-900 dark:text-white truncate">
              {{ banner.title || 'Untitled Banner' }}
            </h4>
          </div>

          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
            <button
                @click="openEditModal(banner)"
                class="p-2 rounded-lg text-zinc-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>

            <button
                @click="openDeleteModal(banner)"
                class="p-2 rounded-lg text-zinc-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <BaseModal
      :show="isDeleteModalOpen"
      confirmVariant="danger"
      @close="isDeleteModalOpen = false"
      @confirm="confirmDelete"
  >
    <template #icon>
      <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-4">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    </template>
    <template #title>Delete Banner</template>
    <template #content>
      Are you sure you want to delete <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ docToDelete?.title }}</span>?
      This action cannot be undone.
    </template>
    <template #confirm-text>Delete Permanently</template>
  </BaseModal>

  <BaseModal
      :show="isCreateModalOpen"
      @close="closeCreateModal"
      @confirm="handleSaveBanner"
      confirmText="Save Banner"
  >
    <template #title>Add New Banner</template>
    <template #content>
      <div class="space-y-4 pt-2">
        <div class="space-y-1">
          <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Banner Title</label>
          <input
              v-model="form.title"
              type="text"
              class="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Summer Sale 2026"
          />
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Upload Image</label>
           <ImagePicker 
              type="file" 
              accept=".png, .jpg, .jpeg" 
              class="h-[188px]"
              @change="handleBanner" 
            />
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { useMasterStore } from "../../../store/masterStore.js";
import { onMounted, reactive, ref } from "vue";
import { useAlertStore } from "../../../store/alertStore.js";
import { storeToRefs } from "pinia";
import BaseModal from "../../../components/ui/BaseModal.vue";
import ImagePicker from "../../../components/ui/ImagePicker.vue";

// Constants
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://192.168.0.82:5001';

const store = useMasterStore();
const alert = useAlertStore();

// State
const isDeleteModalOpen = ref(false);
const docToDelete = ref(null);
const isCreateModalOpen = ref(false);
const isLoading = ref(false); // Global saving state

const form = reactive({
  title: '',
  banner: '',
});

// Destructure from store
const { banners, isBannerLoading } = storeToRefs(store);

// Actions
const openDeleteModal = (doc) => {
  docToDelete.value = doc;
  isDeleteModalOpen.value = true;
};

const openCreateModal = () => {
  form.title = '';
  form.banner = '';
  isCreateModalOpen.value = true;
};

const closeCreateModal = () => {
  isCreateModalOpen.value = false;
};

function handleBanner(file) {
  form.banner = file;
}

const handleSaveBanner = async () => {
  if (!form.title || !form.banner) {
    alert.error("Please provide both a title and an image.");
    return;
  }

  const formData = new FormData();
  formData.append('title', form.title);
  formData.append('banner', form.banner);

  try {
    isLoading.value = true;
    const response = await store.submitBanner(formData);

    if (response.success) {
      alert.success(response.message || "Banner saved successfully!");
      await store.fetchBanners();
      closeCreateModal();
    } else {
      alert.error(response.message || "Failed to save banner.");
    }
  } catch (error) {
    alert.error("An unexpected error occurred.");
    console.error("Banner Upload Error:", error);
  } finally {
    isLoading.value = false;
  }
};

const confirmDelete = async () => {
  if (!docToDelete.value) return;

  try {
    // Assuming your store has a deleteBanner method
    const response = await store.deleteBanner(docToDelete.value._id);
    if (response.success) {
      alert.success(response.message);
      await store.fetchBanners();
      isDeleteModalOpen.value = false;
    } else {
      alert.error(response.message);
    }
  } catch (err) {
    alert.error("Failed to delete banner.");
  }
};

onMounted(() => {
  store.fetchBanners();
});
</script>
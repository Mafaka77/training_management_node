<template>
  <div class="space-y-4">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div class="space-y-1">
        <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          FAQ's
        </h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          Organize your FAQ into functional groups
        </p>
      </div>

      <router-link
          to="/admin/master/faq/create"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New FAQ
      </router-link>
    </div>

    <div v-if="isFAQLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i"
           class="h-24 w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 animate-pulse"
      ></div>
    </div>

    <div v-else-if="faqs.length === 0"
         class="flex flex-col items-center justify-center py-16 bg-zinc-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-white/10"
    >
      <div class="p-4 rounded-full bg-zinc-100 dark:bg-white/5 mb-3 text-zinc-400">
        <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      </div>
      <h3 class="text-zinc-900 dark:text-zinc-100 font-medium">No FAQ's found</h3>
      <p class="text-zinc-500 dark:text-zinc-400 text-sm">Add FAQ to you repos.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
          v-for="cat in faqs"
          :key="cat._id"
          class="group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300
               bg-white dark:bg-white/5
               border-zinc-200 dark:border-white/10
               hover:shadow-lg hover:border-blue-500/50 dark:hover:border-blue-500/50"
      >
        <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                    bg-zinc-100 dark:bg-zinc-800
                    text-zinc-500 dark:text-zinc-400
                    group-hover:bg-blue-600 group-hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-zinc-900 dark:text-zinc-100 truncate">
            {{ cat.question.slice(-40) }}
          </h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-500 font-medium">
            ID: {{ cat._id?.slice(-6) }}
          </p>
        </div>

        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <router-link
              :to="{ name: 'master.faq.edit', params: { id: cat._id } }"
              class="p-2 rounded-lg text-zinc-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </router-link>

          <button
              @click="openDeleteModal(cat)"
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

    <template #title>Delete Room</template>

    <template #content>
      Are you sure you want to delete <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ docToDelete?.question }}</span>?
      This will permanently remove the data from the server.
    </template>

    <template #confirm-text>Delete Permanently</template>
  </BaseModal>
</template>

<script setup>
import { useMasterStore } from "../../../store/masterStore.js";
import {onMounted, ref} from "vue";
import { useAlertStore } from "../../../store/alertStore.js";
import { storeToRefs } from "pinia";
import BaseModal from "../../../components/ui/BaseModal.vue";

const store = useMasterStore();
const alert = useAlertStore();
const isDeleteModalOpen = ref(false);
const docToDelete = ref(null);

const openDeleteModal = (doc) => {

  docToDelete.value = doc;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!docToDelete.value) return;

  const response = await store.deleteFAQ(docToDelete.value._id);
  if (response.success) {
    alert.success(response.message);
    await store.fetchFAQs();
    isDeleteModalOpen.value = false;

  } else {
    alert.error(response.message);
  }
};
// Correct way to destructure refs from store
const { faqs, isFAQLoading } = storeToRefs(store);

onMounted(() => {
  store.fetchFAQs();
});

</script>
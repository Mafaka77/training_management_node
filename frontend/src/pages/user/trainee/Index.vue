<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-6 mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Trainee Management
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Total Trainees Found: <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ traineesTotal || 0 }}</span>
          </p>
        </div>
        <router-link
            to="/admin/trainee/create"
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Trainee
        </router-link>
      </div>

      <div class="relative max-w-md">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, mobile..."
            class="block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-all
                   bg-white dark:bg-zinc-900/50
                   border-zinc-200 dark:border-white/10
                   text-zinc-900 dark:text-zinc-100
                   placeholder-zinc-400
                   focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
        />
      </div>
    </div>

    <div v-if="isTraineeLoading" class="grid grid-cols-1 gap-4">
      <div v-for="i in 3" :key="i"
           class="h-36 w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 animate-pulse"
      ></div>
    </div>

    <div v-else-if="!trainees || trainees.length === 0"
         class="flex flex-col items-center justify-center py-20 px-4 bg-zinc-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-white/10"
    >
      <div class="p-5 rounded-full bg-zinc-100 dark:bg-white/10 mb-4 text-zinc-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <h3 class="text-zinc-900 dark:text-zinc-100 font-semibold text-lg">
        {{ searchQuery ? 'No results for your search' : 'No Trainees Found' }}
      </h3>
      <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-1 text-center max-w-xs">
        {{ searchQuery ? 'Try searching for something else.' : 'Get started by creating your first trainee record.' }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <div
          v-for="trainee in trainees"
          :key="trainee._id"
          class="group relative flex flex-col md:flex-row md:items-center gap-5 p-6 rounded-2xl border transition-all duration-300
               bg-white dark:bg-zinc-900/50
               border-zinc-200 dark:border-white/10
               hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/40"
      >
        <div class="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500
                    bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400
                    group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <h3 class="text-lg font-bold truncate text-zinc-900 dark:text-zinc-100">
              {{ trainee.full_name }}
            </h3>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-600 border border-blue-200 dark:border-blue-800">
              Trainee
            </span>
          </div>

          <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3">
            {{ trainee.designation }} • {{ trainee.department }}
          </p>

          <div v-if="trainee.groups?.length" class="flex flex-wrap gap-1.5 mb-3">
            <span v-for="g in trainee.groups" :key="g._id" 
                  class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              {{ g.group_name }}
            </span>
          </div>

          <div class="flex flex-wrap gap-4 text-xs font-semibold">
            <span class="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
              <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2" stroke-linecap="round"/></svg>
              {{ trainee.email }}
            </span>
            <span class="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
              <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-width="2" stroke-linecap="round"/></svg>
              {{ trainee.mobile }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-white/5">
          <router-link :to="{name: 'trainee.edit', params: {id: trainee._id}}"
                       title="Edit"
                       class="p-2.5 rounded-xl transition-all bg-zinc-100 dark:bg-zinc-800 text-zinc-600 hover:bg-blue-600 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2.5 2.5 0 113.536 3.536L12 20.364H8v-4.364l9.293-9.293z" />
            </svg>
          </router-link>

          <button
              @click="openDeleteModal(trainee)"
              title="Delete"
              class="p-2.5 rounded-xl transition-all bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <nav v-if="traineeTotalPages > 1" class="flex justify-center pt-10">
      <ul class="flex items-center gap-2">
        <li>
          <button @click="goToPage(traineePage - 1)" :disabled="traineePage === 1"
                  class="p-2.5 rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/10 disabled:opacity-25 transition-all">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
        </li>
        <li v-for="p in pageNumbers" :key="p">
          <button @click="goToPage(p)"
                  :class="[p === traineePage ? 'bg-blue-600 text-white border-blue-600' : 'text-zinc-500 border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/10', 'w-10 h-10 rounded-xl border text-sm font-bold transition-all']">
            {{ p }}
          </button>
        </li>
        <li>
          <button @click="goToPage(traineePage + 1)" :disabled="traineePage === traineeTotalPages"
                  class="p-2.5 rounded-xl border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/10 disabled:opacity-25 transition-all">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </li>
      </ul>
    </nav>

    <BaseModal
        :show="isDeleteModalOpen"
        confirmVariant="danger"
        @close="isDeleteModalOpen = false"
        @confirm="confirmDelete"
    >
      <template #icon>
        <div class="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center mb-4">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </template>
      <template #title>Delete Trainee</template>
      <template #content>
        Are you sure you want to remove <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ traineeToDelete?.full_name }}</span>?
        This action will permanently delete the record.
      </template>
      <template #confirm-text>Delete Permanently</template>
    </BaseModal>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useUserManageStore } from "../../../store/userManageStore.js";
import { useAlertStore } from "../../../store/alertStore.js";
import BaseModal from "../../../components/ui/BaseModal.vue";
import debounce from "lodash.debounce"

const alert = useAlertStore();
const store = useUserManageStore();

// Destructure reactive state from Store
const { 
  trainees, 
  isTraineeLoading, 
  traineePage, 
  traineeTotalPages,
  traineesTotal 
} = storeToRefs(store);

// Local State
const searchQuery = ref("");
const isDeleteModalOpen = ref(false);
const traineeToDelete = ref(null);

// Pagination Logic
const pageNumbers = computed(() => {
  const range = [];
  for (let i = 1; i <= traineeTotalPages.value; i++) {
    range.push(i);
  }
  return range;
});

const goToPage = (p) => {
  if (p >= 1 && p <= traineeTotalPages.value) {
    store.fetchTrainee(p, searchQuery.value);
  }
}

// Search Logic
const doSearch = debounce((val) => {
  store.fetchTrainee(1, val);
}, 500);

watch(searchQuery, (newVal) => {
  doSearch(newVal);
});

// Delete Logic
const openDeleteModal = (trainee) => {
  traineeToDelete.value = trainee;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!traineeToDelete.value) return;
  
  const response = await store.deleteTrainee(traineeToDelete.value._id);
  if (response.success) {
    alert.success(response.message || 'Trainee deleted successfully');
    isDeleteModalOpen.value = false;
    await store.fetchTrainee(traineePage.value, searchQuery.value);
  } else {
    alert.error(response.message || 'Failed to delete trainee');
  }
};

onMounted(() => {
  store.fetchTrainee();
});
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style>
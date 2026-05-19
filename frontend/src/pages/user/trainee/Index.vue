<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col gap-6 mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Trainee Management
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Total Trainees Found: <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ traineesTotal || 0
              }}</span>
          </p>
        </div>
        <router-link to="/admin/trainee/create"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Trainee
        </router-link>
      </div>
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div class="relative max-w-md">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input v-model="searchQuery" type="text" placeholder="Search by name, email, mobile..."
            class="block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-all bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
        </div>
        <router-link to="/admin/trainee/create"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Generate Report
        </router-link>
      </div>
    </div>

    <!-- Table Container -->
    <div
      class="overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm flex flex-col">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-zinc-50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/10">
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Trainee
              </th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Designation / Dept</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Contact
              </th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Groups
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Actions</th>
            </tr>
          </thead>

          <tbody v-if="isTraineeLoading">
            <tr v-for="i in 5" :key="i" class="border-b border-zinc-100 dark:border-white/5">
              <td colspan="5" class="px-6 py-4">
                <div class="h-8 w-full bg-zinc-100 dark:bg-white/5 animate-pulse rounded-lg"></div>
              </td>
            </tr>
          </tbody>

          <tbody v-else-if="!trainees || trainees.length === 0">
            <tr>
              <td colspan="5" class="px-6 py-20 text-center">
                <p class="text-zinc-500 dark:text-zinc-400">No trainees found.</p>
              </td>
            </tr>
          </tbody>

          <tbody v-else class="divide-y divide-zinc-100 dark:divide-white/5">
            <tr v-for="trainee in trainees" :key="trainee._id"
              class="group hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
              <!-- Name & Badge Column -->
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ trainee.full_name }}</span>
                  <div class="flex gap-1.5 mt-1">
                    <span v-if="trainee.is_blacklisted"
                      class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-red-100 dark:bg-red-900/30 text-red-600 border border-red-200 dark:border-red-800">
                      Blacklisted
                    </span>
                  </div>
                </div>
              </td>

              <!-- Work Info Column -->
              <td class="px-6 py-4">
                <div class="text-sm text-zinc-600 dark:text-zinc-300">{{ trainee.designation }}</div>
                <div class="text-xs text-zinc-500 dark:text-zinc-500 font-medium">{{ trainee.department }}</div>
              </td>

              <!-- Contact Column -->
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <span class="text-xs flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                    <svg class="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        stroke-width="2" stroke-linecap="round" />
                    </svg>
                    {{ trainee.email }}
                  </span>
                  <span class="text-xs flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                    <svg class="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        stroke-width="2" stroke-linecap="round" />
                    </svg>
                    {{ trainee.mobile }}
                  </span>
                </div>
              </td>

              <!-- Groups Column -->
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                    {{ trainee.group.group_name }}
                  </span>
                  <span v-if="!trainee.group?.group_name" class="text-xs text-zinc-400 italic">No groups</span>
                </div>
              </td>

              <!-- Actions Column -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link :to="{ name: 'trainee.edit', params: { id: trainee._id } }"
                    class="p-2 rounded-lg transition-all bg-zinc-100 dark:bg-zinc-800 text-zinc-600 hover:bg-blue-600 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2.5 2.5 0 113.536 3.536L12 20.364H8v-4.364l9.293-9.293z" />
                    </svg>
                  </router-link>
                  <button @click="openDeleteModal(trainee)"
                    class="p-2 rounded-lg transition-all bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Section -->
      <div v-if="traineeTotalPages > 1"
        class="flex items-center justify-between border-t border-zinc-200 dark:border-white/10 px-6 py-4 bg-zinc-50 dark:bg-white/5">
        <div class="flex flex-1 items-center justify-between">
          <div>
            <p class="text-sm text-zinc-700 dark:text-zinc-400">
              Showing page <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ traineePage }}</span> of <span
                class="font-bold text-zinc-900 dark:text-zinc-100">{{ traineeTotalPages }}</span>
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
              <!-- Previous Button -->
              <button @click="goToPage(traineePage - 1)" :disabled="traineePage === 1"
                class="relative inline-flex items-center rounded-l-lg px-3 py-2 text-zinc-500 ring-1 ring-inset ring-zinc-200 dark:ring-white/10 hover:bg-zinc-100 dark:hover:bg-white/10 focus:z-20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="sr-only">Previous</span>
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clip-rule="evenodd" />
                </svg>
              </button>

              <!-- Page Numbers -->
              <button v-for="p in pageNumbers" :key="p" @click="goToPage(p)" :class="[
                p === traineePage
                  ? 'relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 ring-1 ring-inset ring-zinc-200 dark:ring-white/10 hover:bg-zinc-100 dark:hover:bg-white/10 focus:z-20 outline-none transition-all'
              ]">
                {{ p }}
              </button>

              <!-- Next Button -->
              <button @click="goToPage(traineePage + 1)" :disabled="traineePage === traineeTotalPages"
                class="relative inline-flex items-center rounded-r-lg px-3 py-2 text-zinc-500 ring-1 ring-inset ring-zinc-200 dark:ring-white/10 hover:bg-zinc-100 dark:hover:bg-white/10 focus:z-20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="sr-only">Next</span>
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <BaseModal v-if="isDeleteModalOpen" title="Delete Trainee" @close="isDeleteModalOpen = false">
      <div class="p-6">
        <h3 class="text-lg font-bold text-zinc-900 dark:text-white mb-2">Are you sure?</h3>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Do you really want to delete <span class="font-semibold text-zinc-900 dark:text-zinc-200">{{
            traineeToDelete?.full_name }}</span>? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="isDeleteModalOpen = false"
            class="px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 rounded-lg transition-all">
            Cancel
          </button>
          <button @click="confirmDelete"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-sm shadow-red-500/20">
            Delete Trainee
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import debounce from "lodash.debounce";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import BaseModal from "../../../components/ui/BaseModal.vue";
import { useAlertStore } from "../../../store/alertStore.js";
import { useUserManageStore } from "../../../store/userManageStore.js";

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

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: .5;
  }
}
</style>
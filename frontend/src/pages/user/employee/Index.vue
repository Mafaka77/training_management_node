<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-6 mb-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1">
          <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Employee Management
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Total Employees Found: <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ employeesTotal || 0
            }}</span>
          </p>
        </div>
        <router-link to="/admin/employee/create"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Employee
        </router-link>
      </div>

      <div class="relative max-w-md">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input v-model="searchQuery" type="text" placeholder="Search by name, email, or department..." class="block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border transition-all
                   bg-white dark:bg-zinc-900/50
                   border-zinc-200 dark:border-white/10
                   text-zinc-900 dark:text-zinc-100
                   placeholder-zinc-400
                   focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
      </div>
    </div>

    <!-- Table Container -->
    <div
      class="overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-sm flex flex-col">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-zinc-50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/10">
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Employee
              </th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Designation / Dept</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Contact
              </th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">District
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Actions</th>
            </tr>
          </thead>

          <!-- Loading State Skeletons -->
          <tbody v-if="isLoading">
            <tr v-for="i in 5" :key="i" class="border-b border-zinc-100 dark:border-white/5 last:border-0">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="shrink-0 w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
                  <div class="space-y-2">
                    <div class="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse"></div>
                    <div class="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-2">
                  <div class="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse"></div>
                  <div class="h-3.5 w-36 bg-zinc-100 dark:bg-zinc-800/50 rounded animate-pulse"></div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-2">
                  <div class="h-3.5 w-40 bg-zinc-100 dark:bg-zinc-800/50 rounded animate-pulse"></div>
                  <div class="h-3.5 w-28 bg-zinc-100 dark:bg-zinc-800/50 rounded animate-pulse"></div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse"></div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <div class="w-9 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
                  <div class="w-9 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Empty State -->
          <tbody v-else-if="filteredTrainers.length === 0">
            <tr>
              <td colspan="5" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center justify-center">
                  <div class="p-4 rounded-full bg-zinc-100 dark:bg-white/10 mb-4 text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 class="text-zinc-900 dark:text-zinc-100 font-semibold text-lg">
                    {{ searchQuery ? 'No matches found' : 'No Employees Found' }}
                  </h3>
                  <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-1 text-center max-w-xs">
                    {{ searchQuery ? 'Try adjusting your search terms.' : 'Click the button above to add your first employee.' }}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Employees Data -->
          <tbody v-else class="divide-y divide-zinc-100 dark:divide-white/5">
            <tr v-for="trainer in filteredTrainers" :key="trainer._id"
              class="group hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
              <!-- Employee Info -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="shrink-0 w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ trainer.full_name }}</span>
                    <div class="flex flex-wrap gap-1 mt-0.5">
                      <span v-for="role in trainer.roles" :key="role._id"
                        class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        {{ role.name }}
                      </span>
                      <span v-if="!trainer.roles || trainer.roles.length === 0"
                        class="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        Employee
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Designation / Dept -->
              <td class="px-6 py-4">
                <div class="text-sm text-zinc-600 dark:text-zinc-300 font-medium">{{ trainer.designation || 'Staff' }}
                </div>
                <div class="text-xs text-zinc-500 dark:text-zinc-500">{{ trainer.department || 'General Department' }}
                </div>
              </td>

              <!-- Contact -->
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <span class="text-xs flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                    <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ trainer.email }}
                  </span>
                  <span class="text-xs flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                    <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {{ trainer.mobile || 'No contact' }}
                  </span>
                </div>
              </td>

              <!-- District -->
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  {{ trainer.district?.name || 'Unassigned' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link :to="{ name: 'employee.edit', params: { id: trainer._id } }"
                    class="p-2 rounded-lg transition-all bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-blue-600 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2.5 2.5 0 113.536 3.536L12 20.364H8v-4.364l9.293-9.293z" />
                    </svg>
                  </router-link>

                  <button @click="openDeleteModal(trainer)"
                    class="p-2 rounded-lg transition-all bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white">
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
      <div v-if="employeeTotalPages > 1"
        class="flex items-center justify-between border-t border-zinc-200 dark:border-white/10 px-6 py-4 bg-zinc-50 dark:bg-white/5">
        <div class="flex flex-1 items-center justify-between">
          <div>
            <p class="text-sm text-zinc-700 dark:text-zinc-400">
              Showing page <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ employeePage }}</span> of <span
                class="font-bold text-zinc-900 dark:text-zinc-100">{{ employeeTotalPages }}</span>
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
              <!-- Previous Button -->
              <button @click="goToPage(employeePage - 1)" :disabled="employeePage === 1"
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
                p === employeePage
                  ? 'relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 ring-1 ring-inset ring-zinc-200 dark:ring-white/10 hover:bg-zinc-100 dark:hover:bg-white/10 focus:z-20 outline-none transition-all'
              ]">
                {{ p }}
              </button>

              <!-- Next Button -->
              <button @click="goToPage(employeePage + 1)" :disabled="employeePage === employeeTotalPages"
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

    <BaseModal :show="isDeleteModalOpen" confirmVariant="danger" :confirmLoading="isDeleting"
      @close="isDeleteModalOpen = false" @confirm="confirmDelete">
      <template #icon>
        <div
          class="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center mb-4">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </template>
      <template #title>Delete Employee</template>
      <template #content>
        Are you sure you want to remove <span class="font-bold text-zinc-900 dark:text-zinc-100">{{
          trainerToDelete?.full_name }}</span>?
        This action cannot be undone.
      </template>
      <template #confirm-text>Delete Employee</template>
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

const { employees, isLoading, employeePage, employeeTotalPages, employeesTotal } = storeToRefs(store);

// State
const searchQuery = ref("");
const isDeleteModalOpen = ref(false);
const trainerToDelete = ref(null);
const isDeleting = ref(false);

// Pagination Logic
const pageNumbers = computed(() => {
  const range = [];
  for (let i = 1; i <= employeeTotalPages.value; i++) {
    range.push(i);
  }
  return range;
});

const goToPage = (p) => {
  if (p >= 1 && p <= employeeTotalPages.value) {
    store.fetchEmployees(p, searchQuery.value);
  }
};

// Search Logic
const doSearch = debounce((val) => {
  store.fetchEmployees(1, val);
}, 500);

watch(searchQuery, (newVal) => {
  doSearch(newVal);
});

// Filtering Logic
const filteredTrainers = computed(() => {
  return employees.value || [];
});

const openDeleteModal = (trainer) => {
  trainerToDelete.value = trainer;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!trainerToDelete.value) return;
  isDeleting.value = true;
  const response = await store.deleteEmployee(trainerToDelete.value._id);
  isDeleting.value = false;
  if (response.success) {
    alert.success(response.message || 'Employee deleted successfully');
    await store.fetchEmployees(employeePage.value, searchQuery.value);
    isDeleteModalOpen.value = false;
  } else {
    alert.error(response.message || 'Failed to delete employee');
  }
};

onMounted(() => {
  store.fetchEmployees();
});
</script>
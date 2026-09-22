<template>
  <div class="max-w-[90rem] mx-auto pb-10 space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Department Management
          </h2>
          <span
            class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 text-[10px] font-bold uppercase">
            {{ totalItems }} Records
          </span>
        </div>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">
          Manage administrative parent departments and organizational units.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <router-link to="/admin/master/department/create"
          class="group inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-95 cursor-pointer">
          <div
            class="flex items-center justify-center w-4 h-4 rounded-lg bg-white/20 group-hover:rotate-90 transition-transform duration-300">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span>New Department</span>
        </router-link>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="relative w-full sm:w-80 group">
        <svg
          class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="Search by name, code..."
          class="w-full pl-10 pr-9 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs" />
        <button v-if="searchQuery" @click="clearSearch"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-2 text-xs text-zinc-500">
        <span>Displaying page <strong class="text-zinc-900 dark:text-zinc-100">{{ currentPage }}</strong> of <strong
            class="text-zinc-900 dark:text-zinc-100">{{ totalPages }}</strong></span>
      </div>
    </div>

    <!-- Table Container -->
    <div
      class="relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-zinc-50/80 dark:bg-white/[0.02] border-b border-zinc-100 dark:border-white/5">
              <th
                class="w-16 px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                #
              </th>
              <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Department Name
              </th>
              <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Code
              </th>
              <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                ID / Reference
              </th>
              <th
                class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <!-- Skeleton Loader -->
          <tbody v-if="isDeptParentLoading" class="divide-y divide-zinc-100 dark:divide-white/5">
            <tr v-for="i in 5" :key="`skeleton-${i}`" class="animate-pulse">
              <td class="px-5 py-3.5">
                <div class="h-3 w-6 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              </td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
                  <div class="space-y-1.5 flex-1">
                    <div class="h-3.5 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <div class="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
              </td>
              <td class="px-5 py-3.5">
                <div class="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <div class="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                  <div class="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Empty State -->
          <tbody v-else-if="departmentParents.length === 0">
            <tr>
              <td colspan="5" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div
                    class="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3 border border-emerald-200/60 dark:border-emerald-500/20">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">No Departments Found</h3>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    {{ searchQuery ? `No departments matched your search query "${searchQuery}".`
                      : 'There are currently' + 'no registered departments in the system.' }}
                  </p>
                  <button v-if="searchQuery" @click="clearSearch"
                    class="mt-4 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer">
                    Clear Search Filter
                  </button>
                  <router-link v-else to="/admin/master/department/create"
                    class="mt-4 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-700/20 active:scale-95">
                    Add First Department
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Departments Data Rows -->
          <tbody v-else class="divide-y divide-zinc-100 dark:divide-white/5 text-xs">
            <tr v-for="(dept, index) in departmentParents" :key="dept._id"
              class="hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors">
              <!-- Index Column -->
              <td class="px-5 py-3.5 text-zinc-400 font-mono text-[11px]">
                {{ (currentPage - 1) * limit + index + 1 }}
              </td>

              <!-- Department Name Column -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div
                    class="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs uppercase border border-emerald-200/60 dark:border-emerald-500/20 shrink-0">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div class="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                    {{ dept.name }}
                  </div>
                </div>
              </td>

              <!-- Code Column -->
              <td class="px-5 py-3.5">
                <span v-if="dept.code"
                  class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 font-mono">
                  {{ dept.code }}
                </span>
                <span v-else class="text-[11px] text-zinc-400 italic">—</span>
              </td>

              <!-- ID Column -->
              <td class="px-5 py-3.5 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                {{ dept._id }}
              </td>

              <!-- Actions Column -->
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <router-link :to="{ name: 'master.department.edit', params: { id: dept._id } }"
                    class="p-2 text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all active:scale-95 bg-white dark:bg-zinc-800 rounded-lg shadow-xs border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    title="Edit Department">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </router-link>

                  <button @click="openDeleteModal(dept)"
                    class="p-2 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all active:scale-95 bg-white dark:bg-zinc-800 rounded-lg shadow-xs border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    title="Delete Department">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
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
      <div
        class="px-5 py-3.5 bg-zinc-50/50 dark:bg-white/[0.01] border-t border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span class="text-xs text-zinc-500 font-medium">
          Showing {{ departmentParents.length }} of {{ totalItems }} departments
        </span>

        <div v-if="totalPages > 1" class="flex items-center gap-1">
          <!-- Previous Button -->
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage <= 1 || isDeptParentLoading"
            class="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors text-zinc-500 cursor-pointer disabled:cursor-not-allowed">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Page indicator pills -->
          <button v-for="p in visiblePageNumbers" :key="p" @click="goToPage(p)" :class="[
            p === currentPage
              ? 'bg-emerald-700 text-white font-bold shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium'
          ]"
            class="min-w-[28px] h-7 px-2 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer">
            {{ p }}
          </button>

          <!-- Next Button -->
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages || isDeptParentLoading"
            class="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors text-zinc-500 cursor-pointer disabled:cursor-not-allowed">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <BaseModal :show="isDeleteModalOpen" :confirmLoading="isDeleting" confirmVariant="danger"
      @close="isDeleteModalOpen = false" @confirm="confirmDelete">
      <template #icon>
        <div
          class="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-3 border border-rose-200/60 dark:border-rose-500/20">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      </template>

      <template #title>Delete Department</template>

      <template #content>
        <p class="text-xs text-zinc-600 dark:text-zinc-400">
          Are you sure you want to permanently delete
          <strong class="text-zinc-900 dark:text-zinc-100">"{{ deptToDelete?.name }}"</strong>?
          This action cannot be undone.
        </p>
      </template>

      <template #confirm-text>Delete Permanently</template>
    </BaseModal>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import BaseModal from "../../../components/ui/BaseModal.vue";
import { useAlertStore } from "../../../store/alertStore.js";
import { useMasterStore } from "../../../store/masterStore.js";

const store = useMasterStore();
const alert = useAlertStore();

const { departmentParents, isDeptParentLoading, deptParentPagination } = storeToRefs(store);

const searchQuery = ref("");
const currentPage = ref(1);
const limit = ref(10);
const isDeleteModalOpen = ref(false);
const deptToDelete = ref(null);
const isDeleting = ref(false);

const totalItems = computed(() => {
  return deptParentPagination.value?.total || departmentParents.value.length || 0;
});

const totalPages = computed(() => {
  return deptParentPagination.value?.totalPages || 1;
});

const visiblePageNumbers = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  let start = Math.max(1, current - 2);
  let end = Math.min(total, start + 4);

  if (end - start < 4) {
    start = Math.max(1, end - 4);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const loadDepartments = async () => {
  await store.fetchDepartmentParents({
    page: currentPage.value,
    limit: limit.value,
    search: searchQuery.value.trim()
  });
};

let searchTimeout = null;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    loadDepartments();
  }, 300);
};

const clearSearch = () => {
  searchQuery.value = "";
  currentPage.value = 1;
  loadDepartments();
};

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  loadDepartments();
};

const openDeleteModal = (dept) => {
  deptToDelete.value = dept;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!deptToDelete.value) return;

  isDeleting.value = true;
  try {
    const res = await store.deleteDepartmentParent(deptToDelete.value._id);
    if (res.success) {
      alert.success(res.message || "Department deleted successfully");
      isDeleteModalOpen.value = false;
      deptToDelete.value = null;
      // If current page is now empty and not page 1, step back
      if (departmentParents.value.length === 1 && currentPage.value > 1) {
        currentPage.value -= 1;
      }
      await loadDepartments();
    } else {
      alert.error(res.message || "Failed to delete department");
    }
  } catch (error) {
    alert.error("Error deleting department: " + error.message);
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => {
  loadDepartments();
});
</script>

<template>
  <div class="max-w-[90rem] mx-auto pb-10 space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Employee Management
          </h2>
          <span
            class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 text-[10px] font-bold uppercase">
            {{ employeesTotal || 0 }} Records
          </span>
        </div>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">
          Manage administrative personnel, course directors, coordinators, and institutional staff.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <router-link to="/admin/employee/create"
          class="group inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-95 cursor-pointer">
          <div class="flex items-center justify-center w-4 h-4 rounded-lg bg-white/20 group-hover:rotate-90 transition-transform duration-300">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span>Add New Employee</span>
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
        <input v-model="searchQuery" type="text" placeholder="Search by name, email, department..."
          class="w-full pl-10 pr-9 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs" />
        <button v-if="searchQuery" @click="searchQuery = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-2 text-xs text-zinc-500">
        <span>Displaying page <strong class="text-zinc-900 dark:text-zinc-100">{{ employeePage }}</strong> of <strong class="text-zinc-900 dark:text-zinc-100">{{ employeeTotalPages }}</strong></span>
      </div>
    </div>

    <!-- Redesigned Table Container -->
    <div
      class="relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-zinc-50/80 dark:bg-white/[0.02] border-b border-zinc-100 dark:border-white/5">
              <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Employee
              </th>
              <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Designation & Department
              </th>
              <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Contact
              </th>
              <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                District
              </th>
              <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <!-- Skeleton Loader -->
          <tbody v-if="isLoading" class="divide-y divide-zinc-100 dark:divide-white/5">
            <tr v-for="i in 5" :key="`skeleton-${i}`" class="animate-pulse">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
                  <div class="space-y-1.5 flex-1">
                    <div class="h-3.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                    <div class="h-3 w-16 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <div class="space-y-1.5">
                  <div class="h-3.5 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                  <div class="h-3 w-36 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <div class="space-y-1.5">
                  <div class="h-3 w-36 bg-zinc-150 dark:bg-zinc-800/60 rounded"></div>
                  <div class="h-3 w-24 bg-zinc-150 dark:bg-zinc-800/60 rounded"></div>
                </div>
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
          <tbody v-else-if="filteredEmployees.length === 0">
            <tr>
              <td colspan="5" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div
                    class="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3 border border-emerald-200/60 dark:border-emerald-500/20">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">No Employees Found</h3>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    {{ searchQuery ? `No employee records matched your search query "${searchQuery}".` : 'There are currently no registered administrative employees in the system.' }}
                  </p>
                  <button v-if="searchQuery" @click="searchQuery = ''"
                    class="mt-4 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer">
                    Clear Search Filter
                  </button>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Employees Data Rows -->
          <tbody v-else class="divide-y divide-zinc-100 dark:divide-white/5 text-xs">
            <tr v-for="emp in filteredEmployees" :key="emp._id"
              class="hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors">
              
              <!-- Employee Identity Column -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div
                    class="h-9 w-9 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs uppercase border border-emerald-200/60 dark:border-emerald-500/20 shrink-0">
                    {{ getInitials(emp.full_name) }}
                  </div>
                  <div class="space-y-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="font-bold text-zinc-900 dark:text-zinc-100 text-xs">{{ emp.full_name }}</span>
                    </div>
                    <div class="flex flex-wrap gap-1">
                      <span v-for="role in emp.roles" :key="role._id"
                        class="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                        {{ role.name }}
                      </span>
                      <span v-if="!emp.roles || emp.roles.length === 0"
                        class="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        Staff
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Designation & Department Column -->
              <td class="px-5 py-3.5">
                <div class="space-y-1">
                  <div v-if="emp.designation">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/20 text-[10px] font-semibold uppercase tracking-wide">
                      {{ emp.designation }}
                    </span>
                  </div>
                  <span v-else class="text-zinc-400 italic text-[11px]">—</span>

                  <div v-if="emp.department" class="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                    <svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{{ emp.department }}</span>
                  </div>
                </div>
              </td>

              <!-- Contact Column -->
              <td class="px-5 py-3.5">
                <div class="space-y-1">
                  <div class="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">
                    <svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{{ emp.email || '—' }}</span>
                  </div>
                  <div class="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{{ emp.mobile || '—' }}</span>
                  </div>
                </div>
              </td>

              <!-- District Column -->
              <td class="px-5 py-3.5">
                <div v-if="emp.district?.name || emp.district" class="flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                  <svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ emp.district?.name || emp.district }}</span>
                </div>
                <span v-else class="text-[11px] text-zinc-400 italic">Unassigned</span>
              </td>

              <!-- Actions Column -->
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <router-link :to="{ name: 'employee.edit', params: { id: emp._id } }"
                    class="p-2 text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all active:scale-95 bg-white dark:bg-zinc-800 rounded-lg shadow-xs border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    title="Edit Employee Profile">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </router-link>

                  <button @click="openDeleteModal(emp)"
                    class="p-2 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all active:scale-95 bg-white dark:bg-zinc-800 rounded-lg shadow-xs border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    title="Delete Employee">
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
          Showing {{ filteredEmployees.length }} of {{ employeesTotal || 0 }} employees
        </span>

        <div v-if="employeeTotalPages > 1" class="flex items-center gap-1">
          <!-- Previous Button -->
          <button @click="goToPage(employeePage - 1)" :disabled="employeePage <= 1 || isLoading"
            class="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors text-zinc-500 cursor-pointer disabled:cursor-not-allowed">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Page indicator pills -->
          <button v-for="p in visiblePageNumbers" :key="p" @click="goToPage(p)"
            :class="[
              p === employeePage
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium'
            ]"
            class="min-w-[28px] h-7 px-2 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer">
            {{ p }}
          </button>

          <!-- Next Button -->
          <button @click="goToPage(employeePage + 1)" :disabled="employeePage >= employeeTotalPages || isLoading"
            class="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors text-zinc-500 cursor-pointer disabled:cursor-not-allowed">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :show="isDeleteModalOpen"
      confirmVariant="danger"
      :confirmLoading="isDeleting"
      @close="isDeleteModalOpen = false"
      @confirm="confirmDelete"
    >
      <template #icon>
        <div class="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-3 border border-rose-200/60 dark:border-rose-500/20">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      </template>
      <template #title>Delete Employee</template>
      <template #content>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Are you sure you want to permanently delete <strong class="text-zinc-900 dark:text-zinc-100 font-bold">{{ employeeToDelete?.full_name }}</strong>? This action will remove their system access credentials.
        </p>
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

// Local State
const searchQuery = ref("");
const isDeleteModalOpen = ref(false);
const employeeToDelete = ref(null);
const isDeleting = ref(false);

// Helper for Initials Badge
const getInitials = (name) => {
  if (!name) return 'EM';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

// Pagination Logic (smart page numbers)
const visiblePageNumbers = computed(() => {
  const total = employeeTotalPages.value || 1;
  const current = employeePage.value || 1;
  const delta = 2;
  const range = [];

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }

  if (current - delta > 2) {
    range.unshift('...');
  }
  if (current + delta < total - 1) {
    range.push('...');
  }

  range.unshift(1);
  if (total > 1) {
    range.push(total);
  }

  return [...new Set(range.filter(p => typeof p === 'number'))];
});

const goToPage = (p) => {
  if (p >= 1 && p <= employeeTotalPages.value) {
    store.fetchEmployees(p, searchQuery.value);
  }
};

// Debounced search
const doSearch = debounce((val) => {
  store.fetchEmployees(1, val);
}, 400);

watch(searchQuery, (newVal) => {
  doSearch(newVal);
});

// Filtering Logic
const filteredEmployees = computed(() => {
  return employees.value || [];
});

// Delete Actions
const openDeleteModal = (emp) => {
  employeeToDelete.value = emp;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!employeeToDelete.value) return;
  isDeleting.value = true;
  try {
    const response = await store.deleteEmployee(employeeToDelete.value._id);
    if (response.success) {
      alert.success(response.message || 'Employee deleted successfully');
      await store.fetchEmployees(employeePage.value, searchQuery.value);
      isDeleteModalOpen.value = false;
    } else {
      alert.error(response.message || 'Failed to delete employee');
    }
  } catch (error) {
    alert.error('Failed to delete employee');
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => {
  store.fetchEmployees();
});
</script>
<template>
  <div class="max-w-[90rem] mx-auto pb-10 space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Role Management
          </h2>
          <span
            class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 text-[10px] font-bold uppercase">
            {{ pagination.total }} Roles
          </span>
        </div>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">
          Configure system user roles, view assigned accounts, and manage permissions.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <router-link to="/admin/role/create"
          class="group inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-emerald-700/20 active:scale-95 cursor-pointer">
          <div
            class="flex items-center justify-center w-4 h-4 rounded-lg bg-white/20 group-hover:rotate-90 transition-transform duration-300">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span>New Role</span>
        </router-link>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/60 dark:border-emerald-500/20">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total Defined Roles</p>
          <h4 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">{{ pagination.total }}</h4>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200/60 dark:border-blue-500/20">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Assigned Accounts</p>
          <h4 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">{{ totalAssignedUsers }}</h4>
        </div>
      </div>

      <div class="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200/60 dark:border-purple-500/20">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <p class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Core Access Levels</p>
          <h4 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">RBAC Active</h4>
        </div>
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
        <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="Search roles..."
          class="w-full pl-10 pr-9 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs" />
        <button v-if="searchQuery" @click="clearSearch"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-2 text-xs text-zinc-500">
        <span>Displaying page <strong class="text-zinc-900 dark:text-zinc-100">{{ pagination.page }}</strong> of <strong
            class="text-zinc-900 dark:text-zinc-100">{{ pagination.totalPages }}</strong></span>
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
                Role Name
              </th>
              <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Description
              </th>
              <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-center">
                Assigned Users
              </th>
              <th
                class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <!-- Skeleton Loader -->
          <tbody v-if="isLoading" class="divide-y divide-zinc-100 dark:divide-white/5">
            <tr v-for="i in 5" :key="`skeleton-${i}`" class="animate-pulse">
              <td class="px-5 py-3.5">
                <div class="h-3 w-6 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              </td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
                  <div class="space-y-1.5 flex-1">
                    <div class="h-3.5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <div class="h-3.5 w-56 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
              </td>
              <td class="px-5 py-3.5 text-center">
                <div class="h-5 w-16 mx-auto bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <div class="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                  <div class="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                  <div class="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Empty State -->
          <tbody v-else-if="roles.length === 0">
            <tr>
              <td colspan="5" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div
                    class="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3 border border-emerald-200/60 dark:border-emerald-500/20">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">No Roles Found</h3>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    {{ searchQuery ? `No roles matched your search query "${searchQuery}".`
                      : 'There are currently no registered roles in the system.' }}
                  </p>
                  <button v-if="searchQuery" @click="clearSearch"
                    class="mt-4 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer">
                    Clear Search Filter
                  </button>
                  <router-link v-else to="/admin/role/create"
                    class="mt-4 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-700/20 active:scale-95">
                    Add First Role
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Roles Data Rows -->
          <tbody v-else class="divide-y divide-zinc-100 dark:divide-white/5 text-xs">
            <tr v-for="(role, index) in roles" :key="role._id"
              class="hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors">
              <!-- Index Column -->
              <td class="px-5 py-3.5 text-zinc-400 font-mono text-[11px]">
                {{ (pagination.page - 1) * pagination.limit + index + 1 }}
              </td>

              <!-- Role Name Column -->
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div
                    class="h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs uppercase shrink-0"
                    :class="getRoleBadgeClass(role.name)">
                    {{ role.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-bold text-zinc-900 dark:text-zinc-100 text-xs flex items-center gap-2">
                      <span>{{ role.name }}</span>
                      <span v-if="isSystemRole(role.name)"
                        class="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                        System
                      </span>
                    </div>
                    <span class="text-[10px] text-zinc-400 font-mono">ID: {{ role._id }}</span>
                  </div>
                </div>
              </td>

              <!-- Description Column -->
              <td class="px-5 py-3.5 text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                {{ role.description || '—' }}
              </td>

              <!-- Assigned Users Column -->
              <td class="px-5 py-3.5 text-center">
                <router-link :to="{ name: 'role.view', params: { id: role._id } }"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105"
                  :class="(role.userCount || 0) > 0 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20' 
                    : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50'"
                  title="View Assigned Users">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{{ role.userCount || 0 }} Users</span>
                </router-link>
              </td>

              <!-- Actions Column -->
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- View Details / Users -->
                  <router-link :to="{ name: 'role.view', params: { id: role._id } }"
                    class="p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all active:scale-95 bg-white dark:bg-zinc-800 rounded-lg shadow-xs border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    title="View Role & Users">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link>

                  <!-- Edit Role -->
                  <router-link :to="{ name: 'role.edit', params: { id: role._id } }"
                    class="p-2 text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all active:scale-95 bg-white dark:bg-zinc-800 rounded-lg shadow-xs border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    title="Edit Role">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </router-link>

                  <!-- Delete Role -->
                  <button @click="openDeleteModal(role)"
                    :disabled="isSystemRole(role.name)"
                    :class="isSystemRole(role.name) ? 'opacity-30 cursor-not-allowed' : 'hover:text-rose-600 dark:hover:text-rose-400 active:scale-95 cursor-pointer'"
                    class="p-2 text-zinc-400 transition-all bg-white dark:bg-zinc-800 rounded-lg shadow-xs border border-zinc-200 dark:border-zinc-700"
                    :title="isSystemRole(role.name) ? 'System role cannot be deleted' : 'Delete Role'">
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
          Showing {{ roles.length }} of {{ pagination.total }} roles
        </span>

        <div v-if="pagination.totalPages > 1" class="flex items-center gap-1">
          <!-- Previous Button -->
          <button @click="goToPage(pagination.page - 1)" :disabled="pagination.page <= 1 || isLoading"
            class="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors text-zinc-500 cursor-pointer disabled:cursor-not-allowed">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Page indicator pills -->
          <button v-for="p in visiblePageNumbers" :key="p" @click="goToPage(p)" :class="[
            p === pagination.page
              ? 'bg-emerald-700 text-white font-bold shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium'
          ]"
            class="min-w-[28px] h-7 px-2 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer">
            {{ p }}
          </button>

          <!-- Next Button -->
          <button @click="goToPage(pagination.page + 1)" :disabled="pagination.page >= pagination.totalPages || isLoading"
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
        <div class="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      </template>
      <template #title>
        Delete Role
      </template>
      <template #content>
        <p class="text-sm">
          Are you sure you want to delete the role <strong class="text-zinc-900 dark:text-zinc-100">"{{ selectedRole?.name }}"</strong>?
        </p>
        <p v-if="(selectedRole?.userCount || 0) > 0" class="mt-2 text-xs text-rose-600 dark:text-rose-400 font-semibold">
          Warning: There are {{ selectedRole?.userCount }} users assigned to this role. You must reassign those users before deleting.
        </p>
        <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          This action cannot be undone.
        </p>
      </template>
      <template #confirm-text>
        Delete Role
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import debounce from 'lodash.debounce';
import { useRoleStore } from '../../../store/roleStore.js';
import { useAlertStore } from '../../../store/alertStore.js';
import BaseModal from '../../../components/ui/BaseModal.vue';

const roleStore = useRoleStore();
const alert = useAlertStore();

const { roles, isLoading, pagination } = storeToRefs(roleStore);

const searchQuery = ref('');
const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);
const selectedRole = ref(null);

const totalAssignedUsers = computed(() => {
  return roles.value.reduce((sum, role) => sum + (role.userCount || 0), 0);
});

const isSystemRole = (name) => {
  if (!name) return false;
  return ['Admin'].includes(name.trim());
};

const getRoleBadgeClass = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('admin')) {
    return 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200/60 dark:border-purple-500/20';
  }
  if (n.includes('trainer') || n.includes('course director')) {
    return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20';
  }
  if (n.includes('trainee')) {
    return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20';
  }
  if (n.includes('director')) {
    return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20';
  }
  if (n.includes('employee') || n.includes('faculty')) {
    return 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-200/60 dark:border-sky-500/20';
  }
  return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700';
};

const fetchList = (page = 1) => {
  roleStore.fetchRoles(page, searchQuery.value);
};

const handleSearch = debounce(() => {
  fetchList(1);
}, 300);

const clearSearch = () => {
  searchQuery.value = '';
  fetchList(1);
};

const goToPage = (p) => {
  if (p < 1 || p > pagination.value.totalPages) return;
  fetchList(p);
};

const visiblePageNumbers = computed(() => {
  const current = pagination.value.page;
  const total = pagination.value.totalPages;
  const delta = 2;
  const pages = [];
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.push(i);
  }
  return pages;
});

const openDeleteModal = (role) => {
  selectedRole.value = role;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!selectedRole.value) return;

  isDeleting.value = true;
  try {
    const res = await roleStore.deleteRole(selectedRole.value._id);
    if (res.success) {
      alert.success(res.message || 'Role deleted successfully');
      isDeleteModalOpen.value = false;
      fetchList(pagination.value.page);
    } else {
      alert.error(res.message || 'Failed to delete role');
    }
  } catch (error) {
    alert.error('Failed to delete role: ' + error.message);
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => {
  fetchList(1);
});
</script>

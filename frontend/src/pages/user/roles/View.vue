<template>
  <div class="max-w-[90rem] mx-auto pb-12 space-y-6">
    <Breadcrumbs :items="breadcrumbs" />

    <!-- Role Header & Overview Card -->
    <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 shadow-xs">
      <div v-if="isRoleLoading" class="animate-pulse space-y-4">
        <div class="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
        <div class="h-4 w-96 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
      </div>

      <div v-else class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-start gap-4">
          <div
            class="h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-xl uppercase shrink-0"
            :class="getRoleBadgeClass(currentRole?.name)">
            {{ currentRole?.name?.charAt(0) || 'R' }}
          </div>
          <div class="space-y-1">
            <div class="flex items-center gap-3">
              <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {{ currentRole?.name }}
              </h2>
              <span
                class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 text-[10px] font-bold uppercase">
                {{ usersPagination.total }} Assigned Users
              </span>
            </div>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {{ currentRole?.description || 'No specific description provided for this role.' }}
            </p>
            <div class="flex items-center gap-4 text-[11px] text-zinc-400 pt-1">
              <span>ID: <code class="font-mono">{{ currentRole?._id }}</code></span>
              <span v-if="currentRole?.createdAt">• Created {{ formatDate(currentRole.createdAt) }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <router-link :to="{ name: 'role.edit', params: { id: currentRole?._id } }"
            class="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Edit Role</span>
          </router-link>

          <router-link to="/admin/role"
            class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-semibold rounded-xl transition-all cursor-pointer">
            <span>Back to Roles</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Assigned Users Section -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Assigned Users
          </h3>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">
            All registered user accounts currently holding the <strong class="text-zinc-700 dark:text-zinc-300">{{ currentRole?.name }}</strong> role.
          </p>
        </div>

        <!-- Search input for assigned users -->
        <div class="relative w-full sm:w-72 group">
          <svg
            class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="Search assigned users..."
            class="w-full pl-10 pr-9 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs" />
          <button v-if="searchQuery" @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Users Table -->
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
                  User
                </th>
                <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Contact
                </th>
                <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Designation / Dept
                </th>
                <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  District
                </th>
              </tr>
            </thead>

            <!-- Skeleton Loader -->
            <tbody v-if="isUsersLoading" class="divide-y divide-zinc-100 dark:divide-white/5">
              <tr v-for="i in 5" :key="`skeleton-${i}`" class="animate-pulse">
                <td class="px-5 py-3.5">
                  <div class="h-3 w-6 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                </td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <div class="h-9 w-9 rounded-xl bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
                    <div class="space-y-1 flex-1">
                      <div class="h-3.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                      <div class="h-2.5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3.5">
                  <div class="space-y-1">
                    <div class="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    <div class="h-2.5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                  </div>
                </td>
                <td class="px-5 py-3.5">
                  <div class="h-3 w-36 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                </td>
                <td class="px-5 py-3.5">
                  <div class="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                </td>
              </tr>
            </tbody>

            <!-- Empty State -->
            <tbody v-else-if="roleUsers.length === 0">
              <tr>
                <td colspan="5" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div
                      class="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mb-3">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">No Assigned Users</h4>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      {{ searchQuery ? `No users match "${searchQuery}".` : 'There are currently no users assigned to this role.' }}
                    </p>
                    <button v-if="searchQuery" @click="clearSearch"
                      class="mt-3 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer">
                      Clear Search
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>

            <!-- Users Data Rows -->
            <tbody v-else class="divide-y divide-zinc-100 dark:divide-white/5 text-xs">
              <tr v-for="(user, index) in roleUsers" :key="user._id"
                class="hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors">
                <!-- Index -->
                <td class="px-5 py-3.5 text-zinc-400 font-mono text-[11px]">
                  {{ (usersPagination.page - 1) * usersPagination.limit + index + 1 }}
                </td>

                <!-- User Name / Profile -->
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
                      {{ (user.full_name || user.email || 'U').charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                        {{ user.full_name || 'Unnamed User' }}
                      </div>
                      <div class="text-[10px] text-zinc-400 font-mono">
                        {{ user._id }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Contact -->
                <td class="px-5 py-3.5">
                  <div class="space-y-0.5">
                    <p class="text-zinc-800 dark:text-zinc-200 font-medium">{{ user.email || '—' }}</p>
                    <p class="text-[11px] text-zinc-400 font-mono">{{ user.mobile || '—' }}</p>
                  </div>
                </td>

                <!-- Designation / Dept -->
                <td class="px-5 py-3.5">
                  <div class="space-y-0.5">
                    <p class="text-zinc-800 dark:text-zinc-200 font-medium">{{ user.designation || '—' }}</p>
                    <p class="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {{ user.departmentParent?.name || user.department || '—' }}
                    </p>
                  </div>
                </td>

                <!-- District -->
                <td class="px-5 py-3.5 text-zinc-600 dark:text-zinc-400">
                  <span v-if="user.district?.name"
                    class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
                    {{ user.district.name }}
                  </span>
                  <span v-else class="text-zinc-400 italic">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Section -->
        <div v-if="usersPagination.totalPages > 1"
          class="px-5 py-3.5 bg-zinc-50/50 dark:bg-white/[0.01] border-t border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span class="text-xs text-zinc-500 font-medium">
            Showing {{ roleUsers.length }} of {{ usersPagination.total }} assigned users
          </span>

          <div class="flex items-center gap-1">
            <button @click="goToPage(usersPagination.page - 1)" :disabled="usersPagination.page <= 1 || isUsersLoading"
              class="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors text-zinc-500 cursor-pointer disabled:cursor-not-allowed">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button v-for="p in visiblePageNumbers" :key="p" @click="goToPage(p)" :class="[
              p === usersPagination.page
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium'
            ]"
              class="min-w-[28px] h-7 px-2 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer">
              {{ p }}
            </button>

            <button @click="goToPage(usersPagination.page + 1)" :disabled="usersPagination.page >= usersPagination.totalPages || isUsersLoading"
              class="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors text-zinc-500 cursor-pointer disabled:cursor-not-allowed">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import debounce from 'lodash.debounce';
import Breadcrumbs from '../../../components/ui/Breadcrumbs.vue';
import { useRoleStore } from '../../../store/roleStore.js';

const route = useRoute();
const roleStore = useRoleStore();

const { currentRole, roleUsers, isUsersLoading, usersPagination } = storeToRefs(roleStore);
const isRoleLoading = ref(true);
const searchQuery = ref('');

const breadcrumbs = computed(() => [
  { label: 'Role Management', to: '/admin/role' },
  { label: currentRole.value?.name || 'View Role' }
]);

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

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const fetchUsers = (page = 1) => {
  const roleId = route.params.id;
  roleStore.fetchRoleUsers(roleId, page, searchQuery.value);
};

const handleSearch = debounce(() => {
  fetchUsers(1);
}, 300);

const clearSearch = () => {
  searchQuery.value = '';
  fetchUsers(1);
};

const goToPage = (p) => {
  if (p < 1 || p > usersPagination.value.totalPages) return;
  fetchUsers(p);
};

const visiblePageNumbers = computed(() => {
  const current = usersPagination.value.page;
  const total = usersPagination.value.totalPages;
  const delta = 2;
  const pages = [];
  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.push(i);
  }
  return pages;
});

onMounted(async () => {
  const roleId = route.params.id;
  isRoleLoading.value = true;
  await roleStore.fetchRole(roleId);
  isRoleLoading.value = false;
  fetchUsers(1);
});
</script>

<template>
  <div class="max-w-[90rem] mx-auto pb-10">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h2 class="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            Enrollment Requests
          </h2>
          <span class="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase">
            {{ pagination.total }} Records
          </span>
        </div>
        <p class="text-sm text-zinc-500">Manage and review trainee applications for this program.</p>
      </div>

      <button v-if="isFoundation" @click="openAddEnrollment" class="group relative inline-flex items-center gap-2.5 px-5 py-2.5 
               bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 
               text-sm font-bold rounded-xl transition-all duration-300 
               hover:ring-4 hover:ring-blue-500/10 active:scale-95 shadow-xl shadow-black/10">
        <div
          class="flex items-center justify-center w-5 h-5 rounded-lg bg-white/20 dark:bg-black/10 group-hover:rotate-90 transition-transform duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <span>New Enrollment</span>
      </button>
    </div>

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div class="flex flex-wrap items-center gap-3">
        <div
          class="flex items-center bg-zinc-100 dark:bg-white/5 p-1 rounded-xl border border-zinc-200 dark:border-white/10">
          <button v-for="status in ['All', 'Pending', 'Approved', 'Rejected', 'Waitlisted']" :key="status"
            @click="handleFilterChange(status)" :class="[
              activeFilter === status
                ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            ]" class="px-4 py-1.5 text-xs font-bold rounded-lg transition-all">
            {{ status }}
          </button>
        </div>

        <div class="relative group">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="Search trainee..."
            class="pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-64" />
        </div>
      </div>
    </div>

    <div
      class="relative bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm ">

      <div v-if="isEnrollmentLoading"
        class="absolute inset-0 z-20 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-300">
        <div class="flex flex-col items-center gap-3">
          <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-xs font-bold text-zinc-500 animate-pulse uppercase tracking-widest">Loading Data</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-zinc-50 dark:bg-white/[0.02] border-b border-zinc-200 dark:border-white/10">
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Trainee</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Training Program</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Status
              </th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 dark:divide-white/5" :class="{ 'opacity-25': isEnrollmentLoading }">
            <tr v-if="enrollments.length === 0 && !isEnrollmentLoading">
              <td colspan="4" class="px-6 py-20 text-center">
                <p class="text-sm text-zinc-500 font-medium">No enrollment requests found.</p>
              </td>
            </tr>

            <tr v-for="item in enrollments" :key="item._id"
              class="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center font-black text-xs uppercase">
                    {{ item.user?.full_name?.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-zinc-900 dark:text-zinc-100">{{ item.user?.full_name }}</p>
                    <p class="text-[11px] text-zinc-500">{{ item.user?.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                {{ item.training_program?.t_name }}
              </td>
              <td class="px-6 py-4 text-center">
                <span :class="getStatusClass(item.status)"
                  class="px-3 py-1 rounded-full text-[10px] font-black uppercase border">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link
                    :to="{ name: detailRouteName, params: { id: item._id, programId: item.training_program._id } }"
                    class="p-2 hover:text-blue-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link>
                  <button v-if="item.status === 'Pending'" @click="updateStatus(item._id, 'Approved')"
                    class="p-2 text-zinc-400 hover:text-emerald-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="px-6 py-4 bg-zinc-50 dark:bg-white/[0.02] border-t border-zinc-200 dark:border-white/10 flex items-center justify-between">
        <span class="text-xs text-zinc-500 font-medium">
          Showing {{ enrollments.length }} of {{ pagination.total }} results
        </span>

        <div class="flex items-center gap-1">
          <button @click="changePage(pagination.page - 1)" :disabled="pagination.page <= 1 || isEnrollmentLoading"
            class="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/5 disabled:opacity-30 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-xs font-bold px-3 text-zinc-700 dark:text-zinc-300">
            Page {{ pagination.page }} of {{ pagination.totalPages }}
          </span>
          <button @click="changePage(pagination.page + 1)"
            :disabled="pagination.page >= pagination.totalPages || isEnrollmentLoading"
            class="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/5 disabled:opacity-30 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showSearchModal" class="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
        <div class="fixed inset-0 bg-zinc-950/40 backdrop-blur-md" @click="showSearchModal = false"></div>

        <div
          class="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">

          <div class="p-6 border-b dark:border-white/5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-black dark:text-white uppercase tracking-tight">Enroll Trainee</h3>
              <button @click="showSearchModal = false" class="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>

            <div class="relative group">
              <svg
                class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input v-model="userSearchQuery" type="text" placeholder="Search by name or mobile..."
                class="w-full pl-12 pr-4 py-4 bg-zinc-100 dark:bg-white/5 border-none rounded-2xl text-base focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                autofocus />
            </div>
          </div>

          <div class="max-h-[450px] overflow-y-auto p-4 space-y-2 custom-scrollbar">

            <div v-if="isLoading" class="py-10 flex flex-col items-center gap-2">
              <div class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Searching Database</span>
            </div>

            <template v-else-if="foundationUsers.length > 0">
              <button v-for="user in foundationUsers" :key="user._id" @click="selectUser(user)"
                class="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all group text-left">
                <div
                  class="h-12 w-12 rounded-full bg-blue-600/10 text-blue-600 group-hover:bg-white/20 group-hover:text-white flex items-center justify-center font-black text-sm uppercase">
                  {{ user.full_name?.charAt(0) }}
                </div>
                <div class="flex-1">
                  <p class="text-sm font-black">{{ user.full_name }}</p>
                  <p class="text-xs opacity-60">{{ user.email }}</p>
                  <p class="text-xs opacity-60">{{ user.mobile }}</p>
                  <p class="text-xs opacity-60">{{ user.department }}</p>
                </div>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </button>
            </template>

            <div v-else class="py-20 text-center">
              <div class="inline-flex p-4 rounded-full bg-zinc-100 dark:bg-white/5 mb-4">
                <svg class="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p class="text-sm font-bold text-zinc-500 uppercase tracking-tighter">
                {{ userSearchQuery.length < 2 ? 'Start typing to find users' : 'No users match your search' }} </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useAlertStore } from '../../store/alertStore';
import { useAuthStore } from '../../store/authStore';
import { useEnrollmentStore } from '../../store/enrollmentStore';

const authStore = useAuthStore();
const store = useEnrollmentStore();
const alert = useAlertStore();
const showSearchModal = ref(false);
const userSearchQuery = ref('');
let debounceTimer = null;

const { enrollments, pagination, isFoundation, isEnrollmentLoading, foundationUsers } = storeToRefs(store);

const activeFilter = ref('All');
const searchQuery = ref('');
let searchTimer = null;

const props = defineProps({
  programId: { type: String, required: true }
});

const fetchData = (page = 1) => {
  store.fetchEnrollmentsByProgram(props.programId, {
    page,
    status: activeFilter.value === 'All' ? '' : activeFilter.value,
    search: searchQuery.value
  });
};

const openAddEnrollment = () => {
  console.log("Adding enrollment for program:", props.programId);
  showSearchModal.value = true;
  userSearchQuery.value = '';
  store.foundationUsers = [];

};
// Handle searching through the store
watch(userSearchQuery, (newQuery) => {
  clearTimeout(debounceTimer);
  if (newQuery.length < 2) {
    store.foundationUsers = [];
    return;
  }

  debounceTimer = setTimeout(() => {
    store.searchFoundationUsers(newQuery);
  }, 400); // 400ms debounce to save server resources
});
const handleFilterChange = (status) => {
  activeFilter.value = status;
  fetchData(1);
};

const handleSearch = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    fetchData(1);
  }, 500);
};

const changePage = (newPage) => {
  fetchData(newPage);
};
const selectUser = async (user) => {
  console.log("Selected user:", user._id);
  const res = await store.enrollInTraining(props.programId, user._id);
  if (res.success) {
    alert.success(res.message);
    showSearchModal.value = false;
    userSearchQuery.value = '';
    store.foundationUsers = [];
    fetchData(pagination.value.page);
  } else {
    alert.error(res.message);
  }

}
const getStatusClass = (status) => {
  const map = {
    'Approved': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'Pending': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Rejected': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    'Waitlisted': 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  };
  return map[status] || 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
};

const updateStatus = async (id, status) => {
  const res = await store.updateEnrollmentStatus(id, status);
  if (res.success) {
    alert.success(res.message);
    fetchData(pagination.value.page);
  } else {
    alert.error(res.message);
  }
};

const detailRouteName = computed(() => {
  const roles = Array.isArray(authStore.roles) ? authStore.roles : [authStore.roles];
  if (roles.includes('Admin') || roles.includes('Director')) {
    return 'admin.enrollment.detail';
  }
  return 'trainer.dashboard';
});

onMounted(() => fetchData());
</script>
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs transition-opacity" @click="emit('close')"></div>

        <!-- Modal Dialog Card -->
        <div
          class="relative w-full max-w-5xl h-full max-h-[85vh] flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-white/10 overflow-hidden transform transition-all">

          <!-- Header -->
          <div
            class="px-6 py-4 border-b border-zinc-200/60 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
            <div>
              <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">New Trainee Enrollment</h3>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Search eligible trainees and register them to this training program.</p>
            </div>
            <button @click="emit('close')"
              class="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Toolbar Search & Filters -->
          <div
            class="px-6 py-3.5 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row gap-4 shrink-0">
            <div class="relative flex-1 max-w-md">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input v-model="userSearchQuery" type="text" placeholder="Search by name, department, or mobile..."
                class="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-xs rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-zinc-900 dark:text-zinc-100 transition-all"
                autofocus />
            </div>

            <div class="sm:w-60 ml-auto">
              <select v-model="foundationSortBy"
                class="w-full py-2 px-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-xs rounded-xl text-xs text-zinc-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer">
                <option value="mandatoryCourseDueDate_asc">Sort: Due Date (Urgent)</option>
                <option value="mandatoryCourseDueDate_desc">Sort: Due Date (Latest)</option>
                <option value="full_name_asc">Sort: Name (A-Z)</option>
                <option value="department_asc">Sort: Department</option>
              </select>
            </div>
          </div>

          <!-- Trainees Data Table -->
          <div class="flex-1 overflow-y-auto custom-scrollbar bg-zinc-50/30 dark:bg-zinc-900">
            <div v-if="isLoading" class="py-20 flex flex-col items-center justify-center gap-2">
              <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Querying Trainees Database...</span>
            </div>

            <table v-else-if="foundationUsers && foundationUsers.length > 0"
              class="w-full text-left border-collapse whitespace-nowrap">
              <thead
                class="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-white/5">
                <tr>
                  <th class="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Trainee</th>
                  <th class="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Department</th>
                  <th class="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Mandatory Due</th>
                  <th class="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-center">History</th>
                  <th class="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-100 dark:divide-white/5 text-xs">
                <tr v-for="user in foundationUsers" :key="user._id"
                  class="hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors">
                  <td class="px-5 py-3.5">
                    <div class="flex items-center gap-3">
                      <div
                        class="h-8 w-8 shrink-0 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs uppercase border border-emerald-200/60 dark:border-emerald-500/20">
                        {{ user.full_name?.charAt(0) }}
                      </div>
                      <div>
                        <p class="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-none">{{ user.full_name }}</p>
                        <p class="text-[11px] text-zinc-500 mt-1">{{ user.mobile || user.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-3.5">
                    <p class="text-xs text-zinc-600 dark:text-zinc-400 max-w-[220px] truncate" :title="user.department">
                      {{ user.department || 'N/A' }}
                    </p>
                  </td>
                  <td class="px-5 py-3.5">
                    <div v-if="user.mandatoryCourseDueDate" class="inline-flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full"
                        :class="isOverdue(user.mandatoryCourseDueDate) ? 'bg-rose-500' : 'bg-emerald-500'"></div>
                      <span class="text-xs font-medium"
                        :class="isOverdue(user.mandatoryCourseDueDate) ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-700 dark:text-zinc-300'">
                        {{ formatDueDate(user.mandatoryCourseDueDate) }}
                      </span>
                    </div>
                    <span v-else class="text-xs text-zinc-400 italic">Not Assigned</span>
                  </td>
                  <td class="px-5 py-3.5 text-center">
                    <button @click="viewHistory(user)"
                      class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-zinc-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-zinc-400 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 rounded-lg transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/20 cursor-pointer">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 11-18 0 0118 0z" />
                      </svg>
                      Logs
                    </button>
                  </td>
                  <td class="px-5 py-3.5 text-right">
                    <button @click="selectUser(user)"
                      class="inline-flex items-center gap-1 px-3.5 py-1.5 bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl text-xs font-semibold transition-all shadow-md shadow-emerald-700/20 active:scale-95 cursor-pointer">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Enroll
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="py-24 flex flex-col items-center justify-center text-center">
              <svg class="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">No eligible trainees found</h4>
              <p class="text-xs text-zinc-500 mt-1 max-w-xs">Adjust your search parameters or select a different sort criteria.</p>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="foundationPagination && foundationPagination.totalPages > 1"
            class="px-5 py-3 border-t border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900 flex items-center justify-between shrink-0">
            <span class="text-xs text-zinc-500">
              Page <span class="font-bold text-zinc-700 dark:text-zinc-300">{{ foundationPagination.currentPage }}</span> of {{ foundationPagination.totalPages }}
            </span>
            <div class="flex items-center gap-2">
              <button @click="changeFoundationPage(foundationPagination.currentPage - 1)"
                :disabled="foundationPagination.currentPage <= 1 || isLoading"
                class="inline-flex items-center px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 transition-colors cursor-pointer">
                Previous
              </button>
              <button @click="changeFoundationPage(foundationPagination.currentPage + 1)"
                :disabled="foundationPagination.currentPage >= foundationPagination.totalPages || isLoading"
                class="inline-flex items-center px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-50 transition-colors cursor-pointer">
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Trainee Enrollment Logs Modal -->
  <EnrollmentHistoryModal :show="showHistoryModal" :history="userHistory" :loading="isLoading"
    @close="showHistoryModal = false" />
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useAlertStore } from '../../../../store/alertStore';
import { useEnrollmentStore } from '../../../../store/enrollmentStore';
import EnrollmentHistoryModal from '../../../../components/trainingTabs/enrollmentModal/EnrollmentHistoryModal.vue';

const props = defineProps({
  show: { type: Boolean, required: true },
  programId: { type: String, required: true }
});

const emit = defineEmits(['close', 'enrolled']);

const store = useEnrollmentStore();
const alert = useAlertStore();

const { foundationUsers, foundationPagination, userHistory, isLoading } = storeToRefs(store);
const userSearchQuery = ref('');
const foundationSortBy = ref('mandatoryCourseDueDate_asc');
const foundationPage = ref(1);
const showHistoryModal = ref(false);
let debounceTimer = null;

const formatDueDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const isOverdue = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
};

const fetchFoundationUsers = async (page = 1) => {
  if (!props.programId) return;
  foundationPage.value = page;
  const [sortBy, sortOrder] = foundationSortBy.value.split('_');

  await store.getFoundationUsersByGroup(props.programId, {
    page: foundationPage.value,
    limit: 12,
    search: userSearchQuery.value,
    sortBy: sortBy,
    sortOrder: sortOrder
  });
};

const changeFoundationPage = (newPage) => {
  fetchFoundationUsers(newPage);
};

const selectUser = async (user) => {
  const res = await store.enrollInTraining(props.programId, user._id);
  if (res.success) {
    alert.success(res.message);
    emit('enrolled');
    fetchFoundationUsers(1);
  } else {
    alert.error(res.message);
  }
};

const viewHistory = async (user) => {
  const response = await store.fetchTraineeEnrollmentHistory(user._id);
  if (response.success) {
    showHistoryModal.value = true;
  } else {
    alert.error(response.message);
  }
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    userSearchQuery.value = '';
    foundationSortBy.value = 'mandatoryCourseDueDate_asc';
    fetchFoundationUsers(1);
  }
});

watch(userSearchQuery, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchFoundationUsers(1);
  }, 400);
});

watch(foundationSortBy, () => {
  fetchFoundationUsers(1);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.4);
  border-radius: 10px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="max-w-[90rem] mx-auto pb-10">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h2 class="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            Enrollment Requests
          </h2>
          <span class="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase">
            {{ pagination?.total || 0 }} Records
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
                  <!-- <router-link
                    :to="{ name: detailRouteName, params: { id: item._id, programId: item.training_program._id } }"
                    class="p-2 hover:text-blue-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </router-link> -->
                  <button @click="enrollmentDetails(item)" class="p-2 hover:text-blue-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
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
          Showing {{ enrollments.length }} of {{ pagination?.total || 0 }} results
        </span>

        <div class="flex items-center gap-1">
          <button @click="changePage(pagination.page - 1)" :disabled="pagination?.page <= 1 || isEnrollmentLoading"
            class="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/5 disabled:opacity-30 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-xs font-bold px-3 text-zinc-700 dark:text-zinc-300">
            Page {{ pagination?.page || 1 }} of {{ pagination?.totalPages || 1 }}
          </span>
          <button @click="changePage(pagination.page + 1)"
            :disabled="pagination?.page >= pagination?.totalPages || isEnrollmentLoading"
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
      <div v-if="showSearchModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">

        <div class="absolute inset-0 bg-zinc-900/70 backdrop-blur-sm transition-opacity"
          @click="showSearchModal = false"></div>

        <div
          class="relative w-full max-w-6xl h-full max-h-[90vh] flex flex-col bg-white dark:bg-zinc-950 rounded-xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden transform transition-all">

          <div
            class="px-6 py-4 border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 flex items-center justify-between shrink-0">
            <div>
              <h3 class="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Enroll Trainee</h3>
              <p class="text-xs text-zinc-500 mt-0.5">Search and select trainees to add to this foundation course.</p>
            </div>
            <button @click="showSearchModal = false"
              class="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            class="px-6 py-3 bg-zinc-50 dark:bg-white/[0.02] border-b border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row gap-3 shrink-0">
            <div class="relative flex-1 max-w-md">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input v-model="userSearchQuery" type="text" placeholder="Search by name, department, or mobile..."
                class="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 shadow-sm rounded-md text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none dark:text-white transition-all"
                autofocus />
            </div>

            <div class="sm:w-64 ml-auto">
              <select v-model="foundationSortBy"
                class="w-full py-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-white/10 shadow-sm rounded-md text-sm text-zinc-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 cursor-pointer appearance-none">
                <option value="mandatoryCourseDueDate_asc">Sort: Due Date (Urgent)</option>
                <option value="mandatoryCourseDueDate_desc">Sort: Due Date (Latest)</option>
                <option value="full_name_asc">Sort: Name (A-Z)</option>
                <option value="department_asc">Sort: Department</option>
              </select>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-950">

            <div v-if="isLoading" class="py-24 flex flex-col items-center justify-center gap-3">
              <div class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span class="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Querying Database...</span>
            </div>

            <table v-else-if="foundationUsers && foundationUsers.length > 0"
              class="w-full text-left border-collapse whitespace-nowrap">
              <thead
                class="sticky top-0 z-10 bg-white dark:bg-zinc-950 shadow-[0_1px_0_0_theme(colors.zinc.200)] dark:shadow-[0_1px_0_0_theme(colors.white/10)]">
                <tr>
                  <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Trainee</th>
                  <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Department</th>
                  <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Mandatory Due</th>
                  <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 text-center">History
                  </th>
                  <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 text-right">Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-200 dark:divide-white/10">
                <tr v-for="user in foundationUsers" :key="user._id"
                  class="hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors group">

                  <td class="px-6 py-3">
                    <div class="flex items-center gap-3">
                      <div
                        class="h-8 w-8 shrink-0 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-xs uppercase border border-blue-200 dark:border-blue-800/50">
                        {{ user.full_name?.charAt(0) }}
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-none">{{ user.full_name
                          }}</p>
                        <p class="text-xs text-zinc-500 mt-1">{{ user.mobile }}</p>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-3">
                    <p class="text-xs text-zinc-600 dark:text-zinc-400 max-w-[250px] truncate" :title="user.department">
                      {{ user.department }}
                    </p>
                  </td>

                  <td class="px-6 py-3">
                    <div v-if="user.mandatoryCourseDueDate" class="inline-flex items-center gap-1.5">
                      <div class="w-2 h-2 rounded-full"
                        :class="isOverdue(user.mandatoryCourseDueDate) ? 'bg-red-500' : 'bg-emerald-500'"></div>
                      <span class="text-xs font-medium"
                        :class="isOverdue(user.mandatoryCourseDueDate) ? 'text-red-600 dark:text-red-400' : 'text-zinc-700 dark:text-zinc-300'">
                        {{ formatDueDate(user.mandatoryCourseDueDate) }}
                      </span>
                    </div>
                    <span v-else class="text-xs text-zinc-400 italic">Not Assigned</span>
                  </td>

                  <td class="px-6 py-3 text-center">
                    <button @click="viewHistory(user)"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-blue-600 hover:bg-blue-50 dark:text-zinc-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-md transition-colors">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Logs
                    </button>
                  </td>

                  <td class="px-6 py-3 text-right">
                    <button @click="selectUser(user)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-xs font-medium transition-colors shadow-sm active:scale-95">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Enroll
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="py-32 flex flex-col items-center justify-center text-center">
              <svg class="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h4 class="text-sm font-bold text-zinc-900 dark:text-white">No trainees found</h4>
              <p class="text-xs text-zinc-500 mt-1 max-w-sm">Adjust your search parameters or select a different sort
                criteria to find eligible users.</p>
            </div>
          </div>

          <div v-if="foundationPagination && foundationPagination.totalPages > 1"
            class="px-6 py-3 border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 flex items-center justify-between shrink-0">
            <span class="text-xs text-zinc-500">
              Showing page <span class="font-bold text-zinc-700 dark:text-zinc-300">{{ foundationPagination.currentPage
                }}</span> of {{ foundationPagination.totalPages }}
            </span>
            <div class="flex items-center gap-2">
              <button @click="changeFoundationPage(foundationPagination.currentPage - 1)"
                :disabled="foundationPagination.currentPage <= 1 || isLoading"
                class="inline-flex items-center px-3 py-1.5 border border-zinc-300 dark:border-white/10 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                Previous
              </button>
              <button @click="changeFoundationPage(foundationPagination.currentPage + 1)"
                :disabled="foundationPagination.currentPage >= foundationPagination.totalPages || isLoading"
                class="inline-flex items-center px-3 py-1.5 border border-zinc-300 dark:border-white/10 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>

  <EnrollmentHistoryModal :show="showHistoryModal" :history="userHistory" :loading="isLoading"
    @close="showHistoryModal = false" />
  <EnrollmentDetailsModal :show="showDetailsModal" :enrollment="enrollment" :loading="isLoading"
    :userHistory="userHistory" @close="showDetailsModal = false" @update-status="updateStatus" />
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useAlertStore } from '../../store/alertStore';
import { useAuthStore } from '../../store/authStore';
import { useEnrollmentStore } from '../../store/enrollmentStore';
import EnrollmentDetailsModal from './enrollmentModal/EnrollmentDetailsModal.vue';
import EnrollmentHistoryModal from './enrollmentModal/EnrollmentHistoryModal.vue';
const props = defineProps({
  programId: { type: String, required: true }
});

const authStore = useAuthStore();
const store = useEnrollmentStore();
const alert = useAlertStore();

// Main Table State
const { enrollments, pagination, isFoundation, isEnrollmentLoading, userHistory, enrollment } = storeToRefs(store);
const activeFilter = ref('All');
const searchQuery = ref('');
let searchTimer = null;

// Modal State
// Make sure your store exposes `foundationUsers`, `foundationPagination`, and `isLoading` for the modal
const { foundationUsers, foundationPagination, isLoading } = storeToRefs(store);
const showSearchModal = ref(false);
const userSearchQuery = ref('');
const foundationSortBy = ref('mandatoryCourseDueDate_asc'); // Combined sort value
const foundationPage = ref(1);
let debounceTimer = null;
//HISTORY
const showHistoryModal = ref(false);
const showDetailsModal = ref(false)

// Date Helpers
const formatDueDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const isOverdue = (dateString) => {
  if (!dateString) return false;
  return new Date(dateString) < new Date();
};

// --- Main Table Functions ---
const fetchData = (page = 1) => {
  store.fetchEnrollmentsByProgram(props.programId, {
    page,
    status: activeFilter.value === 'All' ? '' : activeFilter.value,
    search: searchQuery.value
  });
};

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

// --- Modal Functions (Foundation Users) ---
const fetchFoundationUsers = async (page = 1) => {
  foundationPage.value = page;

  // Split the combined sort value into By and Order
  const [sortBy, sortOrder] = foundationSortBy.value.split('_');

  // Assuming your store action is configured to pass these params to the backend
  await store.getFoundationUsersByGroup(props.programId, {
    page: foundationPage.value,
    limit: 12, // Perfect for grid layouts (divisible by 1, 2, 3, 4)
    search: userSearchQuery.value,
    sortBy: sortBy,
    sortOrder: sortOrder
  });
};

const openAddEnrollment = () => {
  showSearchModal.value = true;
  userSearchQuery.value = '';
  foundationSortBy.value = 'mandatoryCourseDueDate_asc';
  fetchFoundationUsers(1);
};

const changeFoundationPage = (newPage) => {
  fetchFoundationUsers(newPage);
};

// Handle Search Input in Modal
watch(userSearchQuery, (newQuery) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchFoundationUsers(1);
  }, 400);
});

// Handle Sort Dropdown Change in Modal
watch(foundationSortBy, () => {
  fetchFoundationUsers(1);
});

// --- Action Functions ---
const selectUser = async (user) => {
  const res = await store.enrollInTraining(props.programId, user._id);
  if (res.success) {
    alert.success(res.message);
    showSearchModal.value = false;
    userSearchQuery.value = '';
    fetchData(pagination.value.page);
    fetchFoundationUsers(1);
  } else {
    alert.error(res.message);
  }
};

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
    showDetailsModal.value = false;
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
const viewHistory = async (user) => {
  const response = await store.fetchTraineeEnrollmentHistory(user._id);
  if (response.success) {
    showHistoryModal.value = true;
    alert.success(response.message);
  } else {
    alert.error(response.message);
  }
}
const enrollmentDetails = async (item) => {
  const response = await store.fetchEnrollmentDetails(item._id);
  if (response.success) {
    alert.success(response.message);
    showDetailsModal.value = true;
  } else {
    alert.error(response.message);
  }
}
onMounted(() => fetchData());
</script>
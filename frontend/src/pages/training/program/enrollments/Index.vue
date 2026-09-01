<template>
  <div class="max-w-[90rem] mx-auto pb-10">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Enrollment Requests
          </h2>
          <span
            class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 text-[10px] font-bold uppercase">
            {{ pagination?.total || 0 }} Records
          </span>
        </div>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">Manage and review trainee applications for this training
          program.</p>
      </div>

      <div class="flex items-center gap-2">
        <button @click="exportApproved" :disabled="isExporting"
          class="group relative inline-flex items-center gap-2 px-4 py-2.5
                 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200
                 text-xs font-semibold rounded-xl transition-all duration-200
                 shadow-sm border border-zinc-200 dark:border-zinc-700 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
          <svg v-if="!isExporting" class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <svg v-else class="w-3.5 h-3.5 text-emerald-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span>{{ isExporting ? 'Exporting...' : 'Export Approved' }}</span>
        </button>

        <button v-if="isFoundation" @click="openAddEnrollment" class="group relative inline-flex items-center gap-2 px-4 py-2.5 
                 bg-emerald-700 hover:bg-emerald-800 text-white 
                 text-xs font-semibold rounded-xl transition-all duration-200 
                 shadow-md shadow-emerald-700/20 active:scale-95 cursor-pointer">
          <div
            class="flex items-center justify-center w-4 h-4 rounded-lg bg-white/20 group-hover:rotate-90 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span>New Enrollment</span>
        </button>
      </div>
    </div>

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div class="flex flex-wrap items-center gap-3">
        <div
          class="flex items-center bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl border border-zinc-200/60 dark:border-white/5">
          <button v-for="status in ['All', 'Pending', 'Approved', 'Rejected', 'Waitlisted']" :key="status"
            @click="handleFilterChange(status)" :class="[
              activeFilter === status
                ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium'
            ]" class="px-3.5 py-1.5 text-xs rounded-lg transition-all cursor-pointer">
            {{ status }}
          </button>
        </div>

        <div class="relative group">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-600 transition-colors"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="Search trainee..."
            class="pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all w-64 text-zinc-900 dark:text-zinc-100" />
        </div>
      </div>
    </div>

    <div
      class="relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">

      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-zinc-50/80 dark:bg-white/[0.02] border-b border-zinc-100 dark:border-white/5">
              <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Trainee</th>
              <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Designation</th>
              <th class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Department</th>
              <th
                class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-center">
                Status</th>
              <th
                class="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 text-right">
                Actions</th>
            </tr>
          </thead>
          <!-- Skeleton Loader -->
          <tbody v-if="isEnrollmentLoading" class="divide-y divide-zinc-100 dark:divide-white/5">
            <tr v-for="i in 5" :key="`skeleton-${i}`" class="animate-pulse">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
                  <div class="space-y-1.5 flex-1">
                    <div class="h-3.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
                    <div class="h-3 w-44 bg-zinc-100 dark:bg-zinc-800/60 rounded-md"></div>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <div class="h-3.5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
              </td>
              <td class="px-5 py-3.5">
                <div class="h-3.5 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
              </td>
              <td class="px-5 py-3.5 text-center">
                <div class="mx-auto h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <div class="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                  <div class="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Data Rows & Empty State -->
          <tbody v-else class="divide-y divide-zinc-100 dark:divide-white/5 text-xs">
            <tr v-if="enrollments.length === 0">
              <td colspan="5" class="px-6 py-20 text-center">
                <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div
                    class="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3 border border-emerald-200/60 dark:border-emerald-500/20">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">No Enrollment Requests Found</h3>
                  <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    There are currently no trainee enrollment records matching your selected filter or search query.
                  </p>
                </div>
              </td>
            </tr>

            <tr v-for="item in enrollments" :key="item._id"
              class="hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div
                    class="h-9 w-9 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs uppercase border border-emerald-200/60 dark:border-emerald-500/20">
                    {{ item.user?.full_name?.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-xs font-bold text-zinc-900 dark:text-zinc-100">{{ item.user?.full_name }}</p>
                    <p class="text-[11px] text-zinc-500 dark:text-zinc-400">{{ item.user?.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <div v-if="item.user?.designation" class="flex items-center gap-2">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/20 text-[10px] font-semibold uppercase tracking-wide">
                    {{ item.user.designation }}
                  </span>
                </div>
                <span v-else class="text-[11px] text-zinc-400 italic">—</span>
              </td>
              <td class="px-5 py-3.5">
                <div v-if="item.user?.department" class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span class="text-xs text-zinc-600 dark:text-zinc-400 font-medium">{{ item.user.department }}</span>
                </div>
                <span v-else class="text-[11px] text-zinc-400 italic">—</span>
              </td>
              <td class="px-5 py-3.5 text-center">
                <span :class="getStatusClass(item.status)"
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border tracking-wider">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="enrollmentDetails(item)"
                    class="p-2 text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors bg-white dark:bg-zinc-800 rounded-lg shadow-xs border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    title="View Details">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button v-if="item.status === 'Pending'" @click="updateStatus(item._id, 'Approved')"
                    class="p-2 text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors bg-white dark:bg-zinc-800 rounded-lg shadow-xs border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    title="Approve">
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
        class="px-5 py-3.5 bg-zinc-50/50 dark:bg-white/[0.01] border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
        <span class="text-xs text-zinc-500 font-medium">
          Showing {{ enrollments.length }} of {{ pagination?.total || 0 }} results
        </span>

        <div class="flex items-center gap-1">
          <button @click="changePage(pagination.page - 1)" :disabled="pagination?.page <= 1 || isEnrollmentLoading"
            class="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors text-zinc-500 cursor-pointer">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-xs font-semibold px-2 text-zinc-700 dark:text-zinc-300">
            Page {{ pagination?.page || 1 }} of {{ pagination?.totalPages || 1 }}
          </span>
          <button @click="changePage(pagination.page + 1)"
            :disabled="pagination?.page >= pagination?.totalPages || isEnrollmentLoading"
            class="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 transition-colors text-zinc-500 cursor-pointer">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Dedicated Create / New Enrollment Component -->
  <CreateEnrollment :show="showSearchModal" :program-id="targetProgramId" @close="showSearchModal = false"
    @enrolled="handleEnrolled" />

  <EnrollmentDetailsModal :show="showDetailsModal" :enrollment="enrollment" :loading="isLoading"
    :userHistory="userHistory" @close="showDetailsModal = false" @update-status="updateStatus" />
  <form ref="eMudhraForm" method="post" action="https://demogateway-core.emsigner.com/Secure/index" class="hidden">
    <input type="hidden" name="Parameter1" :value="store.params?.parameter1" />
    <input type="hidden" name="Parameter2" :value="store.params?.parameter2" />
    <input type="hidden" name="Parameter3" :value="store.params?.parameter3" />
  </form>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import EnrollmentDetailsModal from '../../../../components/trainingTabs/enrollmentModal/EnrollmentDetailsModal.vue';
import { useAlertStore } from '../../../../store/alertStore';
import { useEnrollmentStore } from '../../../../store/enrollmentStore';
import CreateEnrollment from './Create.vue';

const props = defineProps({
  programId: { type: String, default: '' }
});

const route = useRoute();
const targetProgramId = computed(() => props.programId || route.params.id);

const store = useEnrollmentStore();
const alert = useAlertStore();
const eMudhraForm = ref(null);

// Table & Store state
const { enrollments, pagination, isFoundation, isEnrollmentLoading, userHistory, enrollment } = storeToRefs(store);
const activeFilter = ref('All');
const searchQuery = ref('');
let searchTimer = null;

// Modal States
const { isLoading } = storeToRefs(store);
const showSearchModal = ref(false);
const showDetailsModal = ref(false);

const fetchData = async (page = 1) => {
  if (!targetProgramId.value) return;
  await store.fetchEnrollmentsByProgram(targetProgramId.value, {
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

const isExporting = ref(false);

const openAddEnrollment = () => {
  showSearchModal.value = true;
};

const exportApproved = async () => {
  isExporting.value = true;
  try {
    const result = await store.fetchApprovedForExport(targetProgramId.value);
    const rows = result.enrollments || [];
    if (!rows.length) {
      alert.error('No approved trainees found to export.');
      return;
    }

    const headers = [
      'Full Name',
      'Email',
      'Mobile (Last 4 Digits)',
      'District',
      'Department',
      'Group',
      'Gender',
      'Designation',
      'Date of Birth',
      'Date of Entry',
      'Recruitment',
      'Confirmation',
      'Qualification',
      'Service',
      'Category'
    ];

    const escape = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    };

    const formatDate = (val) => {
      if (!val) return '';
      const d = new Date(val);
      return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB');
    };

    const getLast4Mobile = (mobile) => {
      if (!mobile) return '';
      const str = String(mobile).trim();
      return str.length > 4 ? str.slice(-4) : str;
    };

    const getDistrictName = (district) => {
      if (!district) return '';
      if (typeof district === 'object') return district.name || '';
      return String(district);
    };

    const getGroupName = (group) => {
      if (!group) return '';
      if (typeof group === 'object') return group.group_name || group.name || '';
      return String(group);
    };

    const csvRows = [
      headers.join(','),
      ...rows.map(item => [
        escape(item.user?.full_name),
        escape(item.user?.email),
        escape(getLast4Mobile(item.user?.mobile || item.user?.phone)),
        escape(getDistrictName(item.user?.district)),
        escape(item.user?.department),
        escape(getGroupName(item.user?.group)),
        escape(item.user?.gender),
        escape(item.user?.designation),
        escape(formatDate(item.user?.dob)),
        escape(formatDate(item.user?.date_of_entry)),
        escape(item.user?.recruitment),
        escape(item.user?.confirmation),
        escape(item.user?.qualification),
        escape(item.user?.service),
        escape(item.user?.category)
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `approved-trainees-${targetProgramId.value}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert.success(`Exported ${rows.length} approved trainee(s) successfully.`);
  } catch (err) {
    console.error('Export error:', err);
    alert.error('Failed to export. Please try again.');
  } finally {
    isExporting.value = false;
  }
};

const handleEnrolled = () => {
  fetchData(pagination.value?.page || 1);
};

const getStatusClass = (status) => {
  const map = {
    'Approved': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20',
    'Pending': 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20',
    'Rejected': 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/60 dark:border-rose-500/20',
    'Waitlisted': 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/60 dark:border-blue-500/20'
  };
  return map[status] || 'bg-zinc-50 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-500/20';
};

const updateStatus = async (id, status) => {
  const res = await store.updateEnrollmentStatus(id, status);
  if (res.success) {
    alert.success(res.message);
    showDetailsModal.value = false;
    fetchData(pagination.value?.page || 1);
  } else {
    alert.error(res.message);
  }
};

const enrollmentDetails = async (item) => {
  const enrollmentId = item?._id || item;
  if (!enrollmentId) return;
  const response = await store.fetchEnrollmentDetails(enrollmentId);
  if (response.success) {
    showDetailsModal.value = true;
  } else {
    alert.error(response.message);
  }
};

const checkAndOpenDetailsModalFromQuery = async () => {
  const enrollmentId = route.query.enrollmentId;
  if (enrollmentId) {
    await enrollmentDetails(enrollmentId);
  }
};

onMounted(async () => {
  await fetchData();
  await checkAndOpenDetailsModalFromQuery();
});

watch(targetProgramId, async (newId) => {
  if (newId) {
    await fetchData();
  }
});

watch(() => route.query.enrollmentId, async (newEnrollmentId) => {
  if (newEnrollmentId) {
    await checkAndOpenDetailsModalFromQuery();
  }
});
</script>

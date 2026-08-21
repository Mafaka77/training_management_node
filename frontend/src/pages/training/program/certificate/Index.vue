<template>
  <div class="max-w-[90rem] mx-auto pb-10 space-y-6">
    <!-- Header & Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div>
          <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Certificates</h2>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">Generate, review, and issue completion certificates for trainees.</p>
        </div>
        <button @click="showBatchModal = true"
          class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Batch Generate
        </button>
      </div>

      <div v-if="!store.isCertificateLoading && store.certificates?.length > 0" class="flex items-center gap-3">
        <label class="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Sort by:</label>
        <div class="flex bg-zinc-100 dark:bg-zinc-800/60 p-1 rounded-xl border border-zinc-200/60 dark:border-white/5">
          <button @click="setSort('createdAt')"
            :class="['px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer', store.sortKey === 'createdAt' ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-400 shadow-xs' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300']">
            Date
            <span v-if="store.sortKey === 'createdAt'">{{ store.sortOrder === 'desc' ? '↓' : '↑' }}</span>
          </button>
          <button @click="setSort('full_name')"
            :class="['px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer', store.sortKey === 'full_name' ? 'bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-400 shadow-xs' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300']">
            Name
            <span v-if="store.sortKey === 'full_name'">{{ store.sortOrder === 'asc' ? '↓' : '↑' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Skeleton Loading State -->
    <div v-if="store.isCertificateLoading" class="space-y-3">
      <div v-for="i in (store.itemsPerPage || 5)" :key="i"
        class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl p-4 flex items-center justify-between animate-pulse">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800"></div>
          <div>
            <div class="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded mb-2"></div>
            <div class="h-3 w-24 bg-zinc-100 dark:bg-zinc-800/60 rounded"></div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
          <div class="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- Main Content List -->
    <div v-else>
      <div v-if="store.certificates?.length > 0" class="space-y-3">
        <div v-for="certificate in store.certificates" :key="certificate.id || certificate._id"
          class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl p-4.5 shadow-xs hover:shadow-sm hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div class="flex items-center gap-4">
            <div
              class="w-11 h-11 shrink-0 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xs font-bold text-zinc-900 dark:text-zinc-100">{{ certificate.user?.full_name || 'Unknown Trainee' }}</h3>
              <p class="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5 uppercase tracking-wider">
                Generated: {{ formatDate(certificate.createdAt) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <a v-if="certificate.certificate_url" :href="certificate.certificate_url" target="_blank"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200/60 dark:border-emerald-500/20 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              title="View Certificate">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </a>
            <div v-else
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-xs font-semibold">
              <svg class="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Generating...
            </div>

            <button @click="openDeleteModal(certificate)"
              class="p-2 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-all cursor-pointer"
              title="Delete Certificate">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="store.totalPages > 1"
          class="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-zinc-200/60 dark:border-white/5 gap-4">
          <p class="text-xs text-zinc-500">
            Showing <span class="font-bold text-zinc-700 dark:text-zinc-300">{{ ((store.currentPage - 1) * store.itemsPerPage) + 1 }}</span> to <span class="font-bold text-zinc-700 dark:text-zinc-300">{{ Math.min(store.currentPage * store.itemsPerPage, store.totalItems || 0) }}</span> of
            <span class="font-bold text-zinc-700 dark:text-zinc-300">{{ store.totalItems || 0 }}</span> certificates
          </p>
          <div class="flex items-center gap-2">
            <button @click="changePage(store.currentPage - 1)" :disabled="store.currentPage === 1"
              class="px-3.5 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-40 transition-all cursor-pointer">
              Previous
            </button>

            <div class="flex items-center gap-1 px-1">
              <button v-for="page in store.totalPages" :key="page" @click="changePage(page)"
                :class="['w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer', store.currentPage === page ? 'bg-emerald-700 text-white shadow-xs' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5']">
                {{ page }}
              </button>
            </div>

            <button @click="changePage(store.currentPage + 1)"
              :disabled="store.currentPage === store.totalPages"
              class="px-3.5 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-40 transition-all cursor-pointer">
              Next
            </button>
          </div>
        </div>

      </div>

      <!-- Empty State -->
      <div v-else
        class="py-20 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs">
        <div class="mx-auto w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">No Certificates Generated</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
          Certificates have not been generated for trainees in this program yet.
        </p>
      </div>
    </div>

    <!-- Batch Generation Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showBatchModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div class="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-zinc-200/80 dark:border-white/10 transform transition-all">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Batch Generate Certificates</h3>
              <button @click="showBatchModal = false" class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4 mb-5">
              <div>
                <label class="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Minimum Attendance Required</label>
                <select v-model="batchOptions.attendancePercentage"
                  class="w-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none cursor-pointer">
                  <option :value="70">70% Attendance</option>
                  <option :value="80">80% Attendance</option>
                  <option :value="85">85% Attendance</option>
                  <option :value="90">90% Attendance</option>
                </select>
              </div>
            </div>

            <p class="text-xs text-zinc-600 dark:text-zinc-300 mb-6 bg-emerald-50/60 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-500/20 leading-relaxed">
              This will evaluate attendance logs for all enrolled trainees. Trainees meeting <strong>{{ batchOptions.attendancePercentage }}% or higher</strong> attendance without existing certificates will be queued for automated PDF generation.
            </p>

            <div class="flex items-center justify-end gap-3">
              <button @click="showBatchModal = false"
                class="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer">
                Cancel
              </button>
              <button @click="handleBatchGenerate" :disabled="isGenerating"
                class="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
                <svg v-if="isGenerating" class="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Start Batch Job
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selectedDeleteCert"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div class="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-zinc-200/80 dark:border-white/10 transform transition-all">
            <div class="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center mb-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">Delete Certificate?</h3>
            <p class="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed mb-5">
              Are you sure you want to delete this certificate? This action will permanently remove the record and file from the server.
            </p>

            <div class="flex gap-2">
              <button @click="selectedDeleteCert = null"
                class="flex-1 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                Cancel
              </button>
              <button @click="confirmDelete" :disabled="store.isCertificateLoading"
                class="flex-1 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <svg v-if="store.isCertificateLoading" class="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAlertStore } from '../../../../store/alertStore';
import { useCertificateStore } from '../../../../store/certificateStore';
import { formatDate } from '../../../../utils/dateFormatter';

const props = defineProps({
  programId: { type: String, default: '' }
});

const route = useRoute();
const targetTrainingId = computed(() => props.programId || route.params.id);

const alert = useAlertStore();
const store = useCertificateStore();

const showBatchModal = ref(false);
const isGenerating = ref(false);
const selectedDeleteCert = ref(null);
const batchOptions = ref({
  attendancePercentage: 70
});

let pollTimer = null;

const loadData = async () => {
  if (!targetTrainingId.value) return;
  await store.fetchCertificates(targetTrainingId.value);
  checkPolling();
};

const checkPolling = () => {
  if (pollTimer) clearTimeout(pollTimer);
  const needsPolling = store.certificates?.some(c => c.status === 'processing');
  if (needsPolling) {
    pollTimer = setTimeout(() => {
      loadData();
    }, 3000);
  }
};

onUnmounted(() => {
  if (pollTimer) clearTimeout(pollTimer);
});

const changePage = (page) => {
  if (page >= 1 && page <= store.totalPages) {
    store.currentPage = page;
    loadData();
  }
};

const setSort = (key) => {
  if (store.sortKey === key) {
    store.sortOrder = store.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    store.sortKey = key;
    store.sortOrder = key === 'createdAt' ? 'desc' : 'asc';
  }
  store.currentPage = 1;
  loadData();
};

const openDeleteModal = (certificate) => {
  selectedDeleteCert.value = certificate;
};

const confirmDelete = async () => {
  if (!selectedDeleteCert.value) return;
  const response = await store.deleteCertificate(selectedDeleteCert.value._id);
  if (response.success) {
    selectedDeleteCert.value = null;
    loadData();
    alert.success(response.message);
  } else {
    alert.error(response.message);
  }
};

const handleBatchGenerate = async () => {
  if (!targetTrainingId.value) return;
  isGenerating.value = true;
  try {
    const res = await store.batchGenerateCertificates(targetTrainingId.value, batchOptions.value);
    if (res.success) {
      alert.success(res.message);
      showBatchModal.value = false;
      loadData();
    } else {
      alert.error(res.message);
    }
  } catch (e) {
    console.error(e);
    alert.error("An error occurred during batch generation");
  } finally {
    isGenerating.value = false;
  }
};

onMounted(() => {
  if (targetTrainingId.value) {
    if (store.currentTrainingId !== targetTrainingId.value) {
      store.resetQueryState();
      store.currentTrainingId = targetTrainingId.value;
    }
    loadData();
  }
});

watch(targetTrainingId, (newId) => {
  if (newId) {
    store.resetQueryState();
    store.currentTrainingId = newId;
    loadData();
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

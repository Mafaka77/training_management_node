<template>
  <div class="max-w-[90rem] mx-auto pb-10 space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Official Release Order</h2>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">View, sign, or generate official program release orders for trainees.</p>
      </div>
    </div>

    <!-- Skeleton Loading State -->
    <div v-if="store.isLoading" class="space-y-4">
      <div v-for="i in 2" :key="i"
        class="h-24 w-full bg-zinc-100 dark:bg-zinc-800/60 animate-pulse rounded-2xl border border-zinc-200/60 dark:border-white/5"></div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <div v-if="store.releaseOrder" class="space-y-4">
        <div
          class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl p-5 shadow-xs hover:shadow-sm hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between group gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <div>
              <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Official Release Order Document</h3>
              <p class="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5 uppercase tracking-wider">
                Generated: {{ formatDate(store.releaseOrder.createdAt) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div v-if="!store.releaseOrder.is_signed">
              <button @click="handleSignDocument" :disabled="store.isSigning"
                class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold disabled:opacity-50 transition-all shadow-md shadow-emerald-700/20 active:scale-95 cursor-pointer">
                <svg v-if="store.isSigning" class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                {{ store.isSigning ? 'Signing...' : 'Sign Document' }}
              </button>
            </div>

            <a v-if="store.releaseOrder.is_signed" :href="store.releaseOrder.release_order_url" target="_blank"
              class="p-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200/60 dark:border-emerald-500/20 rounded-xl transition-all cursor-pointer"
              title="Preview Signed Document">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </a>

            <!-- eMudhra Hidden Form -->
            <form ref="eMudhraForm" method="post" action="https://gateway-core.emsigner.com/Secure/index" class="hidden">
              <input type="hidden" name="Parameter1" :value="store.params?.parameter1" />
              <input type="hidden" name="Parameter2" :value="store.params?.parameter2" />
              <input type="hidden" name="Parameter3" :value="store.params?.parameter3" />
            </form>

            <button @click="showDeleteConfirm = true"
              class="p-2 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer"
              title="Delete Release Order">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else
        class="py-20 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs">
        <div class="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">No Release Order Found</h3>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mt-1">
          A release order has not been generated for this training program yet.
        </p>
        <button @click="generateReleaseOrder"
          class="mt-5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer">
          Generate Release Order Now
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showDeleteConfirm"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div class="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-zinc-200/80 dark:border-white/10 transform transition-all">
            <div class="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center mb-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">Delete Release Order?</h3>
            <p class="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed mb-5">
              Are you sure you want to remove this document? This action will permanently delete the file from the server and cannot be undone.
            </p>

            <div class="flex gap-2">
              <button @click="showDeleteConfirm = false"
                class="flex-1 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
                Cancel
              </button>
              <button @click="confirmDelete" :disabled="store.isLoading"
                class="flex-1 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <svg v-if="store.isLoading" class="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24">
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
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAlertStore } from '../../../../store/alertStore';
import { useCertificateStore } from '../../../../store/certificateStore';
import { formatDate } from '../../../../utils/dateFormatter';

const props = defineProps({
  programId: { type: String, default: '' }
});

const route = useRoute();
const router = useRouter();
const targetProgramId = computed(() => props.programId || route.params.id);

const alert = useAlertStore();
const store = useCertificateStore();
const eMudhraForm = ref(null);
const showDeleteConfirm = ref(false);

const handleSignDocument = async () => {
  if (!targetProgramId.value) return;
  try {
    const response = await store.handleSignDocument(targetProgramId.value);
    if (response.success) {
      await nextTick();
      if (eMudhraForm.value) eMudhraForm.value.submit();
    }
  } catch (ex) {
    console.error("Sign document error", ex);
  }
};

const confirmDelete = async () => {
  if (!targetProgramId.value) return;
  const response = await store.deleteReleaseOrder(targetProgramId.value);
  if (response.success) {
    showDeleteConfirm.value = false;
    store.getReleaseOrder(targetProgramId.value);
    alert.success(response.message);
  } else {
    alert.error(response.message);
  }
};

const generateReleaseOrder = async () => {
  if (!targetProgramId.value) return;
  router.push({ name: 'training.release-order', params: { id: targetProgramId.value } });
};

onMounted(() => {
  if (targetProgramId.value) {
    store.getReleaseOrder(targetProgramId.value);
  }
});

watch(targetProgramId, (newId) => {
  if (newId) {
    store.getReleaseOrder(newId);
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

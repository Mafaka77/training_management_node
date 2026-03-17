<template>
  <div class="max-w-6xl mx-auto pb-12">
    <Breadcrumbs :items="breadcrumbs" />

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="relative h-12 w-12">
        <div class="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
        <div class="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"></div>
      </div>
      <p class="text-xs font-black uppercase tracking-widest text-zinc-500 animate-pulse">Fetching Application...</p>
    </div>

    <div v-else-if="enrollment" class="space-y-6">
      <section
        class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div class="p-8 border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.01]">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div class="flex items-center gap-5">
              <div
                class="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/20">
                {{ enrollment.user?.full_name?.charAt(0) }}
              </div>
              <div>
                <div class="flex items-center gap-3">
                  <h2 class="text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight italic">
                    {{ enrollment.user?.full_name }}
                  </h2>
                  <span :class="getStatusClass(enrollment.status)"
                    class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border">
                    {{ enrollment.status }}
                  </span>
                </div>
                <p class="text-zinc-500 font-medium">{{ enrollment.user?.email }}</p>
              </div>
            </div>

            <button v-if="enrollment.status !== 'Pending'" @click="revertToPending"
              class="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-500 flex items-center gap-2 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset to Pending
            </button>
          </div>
        </div>

        <div
          class="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-zinc-100 dark:divide-white/5">
          <div class="p-8 space-y-6">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Trainee Profile</h3>
            <div class="grid grid-cols-1 gap-4">
              <DetailItem label="Department" :value="enrollment.user?.department || 'N/A'" icon="OfficeBuilding" />
              <DetailItem label="Designation" :value="enrollment.user?.designation || 'N/A'" icon="BadgeCheck" />
              <DetailItem label="Mobile" :value="enrollment.user?.mobile" icon="Phone" />
              <DetailItem label="Group" :value="enrollment.user?.group?.group_name || 'Unassigned'" icon="" />
            </div>
          </div>

          <div class="p-8 space-y-6 bg-zinc-50/30 dark:bg-white/[0.01]">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Program Details</h3>
            <div class="space-y-4">
              <div>
                <p class="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Course Title</p>
                <p class="text-sm font-black text-zinc-800 dark:text-zinc-200 mt-1">
                  {{ enrollment.training_program?.t_name }}
                </p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Applied Date</p>
                  <p class="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-1">
                    {{ formatDate(enrollment.enrolledAt) }}
                  </p>
                </div>
                <div>
                  <p class="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Status</p>
                  <p class="text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-1">
                    {{ enrollment.training_program?.t_status }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="p-8 space-y-6">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Admin Action</h3>
            <div v-if="enrollment.status === 'Pending'" class="space-y-3">
              <button @click="openApproveModal"
                class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]">
                Approve Application
              </button>
              <button @click="openRejectModal"
                class="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-rose-600/20 active:scale-[0.98]">
                Reject Application
              </button>
            </div>
            <div v-else
              class="p-6 rounded-2xl border-2 border-dashed border-zinc-100 dark:border-white/5 flex flex-col items-center text-center">
              <div class="h-10 w-10 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-3">
                <svg class="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p class="text-xs font-bold text-zinc-500">Status is locked.</p>
              <p class="text-[10px] text-zinc-400 mt-1">Reset to Pending to modify.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex items-center justify-between px-2">
          <h3 class="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">User Enrollment History</h3>
          <span v-if="userHistory"
            class="text-[10px] font-bold px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-500">
            {{ userHistory.length }} Record(s) Found
          </span>
        </div>

        <div v-if="userHistory && userHistory.length > 0" class="grid grid-cols-1 gap-3">
          <div v-for="history in userHistory" :key="history._id"
            class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl flex items-center justify-between transition-all hover:border-zinc-300 dark:hover:border-white/20">
            <div class="flex items-center gap-4">
              <div :class="getStatusClass(history.status)"
                class="h-10 w-10 rounded-xl flex items-center justify-center border">
                <svg v-if="history.status === 'Approved'" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else-if="history.status === 'Rejected'" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 class="text-sm font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-tight italic">
                  {{ history.training_program?.t_name }}
                </h4>
                <p class="text-[10px] font-bold text-zinc-500 uppercase mt-0.5">
                  Applied on {{ formatDate(history.enrolledAt) }}
                </p>
              </div>
            </div>
            <span :class="getStatusClass(history.status)"
              class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border">
              {{ history.status }}
            </span>
          </div>
        </div>

        <div v-else
          class="p-12 rounded-2xl border-2 border-dashed border-zinc-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <p class="text-xs font-bold text-zinc-400 uppercase tracking-widest italic">No previous enrollment records
            available for this user.</p>
        </div>
      </section>
    </div>

    <Dialog :show="isApproveModal" :loading="loading" title="Confirm Approval"
      message="Are you sure you want to approve this request?" confirm-text="Approve Now"
      @close="isApproveModal = false" @confirm="handleUpdateStatus('Approved');" />

    <Dialog :show="rejectModal" :loading="loading" title="Confirm Rejection"
      message="Are you sure you want to reject this request?" confirm-text="Reject Now" @close="rejectModal = false"
      @confirm="handleUpdateStatus('Rejected')" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DetailItem from "../../../components/DetailItem.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";
import Dialog from '../../../components/ui/Dialog.vue';
import { useAlertStore } from '../../../store/alertStore';
import { useEnrollmentStore } from '../../../store/enrollmentStore';

const store = useEnrollmentStore();
const { enrollment, isLoading, userHistory } = storeToRefs(store);
const alert = useAlertStore();
const route = useRoute();
const router = useRouter();

const isApproveModal = ref(false);
const loading = ref(false);
const rejectModal = ref(false);

const breadcrumbs = [
  { label: "Enrollments", to: "/admin/training/enrollments" },
  { label: "Application Detail" }
];

const openApproveModal = () => { isApproveModal.value = true; };
const openRejectModal = () => { rejectModal.value = true; };

const handleUpdateStatus = async (status) => {
  loading.value = true;
  try {
    const response = await store.updateEnrollmentStatus(enrollment.value._id, status);
    if (response.success) {
      alert.success(`Application ${status} successfully`);
      router.push('/admin/training/enrollments');
    } else {
      alert.error(response.message);
    }
  } catch (error) {
    alert.error("Action failed");
  } finally {
    loading.value = false;
    isApproveModal.value = false;
    rejectModal.value = false;
  }
};

const revertToPending = async () => {
  if (confirm("Reset this application to Pending?")) {
    try {
      const response = await store.updateEnrollmentStatus(enrollment.value._id, 'Pending');
      if (response.success) {
        alert.success(`Application marked Pending`);
        router.push('/admin/training/enrollments');
      } else {
        alert.error(response.message);
      }
    } catch (error) {
      alert.error("Reset failed");
    }
  }
};

const getStatusClass = (status) => {
  if (status === 'Approved') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  if (status === 'Pending') return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
  if (status === 'Rejected') return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
  return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
};

const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

onMounted(async () => {
  const data = await store.fetchEnrollmentById(route.params.id);
});
</script>
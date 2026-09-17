<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs transition-opacity" @click="$emit('close')"></div>

        <!-- Modal Card -->
        <div
          class="relative w-full max-w-4xl h-full max-h-[90vh] flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-white/10 overflow-hidden transform transition-all">

          <!-- Header -->
          <div
            class="px-6 py-4 border-b border-zinc-200/60 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Trainee Profile & Details</h3>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Comprehensive profile and service records.</p>
              </div>
            </div>
            <button @click="$emit('close')"
              class="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-zinc-50/30 dark:bg-zinc-900/60">
            <!-- Loading State -->
            <div v-if="loading" class="py-24 flex flex-col items-center justify-center gap-3">
              <div class="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">Loading Trainee Details...</span>
            </div>

            <div v-else-if="trainee" class="max-w-3xl mx-auto space-y-6">
              <!-- Hero Profile Banner -->
              <div
                class="p-5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                  <div
                    class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-700/20 shrink-0">
                    {{ getInitials(trainee.full_name) }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <h4 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">{{ trainee.full_name || 'N/A' }}</h4>
                      <span v-if="trainee.gender"
                        class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">
                        {{ trainee.gender }}
                      </span>
                      <span v-if="trainee.is_blacklisted"
                        class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                        Blacklisted
                      </span>
                    </div>
                    <p class="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                      {{ trainee.designation || 'No Designation' }} • {{ trainee.department || 'No Department' }}
                    </p>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <span v-if="getGroupName(trainee.group)"
                    class="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                    Group: {{ getGroupName(trainee.group) }}
                  </span>
                  <span v-if="getDistrictName(trainee.district)"
                    class="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    📍 {{ getDistrictName(trainee.district) }}
                  </span>
                </div>
              </div>

              <!-- Section 1: Personal & Contact Information -->
              <div
                class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
                <div class="px-5 py-3.5 bg-zinc-50/60 dark:bg-white/[0.02] border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div
                      class="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-500/20">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                    </div>
                    <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Personal & Contact Details</span>
                  </div>
                </div>

                <div class="p-5">
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-left">
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Full Name</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ trainee.full_name || 'N/A' }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Email Address</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 break-all">{{ trainee.email || 'N/A' }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Mobile Number</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ trainee.mobile || 'N/A' }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Gender</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ trainee.gender || 'N/A' }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Date of Birth</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ formatDate(trainee.dob) }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">District</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ getDistrictName(trainee.district) || 'N/A' }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Category</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ trainee.category || 'General' }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Highest Qualification</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ trainee.qualification || 'Not Specified' }}</dd>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 2: Service & Employment Details -->
              <div
                class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
                <div class="px-5 py-3.5 bg-zinc-50/60 dark:bg-white/[0.02] border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div
                      class="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-500/20">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Service & Employment Details</span>
                  </div>
                </div>

                <div class="p-5">
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-left">
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Office / Department</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ trainee.department || 'N/A' }}</dd>
                    </div>
                    <div v-if="trainee.departmentParent">
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Parent Department</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ getDepartmentParentName(trainee.departmentParent) || 'N/A' }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Designation</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ trainee.designation || 'N/A' }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Group / Cadre Group</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ getGroupName(trainee.group) || 'N/A' }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Service Type</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ trainee.service || 'State' }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Service Cadre</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ trainee.service_cadre || 'Not Specified' }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Govt Employee Status</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                        <span :class="trainee.is_govt_employee !== false ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'">
                          {{ trainee.is_govt_employee !== false ? 'Yes (Government)' : 'No / Non-Govt' }}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Mode of Recruitment</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ trainee.recruitment || 'Direct' }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Confirmation Status</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ trainee.confirmation || 'Confirmed' }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Date of Entry into Service</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ formatDate(trainee.date_of_entry) }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Date of Entry in Present Grade</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ formatDate(trainee.date_of_entry_in_present_grade) }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Date of Superannuation</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">{{ formatDate(trainee.date_of_superannuation) }}</dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Mandatory Training Status</dt>
                      <dd class="text-xs font-bold mt-0.5">
                        <span :class="trainee.mandatory_completion ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
                          {{ trainee.mandatory_completion ? '✓ Completed' : 'Pending / Required' }}
                        </span>
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section 3: Account & Blacklist Details -->
              <div
                class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-xs">
                <div class="px-5 py-3.5 bg-zinc-50/60 dark:bg-white/[0.02] border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div
                      class="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-200/50 dark:border-amber-500/20">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span class="text-xs font-bold text-zinc-900 dark:text-zinc-100">Account & Compliance Status</span>
                  </div>
                </div>

                <div class="p-5">
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-left">
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Account Status</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                        <span
                          class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold"
                          :class="trainee.is_active !== false ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'">
                          <span class="w-1.5 h-1.5 rounded-full"
                            :class="trainee.is_active !== false ? 'bg-emerald-600' : 'bg-rose-600'"></span>
                          {{ trainee.is_active !== false ? 'Active' : 'Inactive' }}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Blacklist Status</dt>
                      <dd class="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                        <span
                          class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold"
                          :class="trainee.is_blacklisted ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'">
                          {{ trainee.is_blacklisted ? '⚠️ Blacklisted' : '✓ Clean Record' }}
                        </span>
                      </dd>
                    </div>
                    <div v-if="trainee.is_blacklisted" class="col-span-full">
                      <dt class="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Blacklist Reason</dt>
                      <dd class="text-xs font-medium text-rose-600 dark:text-rose-400 mt-0.5">
                        {{ trainee.blacklist_details?.reason || 'No Reason Stated' }}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error / Empty State -->
            <div v-else class="py-24 flex flex-col items-center justify-center text-center">
              <svg class="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Unable to Load Trainee Details</h4>
              <p class="text-xs text-zinc-500 mt-1">Please try again or close this dialog.</p>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 border-t border-zinc-200/60 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
            <button @click="$emit('close')"
              class="px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer">
              Close
            </button>
            <button v-if="showEnrollButton && trainee" @click="$emit('enroll', trainee)"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Enroll Trainee</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: { type: Boolean, required: true },
  trainee: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  showEnrollButton: { type: Boolean, default: false }
});

defineEmits(['close', 'enroll']);

const getInitials = (name) => {
  if (!name) return 'TR';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
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

const getDepartmentParentName = (parent) => {
  if (!parent) return '';
  if (typeof parent === 'object') return parent.name || parent.code || '';
  return String(parent);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Not Recorded';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
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

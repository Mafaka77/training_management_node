<template>
  <div :class="[isEmbedded ? 'space-y-6' : 'max-w-6xl mx-auto space-y-8 pb-12']"
    class="text-zinc-900 dark:text-zinc-100">

    <!-- Breadcrumb Header (Only when standalone) -->
    <nav v-if="!isEmbedded"
      class="flex p-3 bg-zinc-100/60 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 rounded-xl"
      aria-label="Breadcrumb">
      <div v-if="isLoading" class="flex items-center space-x-2 w-full animate-pulse">
        <div class="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        <div class="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        <div class="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
      </div>
      <ol v-else class="inline-flex items-center space-x-1 md:space-x-2">
        <li class="inline-flex items-center">
          <router-link to="/admin/training/program"
            class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center transition-colors">
            <svg class="w-4 h-4 me-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1-1v3h3a1 1 0 0 0 1-1v-8.5" />
            </svg>
            Trainings
          </router-link>
        </li>
        <li aria-current="page" class="flex items-center space-x-1.5">
          <svg class="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
          </svg>
          <span class="text-xs font-semibold text-zinc-400 dark:text-zinc-500">Program Schedule & Sessions</span>
        </li>
      </ol>
    </nav>

    <!-- Standalone Hero Banner (Only when not embedded) -->
    <template v-if="!isEmbedded">
      <div v-if="isLoading" class="space-y-6 animate-pulse">
        <section
          class="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs flex flex-col md:flex-row items-center gap-6">
          <div class="w-full md:w-48 h-32 bg-zinc-200 dark:bg-zinc-800 rounded-2xl shrink-0"></div>
          <div class="flex-1 space-y-3 w-full">
            <div class="flex items-center gap-3">
              <div class="h-7 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
              <div class="h-5 w-20 bg-zinc-100 dark:bg-zinc-800/60 rounded-full"></div>
            </div>
            <div class="h-6 w-44 bg-zinc-100 dark:bg-zinc-800/60 rounded-lg"></div>
          </div>
          <div
            class="flex gap-4 p-4 bg-zinc-50 dark:bg-white/[0.02] rounded-2xl border border-zinc-200/60 dark:border-white/5 shrink-0">
            <div class="h-10 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
            <div class="h-10 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
          </div>
        </section>
      </div>

      <section v-else
        class="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xs border border-zinc-200/80 dark:border-white/10 hover:border-emerald-500/30 transition-all relative overflow-hidden group">
        <div
          class="absolute -right-4 -top-4 w-32 h-32 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0 pointer-events-none">
        </div>

        <div class="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div class="relative w-full md:w-48 h-32 shrink-0">
            <img :src="getImageUrl(form?.t_banner)"
              class="w-full h-full object-cover rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs" />
          </div>
          <div class="flex-1 space-y-2">
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{{ form?.t_name }}</h1>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                {{ form?.t_status }}
              </span>
            </div>
            <div class="flex items-center gap-4 mt-2">
              <span
                class="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-200/60 dark:border-emerald-500/20">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDateRange(form?.t_start_date, form?.t_end_date) }}
              </span>
            </div>
          </div>
          <div
            class="flex gap-6 p-5 bg-zinc-50/80 dark:bg-white/[0.02] rounded-2xl border border-zinc-200/60 dark:border-white/5 shadow-xs">
            <div class="text-center px-2">
              <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Capacity</p>
              <p class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{{ form?.t_capacity || 0 }}</p>
            </div>
            <div class="w-px h-10 bg-zinc-200 dark:bg-white/10 self-center"></div>
            <div class="text-center px-2">
              <p class="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Sessions</p>
              <p class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{{ sessions.length }}</p>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Training Schedule & Sessions Timetable Section -->
    <div class="space-y-6">
      <div v-if="isSessionLoading" class="space-y-4 animate-pulse">
        <div v-for="i in 3" :key="i"
          class="h-20 w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/60 dark:border-white/5">
        </div>
      </div>

      <template v-else>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-zinc-900 dark:text-zinc-100">Daily Session Timetable</h2>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">Classroom sessions, topics, and assigned facilitators.
            </p>
          </div>
          <button @click="openAddSessionModal"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition-all active:scale-95 cursor-pointer">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Session
          </button>
        </div>

        <div v-if="Object.keys(groupedSessions).length === 0"
          class="py-16 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-xs">
          <div
            class="mx-auto w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-zinc-900 dark:text-zinc-100 font-bold text-base">No Sessions Scheduled</h3>
          <p class="text-zinc-500 dark:text-zinc-400 text-xs mt-1">Get started by creating your first session.</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="(daySessions, date) in groupedSessions" :key="date"
            class="bg-white dark:bg-zinc-900 rounded-2xl shadow-xs border border-zinc-200/80 dark:border-white/10 overflow-hidden transition-all"
            :class="{ 'ring-2 ring-emerald-500/40 border-emerald-500': expandedDates.has(date) }">
            <button @click="toggleDate(date)"
              class="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors text-left bg-zinc-50/50 dark:bg-white/[0.01] cursor-pointer">
              <div class="flex items-center gap-3">
                <div
                  class="px-3 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 shadow-xs">
                  {{ formatDate(date) }}
                </div>
                <span class="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  {{ new Date(date).toLocaleDateString('en-US', { weekday: 'long' }) }}
                </span>
                <span
                  class="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-200/60 dark:border-emerald-500/20">
                  {{ daySessions.length }} {{ daySessions.length === 1 ? 'Session' : 'Sessions' }}
                </span>
              </div>
              <svg class="w-5 h-5 text-zinc-400 transition-transform duration-300"
                :class="{ 'rotate-180 text-emerald-700 dark:text-emerald-400': expandedDates.has(date) }" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
              </svg>
            </button>

            <div v-show="expandedDates.has(date)" class="border-t border-zinc-100 dark:border-white/5">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr
                    class="bg-zinc-50/80 dark:bg-white/[0.02] text-[10px] font-bold uppercase text-zinc-400 dark:text-zinc-500 border-b border-zinc-100 dark:border-white/5">
                    <th class="px-5 py-3 w-16">#</th>
                    <th class="px-5 py-3">Timing</th>
                    <th class="px-5 py-3">Topic / Module</th>
                    <th class="px-5 py-3">Faculty Trainer</th>
                    <th class="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-zinc-100 dark:divide-white/5 text-xs">
                  <tr v-for="session in daySessions" :key="session._id"
                    class="group hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors">
                    <td class="px-5 py-3.5 font-bold text-zinc-400 dark:text-zinc-500">
                      Session {{ session.tc_session }}
                    </td>
                    <td class="px-5 py-3.5 font-semibold text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                      {{ session.tc_start_time }} - {{ session.tc_end_time }}
                    </td>
                    <td class="px-5 py-3.5 font-bold text-zinc-900 dark:text-zinc-100">
                      {{ session.tc_topic }}
                    </td>
                    <td class="px-5 py-3.5">
                      <div v-if="session.trainer" class="flex items-center gap-2">
                        <img :src="getImageUrl(session.trainer?.image, session.trainer?.full_name)"
                          class="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shadow-xs" />
                        <span class="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{{
                          session.trainer?.full_name }}</span>
                      </div>
                      <span v-else class="text-xs italic text-zinc-400">Unassigned</span>
                    </td>
                    <td class="px-5 py-3.5 text-right">
                      <div class="flex justify-end gap-1.5">
                        <button v-if="form?.t_status === 'Ongoing' || form?.t_status === 'Completed'"
                          @click="navigateToAttendance(session._id)"
                          class="p-2 text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all active:scale-95 bg-white dark:bg-zinc-800 rounded-lg shadow-xs border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                          title="Attendance Registry">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </button>
                        <button @click="editSession(session)"
                          class="p-2 text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors active:scale-95 bg-white dark:bg-zinc-800 rounded-lg shadow-xs border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                          title="Edit Session">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button @click="deleteSession(session)"
                          class="p-2 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors active:scale-95 bg-white dark:bg-zinc-800 rounded-lg shadow-xs border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                          title="Delete Session">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
          </div>
        </div>
      </template>
    </div>

    <!-- Add/Edit Session Component -->
    <CreateSession :show="showModal" :program-id="targetProgramId" :session-data="editingSession"
      :next-session-num="sessions.length + 1" @close="showModal = false" @saved="handleSessionSaved" />

    <DeleteDialog :show="showDeleteModal" :loading="isDeleting" title="Delete Training Session"
      :message="`Are you sure you want to delete '${selectionItem?.tc_topic}'?`" confirmText="Yes, Delete Session"
      @close="showDeleteModal = false" @confirm="onConfirmDelete" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DeleteDialog from '../../../../components/ui/DeleteDialog.vue';
import { useAlertStore } from '../../../../store/alertStore';
import { useSessionStore } from '../../../../store/sessionStore';
import { useTrainingStore } from '../../../../store/trainingStore';
import CreateSession from './Create.vue';

const props = defineProps({
  programId: { type: String, default: '' },
  embedded: { type: Boolean, default: false }
});

const selectionItem = ref(null);
const route = useRoute();
const router = useRouter();
const alertStore = useAlertStore();
const trainingStore = useTrainingStore();
const sessionStore = useSessionStore();

const targetProgramId = computed(() => props.programId || route.params.id);
const isEmbedded = computed(() => props.embedded || !!props.programId);

const { form, isLoading } = storeToRefs(trainingStore);
const { sessions, isSessionLoading, isDeleting } = storeToRefs(sessionStore);

const expandedDates = ref(new Set());
const showModal = ref(false);
const showDeleteModal = ref(false);
const editingSession = ref(null);

const groupedSessions = computed(() => {
  if (!sessions.value || !Array.isArray(sessions.value)) return {};
  const groups = {};
  sessions.value.forEach(session => {
    const dateKey = session.tc_date ? session.tc_date.split('T')[0] : 'Unscheduled';
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(session);
  });
  return groups;
});

const toggleDate = (date) => {
  if (expandedDates.value.has(date)) {
    expandedDates.value.delete(date);
  } else {
    expandedDates.value.add(date);
  }
};

const formatDate = (dateString) => {
  if (!dateString || dateString === 'Unscheduled') return 'Unscheduled';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

const formatDateRange = (start, end) => {
  if (!start) return '';
  const s = new Date(start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const e = end ? new Date(end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
  return e ? `${s} - ${e}` : s;
};

const getImageUrl = (url, name = 'Program') => {
  if (!url) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=047857&color=fff`;
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_API_URL || ''}/${url}`.replace(/([^:]\/)\/+/g, "$1");
};

const navigateToAttendance = (sessionId) => {
  router.push({
    name: 'training.session.attendance',
    params: { id: targetProgramId.value, sessionId: sessionId }
  });
};

const openAddSessionModal = () => {
  editingSession.value = null;
  showModal.value = true;
};

const editSession = (session) => {
  editingSession.value = session;
  showModal.value = true;
};

const deleteSession = (session) => {
  selectionItem.value = session;
  showDeleteModal.value = true;
};

const handleSessionSaved = async () => {
  await sessionStore.fetchSessionsByProgram(targetProgramId.value);
};

const onConfirmDelete = async () => {
  if (!selectionItem.value) return;
  try {
    await sessionStore.deleteSession(selectionItem.value._id);
    alertStore.success('Session deleted successfully');
    showDeleteModal.value = false;
    selectionItem.value = null;
    await sessionStore.fetchSessionsByProgram(targetProgramId.value);
  } catch (error) {
    alertStore.error(error.message || 'Deletion failed');
  }
};

onMounted(async () => {
  const pid = targetProgramId.value;
  if (pid) {
    await Promise.all([
      // trainingStore.fetchTrainingProgramById(pid),
      sessionStore.fetchSessionsByProgram(pid),
      sessionStore.fetchTrainers()
    ]);
  }
});
</script>
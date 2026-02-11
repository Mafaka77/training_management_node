<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-12">
    <nav class="flex p-3 bg-white/5 border border-white/10 rounded-xl mb-6" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-2">
        <li class="inline-flex items-center">
          <router-link to="/admin/training/program" class="text-sm font-medium text-zinc-400 hover:text-blue-500 flex items-center">
            <svg class="w-4 h-4 me-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
            </svg>
            Trainings
          </router-link>
        </li>
        <li aria-current="page" class="flex items-center space-x-1.5">
          <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/></svg>
          <span class="text-sm font-medium text-zinc-500">Program Details</span>
        </li>
      </ol>
    </nav>

    <section class="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-sm">
      <div class="flex flex-col md:flex-row items-center gap-6 p-6">
        <div class="relative w-full md:w-48 h-32 flex-shrink-0">
          <img :src="getImageUrl(form.t_banner)" class="w-full h-full object-cover rounded-2xl border border-zinc-100 dark:border-white/5 shadow-inner" />
        </div>

        <div class="flex-1 space-y-2">
          <div class="flex items-center gap-3">
            <h1 class="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">{{ form.t_name }}</h1>
            <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-blue-100 dark:border-blue-500/20 uppercase tracking-wider">{{ form.t_status }}</span>
          </div>
          <div class="flex items-center gap-4 mt-2">
            <span class="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10">
              <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {{ formatDateRange(form.t_start_date, form.t_end_date) }}
            </span>
          </div>
        </div>

        <div class="flex gap-4 p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/5">
           <div class="text-center px-4">
              <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Capacity</p>
              <p class="text-lg font-bold text-zinc-900 dark:text-zinc-100">{{ form.t_capacity }}</p>
           </div>
           <div class="w-px h-8 bg-zinc-200 dark:bg-white/10 self-center"></div>
           <div class="text-center px-4">
              <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Sessions</p>
              <p class="text-lg font-bold text-zinc-900 dark:text-zinc-100">{{ sessions.length }}</p>
           </div>
        </div>
      </div>
    </section>

    <div class="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-white/5 rounded-2xl w-fit border border-zinc-200 dark:border-white/10">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-200',
          activeTab === tab.id
            ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
        ]"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
        </svg>
        {{ tab.label }}
      </button>
    </div>

    <div v-if="activeTab === 'schedule'" class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">Training Schedule</h2>
          <p class="text-xs text-zinc-500">Manage daily sessions and facilitators.</p>
        </div>
        <button @click="openAddSessionModal" class="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Session
        </button>
      </div>

      <div v-if="Object.keys(groupedSessions).length === 0" class="py-16 text-center bg-zinc-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-white/10">
        <p class="text-zinc-500 font-medium text-sm">No sessions scheduled yet.</p>
      </div>

      <div v-else class="space-y-3">
        <div v-for="(daySessions, date) in groupedSessions" :key="date" 
             class="border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm transition-all"
             :class="{ 'ring-1 ring-blue-500/30 border-blue-500/30': expandedDates.has(date) }">
          
          <button @click="toggleDate(date)" 
                  class="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-left">
            <div class="flex items-center gap-4">
              <div class="px-3 py-1 rounded-lg bg-zinc-100 dark:bg-white/10 text-xs font-bold font-mono text-zinc-600 dark:text-zinc-300">
                {{ formatDate(date) }}
              </div>
              <span class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                {{ new Date(date).toLocaleDateString('en-US', { weekday: 'long' }) }}
              </span>
              <span class="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 text-[9px] font-black uppercase tracking-tighter">
                {{ daySessions.length }} {{ daySessions.length === 1 ? 'Session' : 'Sessions' }}
              </span>
            </div>
            <svg class="w-5 h-5 text-zinc-400 transition-transform duration-300" 
                 :class="{ 'rotate-180': expandedDates.has(date) }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
            </svg>
          </button>

          <div v-show="expandedDates.has(date)" class="border-t border-zinc-100 dark:border-white/5">
            <table class="w-full text-left">
              <thead class="bg-zinc-50 dark:bg-white/[0.02] text-[10px] font-black uppercase text-zinc-400 border-b border-zinc-100 dark:border-white/5">
                <tr>
                  <th class="px-6 py-3 w-16">Session</th>
                  <th class="px-6 py-3">Time</th>
                  <th class="px-6 py-3">Topic</th>
                  <th class="px-6 py-3">Trainer</th>
                  <th class="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-100 dark:divide-white/5">
                <tr v-for="session in daySessions" :key="session._id" class="group hover:bg-blue-50/30 dark:hover:bg-blue-500/[0.02] transition-colors">
                  <td class="px-6 py-4">
                    <span class="text-xs font-black text-zinc-400">{{ session.tc_session }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold text-zinc-700 dark:text-zinc-300">{{ session.tc_start_time }}</span>
                      <span>-</span>
                      <span class="text-sm font-bold text-zinc-700 dark:text-zinc-300"> {{ session.tc_end_time }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight">{{ session.tc_topic }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div v-if="session.trainer" class="flex items-center gap-2">
                      <img :src="getImageUrl(session.trainer?.image,session.trainer?.full_name)" class="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-white/10" />
                      <span class="text-xs font-medium text-zinc-600 dark:text-zinc-400">{{ session.trainer?.full_name }}</span>
                    </div>
                    <span v-else class="text-xs italic text-zinc-400">Unassigned</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button v-if="form.t_status==='Ongoing'|| form.t_status==='Completed'"
                          @click="navigateToAttendance(session._id)"
                          class="p-2 text-zinc-400 hover:text-emerald-500 transition-all active:scale-90"
                          title="View Attendance"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>

                      <button @click="editSession(session)" class="p-2 text-zinc-400 hover:text-blue-500 transition-colors">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </button>

                      <button @click="deleteSession(session)" class="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
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
    </div>

    <div v-if="activeTab === 'materials'" class="space-y-6">
      <Materials :program-id="route.params.id"/>
    </div>
    <div v-if="activeTab === 'enrollments'" class="space-y-6">
        <EnrollmentComponent :program-id="route.params.id"/>
    </div>
    <div v-if="activeTab === 'attendance'" class="space-y-6">
      <div v-if="form.t_status === 'Upcoming' ||form.t_status === 'Draft' "
           class="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-3xl">

        <div class="w-12 h-12 mb-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h2 class="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">Registry Locked</h2>
        <p class="text-xs text-zinc-500 mt-1 max-w-[240px] text-center leading-relaxed">
          Attendance tracking becomes available once the training status moves to <span class="text-blue-500 font-bold">Ongoing</span>.
        </p>
      </div>

      <div v-else>
        <AttendanceComponent :program-id="route.params.id"/>
      </div>
    </div>
   <Transition 
  enter-active-class="duration-300 ease-out" 
  enter-from-class="opacity-0" 
  enter-to-class="opacity-100" 
  leave-active-class="duration-200 ease-in" 
  leave-from-class="opacity-100" 
  leave-to-class="opacity-0"
>
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
    <div class="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
      <div class="px-6 py-4 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-white/2">
        <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {{ isEditMode ? 'Edit Session' : 'Add New Session' }}
        </h3>
        <button @click="closeModal" class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <BaseInput v-model="sessionForm.tc_topic" label="Topic" placeholder="e.g. Fundamental Logic" />
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-xs font-bold text-zinc-500 uppercase mb-1.5 ml-1 tracking-wider">Date</label>
            <input v-model="sessionForm.tc_date" type="date" required class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
          </div>
          <BaseInput v-model="sessionForm.tc_start_time" label="Start Time" type="time" />
          <BaseInput v-model="sessionForm.tc_end_time" label="End Time" type="time" />
        </div>
        <BaseInput v-model="sessionForm.tc_session" label="Session Number" placeholder="eg. 1" type="number" />
        <SearchSelect v-model="sessionForm.trainer" :options="trainers" label="Trainer" placeholder="Search staff..." />
        
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-white/5">
          <button type="button" @click="closeModal" class="px-5 py-2.5 text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all">Cancel</button>
          <button type="submit" :disabled="isSubmitting" class="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2">
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isEditMode ? 'Update Session' : 'Save Session' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</Transition>
<DeleteDialog 
      :show="showDeleteModal"
      :loading="isDeleting"
      title="Delete Training Session"
      :message="`Are you sure you want to delete '${selectionItem?.tc_topic}'?` "
      confirmText="Yes, Delete Session"
      @close="showDeleteModal = false"
      @confirm="onConfirmDelete"
    />
  </div>
</template>

<script setup>
import { onMounted, watch, ref, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute,useRouter } from 'vue-router';
import { useAlertStore } from '../../../../store/alertStore';
import { useSessionStore } from '../../../../store/sessionStore';
import { useTrainingStore } from '../../../../store/trainingStore';
import BaseInput from '../../../../components/ui/BaseInput.vue';
import SearchSelect from '../../../../components/ui/SearchSelect.vue';
import Materials from '../../../../components/trainingTabs/Materials.vue';
import DeleteDialog from '../../../../components/ui/DeleteDialog.vue';
import AttendanceComponent from "../../../../components/trainingTabs/AttendanceComponent.vue";
import EnrollmentComponent from "../../../../components/trainingTabs/EnrollmentComponent.vue";
const selectionItem=ref(null);
// Setup
const route = useRoute();
const router=useRouter();
const trainingStore = useTrainingStore();
const sessionStore = useSessionStore();
const alert = useAlertStore();

// State
const activeTab = ref('schedule');
const showModal = ref(false);
const isSubmitting = ref(false);
const editingId=ref(null)
const loading = ref(false);
const showDeleteModal=ref(false);
const isDeleting=ref(false);
const { sessions, trainers ,expandedDates} = storeToRefs(sessionStore);
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const tabs = [
  {
    id: 'schedule',
    label: 'Schedule',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    id: 'materials',
    label: 'Materials',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  {
    id: 'enrollments',
    label: 'Enrollments',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  {
    id: 'attendance',
    label: 'Attendance',
    // New Attendance Icon: User + Checkmark
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
  }
];

const initialForm = reactive({
  id:'',
  tc_topic: '',
  tc_date: '',
  tc_start_time: '',
  tc_end_time: '',
  tc_session: 1,
  trainer: '',
  t_program: route.params.id
});

const form = reactive({
  t_name: '',
  t_banner: '',
  t_description: '',
  t_capacity: 0,
  t_start_date: '',
  t_end_date: '',
  t_status:''
});
const isEditMode=ref(false);
const sessionForm=reactive({...initialForm});
// Helpers
const getImageUrl = (path,name) => path ? `${IMAGE_URL}${path}` : `https://ui-avatars.com/api/?name=${name}`;
const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const formatDateRange = (start, end) => {
  if (!start || !end) return "Dates TBA";
  const options = { month: "short", day: "numeric" };
  const s = new Date(start).toLocaleDateString("en-US", options);
  const e = new Date(end).toLocaleDateString("en-US", { ...options, year: "numeric" });
  return `${s} - ${e}`;
};
const closeModal=()=>{
  showModal.value = false;
}
const toggleDate = (date) => {
  if (expandedDates.value.has(date)) {
    expandedDates.value.delete(date);
  } else {
    expandedDates.value.add(date);
  }
};

// Data Fetching
async function fetchProgramData(id) {
  loading.value = true;
  try {
    const data = await trainingStore.fetchTraining(id);
    Object.assign(form, data);
    await sessionStore.fetchSession(id);
  } catch (err) {
    console.log(err);
    alert.warning('Failed to load program details');
  } finally {
    loading.value = false;
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true;
  const formData = new FormData();
  Object.keys(sessionForm).forEach((key) => {
    const value = sessionForm[key];
    if (value !== null && value !== undefined && value !== '') {
      const cleanValue = (typeof value === 'object' && value._id) ? value._id : value;
      formData.append(key, cleanValue);
    }
  });

  try {
   if(isEditMode.value){
      
      const response=await sessionStore.updateSession(formData,sessionForm.id);
      if(response.success){
        await sessionStore.fetchSession(route.params.id);
        showModal.value=false;
        alert.success(response.message)
      }else{
        alert.error(response.message);
      }
   }else{
     const response = await sessionStore.submitSession(formData);
    if (response.success) {
      alert.success(response.message);
      showModal.value = false;
      await sessionStore.fetchSession(route.params.id); 
    } else {
      alert.warning(response.message);
    }
   }
  } catch (ex) {
    alert.warning("Error saving session");
  } finally {
    isSubmitting.value = false;
  }
};

const openAddSessionModal = () => {
  
   isEditMode.value=false;
   console.log(isEditMode.value);
  Object.assign(sessionForm, initialForm); // Reset form
  showModal.value = true;
};

const editSession = (session) => {
  
   isEditMode.value=true;
   console.log(isEditMode.value);
  // Map existing data to form fields
  sessionForm.id=session._id;
  sessionForm.tc_topic = session.tc_topic;
  sessionForm.tc_date = session.tc_date ? new Date(session.tc_date).toISOString().split('T')[0] : '';
  sessionForm.tc_start_time = session.tc_start_time;
  sessionForm.tc_end_time = session.tc_end_time;
  sessionForm.tc_session = session.tc_session;
  sessionForm.trainer = session.trainer || session.trainer;
  showModal.value = true;
};

const deleteSession = async (data) => {
    selectionItem.value=data;
    showDeleteModal.value=true;
    sessionForm.id=data._id;
    sessionForm.t_program=data.t_program._id;
  
};
const onConfirmDelete=async()=>{
  isDeleting.value=true;
  try{
    const response=await sessionStore.deleteSession(sessionForm.id);
  if(response.success){
    showDeleteModal.value=false;
   await sessionStore.fetchSession(sessionForm.t_program);
    alert.success(response.message);
  } else{
    alert.error(response.message);
  }
  }catch(ex){
    alert.error(ex);
  }finally{
    isDeleting.value=false;
  }
  
}
// Computed
const groupedSessions = computed(() => {
  if (!sessions.value.length) return {};
  const groups = sessions.value.reduce((acc, session) => {
    const dateKey = new Date(session.tc_date).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(session);
    return acc;
  }, {});
  Object.keys(groups).forEach(date => {
    groups[date].sort((a, b) => a.tc_start_time.localeCompare(b.tc_start_time));
  });
  return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => new Date(a) - new Date(b)));
});

// Lifecycle
onMounted(() => {
  sessionStore.getTrainers();
  if (route.params.id) fetchProgramData(route.params.id);
});
const navigateToAttendance = (sessId) => {
  router.push({
    name: 'training.session.attendance',
    params: {
      id: route.params.id,
      sessionId: sessId
    }
  });
};

watch(() => route.params.id, (newId) => {
  if (newId) fetchProgramData(newId);
});
</script>
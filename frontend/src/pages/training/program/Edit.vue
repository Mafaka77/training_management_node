<template>
  <div class="max-w-5xl mx-auto pb-12 space-y-6">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" />

    <!-- Page Header & Action Strip -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Edit Training Program
          </h2>
          <span v-if="form.t_status"
            :class="['px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border', getStatusStyle(form.t_status).badge]">
            {{ form.t_status }}
          </span>
        </div>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">
          Update curriculum schedule, eligibility criteria, course leadership, and venue logistics.
        </p>
      </div>

      <div v-if="form.t_status === 'Draft'" class="flex items-center gap-2">
        <button type="button" @click="handleMarkUpcoming"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-xl border border-emerald-300 dark:border-emerald-500/30 shadow-xs transition-all active:scale-95 cursor-pointer">
          <svg class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Mark as Upcoming</span>
        </button>
      </div>
    </div>

    <!-- Edit Form -->
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- 1. General Information -->
      <section
        class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl p-6 shadow-xs space-y-6">
        <div class="flex items-center gap-2.5 border-b border-zinc-100 dark:border-white/5 pb-4">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-500/20 shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">General Information</h3>
            <p class="text-[11px] text-zinc-500">Program identification and descriptive overview</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 space-y-4">
            <BaseInput v-model="form.t_name" label="Training Program Name"
              placeholder="e.g. Advanced Cybersecurity Workshop" type="text" />
            <BaseInput v-model="form.t_description" label="Program Overview"
              placeholder="Describe the objectives, syllabus highlights, and outcomes..." type="textarea" rows="4" />
          </div>
          <div class="md:col-span-1">
            <label class="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Program Banner</label>
            <ImagePicker type="file" accept=".png, .jpg, .jpeg" class="h-[188px]" @change="handleBanner" />
          </div>
        </div>
      </section>

      <!-- 2. Timeline & Schedule -->
      <section
        class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl p-6 shadow-xs space-y-6">
        <div class="flex items-center gap-2.5 border-b border-zinc-100 dark:border-white/5 pb-4">
          <div class="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-200/60 dark:border-amber-500/20 shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Timeline & Duration</h3>
            <p class="text-[11px] text-zinc-500">Program schedule dates and duration calculation</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BaseInput v-model="form.t_start_date" label="Start Date" type="date" />
          <BaseInput v-model="form.t_end_date" label="End Date" type="date" />
          <BaseInput v-model="form.t_duration" label="Duration (in days)" placeholder="Calculated automatically" type="number" disabled />
        </div>
      </section>

      <!-- 3. Logistics, Faculty & Eligibility -->
      <section
        class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl p-6 shadow-xs space-y-6">
        <div class="flex items-center gap-2.5 border-b border-zinc-100 dark:border-white/5 pb-4">
          <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-500/20 shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-100">Training Logistics & Leadership</h3>
            <p class="text-[11px] text-zinc-500">Course director, coordinator, capacity, and target eligibility groups</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-5">
            <BaseInput v-model="form.t_organizer" label="Organizer / Department" placeholder="e.g. ATI"
              type="text" />
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SearchSelect v-if="userRole.some(role => ['Admin', 'Course Director', 'Director'].includes(role))"
                v-model="form.t_director" :options="directors" label="Course Director" placeholder="e.g. Director Name"
                type="text" />
              <SearchSelect v-if="userRole.some(role => ['Admin', 'Course Director', 'Director'].includes(role))"
                v-model="form.t_coordinator" :options="directors" label="Course Coordinator"
                placeholder="e.g. Coordinator Name" type="text" />
            </div>

            <MultiSelect v-model="form.t_eligibility" :options="groups" track-by="_id" option-label="group_name"
              label="Target Eligibility Groups" placeholder="Select allowed groups" />
          </div>

          <div class="space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <BaseInput v-model="form.t_capacity" label="Seat Capacity" placeholder="50" type="number" />

              <SingleSelect v-model="form.t_category" :options="categories" track-by="_id" option-label="name"
                label="Category" placeholder="Select Type" />
            </div>

            <SingleSelect v-model="form.t_status" :options="status" track-by="name" option-label="value" label="Program Status"
              placeholder="Select Status" />
            
            <MultiSelect v-model="form.t_room" :options="rooms" track-by="_id" option-label="room_name"
              label="Assigned Room / Venue" placeholder="Select Venue" />
          </div>
        </div>
      </section>

      <!-- Bottom Action Strip -->
      <div
        class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
          ID: {{ route.params.id }}
        </p>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <button type="button" @click="$router.back()"
            class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 font-bold text-xs transition-colors cursor-pointer">
            Cancel
          </button>
          <button type="submit" :disabled="isLoading"
            class="flex-1 sm:flex-none flex items-center justify-center px-8 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span>{{ isLoading ? 'Saving Changes...' : 'Update Training Program' }}</span>
          </button>
        </div>
      </div>
    </form>

    <!-- Mark as Upcoming Modal -->
    <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showStatusModal"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
        <div
          class="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">

          <div class="p-6 text-center">
            <div
              class="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-3 border border-emerald-200/60 dark:border-emerald-500/20">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">Publish as Upcoming?</h3>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 px-2 leading-relaxed">
              Are you sure you want to mark this training as <strong class="text-emerald-700 dark:text-emerald-400 font-bold">Upcoming</strong>? This will make the program visible for prospective enrollments.
            </p>
          </div>

          <div
            class="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-white/[0.02] border-t border-zinc-100 dark:border-white/5">
            <button @click="showStatusModal = false"
              class="flex-1 px-4 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-all cursor-pointer">
              Cancel
            </button>
            <button @click="confirmStatusUpdate(route.params.id)" :disabled="isSubmitting"
              class="flex-1 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
              <span v-if="isSubmitting"
                class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Confirm & Publish
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import BaseInput from "../../../components/ui/BaseInput.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";
import ImagePicker from "../../../components/ui/ImagePicker.vue";
import MultiSelect from "../../../components/ui/MultiSelect.vue";
import SearchSelect from "../../../components/ui/SearchSelect.vue";
import SingleSelect from "../../../components/ui/SingleSelect.vue";
import { useAlertStore } from "../../../store/alertStore.js";
import { useAuthStore } from "../../../store/authStore.js";
import { useTrainingStore } from "../../../store/trainingStore.js";

const route = useRoute();
const alert = useAlertStore();
const store = useTrainingStore();
const authStore = useAuthStore();
const { categories, rooms, groups, directors } = storeToRefs(store);

const isLoading = ref(false);
const isUpdating = ref(false);
const loading = ref(false);
const showStatusModal = ref(false);
const isSubmitting = ref(false);

const status = [
  { name: "Draft", value: "Draft" },
  { name: "Upcoming", value: "Upcoming" },
  { name: "Ongoing", value: "Ongoing" },
  { name: "Completed", value: "Completed" },
];

const form = reactive({
  t_name: "",
  t_description: "",
  t_banner: null,
  t_start_date: "",
  t_end_date: "",
  t_duration: 0,
  t_eligibility: [],
  t_organizer: "",
  t_capacity: 0,
  t_category: "",
  t_room: [],
  t_status: "",
  t_director: "",
  t_coordinator: "",
});

const breadcrumbs = [
  { label: "Training", to: "/admin/training/program" },
  { label: "Edit Program", to: "/admin/training/program/edit/" + route.params.id }
];

const getStatusStyle = (s) => {
  const map = {
    Draft: { badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20" },
    Upcoming: { badge: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-500/20" },
    Ongoing: { badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20" },
    Completed: { badge: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700" }
  };
  return map[s] || { badge: "bg-zinc-100 text-zinc-700 border-zinc-200" };
};

const userRole = computed(() => {
  const roles = authStore.roles;
  if (!roles) return [];
  if (Array.isArray(roles)) return roles;
  return [roles];
});

watch(() => [form.t_start_date, form.t_end_date], () => {
  if (form.t_start_date && form.t_end_date) {
    const start = new Date(form.t_start_date);
    const end = new Date(form.t_end_date);
    const timeDiff = end.getTime() - start.getTime();
    if (timeDiff >= 0) {
      const diffDays = Math.round(timeDiff / (1000 * 3600 * 24)) + 1;
      form.t_duration = diffDays;
    } else {
      form.t_duration = 0;
    }
  } else {
    form.t_duration = 0;
  }
});

function handleBanner(file) {
  form.t_banner = file;
}

const submitForm = async () => {
  if (!form.t_name || !form.t_start_date || !form.t_category) {
    alert.error("Please fill in all required fields.");
    return;
  }

  isLoading.value = true;
  const formData = new FormData();
  Object.keys(form).forEach((key) => {
    if (form[key] instanceof File) {
      formData.append(key, form[key]);
    } else if (key === 't_eligibility') {
      form[key].forEach((item) => {
        const id = typeof item === 'object' ? item._id : item;
        formData.append('t_eligibility', id);
      });
    } else if (key === 't_room') {
      form[key].forEach((item) => {
        const id = typeof item === 'object' ? item._id : item;
        formData.append('t_room', id);
      });
    } else if (form[key] !== null && form[key] !== undefined) {
      const value = (typeof form[key] === 'object' && form[key]?._id)
        ? form[key]._id
        : form[key];
      formData.append(key, value);
    }
  });

  try {
    let response;
    if (isUpdating.value) {
      response = await store.updateTraining(route.params.id, formData);
    } else {
      response = await store.submitTraining(formData);
    }

    if (response.success) {
      alert.success(isUpdating.value ? "Program updated successfully!" : "Program created successfully!");
    } else {
      alert.error(response.message || "Action failed");
    }
  } catch (error) {
    alert.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

watch(() => route.params.id, (newId) => {
  if (newId) fetchTraining(newId);
});

async function fetchTraining(id) {
  loading.value = true;
  try {
    const data = await store.fetchTraining(id);
    if (data.t_start_date) data.t_start_date = data.t_start_date.split('T')[0];
    if (data.t_end_date) data.t_end_date = data.t_end_date.split('T')[0];
    
    const formattedData = {
      ...data,
      t_category: data.t_category?._id || data.t_category || "",
      t_room: data.t_room || [],
      t_eligibility: data.t_eligibility || [],
      t_director: data.t_director?._id || data.t_director || "",
      t_coordinator: data.t_coordinator?._id || data.t_coordinator || "",
      t_duration: data.t_duration || 0,
    };
    Object.assign(form, formattedData);
  } catch (err) {
    alert.error("Could not fetch training details");
    console.error(err);
  } finally {
    loading.value = false;
  }
}

const handleMarkUpcoming = () => {
  showStatusModal.value = true;
};

const confirmStatusUpdate = async (id) => {
  isSubmitting.value = true;
  try {
    const response = await store.updateStatus(id);
    if (response.success) {
      alert.success(response.message);
      showStatusModal.value = false;
      await fetchTraining(route.params.id);
    } else {
      alert.warning(response.message);
    }
  } catch (ex) {
    alert.warning(ex);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    store.fetchCategories(),
    store.fetchRooms(),
    store.fetchGroups(),
    store.fetchDirectors()
  ]);

  const trainingId = route.params.id;
  if (trainingId) {
    isUpdating.value = true;
    await fetchTraining(trainingId);
  }
});
</script>
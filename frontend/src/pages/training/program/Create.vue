<template>
  <div class="max-w-5xl mx-auto pb-12 space-y-6">
    <!-- Breadcrumbs -->
    <Breadcrumbs :items="breadcrumbs" />

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Create Training Program
          </h2>
          <span
            class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 text-[10px] font-bold uppercase">
            New Curriculum
          </span>
        </div>
        <p class="text-xs text-zinc-500 dark:text-zinc-400">
          Establish a new ATI educational course, assign faculty leadership, and define eligibility criteria.
        </p>
      </div>
    </div>

    <!-- Create Form -->
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

            <MultiSelect v-model="form.t_room" :options="rooms" track-by="_id" option-label="room_name"
              label="Assigned Room / Venue" placeholder="Select Venue" />
          </div>
        </div>
      </section>

      <!-- Bottom Action Strip -->
      <div
        class="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 rounded-2xl p-4 shadow-xs flex items-center justify-end gap-3">
        <button type="button" @click="$router.back()"
          class="px-6 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 font-bold text-xs transition-colors cursor-pointer">
          Cancel
        </button>
        <button type="submit" :disabled="isLoading"
          class="flex items-center justify-center px-8 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <span>{{ isLoading ? 'Creating Program...' : 'Create Training Program' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import BaseInput from "../../../components/ui/BaseInput.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";
import ImagePicker from "../../../components/ui/ImagePicker.vue";
import MultiSelect from "../../../components/ui/MultiSelect.vue";
import SearchSelect from "../../../components/ui/SearchSelect.vue";
import SingleSelect from "../../../components/ui/SingleSelect.vue";
import { useAlertStore } from "../../../store/alertStore.js";
import { useAuthStore } from "../../../store/authStore.js";
import { useTrainingStore } from "../../../store/trainingStore.js";

const router = useRouter();
const alert = useAlertStore();
const store = useTrainingStore();
const authStore = useAuthStore();
const { categories, rooms, groups, directors } = storeToRefs(store);

const isLoading = ref(false);

const form = reactive({
  t_name: "",
  t_description: "",
  t_banner: null,
  t_start_date: "",
  t_end_date: "",
  t_duration: 0,
  t_eligibility: [],
  t_organizer: "ATI",
  t_capacity: 0,
  t_category: "",
  t_room: [],
  t_director: "",
  t_coordinator: "",
});

const breadcrumbs = [
  { label: "Training", to: "/admin/training/program" },
  { label: "Create Program", to: "/admin/training/program/create" }
];

function handleBanner(file) {
  form.t_banner = file;
}

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

const submitForm = async () => {
  if (!form.t_name || !form.t_start_date || !form.t_category || !form.t_room || !form.t_eligibility || !form.t_capacity || !form.t_end_date || !form.t_director) {
    alert.error("Please fill in all required fields.");
    return;
  }

  isLoading.value = true;
  const formData = new FormData();
  Object.keys(form).forEach((key) => {
    if (key === 't_eligibility') {
      form[key].forEach((item) => {
        const id = typeof item === 'object' ? item._id : item;
        formData.append('t_eligibility', id);
      });
    } else if (key === 't_room') {
      form[key].forEach((item) => {
        const id = typeof item === 'object' ? item._id : item;
        formData.append('t_room', id);
      });
    } else if (key === 't_banner') {
      if (form[key]) {
        formData.append('t_banner', form[key]);
      }
    } else if (form[key] !== null && form[key] !== undefined) {
      const value = (typeof form[key] === 'object' && form[key]?._id)
        ? form[key]._id
        : form[key];
      formData.append(key, value);
    }
  });

  try {
    const response = await store.submitTraining(formData);
    if (response.success) {
      alert.success("Training program created successfully!");
      router.push("/admin/training/program");
    } else {
      alert.error(response.message || "Failed to create training.");
    }
  } catch (error) {
    alert.error("An unexpected error occurred.");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  store.fetchCategories();
  store.fetchRooms();
  store.fetchGroups();
  store.fetchDirectors();
});
</script>
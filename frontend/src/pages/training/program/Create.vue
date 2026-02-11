<template>
  <div class="max-w-5xl mx-auto pb-12">
    <Breadcrumbs :items="breadcrumbs" />
    <form @submit.prevent="submitForm" class="space-y-6">
      <section class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-6 text-blue-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h2 class="text-lg font-bold tracking-tight">General Information</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 space-y-4">
            <BaseInput v-model="form.t_name" label="Training Program Name" placeholder="e.g. Advanced Cybersecurity Workshop" type="text" />
            <BaseInput v-model="form.t_description" label="Program Overview" placeholder="Describe the objectives and outcomes..." type="textarea" rows="4" />
          </div>
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Program Banner</label>
            <ImagePicker 
              type="file" 
              accept=".png, .jpg, .jpeg" 
              class="h-[188px]"
              @change="handleBanner" 
            />
          </div>
        </div>
      </section>

      <section class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-6 text-amber-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <h2 class="text-lg font-bold tracking-tight">Timeline</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <BaseInput v-model="form.t_start_date" label="Start Date" type="date" />
          <BaseInput v-model="form.t_end_date" label="End Date" type="date" />
        </div>
      </section>

      <section class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-6 text-emerald-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          <h2 class="text-lg font-bold tracking-tight">Training Logistics</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput v-model="form.t_organizer" label="Organizer / Department" placeholder="e.g. HR Department" type="text" />
              <SearchSelect  v-model="form.t_director"
                             :options="directors"
                             label="Training Director"
                             placeholder="e.g. Director Name"
                             type="text" />
            </div>

            <MultiSelect 
              v-model="form.t_eligibility" 
              :options="groups" 
              track-by="_id" 
              option-label="group_name" 
              label="Target Eligibility Groups" 
              placeholder="Select allowed groups" 
            />
          </div>
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <BaseInput v-model="form.t_capacity" label="Seat Capacity" placeholder="50" type="number" />
              <SingleSelect 
                v-model="form.t_category" 
                :options="categories" 
                track-by="_id" 
                option-label="name" 
                label="Category" 
                placeholder="Select Type" 
              />
            </div>
            <SingleSelect 
              v-model="form.t_room" 
              :options="rooms" 
              track-by="_id" 
              option-label="room_name" 
              label="Assigned Room / Venue" 
              placeholder="Select Venue" 
            />
          </div>
        </div>
      </section>

      <div class="flex items-center justify-end gap-4 pt-4">
        <button type="button" @click="$router.back()" class="px-6 py-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 font-semibold transition-all">
          Cancel
        </button>
        <button type="submit" class="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95">
          Create Training Program
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted,ref } from "vue"
import { storeToRefs } from "pinia";
import { useTrainingStore } from "../../../store/trainingStore.js";
import MultiSelect from "../../../components/ui/MultiSelect.vue";
import BaseInput from "../../../components/ui/BaseInput.vue";
import SingleSelect from "../../../components/ui/SingleSelect.vue";
import ImagePicker from "../../../components/ui/ImagePicker.vue";
import { useAlertStore } from "../../../store/alertStore.js";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";
import SearchSelect from "../../../components/ui/SearchSelect.vue";
const alert=useAlertStore();
const store = useTrainingStore();
const { categories, rooms, groups ,directors} = storeToRefs(store);
const isLoading=ref(false);
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
  t_room: "",
  t_director:"",
})
const breadcrumbs=[
  {label:"Training",to:"/admin/training/program"},
  {label:"Create Program",to:"/admin/training/program/create"}
]
function handleBanner(file) {
  // If your ImagePicker emits the file directly, use 'file'
  // If it emits the event, use 'file.target.files[0]'
  form.t_banner = file;
}

const submitForm = async () => {
  // 1. Basic Validation
  if (!form.t_name || !form.t_start_date || !form.t_category) {
    alert.error("Please fill in the required fields.");
    return;
  }

  isLoading.value = true;
  const formData = new FormData();

  // 2. Build FormData
  Object.keys(form).forEach((key) => {
    if (key === 't_eligibility') {
      // If it's an array of objects from MultiSelect, send only the IDs
      form[key].forEach((item) => {
        const id = typeof item === 'object' ? item._id : item;
        formData.append('t_eligibility', id); 
      });
    } else if (key === 't_banner') {
      // Only append if a file actually exists
      if (form[key]) {
        formData.append('t_banner', form[key]);
      }
    } else if (form[key] !== null && form[key] !== undefined) {
      // For SingleSelect, ensure we only send the ID if it's an object
      const value = (typeof form[key] === 'object' && form[key]?._id) 
                    ? form[key]._id 
                    : form[key];
      formData.append(key, value);
    }
  });

  try {
    // 3. Dispatch to Store
    const response = await store.submitTraining(formData);
    
    if (response.success) {
      alert.success("Training program created successfully!");
      // router.push("/admin/training/program");
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
})
</script>
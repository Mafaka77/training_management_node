<template>
  <div class="max-w-5xl mx-auto pb-12">
    <Breadcrumbs :items="breadcrumbs" />
    <form @submit.prevent="submitForm" class="space-y-6">
      <section class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
  <div class="flex items-center gap-2 text-blue-600">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h2 class="text-lg font-bold tracking-tight">General Information</h2>
  </div>
  <div v-if="form.t_status==='Draft'">
  <button 
  type="button"
    @click="handleMarkUpcoming"
    class="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-xl transition-all active:scale-95 flex items-center gap-2"
  >
    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    Mark as Upcoming
  </button>
  </div>
  
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

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div class="space-y-6">
            <BaseInput v-model="form.t_organizer" label="Organizer / Department" placeholder="e.g. HR Department" type="text" />
            <SearchSelect  v-model="form.t_director"
                             :options="directors"
                             label="Training Director"
                             placeholder="Full Name"
                             type="text" />
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
                v-model="form.t_status" 
                :options="status" 
                track-by="name" 
                option-label="value" 
                label="Status" 
                placeholder="Select Status" 
              />
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
          Update Training Program
        </button>
      </div>
    </form>
    <Transition 
  enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" 
  leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0"
>
  <div v-if="showStatusModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
    <div class="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
      
      <div class="p-6 text-center">
        <div class="mx-auto w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <h3 class="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Change Status?</h3>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 px-4">
          Are you sure you want to mark this training as <span class="font-bold text-blue-600">Upcoming</span>? This will be available to public.
        </p>
      </div>

      <div class="flex items-center gap-3 p-6 bg-zinc-50 dark:bg-white/[0.02] border-t border-zinc-100 dark:border-white/5">
        <button 
          @click="showStatusModal = false" 
          class="flex-1 px-5 py-3 text-sm font-bold text-zinc-500 hover:bg-zinc-200 dark:hover:bg-white/5 rounded-2xl transition-all"
        >
          Cancel
        </button>
        <button 
          @click="confirmStatusUpdate(route.params.id)"
          :disabled="isSubmitting"
          class="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          Yes, Confirm
        </button>
      </div>
    </div>
  </div>
</Transition>
  </div>
  
</template>

<script setup>
import { reactive, onMounted,ref,watch } from "vue"
import { storeToRefs } from "pinia";
import { useTrainingStore } from "../../../store/trainingStore.js";
import MultiSelect from "../../../components/ui/MultiSelect.vue";
import BaseInput from "../../../components/ui/BaseInput.vue";
import SearchSelect from "../../../components/ui/SearchSelect.vue";
import SingleSelect from "../../../components/ui/SingleSelect.vue";
import ImagePicker from "../../../components/ui/ImagePicker.vue";
import { useAlertStore } from "../../../store/alertStore.js";
import { useRoute } from "vue-router";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";
const route = useRoute();
const alert=useAlertStore();
const store = useTrainingStore();
const { categories, rooms, groups ,directors} = storeToRefs(store);
const isLoading=ref(false);
const isUpdating = ref(false);
const loading=ref(false);
const showStatusModal = ref(false);
const isSubmitting=ref(false);
const status=[
  {name:"Draft",value:"Draft"},
  {name:"Upcoming",value:"Upcoming"},
  {name:"Ongoing",value:"Ongoing"},
  {name:"Completed",value:"Completed"},
]
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
  t_status:"",
  t_director:"",
})
const breadcrumbs=[
  {label:"Training",to:"/admin/training/program"},
  {label:"Edit Program",to:"/admin/training/program/edit/"+route.params.id}
];
function handleBanner(file) {
  form.t_banner = file;
}

const submitForm = async () => {
  if (!form.t_name || !form.t_start_date || !form.t_category) {
    alert.error("Please fill in the required fields.");
    return;
  }

  isLoading.value = true;
  const formData = new FormData();
  Object.keys(form).forEach((key) => {
      if (form[key] instanceof File) {
      formData.append(key, form[key]);
    } else if (Array.isArray(form[key])) {
      formData.append(key, JSON.stringify(form[key]));
    } else {
      formData.append(key, form[key]);
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
      alert.success(isUpdating.value ? "Updated successfully!" : "Created successfully!");
      // router.push("/admin/training/program");
    } else {
      alert.error(response.message || "Action failed");
    }
  } catch (error) {
    alert.error(error.message);
  } finally {
    isLoading.value = false;
  }
};
watch(()=>route.params.id,(newId)=>{
  if(newId) fetchTraining(newId);
})

async function fetchTraining(id) {
  loading.value = true;
  try {
    const data = await store.fetchTraining(id);
    if (data.t_start_date) data.t_start_date = data.t_start_date.split('T')[0];
    if (data.t_end_date) data.t_end_date = data.t_end_date.split('T')[0];
    const formattedData = {
      ...data,
      t_category: data.t_category?._id || data.t_category,
      t_room: data.t_room?._id || data.t_room,
      t_eligibility: data.t_eligibility || [],
      t_director: data.t_director._id|| data.t_director._id,
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
const confirmStatusUpdate=async(id)=>{
  isSubmitting.value=true;
  try{
    const response=await store.updateStatus(id);
    if(response.success){
      alert.success(response.message);
      showStatusModal.value=false;
      await fetchTraining(route.params.id);
    }else{
      alert.warning(response.message);
    }
  }catch(ex){
    alert.warning(ex);
  }finally{
    isSubmitting.value=false;
  }
}
onMounted(async () => {
  // Always fetch dropdown options
  await Promise.all([
    store.fetchCategories(),
    store.fetchRooms(),
    store.fetchGroups(),
    store.fetchDirectors()
  ]);

  // Only fetch training data if an ID exists in the route
  const trainingId = route.params.id;
  if (trainingId) {
    isUpdating.value = true;
    await fetchTraining(trainingId);
  }
});
</script>
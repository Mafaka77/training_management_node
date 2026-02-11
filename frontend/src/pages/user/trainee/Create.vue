<template>
  <div class="max-w-4xl mx-auto pb-10">
  
    <Breadcrumbs :items="breadcrumbs" />
    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-white/10">

        <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6 border-b border-zinc-100 dark:border-white/5 pb-2">
          Personal Information
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput v-model="form.full_name" label="Full Name" placeholder="John Doe" type="text"/>
          <BaseInput v-model="form.email" label="Email Address" type="email" placeholder="john@example.com"/>

          <BaseInput v-model="form.mobile" type="text" label="Mobile Number" placeholder="017..."/>
          <BaseInput v-model="form.password" type="password" label="Account Password" placeholder="••••••••"/>

          <SingleSelect :options="genderOptions" v-model="form.gender" option-label="name" track-by="name" label="Gender"/>
          <SingleSelect :options="districts" v-model="form.district" track-by="_id" label="District"/>
        </div>

        <h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-10 mb-6 border-b border-zinc-100 dark:border-white/5 pb-2">
          Work & Group Assignment
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput v-model="form.designation" type="text" label="Designation" placeholder="e.g. Executive"/>
          <BaseInput v-model="form.department" type="text" label="Department" placeholder="e.g. Operations"/>

          <div class="md:col-span-2">
            <SingleSelect
                :options="groups"
                v-model="form.group"
                track-by="_id"
                option-label="group_name"
                label="Assign Groups"
                placeholder="Select  groups..."
            />
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-zinc-100 dark:border-white/5 flex justify-end">
          <button
              type="submit"
              :disabled="isLoading"
              class="flex items-center justify-center px-10 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Processing...' : 'Save Trainee Profile' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAlertStore } from "../../../store/alertStore.js";
import { useUserManageStore } from "../../../store/userManageStore.js";
import BaseInput from "../../../components/ui/BaseInput.vue";
import SingleSelect from "../../../components/ui/SingleSelect.vue";
import MultiSelect from "../../../components/ui/MultiSelect.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";
const alert = useAlertStore();
const store = useUserManageStore();
const { districts, groups } = storeToRefs(store);

const isLoading = ref(false);

const genderOptions = [
  { name: "Male" },
  { name: "Female" }
];

const form = reactive({
  full_name: '',
  email: '',
  mobile: '',
  password: '',
  district: '',
  designation: '',
  department: '',
  group:'', // Array for MultiSelect
  gender: '',
});

const breadcrumbs=[
  {label:"Trainees",to:"/admin/trainee"},
  {label:"Create Trainee",to:"/admin/trainee/create"}
]

const submitForm = async () => {
  isLoading.value = true;
  try {
    const response = await store.submitTrainee(form);
    if (response.success === false) {
      alert.error(response.message);
    } else {
      alert.success(response.message);
      // Reset form
      Object.assign(form, {
        full_name: '',
        email: '',
        mobile: '',
        password: '',
        district: '',
        designation: '',
        department: '',
        group:'',
        gender: '',
      });
    }
  } catch (error) {
    alert.error('An error occurred while saving. Please check your connection.');
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  store.fetchDistricts();
  store.fetchGroups();
});
</script>
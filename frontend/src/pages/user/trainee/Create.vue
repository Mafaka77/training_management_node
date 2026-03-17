<template>
  <div class="max-w-4xl mx-auto pb-10">

    <Breadcrumbs :items="breadcrumbs" />
    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-white/10">

        <h3
          class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6 border-b border-zinc-100 dark:border-white/5 pb-2">
          Personal Information
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput v-model="form.full_name" label="Full Name" placeholder="John Doe" type="text" />
          <BaseInput v-model="form.email" label="Email Address" type="email" placeholder="john@example.com" />

          <BaseInput v-model="form.mobile" type="text" label="Mobile Number" placeholder="017..." />
          <BaseInput v-model="form.password" type="password" label="Account Password" placeholder="••••••••" />

          <SingleSelect :options="genderOptions" v-model="form.gender" option-label="name" track-by="name"
            label="Gender" />
          <SingleSelect :options="districts" v-model="form.district" track-by="_id" label="District" />
        </div>

        <h3
          class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-10 mb-6 border-b border-zinc-100 dark:border-white/5 pb-2">
          Work & Group Assignment
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput v-model="form.designation" type="text" label="Designation" placeholder="e.g. Executive" />
          <BaseInput v-model="form.department" type="text" label="Department" placeholder="e.g. Operations" />

          <div class="md:col-span-2 space-y-4">
            <SingleSelect :options="groups" v-model="form.group" track-by="_id" option-label="group_name"
              label="Assign Groups" placeholder="Select groups..." />

            <div class="flex items-start gap-3 p-4 rounded-xl border transition-all" :class="form.mandatory_completion
              ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-500/5 dark:border-emerald-500/20'
              : 'bg-zinc-50 border-zinc-200 dark:bg-white/5 dark:border-white/10'">
              <div class="flex items-center h-5">
                <input id="mandatory-check" type="checkbox" v-model="form.mandatory_completion"
                  class="h-5 w-5 cursor-pointer rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900" />
              </div>
              <label for="mandatory-check" class="flex flex-col cursor-pointer">
                <span class="text-sm font-bold transition-colors"
                  :class="form.mandatory_completion ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-200'">
                  I have completed the Mandatory Foundation Training
                </span>
                <span class="text-xs text-zinc-500 mt-0.5">
                  Check this box only if you have already received your certification for the government service
                  prerequisite course.
                </span>
              </label>
            </div>

            <Transition name="fade">
              <div v-if="!form.mandatory_completion && form.group"
                class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-2 items-center">
                <svg class="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span class="text-[11px] font-medium text-amber-700 dark:text-amber-500">
                  User will be flagged as "Training Required" for government service compliance.
                </span>
              </div>
            </Transition>
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-zinc-100 dark:border-white/5 flex justify-end">
          <button type="submit" :disabled="isLoading"
            class="flex items-center justify-center px-10 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ isLoading ? 'Processing...' : 'Save Trainee Profile' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import BaseInput from "../../../components/ui/BaseInput.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";
import SingleSelect from "../../../components/ui/SingleSelect.vue";
import { useAlertStore } from "../../../store/alertStore.js";
import { useUserManageStore } from "../../../store/userManageStore.js";
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
  group: '', // Array for MultiSelect
  gender: '',
  mandatory_completion: true
});

const breadcrumbs = [
  { label: "Trainees", to: "/admin/trainee" },
  { label: "Create Trainee", to: "/admin/trainee/create" }
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
        group: '',
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
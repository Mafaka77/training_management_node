<template>
  <div class="max-w-5xl mx-auto pb-10">
    <Breadcrumbs :items="breadcrumbs" />

    <form @submit.prevent="submitForm">
      <div class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        
        <div class="mb-8 border-b border-zinc-100 dark:border-white/5 pb-4">
          <h2 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">Trainer Details</h2>
          <p class="text-sm text-zinc-500">Fill in the information to register a new trainer.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <BaseInput 
            v-model="form.full_name"
            label="Full Name"
            placeholder="e.g. John Doe"
            type="text"
          />
          <BaseInput 
            v-model="form.email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
          />

          <BaseInput 
            v-model="form.mobile"
            type="text"
            label="Mobile Number"
            placeholder="e.g. 9876543210"
          />
          <BaseInput 
            v-model="form.password"
            type="password"
            label="Password"
            placeholder="Set a secure password"
          />

          <BaseInput 
            v-model="form.department"
            type="text"
            label="Department"
            placeholder="e.g. IT Cell"
          />
          <BaseInput 
            v-model="form.designation"
            type="text"
            label="Designation"
            placeholder="e.g. Senior Instructor"
          />

          <div class="md:col-span-1">
            <SingleSelect 
              :options="districts"
              v-model="form.district"
              track-by="_id"
              label="Assigned District"
              placeholder="Select District"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-zinc-100 dark:border-white/5">
          <button 
            type="button" 
            @click="$router.back()"
            class="px-6 py-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 font-semibold transition-all"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            :disabled="isLoading"
            class="flex items-center justify-center px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Saving...' : 'Save Trainer' }}</span>
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
import router from "../../../router/index.js"; // Ensure this is imported for the Cancel button

// Components
import BaseInput from "../../../components/ui/BaseInput.vue";
import SingleSelect from "../../../components/ui/SingleSelect.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";

const alert = useAlertStore();
const store = useUserManageStore();
const { districts } = storeToRefs(store);
const isLoading = ref(false);

const form = reactive({
  full_name: '',
  email: '',
  mobile: '',
  password: '',
  district: '',
  designation: '',
  department: '',
});

// Breadcrumb definition
// Note: Removed 'to' from the last item so it renders as text, not a link
const breadcrumbs = [
  { label: "Trainers", to: "/admin/trainer" },
  { label: "Create Trainer" } 
];

const submitForm = async () => {
  isLoading.value = true;
  try {
    const response = await store.submitTrainer(form);
    
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
      });
      
      // Optional: Redirect back after success
      // router.push('/admin/trainer');
    }
  } catch (error) {
    alert.error('An error occurred while saving the trainer.');
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  store.fetchDistricts();
})
</script>
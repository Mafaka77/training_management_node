<template>
  <div class="max-w-4xl mx-auto pb-12">
    <Breadcrumbs :items="breadcrumbs" />

    <form @submit.prevent="submitForm">
      <section
        class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
      >
        <div class="flex items-center gap-2.5 mb-6 text-emerald-600 dark:text-emerald-400">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-500/20">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Create New Role
            </h2>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              Define a new user role identifier and description for system access control.
            </p>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <BaseInput
              v-model="form.name"
              label="Role Name"
              placeholder="e.g. Coordinator, Course Director, Evaluator"
              type="text"
              required
            />
            <p class="mt-1.5 text-[11px] text-zinc-400">
              Unique name for the role. This name will be used throughout the application.
            </p>
          </div>

          <div>
            <BaseTextArea
              v-model="form.description"
              label="Description (Optional)"
              placeholder="Provide context on who this role is for and what privileges it covers..."
              :rows="4"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-zinc-100 dark:border-white/5">
          <button
            type="button"
            @click="$router.back()"
            class="px-6 py-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 font-semibold transition-all cursor-pointer text-xs"
          >
            Cancel
          </button>

          <button
            type="submit"
            :disabled="isLoading"
            class="flex items-center justify-center px-8 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-lg shadow-emerald-700/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px] cursor-pointer"
          >
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{{ isLoading ? 'Creating...' : 'Create Role' }}</span>
          </button>
        </div>
      </section>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import Breadcrumbs from '../../../components/ui/Breadcrumbs.vue';
import { useAlertStore } from '../../../store/alertStore.js';
import { useRoleStore } from '../../../store/roleStore.js';

const roleStore = useRoleStore();
const alert = useAlertStore();
const router = useRouter();

const isLoading = ref(false);

const form = reactive({
  name: '',
  description: ''
});

const breadcrumbs = [
  { label: 'Role Management', to: '/admin/role' },
  { label: 'Create Role' }
];

const submitForm = async () => {
  if (!form.name || !form.name.trim()) {
    alert.warning('Please enter a role name.');
    return;
  }

  isLoading.value = true;
  try {
    const response = await roleStore.createRole({
      name: form.name.trim(),
      description: form.description ? form.description.trim() : ''
    });

    if (response.success) {
      alert.success(response.message || 'Role created successfully!');
      router.push('/admin/role');
    } else {
      alert.error(response.message || 'Failed to create role');
    }
  } catch (error) {
    alert.error('Failed to create role: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

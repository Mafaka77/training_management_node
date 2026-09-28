<template>
  <div class="max-w-4xl mx-auto pb-12">
    <Breadcrumbs :items="breadcrumbs" />

    <!-- Loading Skeleton -->
    <div v-if="isFetching" class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-6 animate-pulse">
      <div class="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
      <div class="space-y-4">
        <div class="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
        <div class="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
      </div>
    </div>

    <!-- Edit Form -->
    <form v-else @submit.prevent="submitForm">
      <section
        class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
      >
        <div class="flex items-center gap-2.5 mb-6 text-emerald-600 dark:text-emerald-400">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-500/20">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Edit Role
            </h2>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">
              Update role information and permission description.
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
            <span>{{ isLoading ? 'Saving Changes...' : 'Update Role' }}</span>
          </button>
        </div>
      </section>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseTextArea from '../../../components/ui/BaseTextArea.vue';
import Breadcrumbs from '../../../components/ui/Breadcrumbs.vue';
import { useAlertStore } from '../../../store/alertStore.js';
import { useRoleStore } from '../../../store/roleStore.js';

const route = useRoute();
const router = useRouter();
const roleStore = useRoleStore();
const alert = useAlertStore();

const isFetching = ref(true);
const isLoading = ref(false);

const form = reactive({
  name: '',
  description: ''
});

const breadcrumbs = ref([
  { label: 'Role Management', to: '/admin/role' },
  { label: 'Edit Role' }
]);

const loadRole = async () => {
  const roleId = route.params.id;
  isFetching.value = true;
  try {
    const res = await roleStore.fetchRole(roleId);
    if (res.success && res.role) {
      form.name = res.role.name || '';
      form.description = res.role.description || '';
      breadcrumbs.value = [
        { label: 'Role Management', to: '/admin/role' },
        { label: res.role.name || 'Edit Role' }
      ];
    } else {
      alert.error(res.message || 'Failed to fetch role details');
      router.push('/admin/role');
    }
  } catch (error) {
    alert.error('Failed to load role: ' + error.message);
    router.push('/admin/role');
  } finally {
    isFetching.value = false;
  }
};

const submitForm = async () => {
  if (!form.name || !form.name.trim()) {
    alert.warning('Please enter a role name.');
    return;
  }

  isLoading.value = true;
  try {
    const response = await roleStore.updateRole(route.params.id, {
      name: form.name.trim(),
      description: form.description ? form.description.trim() : ''
    });

    if (response.success) {
      alert.success(response.message || 'Role updated successfully!');
      router.push('/admin/role');
    } else {
      alert.error(response.message || 'Failed to update role');
    }
  } catch (error) {
    alert.error('Failed to update role: ' + error.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadRole();
});
</script>

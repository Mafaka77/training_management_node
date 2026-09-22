<template>
  <div class="max-w-4xl mx-auto pb-12">
    <Breadcrumbs :items="breadcrumbs" />

    <form @submit.prevent="submitForm">
      <section
        class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
      >
        <div class="flex items-center gap-2 mb-6 text-emerald-600 dark:text-emerald-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h2 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Department Details
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <BaseInput
              v-model="form.name"
              label="Department Name"
              placeholder="e.g. Department of Higher & Technical Education"
              type="text"
            />
          </div>

          <div class="md:col-span-1">
            <BaseInput
              v-model="form.code"
              label="Department Code (Optional)"
              placeholder="e.g. HTE"
              type="text"
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
            class="flex items-center justify-center px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
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
            <span>{{ isLoading ? 'Saving...' : 'Save Department' }}</span>
          </button>
        </div>
      </section>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import BaseInput from "../../../components/ui/BaseInput.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";
import { useAlertStore } from "../../../store/alertStore.js";
import { useMasterStore } from "../../../store/masterStore.js";

const store = useMasterStore();
const alert = useAlertStore();
const router = useRouter();

const isLoading = ref(false);

const form = reactive({
  name: "",
  code: ""
});

const breadcrumbs = [
  { label: "Departments", to: "/admin/master/department" },
  { label: "Create Department" }
];

const submitForm = async () => {
  if (!form.name || !form.name.trim()) {
    alert.warning("Please enter a department name.");
    return;
  }

  isLoading.value = true;
  try {
    const response = await store.submitDepartmentParent({
      name: form.name.trim(),
      code: form.code ? form.code.trim() : ""
    });

    if (response.success === false) {
      alert.error(response.message || "Failed to create department");
    } else {
      alert.success(response.message || "Department created successfully!");
      router.push("/admin/master/department");
    }
  } catch (error) {
    alert.error("Failed to create department: " + error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

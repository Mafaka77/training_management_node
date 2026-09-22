<template>
  <div class="max-w-4xl mx-auto pb-12">
    <Breadcrumbs :items="breadcrumbs" />

    <!-- Initial Loading Skeleton -->
    <div
      v-if="isFetching"
      class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm animate-pulse space-y-6"
    >
      <div class="h-6 w-48 bg-zinc-200 dark:bg-white/10 rounded-lg"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="h-12 bg-zinc-200 dark:bg-white/10 rounded-xl md:col-span-2"></div>
        <div class="h-12 bg-zinc-200 dark:bg-white/10 rounded-xl md:col-span-1"></div>
      </div>
      <div class="h-10 w-32 bg-zinc-200 dark:bg-white/10 rounded-xl ml-auto"></div>
    </div>

    <!-- Edit Form -->
    <form v-else @submit.prevent="submitForm">
      <section
        class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
      >
        <div class="flex items-center gap-2 mb-6 text-emerald-600 dark:text-emerald-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2.5 2.5 0 113.536 3.536L12 20.364H8v-4.364l9.293-9.293z" />
          </svg>
          <h2 class="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Edit Department Details
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

        <div class="flex items-center justify-between mt-8 pt-6 border-t border-zinc-100 dark:border-white/5">
          <span class="text-xs text-zinc-400 font-mono">
            ID: {{ route.params.id }}
          </span>

          <div class="flex items-center gap-4">
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
              <span>{{ isLoading ? 'Updating...' : 'Update Department' }}</span>
            </button>
          </div>
        </div>
      </section>
    </form>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseInput from "../../../components/ui/BaseInput.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";
import { useAlertStore } from "../../../store/alertStore.js";
import { useMasterStore } from "../../../store/masterStore.js";

const route = useRoute();
const router = useRouter();
const store = useMasterStore();
const alert = useAlertStore();

const isFetching = ref(true);
const isLoading = ref(false);

const form = reactive({
  name: "",
  code: ""
});

const breadcrumbs = [
  { label: "Departments", to: "/admin/master/department" },
  { label: "Edit Department" }
];

const fetchDepartment = async () => {
  isFetching.value = true;
  try {
    const res = await store.fetchDepartmentParent(route.params.id);
    if (res.success && res.data) {
      form.name = res.data.name || "";
      form.code = res.data.code || "";
    } else {
      alert.error(res.message || "Failed to load department details");
      router.push("/admin/master/department");
    }
  } catch (error) {
    alert.error("Error loading department: " + error.message);
    router.push("/admin/master/department");
  } finally {
    isFetching.value = false;
  }
};

const submitForm = async () => {
  if (!form.name || !form.name.trim()) {
    alert.warning("Please enter a department name.");
    return;
  }

  isLoading.value = true;
  try {
    const response = await store.updateDepartmentParent(route.params.id, {
      name: form.name.trim(),
      code: form.code ? form.code.trim() : ""
    });

    if (response.success === false) {
      alert.error(response.message || "Failed to update department");
    } else {
      alert.success(response.message || "Department updated successfully!");
      router.push("/admin/master/department");
    }
  } catch (error) {
    alert.error("Failed to update department: " + error.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDepartment();
});
</script>

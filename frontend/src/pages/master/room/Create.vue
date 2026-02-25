<template>
  <div class="max-w-5xl mx-auto pb-12">
    <Breadcrumbs :items="breadcrumbs" />

    <form @submit.prevent="submitForm">
      <section class="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        
        <div class="flex items-center gap-2 mb-6 text-blue-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h2 class="text-lg font-bold tracking-tight">Room Configuration</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput 
            v-model="form.room_name"
            label="Room Name"
            placeholder="e.g. Executive Seminar Hall"
            type="text"
          />
          <BaseInput 
            v-model="form.capacity"
            label="Seating Capacity"
            placeholder="e.g. 50"
            type="number"
          />

          <div class="md:col-span-2">
            <BaseInput 
              v-model="form.details"
              label="Room Description & Amenities"
              placeholder="e.g. Projector available, high-speed Wi-Fi, localized AC control..."
              type="text"
            />
          </div>

          <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-zinc-50 dark:bg-white/[0.02] rounded-xl border border-zinc-100 dark:border-white/5">
            <BaseInput 
              v-model="form.latitude"
              label="Latitude"
              placeholder="e.g. 23.7271"
              type="text"
            />
            <BaseInput 
              v-model="form.longitude"
              label="Longitude"
              placeholder="e.g. 92.7176"
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
            class="flex items-center justify-center px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Saving...' : 'Save Room' }}</span>
          </button>
        </div>
      </section>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useMasterStore } from "../../../store/masterStore.js";
import { useAlertStore } from "../../../store/alertStore.js";
import BaseInput from "../../../components/ui/BaseInput.vue";
import Breadcrumbs from "../../../components/ui/Breadcrumbs.vue";

const alert = useAlertStore();
const store = useMasterStore();
const isLoading = ref(false);

const form = reactive({
  room_name: '',
  capacity: 0,
  details: '',
  latitude: '',
  longitude: ''
});

const breadcrumbs = [
  { label: "Rooms", to: "/admin/master/room" },
  { label: "Create Room" } // Current page usually doesn't need a 'to'
];

const submitForm = async () => {
  if (!form.room_name || form.capacity <= 0) {
    alert.warning("Please provide a valid room name and capacity.");
    return;
  }

  isLoading.value = true;
  try {
    const response = await store.submitRoom(form);
    if (response.success === false) {
      alert.error(response.message);
    } else {
      alert.success(response.message || "Room created successfully!");
      Object.assign(form, {
        room_name: '',
        capacity: 0,
        details: '',
        latitude: '',
        longitude: ''
      });
    }
  } catch (error) {
    alert.error(error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>
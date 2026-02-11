<template>
  <nav class="flex p-3 bg-white/5 border border-white/10 rounded-xl mb-6" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2">
      <li class="inline-flex items-center">
        <router-link to="/admin/master/room" class="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-blue-500">
          <svg class="w-4 h-4 me-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
          </svg>
          Room
        </router-link>
      </li>
      <li aria-current="page">
        <div class="flex items-center space-x-1.5">
          <svg class="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
          </svg>
          <span class="inline-flex items-center text-sm font-medium text-zinc-500">Edit Room</span>
        </div>
      </li>
    </ol>
  </nav>

  <div v-if="loading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>

  <form v-else @submit.prevent="handleUpdate" class="space-y-4">
    <div class="bg-white/5 rounded-2xl p-6 space-y-4 border border-white/10">
      <h2 class="text-lg font-semibold text-black mb-4 dark:text-white">Update Room Details</h2>

      <BaseInput v-model="form.room_name"
                 label="Room Name"
                 placeholder="e.g. Room A101"
                 type="text"/>

      <BaseInput v-model.number="form.capacity"
                 label="Room Capacity"
                 placeholder="e.g. 30"
                 type="number"/>

      <BaseInput v-model="form.details"
                 label="Room Details"
                 placeholder="Room description..."
                 type="text"/>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput v-model="form.latitude"
                   label="Latitude"
                   placeholder="12.3456"
                   type="text"/>
        <BaseInput v-model="form.longitude"
                   label="Longitude"
                   placeholder="78.9101"
                   type="text"/>
      </div>

      <div class="flex gap-3 pt-2">
        <button
            type="submit"
            :disabled="isUpdating"
            class="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50">
          {{ isUpdating ? 'Updating...' : 'Update Room' }}
        </button>
        <button
            type="button"
            @click="$router.push('/admin/master/room')"
            class="px-6 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-medium">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import {reactive, onMounted, ref, watch} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMasterStore } from "../../../store/masterStore.js";
import { useAlertStore } from "../../../store/alertStore.js";
import BaseInput from "../../../components/ui/BaseInput.vue";

const route = useRoute();
const router = useRouter();
const store = useMasterStore();
const alert = useAlertStore();

const loading = ref(true);
const isUpdating = ref(false);

const form = reactive({
  room_name: '',
  capacity: 0,
  details: '',
  latitude: '',
  longitude: ''
});
watch(()=>route.params.id,(newId)=>{
  if(newId) fetchRoomData(newId);
})
async function fetchRoomData(id) {
  loading.value = true;
  try {
    const data = await store.getRoomById(id);
    Object.assign(form, data);
  } catch (err) {
    alert.error("Could not fetch room details");
  } finally {
    loading.value = false;
  }
}
onMounted(async () =>fetchRoomData(route.params.id));

// 2. Submit the update
const handleUpdate = async () => {
  isUpdating.value = true;
  const response = await store.updateRoom(route.params.id, form);
  if (response.success) {
    alert.success("Room updated successfully");
    router.push('/admin/master/room');
  } else {
    alert.error(response.message);
  }
  isUpdating.value = false;
};
</script>
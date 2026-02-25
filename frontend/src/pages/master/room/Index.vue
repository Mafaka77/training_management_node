<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between mb-6">
      <div class="space-y-1">
        <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Training Rooms
        </h2>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          Manage and monitor your facility locations
        </p>
      </div>
      <router-link
          to="/admin/master/room/create"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-blue-500/20 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Room
      </router-link>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i"
           class="h-28 w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 animate-pulse"
      ></div>
    </div>

    <div v-else-if="rooms.length === 0"
         class="flex flex-col items-center justify-center py-16 px-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-white/10"
    >
      <div class="p-4 rounded-full bg-zinc-100 dark:bg-white/5 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 class="text-zinc-900 dark:text-zinc-100 font-medium">No rooms available</h3>
      <p class="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Get started by creating your first training room.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <div
          v-for="room in rooms"
          :key="room._id"
          class="group relative flex flex-col md:flex-row md:items-center gap-5 p-5 rounded-2xl border transition-all duration-300
               bg-white dark:bg-white/5
               border-zinc-200 dark:border-white/10
               hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none
               hover:border-blue-500/50 dark:hover:border-blue-500/50"
      >
        <div class="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
                    bg-blue-50 dark:bg-blue-600/10
                    text-blue-600 dark:text-blue-400
                    group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 mb-1">
            <h3 class="text-lg font-bold truncate text-zinc-900 dark:text-zinc-100">
              {{ room.room_name }}
            </h3>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider
                         bg-zinc-100 dark:bg-zinc-800
                         text-zinc-500 dark:text-zinc-400
                         border border-zinc-200 dark:border-zinc-700"
            >
              {{ room._id?.slice(-5) }}
            </span>
          </div>

          <p class="text-sm line-clamp-1 text-zinc-600 dark:text-zinc-400 mb-3">
            {{ room.details || 'No specific details provided for this location.' }}
          </p>

          <div class="flex flex-wrap gap-4">
            <div class="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <div class="w-2 h-2 rounded-full bg-blue-500"></div>
              Capacity: <span class="text-zinc-900 dark:text-zinc-200">{{ room.capacity }} Seats</span>
            </div>
            <div class="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{{ room.location.coordinates[1] }}, {{ room.location.coordinates[0] }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-white/5">
          <router-link :to="{name: 'master.room.edit',params:{id:room._id}}" title="Edit Room"  class="flex-1 md:flex-none p-2.5 rounded-xl transition-colors
                         bg-zinc-100 dark:bg-zinc-800
                         text-zinc-600 dark:text-zinc-300
                         hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2.5 2.5 0 113.536 3.536L12 20.364H8v-4.364l9.293-9.293z" />
            </svg>
          </router-link>

          <button
              @click="openDeleteModal(room)"
              title="Delete Room" class="flex-1 md:flex-none p-2.5 rounded-xl transition-colors
                         bg-red-50 dark:bg-red-500/10
                         text-red-600 dark:text-red-500
                         hover:bg-red-600 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <BaseModal
      :show="isDeleteModalOpen"
      confirmVariant="danger"
      @close="isDeleteModalOpen = false"
      @confirm="confirmDelete"
  >
    <template #icon>
      <div class="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-4">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    </template>

    <template #title>Delete Room</template>

    <template #content>
      Are you sure you want to delete <span class="font-bold text-zinc-900 dark:text-zinc-100">{{ roomToDelete?.room_name }}</span>?
      This will permanently remove the data from the server.
    </template>

    <template #confirm-text>Delete Permanently</template>
  </BaseModal>
</template>

<script setup>
import { useMasterStore } from "../../../store/masterStore.js";
import { onMounted,ref } from "vue";
import { storeToRefs } from "pinia";
import BaseModal from "../../../components/ui/BaseModal.vue";
import {useAlertStore} from "../../../store/alertStore.js";
const alert=useAlertStore();

const store = useMasterStore();
const { rooms, loading } = storeToRefs(store);
const isDeleteModalOpen = ref(false);
const roomToDelete = ref(null);

const openDeleteModal = (room) => {

  roomToDelete.value = room;
  isDeleteModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!roomToDelete.value) return;

  const response = await store.deleteRoom(roomToDelete.value._id);
  if (response.success) {
    alert.success('Room deleted successfully');
   await store.fetchRooms();
    isDeleteModalOpen.value = false;

  } else {
    alert.error(response.message);
  }
};
onMounted(() => {
  store.fetchRooms();
});

</script>

<style scoped>
/* Ensure content doesn't jump when loading */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style>
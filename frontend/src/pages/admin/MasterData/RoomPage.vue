<template>
  <div class="q-pa-md">
    <!-- Header -->
    <div class="flex justify-between items-center q-mb-md">
      <div class="text-h6 text-primary">Training Rooms</div>
      <q-btn color="primary" icon="add" label="Add Room" @click="openAddDialog" />
    </div>

    <!-- Room Cards Grid -->
    <div class="row q-col-gutter-md">
      <div v-for="room in rooms" :key="room._id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="shadow-3 rounded-borders hover-card">
          <q-card-section>
            <div class="text-h6 text-primary">{{ room.room_name }}</div>
            <div class="text-caption text-grey">Room No: {{ room.room_no }}</div>
            <div class="text-body2 q-mt-sm">
              <b>Capacity:</b> {{ room.capacity || "-" }}
            </div>
            <div class="text-body2 q-mt-xs ellipsis-3-lines">
              <b>Details:</b> {{ room.details || "No details provided." }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="around">
            <q-btn flat dense color="primary" icon="edit" label="Edit" @click="openEditDialog(room)" />
            <q-btn flat dense color="negative" icon="delete" label="Delete" @click="deleteRoom(room)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!rooms.length && !loading" class="text-center q-my-xl text-grey">
      <q-icon name="meeting_room" size="40px" color="grey-6" />
      <div class="text-subtitle2 q-mt-sm">No training rooms found.</div>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="text-center q-my-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width:500px" class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-primary">
            {{ isEditing ? "Edit Room" : "Add Room" }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-input v-model="form.room_name" label="Room Name" outlined />
          <q-input v-model="form.room_no" label="Room No" outlined />
          <q-input v-model.number="form.capacity" label="Capacity" type="number" outlined />
          <q-input v-model="form.details" label="Details" outlined type="textarea" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-btn label="Save" color="primary" @click="saveRoom" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();

const rooms = ref([]);
const loading = ref(false);
const saving = ref(false);
const showDialog = ref(false);
const isEditing = ref(false);
const editId = ref(null);

const form = ref({
  room_name: "",
  room_no: "",
  capacity: null,
  details: "",
});

const fetchRooms = async () => {
  loading.value = true;
  try {
    const res = await api.get("/admin/api/get-training-room");
    rooms.value = res.data.rooms || [];
  } catch (err) {
    console.error("Error fetching rooms:", err);
    $q.notify({ type: "negative", message: "Failed to load training rooms" });
  } finally {
    loading.value = false;
  }
};

const openAddDialog = () => {
  isEditing.value = false;
  editId.value = null;
  form.value = { room_name: "", room_no: "", capacity: null, details: "" };
  showDialog.value = true;
};

const openEditDialog = (room) => {
  isEditing.value = true;
  editId.value = room._id;
  form.value = { ...room };
  showDialog.value = true;
};

const saveRoom = async () => {
  saving.value = true;
  try {
    if (isEditing.value && editId.value) {
      await api.put(`/admin/api/training-room/${editId.value}`, form.value);
      $q.notify({ type: "positive", message: "Training room updated successfully!" });
    } else {
      await api.post("/admin/api/submit-training-room", form.value);
      $q.notify({ type: "positive", message: "Training room added successfully!" });
    }
    showDialog.value = false;
    fetchRooms();
  } catch (err) {
    console.error("Save room failed:", err);
    $q.notify({ type: "negative", message: "Failed to save room" });
  } finally {
    saving.value = false;
  }
};

const deleteRoom = async (room) => {
  $q.dialog({
    title: "Confirm Delete",
    message: `Are you sure you want to delete "${room.room_name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await api.delete(`/admin/api/training-room/${room._id}`);
      $q.notify({ type: "positive", message: "Room deleted successfully!" });
      fetchRooms();
    } catch (err) {
      console.error("Delete room failed:", err);
      $q.notify({ type: "negative", message: "Failed to delete room" });
    }
  });
};

onMounted(fetchRooms);
</script>

<style lang="sass" scoped>
.hover-card
  transition: transform 0.2s, box-shadow 0.2s
  &:hover
    transform: translateY(-4px)
    box-shadow: 0 8px 20px rgba(0,0,0,0.15)

.ellipsis-3-lines
  display: -webkit-box
  -webkit-line-clamp: 3
  -webkit-box-orient: vertical
  overflow: hidden
</style>

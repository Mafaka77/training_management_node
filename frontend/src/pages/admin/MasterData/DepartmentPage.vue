<template>
  <div class="q-pa-md">
    <!-- Header -->
    <div class="flex justify-between items-center q-mb-md">
      <div class="text-h6 text-primary">Training Departments</div>
      <q-btn color="primary" label="Add Department" icon="add" @click="openAddDialog" />
    </div>

    <!-- Department Cards -->
    <div class="row q-col-gutter-md">
      <div
        v-for="dept in categories"
        :key="dept._id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="shadow-3 rounded-borders hover-card">
          <q-card-section class="text-center q-pt-md q-pb-sm">
            <div class="text-h6 text-primary">{{ dept.name }}</div>
            <div class="text-caption text-grey q-mt-xs">
              Created on: {{ formatDate(dept.createdAt) }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="around">
            <q-btn
              dense
              flat
              color="primary"
              icon="edit"
              label="Edit"
              @click="openEditDialog(dept)"
            />
            <q-btn
              dense
              flat
              color="negative"
              icon="delete"
              label="Delete"
              @click="deleteDepartment(dept._id)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- No departments message -->
    <div v-if="!categories.length" class="text-center text-grey q-my-xl">
      <q-icon name="warning" size="40px" color="grey-6" />
      <div class="text-subtitle2 q-mt-sm">No departments found.</div>
    </div>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width:400px" class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-primary">
            {{ isEditing ? "Edit Department" : "Add Department" }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-input v-model="form.name" label="Department Name" outlined />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-btn label="Save" color="primary" @click="saveCategory" />
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
const categories = ref([]);
const showDialog = ref(false);
const isEditing = ref(false);
const form = ref({ _id: null, name: "" });

const fetchCategories = async () => {
  try {
    const res = await api.get("/admin/departments");
    categories.value = res.data?.departments || [];
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
};

const saveCategory = async () => {
  try {
    if (isEditing.value && form.value._id) {
      await api.put(`/admin/department/${form.value._id}`, {
        name: form.value.name,
      });
      $q.notify({ type: "positive", message: "Department updated successfully" });
    } else {
      await api.post("/admin/department", { name: form.value.name });
      $q.notify({ type: "positive", message: "Department added successfully" });
    }

    showDialog.value = false;
    fetchCategories();
    resetForm();
  } catch (err) {
    console.error("Failed to save category:", err);
    $q.notify({ type: "negative", message: "Failed to save department" });
  }
};

const deleteDepartment = async (id) => {
  try {
    const res = await api.delete(`/admin/department/${id}`);
    if (res.data?.status === 200) {
      $q.notify({
        type: "positive",
        message: res.data?.message || "Department deleted successfully",
      });
      fetchCategories();
    }
  } catch (err) {
    console.error("Delete failed:", err);
    $q.notify({ type: "negative", message: "Failed to delete department" });
  }
};

const openAddDialog = () => {
  resetForm();
  isEditing.value = false;
  showDialog.value = true;
};

const openEditDialog = (dept) => {
  form.value = { _id: dept._id, name: dept.name };
  isEditing.value = true;
  showDialog.value = true;
};

const resetForm = () => {
  form.value = { _id: null, name: "" };
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
};

onMounted(fetchCategories);
</script>

<style lang="sass" scoped>
.hover-card
  transition: transform 0.2s, box-shadow 0.2s
  &:hover
    transform: translateY(-4px)
    box-shadow: 0 8px 20px rgba(0,0,0,0.15)
</style>

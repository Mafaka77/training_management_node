<template>
  <div class="q-pa-md">
    <!-- Header and Add Button -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-primary text-weight-bold">Training Categories</div>
      <q-btn color="primary" label="Add Category" icon="add" @click="openAddDialog" />
    </div>

    <!-- Category Grid -->
    <div class="row q-col-gutter-md">
      <div v-for="cat in categories" :key="cat._id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="category-card shadow-3 rounded-borders">
          <q-card-section class="text-center">
            <div class="text-h6 text-primary text-weight-medium ellipsis">{{ cat.name }}</div>
            <div class="text-caption text-grey">
              Created: {{ formatDate(cat.createdAt) }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="center">
            <q-btn dense flat color="primary" icon="edit" label="Edit" @click="openEditDialog(cat)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!categories.length" class="text-center q-mt-xl text-grey">
      <q-icon name="category" size="56px" color="grey-5" />
      <div class="text-subtitle1 q-mt-sm">No categories found</div>
    </div>

    <!-- Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width:400px" class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-primary">
            {{ isEditing ? "Edit Category" : "Add Category" }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-input v-model="form.name" label="Category Name" outlined />
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

// ✅ Fetch categories
const fetchCategories = async () => {
  try {
    const res = await api.get("/admin/get-training-category");
    categories.value = res.data?.categories || [];
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
};

// ✅ Save new or edited category
const saveCategory = async () => {
  try {
    const payload = [
      { key: "name", value: form.value.name, type: "text", enabled: true },
    ];
    await api.post("/admin/submit-training-category", payload);
    $q.notify({
      type: "positive",
      message: isEditing.value ? "Category updated successfully" : "Category added successfully",
      position: "top-right",
    });
    showDialog.value = false;
    fetchCategories();
    resetForm();
  } catch (err) {
    console.error("Failed to save category:", err);
  }
};

const openAddDialog = () => {
  resetForm();
  isEditing.value = false;
  showDialog.value = true;
};

const openEditDialog = (cat) => {
  form.value = { _id: cat._id, name: cat.name };
  isEditing.value = true;
  showDialog.value = true;
};

const resetForm = () => {
  form.value = { _id: null, name: "" };
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

onMounted(fetchCategories);
</script>

<style lang="sass">
.category-card
  transition: all 0.2s ease
  &:hover
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
    transform: translateY(-2px)
</style>

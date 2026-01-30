<template>
  <div class="q-pa-lg bg-grey-1">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-primary text-weight-bold">👥 User Management</div>

      <div class="row items-center q-gutter-sm">
        <!-- Role Filter -->
        <q-select
          v-model="selectedRole"
          :options="roleOptions"
          label="Filter by Role"
          outlined
          dense
          clearable
          @update:model-value="fetchUsers"
          style="width: 180px"
        />

        <!-- Search -->
        <q-input
          dense
          debounce="300"
          v-model="search"
          placeholder="Search users..."
          outlined
          rounded
          clearable
          @update:model-value="fetchUsers"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn color="primary" icon="add" label="Add User" @click="showDialog = true" rounded unelevated />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-center q-mt-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <!-- Empty -->
    <div v-else-if="!users.length" class="text-center q-pa-lg text-grey">
      <q-icon name="people_outline" size="48px" color="grey-6" />
      <div class="text-subtitle1 q-mt-sm">No users found</div>
    </div>

    <!-- User Cards -->
    <div v-else class="row q-col-gutter-md">
      <div
        v-for="user in paginatedUsers"
        :key="user._id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="user-card shadow-2">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">{{ user.full_name }}</div>
            <div class="text-caption text-grey-3">
              {{ user.roles?.[0]?.name || "User" }}
            </div>
          </q-card-section>

          <q-card-section>
            <div class="q-mb-xs">
              <q-icon name="email" size="16px" class="q-mr-xs" />
              {{ user.email }}
            </div>
            <div class="q-mb-xs">
              <q-icon name="phone" size="16px" class="q-mr-xs" />
              {{ user.mobile || "N/A" }}
            </div>
            <div class="q-mb-xs">
              <q-icon name="work" size="16px" class="q-mr-xs" />
              {{ user.department?.name || "N/A" }}
            </div>
            <div>
              <q-icon name="badge" size="16px" class="q-mr-xs" />
              {{ user.designation || "N/A" }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat dense icon="edit" color="primary" @click="editUser(user)" />
            <q-btn flat dense icon="delete" color="negative" @click="deleteUser(user._id)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="users.length" class="q-mt-lg q-pa-md flex flex-center column">
      <q-pagination
        v-model="currentPage"
        :max="maxPages"
        max-pages="7"
        boundary-numbers
        direction-links
        color="primary"
        class="q-mb-md"
      />
      <q-select
        v-model="rowsPerPage"
        :options="[6, 12, 24]"
        label="Rows per page"
        outlined
        dense
        style="width: 150px"
      />
    </div>

    <!-- Add/Edit User Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 480px" class="q-pa-md">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            {{ editing ? "Edit User" : "Add New User" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="saveUser" class="q-gutter-md q-pt-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input v-model="form.full_name" label="Full Name" outlined dense />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.email" label="Email" outlined dense type="email" />
              </div>
              <div class="col-12 col-md-6" v-if="!editing">
                <q-input v-model="form.password" label="Password" outlined dense type="password" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="form.mobile" label="Mobile" outlined dense />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.district"
                  :options="districts.map(d => ({ label: d.name, value: d._id }))"
                  label="District"
                  outlined dense emit-value map-options
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.department"
                  :options="departments.map(d => ({ label: d.name, value: d._id }))"
                  label="Department"
                  outlined dense emit-value map-options
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.roles"
                  :options="roleOptions.map(r => ({ label: r.label, value: r.value }))"
                  label="Role"
                  outlined dense emit-value map-options
                />
              </div>
              <div class="col-12">
                <q-input v-model="form.designation" label="Designation" outlined dense />
              </div>
            </div>

            <div class="row justify-end q-gutter-sm q-pt-md">
              <q-btn flat label="Cancel" color="negative" v-close-popup />
              <q-btn type="submit" label="Save" color="primary" unelevated />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const $q = useQuasar();

const users = ref([]);
const districts = ref([]);
const departments = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const search = ref("");
const editing = ref(false);
const editId = ref(null);
const selectedRole = ref(null);

// Pagination
const currentPage = ref(1);
const rowsPerPage = ref(6);

const form = ref({
  full_name: "",
  email: "",
  password: "",
  mobile: "",
  district: "",
  department: "",
  designation: "",
  roles: ["68b01472d1838d6cd773d6fb"] // default: User
});

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Trainer", value: "trainer" },
  { label: "Trainee", value: "trainee" }
];

const fetchUsers = async () => {
  loading.value = true;
  try {
    const query = `/admin/users?search=${search.value}&role=${selectedRole.value || ""}&page=1&limit=100`;
    const res = await api.get(query);
    users.value = res.data.users || [];
  } catch (err) {
    $q.notify({ type: "negative", message: "Failed to fetch users.",err });
  } finally {
    loading.value = false;
  }
};

// Pagination Computed
const maxPages = computed(() => Math.ceil(users.value.length / rowsPerPage.value));
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  return users.value.slice(start, start + rowsPerPage.value);
});

// Save user
const saveUser = async () => {
  try {
    if (editing.value) {
      await api.put(`/admin/users/${editId.value}`, form.value);
      $q.notify({ type: "positive", message: "User updated successfully!" });
    } else {
      await api.post("/admin/create-user", form.value);
      $q.notify({ type: "positive", message: "User created successfully!" });
    }
    showDialog.value = false;
    resetForm();
    fetchUsers();
  } catch (err) {
    const msg = err.response?.data?.message || "Error saving user.";
    $q.notify({ type: "negative", message: msg });
  }
};

// Edit user
const editUser = (user) => {
  editing.value = true;
  editId.value = user._id;
  form.value = {
    ...user,
    district: user.district?._id || "",
    department: user.department?._id || "",
    roles: user.roles?.[0]?._id || user.roles?.[0]?.name || "trainee",
    password: ""
  };
  showDialog.value = true;
};

// Delete user
const deleteUser = async (id) => {
  $q.dialog({
    title: "Confirm Delete",
    message: "Are you sure you want to delete this user?",
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/admin/users/${id}`);
      $q.notify({ type: "positive", message: "User deleted!" });
      fetchUsers();
    } catch {
      $q.notify({ type: "negative", message: "Failed to delete user." });
    }
  });
};

const resetForm = () => {
  editing.value = false;
  editId.value = null;
  form.value = {
    full_name: "",
    email: "",
    password: "",
    mobile: "",
    district: "",
    department: "",
    designation: "",
    roles: ["68b01472d1838d6cd773d6fb"]
  };
};

const fetchDropdowns = async () => {
  try {
    const [distRes, deptRes] = await Promise.all([
      api.get("/admin/get-all-district"),
      api.get("/admin/departments?limit=100")
    ]);
    districts.value = distRes.data.districts || [];
    departments.value = deptRes.data.departments || [];
  } catch (err) {
    console.error("Dropdown fetch failed:", err);
  }
};

onMounted(() => {
  fetchUsers();
  fetchDropdowns();
});
</script>

<style lang="sass" scoped>
.user-card
  transition: all 0.2s ease
  border-radius: 14px
  &:hover
    transform: translateY(-4px)
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1)
</style>

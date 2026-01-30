<template>
  <div class="q-pa-md">

    <!-- Header Row: Add Trainer + Search -->
    <div class="row justify-between items-center q-mb-md">
      <q-btn color="primary" icon="add" label="Add Trainer" @click="openDialog()" unelevated />
      <q-input
        dense
        debounce="300"
        v-model="search"
        placeholder="Search trainers..."
        outlined
        clearable
        @update:model-value="onSearch"
        class="col-xs-12 col-sm-6 col-md-4"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Trainers Grid -->
    <div class="row q-gutter-md">
      <div v-for="trainer in trainers" :key="trainer._id" class="col-xs-12 col-sm-6 col-md-4">
        <q-card class="shadow-2 hover-card rounded-borders">

          <!-- Header: Avatar + Name + Email -->
          <q-card-section class="row items-center q-pb-sm bg-primary text-white">
            <q-avatar size="60px" class="q-mr-md">
              <template v-if="trainer.trainerProfile?.profile_picture">
                <img :src="'https://staging2.egovmz.in' + trainer.trainerProfile.profile_picture" alt="Profile" />
              </template>
              <template v-else>
                <q-icon name="person" size="40px" color="" />
              </template>
            </q-avatar>
            <div class="column">
              <div class="text-h6 text-primary">{{ trainer.full_name }}</div>
              <div class="text-subtitle2">{{ trainer.email }}</div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Details Section -->
          <q-card-section class="q-pt-sm q-pb-sm">
            <q-item-label class="q-mb-xs">
              <strong>Mobile:</strong> {{ trainer.mobile }}
            </q-item-label>
            <q-item-label class="q-mb-xs">
              <strong>Designation:</strong> {{ trainer.designation }}
            </q-item-label>
            <q-item-label v-if="trainer.department" class="q-mb-xs">
              <strong>Department:</strong> {{ getDepartmentName(trainer.department) }}
            </q-item-label>

            <div v-if="trainer.trainerProfile" class="q-mt-sm">
              <q-chip dense outline color="secondary" text-color="dark" class="q-mr-xs q-mb-xs" v-if="trainer.trainerProfile.expertise">
                Expertise: {{ trainer.trainerProfile.expertise }}
              </q-chip>
              <q-chip dense outline color="primary" text-color="dark" class="q-mr-xs q-mb-xs" v-if="trainer.trainerProfile.qualification">
                Qualification: {{ trainer.trainerProfile.qualification }}
              </q-chip>
              <q-chip dense outline color="accent" text-color="dark" class="q-mr-xs q-mb-xs" v-if="trainer.trainerProfile.experience">
                Experience: {{ trainer.trainerProfile.experience }}
              </q-chip>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Actions -->
          <q-card-section class="row justify-end q-gutter-sm">
            <q-btn flat icon="edit" color="primary" label="Edit" @click="openDialog(trainer)" />
            <q-btn flat icon="delete" color="negative" label="Delete" @click="deleteTrainer(trainer._id)" />
          </q-card-section>

        </q-card>
      </div>
    </div>

    <!-- Pagination -->
    <div class="row justify-center q-mt-md">
      <q-pagination
        v-model="pagination.page"
        :max="pagination.totalPages"
        @update:model-value="fetchTrainers"
        boundary-numbers
        input
        color="primary"
      />
    </div>

    <!-- Add/Edit Trainer Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="q-pa-md" style="min-width: 500px">
        <q-card-section>
          <div class="text-h6 text-primary">{{ isEditing ? 'Edit Trainer' : 'Add New Trainer' }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="submitForm" class="q-gutter-md">

            <q-input v-model="form.full_name" label="Full Name" outlined required />
            <q-input v-model="form.email" label="Email" outlined type="email" required />
            <q-input v-if="!isEditing" v-model="form.password" label="Password" outlined type="password" required />
            <q-input v-model="form.mobile" label="Mobile" outlined required />

            <q-select
              v-model="form.department"
              :options="departments.map(d => ({ label: d.name, value: d._id }))"
              label="Select Department"
              outlined
              emit-value
              map-options
              required
            />

            <q-input v-model="form.designation" label="Designation" outlined required />

            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancel" color="negative" v-close-popup />
              <q-btn type="submit" label="Save" color="primary" :loading="submitLoading" />
            </div>

          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { api } from "boot/axios"
import { useQuasar } from "quasar"

const $q = useQuasar()

// State
const trainers = ref([])
const departments = ref([])
const showDialog = ref(false)
const submitLoading = ref(false)
const search = ref("")
const isEditing = ref(false)

const form = ref({
  full_name: "",
  email: "",
  password: "",
  mobile: "",
  department: null,
  designation: "",
  district: [],
  roles: []
})

const pagination = ref({
  page: 1,
  limit: 10,
  totalPages: 1
})

// Fetch Trainers
async function fetchTrainers() {
  try {
    const res = await api.get(`/admin-api/trainers?search=${search.value}&page=${pagination.value.page}&limit=${pagination.value.limit}`)
    trainers.value = res.data.trainers || []
    pagination.value.totalPages = res.data.pagination?.totalPages || 1
  } catch (err) {
    console.error(err)
  }
}

// Fetch Departments
async function fetchDepartments() {
  try {
    const res = await api.get("/admin-api/departments?limit=100")
    departments.value = res.data.departments || []
  } catch (err) {
    console.error(err)
  }
}

// Get Department Name
const getDepartmentName = (id) => {
  const dep = departments.value.find(d => d._id === id)
  return dep ? dep.name : "-"
}

// Search
function onSearch() {
  pagination.value.page = 1
  fetchTrainers()
}

// Open Dialog
function openDialog(trainer = null) {
  if (trainer) {
    isEditing.value = true
    form.value = {
      full_name: trainer.full_name,
      email: trainer.email,
      password: "",
      mobile: trainer.mobile,
      department: trainer.department || null,
      designation: trainer.designation,
      district: trainer.district || [],
      roles: trainer.roles || []
    }
  } else {
    isEditing.value = false
    resetForm()
  }
  showDialog.value = true
}

// Reset Form
function resetForm() {
  form.value = {
    full_name: "",
    email: "",
    password: "",
    mobile: "",
    department: null,
    designation: "",
    district: [],
    roles: []
  }
}

// Submit Form
async function submitForm() {
  submitLoading.value = true
  try {
    if (isEditing.value) {
      const trainerToUpdate = trainers.value.find(t => t.email === form.value.email)
      await api.put(`/admin-api/trainer/${trainerToUpdate._id}`, form.value)
    } else {
      await api.post("/admin-api/trainer", form.value)
    }
    $q.notify({ type: "positive", message: "Trainer saved successfully!" })
    showDialog.value = false
    resetForm()
    fetchTrainers()
  } catch (err) {
    console.error(err)
    $q.notify({ type: "negative", message: "Failed to save trainer." })
  } finally {
    submitLoading.value = false
  }
}

// Delete Trainer
async function deleteTrainer(id) {
  try {
    const confirmed = await $q.dialog({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this trainer?",
      cancel: true,
      persistent: true
    })
    if (!confirmed) return

    await api.delete(`/admin-api/trainer/${id}`)
    $q.notify({ type: "positive", message: "Trainer deleted successfully!" })
    fetchTrainers()
  } catch (err) {
    console.error(err)
    $q.notify({ type: "negative", message: "Failed to delete trainer." })
  }
}

onMounted(() => {
  fetchDepartments()
  fetchTrainers()
})
</script>

<style scoped lang="sass">
.hover-card
  transition: all 0.2s ease-in-out
  &:hover
    transform: translateY(-4px)
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12)
</style>

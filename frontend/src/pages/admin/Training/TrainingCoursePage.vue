<template>
  <div class="q-pa-md">
    <q-btn color="primary" icon="add" label="Add Training Course" @click="showDialog = true" class="q-mb-md" />
    <!-- Courses Table -->
    <q-table class="styled-table shadow-2 rounded-borders" flat bordered title="Training Courses" :rows="courses" :columns="columns"
      row-key="_id" @request="onRequest">
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="search" placeholder="Search..." outlined clearable
          @update:model-value="onSearch">
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <!-- Create Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 500px" class="q-pa-md">
        <q-card-section>
          <div class="text-h6 text-primary">Add New Course</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <q-form @submit.prevent="submitForm" class="q-gutter-md">
            <q-input v-model="form.tc_topic" label="Topic" outlined />
            <!-- <q-input v-model="form.tc_topic" label="Topic" outlined color="primary" class="bg-primary text-white" /> -->

            <q-input v-model="form.tc_description" label="Description" type="textarea" outlined />

            <q-input v-model="form.tc_start_time" label="Start Date" type="date" outlined />
            <q-input v-model="form.tc_end_time" label="End Date" type="date" outlined />

            <q-input v-model.number="form.tc_session" label="No. of Sessions" type="number" outlined />

            <!-- Program Dropdown -->
            <q-select v-model="form.t_program" :options="programs.map(p => ({ label: p.t_name, value: p._id }))"
              label="Training Program" outlined emit-value map-options />

            <!-- Trainer Dropdown -->
            <q-select v-model="form.trainer" :options="trainers.map(t => ({ label: t.full_name, value: t._id }))"
              label="Trainer" outlined emit-value map-options />


            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancel" color="negative" v-close-popup />
              <q-btn type="submit" label="Save" color="primary" />
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
import { useQuasar } from 'quasar'

const $q = useQuasar()

const courses = ref([])
const showDialog = ref(false)
const loading = ref(false)
const search = ref("")

const form = ref({
  tc_topic: "",
  tc_description: "",
  tc_start_time: "",
  tc_end_time: "",
  tc_session: 1,
  t_program: null,
  trainer: null,
  qrVersion: null
})
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})
const programs = ref([])
const trainers = ref([])

// Table columns
const columns = [
  { name: "tc_topic", label: "Topic", field: "tc_topic", sortable: true },
  { name: "tc_description", label: "Description", field: "tc_description" },
  { name: "tc_start_time", label: "Start Date", field: row => new Date(row.tc_start_time).toLocaleDateString() },
  { name: "tc_end_time", label: "End Date", field: row => new Date(row.tc_end_time).toLocaleDateString() },
  { name: "tc_session", label: "Sessions", field: "tc_session" },
  { name: "program", label: "Program", field: row => row.t_program?.t_name || "-" },
  { name: "trainer", label: "Trainer", field: row => row.trainer?.full_name || "-" }
]

// Fetch dropdowns
async function fetchDropdowns() {
  try {
    const [programRes, trainerRes] = await Promise.all([
      api.get("/admin/get-all-training-program?page=1&limit=100&search="),
      api.get("/admin/get-trainer")
    ])
    programs.value = programRes.data.programs || []
    trainers.value = trainerRes.data.trainers || []
  } catch (err) {
    console.error("Dropdown fetch failed", err)
  }
}

const submitForm = async () => {
  try {
    const res = await api.post("/admin/submit-training-course", form.value)
    $q.notify({
      type: "positive",
      message: res.data.message || "Training created successfully",
      caption: `Status: ${res.data.status}`,
      position: "top-right",
      timeout: 3000
    });

    showDialog.value = false
    form.value = {
      tc_topic: "",
      tc_description: "",
      tc_start_time: "",
      tc_end_time: "",
      tc_session: 1,
      t_program: null,
      trainer: null,
      qrVersion: null
    }
    fetchCourse() // ✅ refresh table after save
  } catch (err) {
    console.error("Submit failed:", err)
  }
}

// fetch function
async function fetchCourse() {
  loading.value = true
  try {
    const { page, rowsPerPage } = pagination.value
    const res = await api.get(
      `/admin/get-all-training-course?page=${page}&limit=${rowsPerPage}&search=${search.value}`
    )

    courses.value = res.data.courses || []   // ✅ store courses
    pagination.value.rowsNumber = res.data.total || 0
  } catch (err) {
    console.error("Error fetching courses", err)
  } finally {
    loading.value = false
  }
}

function onRequest(props) {
  pagination.value = props.pagination
  fetchCourse()
}
function onSearch() {
  pagination.value.page = 1
  fetchCourse()
}

onMounted(() => {
  fetchDropdowns()
  fetchCourse() // ✅ load courses when page loads
})
</script>


<style lang="sass">
.styled-table
  thead tr th
    background-color: #00b4ff
    color: white
    font-weight: bold
    text-transform: uppercase
  tbody tr:nth-child(even)
    background: #f5faff
  tbody tr:hover
    background: #e0f7ff
    transition: background 0.2s
</style>

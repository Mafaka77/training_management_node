<template>
  <div class="q-pa-md">

    <!-- Status Tabs -->
    <q-tabs v-model="statusFilter" dense class="text-primary q-mb-md" align="left" active-color="primary"
      indicator-color="primary">
      <q-tab name="all" label="All" />
      <q-tab name="Upcoming" label="Upcoming" />
      <q-tab name="Ongoing" label="Ongoing" />
      <q-tab name="Finished" label="Finished" />
    </q-tabs>
    <!-- Filters & Search -->
    <div class="row q-col-gutter-md q-mb-md items-center">

      <!-- Search -->
      <div class="col-12 col-md-4">
        <q-input dense debounce="300" v-model="searchQuery" placeholder="Search by program name or description..."
          outlined clearable @update:model-value="currentPage = 1">
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- Category Filter -->
      <div class="col-12 col-md-2">
        <q-select dense v-model="categoryFilter" :options="catOptions.map(c => ({ label: c.label, value: c.value }))"
          label="Category" outlined clearable emit-value map-options @update:model-value="currentPage = 1" />
      </div>

      <!-- Room Filter -->
      <div class="col-12 col-md-2">
        <q-select dense v-model="roomFilter" :options="roomsOptions.map(r => ({ label: r.label, value: r.value }))"
          label="Room" outlined clearable emit-value map-options @update:model-value="currentPage = 1" />
      </div>

      <!-- Trainer Filter (Multi-select) -->
      <div class="col-12 col-md-2">
        <q-select dense v-model="trainerFilter" :options="allTrainersOptions" label="Trainer" outlined clearable
          multiple emit-value map-options @update:model-value="currentPage = 1" />
      </div>

    </div>

    <!-- Programs -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-4" v-for="program in paginatedPrograms" :key="program._id">
        <q-card flat bordered class="shadow-2 rounded-borders hover-card">

          <!-- Banner Hero -->
          <q-img :src="getBannerUrl(program.t_banner)" :ratio="16 / 9" class="rounded-borders-top"
            spinner-color="primary">
            <template v-if="!program.t_banner">
              <div class="absolute-full flex flex-center bg-grey-4">
                <q-icon name="image" size="48px" color="grey-6" />
                <div class="text-grey-6 q-mt-md">No Banner Available</div>
              </div>
            </template>

            <div class="absolute-bottom bg-gradient-to-top text-white q-pa-md">
              <div class="text-h6 q-mb-xs">{{ program.t_name }}</div>
              <div class="text-caption ellipsis">{{ program.t_description }}</div>
              <div class="row items-center q-mt-xs justify-between">
                <q-chip dense :color="getProgramStatusColor(program.t_status)" text-color="white">
                  {{ program.t_status }}
                </q-chip>
                <div class="row items-center">
                  <q-rating v-model="program.averageRating" max="5" color="yellow" readonly size="18px" />
                  <div class="text-caption q-ml-xs">({{ program.ratingsCount }})</div>
                </div>
              </div>
            </div>
          </q-img>

          <!-- Program Details -->
          <q-card-section>
            <div><b>Dates:</b> {{ formatDate(program.t_start_date) }} → {{ formatDate(program.t_end_date) }}</div>
            <div><b>Duration:</b> {{ program.t_duration }} days</div>
            <div><b>Capacity:</b> {{ program.t_capacity > 0 ? program.t_capacity : 'Unlimited' }}</div>
            <div><b>Category:</b> {{ program.t_category?.name || 'N/A' }}</div>
            <div><b>Room:</b> {{ program.t_room?.room_name || 'N/A' }}</div>
          </q-card-section>

          <q-separator />

          <!-- Courses & Trainers Tabs -->
          <q-tabs v-model="activeTab[program._id]" dense class="text-primary" active-color="primary"
            indicator-color="primary">
            <q-tab name="courses" label="Courses" icon="school" />
            <q-tab name="trainers" label="Trainers" icon="person" />
          </q-tabs>

          <q-tab-panels v-model="activeTab[program._id]" animated>
            <q-tab-panel name="courses">
              <q-card-section>
                <q-btn dense color="primary" icon="add" label="Add Course" @click="openCourseDialog(program._id)"
                  class="q-mb-sm" />
                <q-table dense flat bordered :rows="programCourses(program._id)" :columns="courseColumns" row-key="_id"
                  hide-bottom />
              </q-card-section>
            </q-tab-panel>

            <q-tab-panel name="trainers">
              <q-card-section>
                <q-btn dense color="primary" icon="add" label="Add Trainer" @click="openTrainerDialog(program._id)"
                  class="q-mb-sm" />
                <q-table dense flat bordered :rows="programTrainers(program._id)" :columns="trainerColumns"
                  row-key="_id" hide-bottom />
              </q-card-section>
            </q-tab-panel>
          </q-tab-panels>

        </q-card>
      </div>
    </div>

    <!-- Pagination & Rows-per-page -->
    <div class="q-mt-lg q-pa-md flex flex-center column">
      <q-pagination v-model="currentPage" :max="maxPages" max-pages="7" boundary-numbers direction-links color="primary"
        class="q-mb-md" />

      <q-select v-model="rowsPerPage" :options="[6, 12, 24]" label="Rows per page" outlined dense
        style="width: 150px" />
    </div>

    <!-- Loading Indicator -->
    <q-inner-loading :showing="loading">
      <q-spinner color="primary" size="50px" />
    </q-inner-loading>

    <!-- Add Program Dialog -->
    <q-dialog v-model="showProgramDialog" persistent>
      <q-card style="min-width: 600px;" class="q-pa-md q-mb-lg q-mt-lg">
        <q-card-section>
          <div class="text-h6 text-primary">Add Training Program</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitProgram" class="q-gutter-md">
            <q-input v-model="programForm.t_name" label="Name" outlined required />
            <q-input v-model="programForm.t_description" label="Description" type="textarea" outlined />
            <q-input v-model="programForm.t_start_date" type="date" label="Start Date" outlined required />
            <q-input v-model="programForm.t_end_date" type="date" label="End Date" outlined required />
            <q-input v-model.number="programForm.t_duration" label="Duration (days)" type="number" outlined readonly />
            <q-input v-model="programForm.t_eligibility" label="Eligibility" outlined />
            <q-input v-model="programForm.t_organizer" label="Organizer" outlined />
            <q-input v-model.number="programForm.t_capacity" label="Capacity" type="number" outlined />
            <q-select v-model="programForm.t_room" :options="roomsOptions" label="Select Room" outlined emit-value
              map-options required />
            <q-select v-model="programForm.t_category" :options="catOptions" label="Select Category" outlined emit-value
              map-options required />

            <!-- Improved File Upload -->
            <div>
              <div class="text-caption q-mb-xs">Upload Banner</div>
              <q-file v-model="programForm.t_banner" accept="image/*" outlined label="Choose banner image" clearable
                max-file-size="5242880" @rejected="onFileRejected">
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
              <div class="text-caption text-grey">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </div>

              <!-- Preview -->
              <div v-if="programForm.t_banner" class="q-mt-sm">
                <div class="text-caption">Preview:</div>
                <q-img :src="getFilePreview(programForm.t_banner)" style="max-width: 200px; max-height: 100px;"
                  class="q-mt-xs rounded-borders" />
              </div>
            </div>

            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancel" color="negative" v-close-popup />
              <q-btn type="submit" label="Save" color="primary" :loading="submitProgramLoading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Course Dialog -->
    <q-dialog v-model="showCourseDialog" persistent>
      <q-card style="min-width: 500px;" class="q-pa-md q-mb-lg q-mt-lg">
        <q-card-section>
          <div class="text-h6 text-primary">Add New Course to {{ getProgramName(selectedProgramId) }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitCourse" class="q-gutter-md">
            <q-input v-model="courseForm.tc_topic" label="Topic" outlined required />
            <q-input v-model="courseForm.tc_description" label="Description" type="textarea" outlined />
            <q-input v-model="courseForm.tc_start_time" type="date" label="Start Date" outlined required />
            <q-input v-model="courseForm.tc_end_time" type="date" label="End Date" outlined required />
            <q-input v-model.number="courseForm.tc_session" type="number" label="Sessions" outlined />
            <q-select v-model="courseForm.trainer" :options="allTrainersOptions" label="Trainer" outlined emit-value
              map-options required />
            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancel" color="negative" v-close-popup />
              <q-btn type="submit" label="Save" color="primary" :loading="submitCourseLoading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Trainer Dialog -->
    <q-dialog v-model="showTrainerDialog" persistent>
      <q-card style="min-width: 500px;" class="q-pa-md q-mb-lg q-mt-lg">
        <q-card-section>
          <div class="text-h6 text-primary">Add Trainer to {{ getProgramName(selectedTrainerProgramId) }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitTrainer" class="q-gutter-md">
            <q-input v-model="trainerForm.full_name" label="Full Name" outlined required />
            <q-input v-model="trainerForm.email" label="Email" outlined type="email" required />
            <q-input v-model="trainerForm.password" label="Password" outlined type="password" required />
            <q-input v-model="trainerForm.mobile" label="Mobile" outlined required />
            <q-select v-model="trainerForm.department"
              :options="departments.map(d => ({ label: d.name, value: d._id }))" label="Select Department" outlined
              emit-value map-options required />
            <q-input v-model="trainerForm.designation" label="Designation" outlined required />
            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancel" color="negative" v-close-popup />
              <q-btn type="submit" label="Save" color="primary" :loading="submitTrainerLoading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Program Button -->
    <q-btn icon="add" color="primary" label="Add Training Program" @click="openProgramDialog"
      class="fixed-bottom-right q-mr-lg q-mb-lg" />

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue"
import { api } from "boot/axios"
import { useQuasar } from "quasar"

const $q = useQuasar()

// --- State ---
const programs = ref([])
const courses = ref([])
const trainers = ref([])
const departments = ref([])

const currentPage = ref(1)
const rowsPerPage = ref(6)
const loading = ref(false)
const statusFilter = ref("all")

const showProgramDialog = ref(false)
const showCourseDialog = ref(false)
const showTrainerDialog = ref(false)

const selectedProgramId = ref(null)
const selectedTrainerProgramId = ref(null)

const submitProgramLoading = ref(false)
const submitCourseLoading = ref(false)
const submitTrainerLoading = ref(false)


// Filters
const searchQuery = ref('')
const categoryFilter = ref(null)
const roomFilter = ref(null)
const trainerFilter = ref(null)

const programForm = ref({
  t_name: "",
  t_description: "",
  t_start_date: "",
  t_end_date: "",
  t_duration: 0,
  t_eligibility: "",
  t_organizer: "",
  t_capacity: null,
  t_room: null,
  t_category: null,
  t_banner: null
})

const courseForm = ref({
  tc_topic: "",
  tc_description: "",
  tc_start_time: "",
  tc_end_time: "",
  tc_session: 1,
  trainer: null
})

const trainerForm = ref({
  full_name: "",
  email: "",
  password: "",
  mobile: "",
  department: null,
  designation: "",
  district: [],
  roles: []
})

const roomsOptions = ref([])
const catOptions = ref([])

const activeTab = ref({})

// --- Improved Banner URL Handling ---
const getBannerUrl = (banner) => {
  if (!banner) {
    return '' // Return empty string for fallback handling in template
  }

  // If it's already a full URL
  if (banner.startsWith('http://') || banner.startsWith('https://')) {
    return banner
  }

  // If it starts with /, use as is (API returns "/uploads/filename.jpg")
  if (banner.startsWith('/')) {
    return `${api.defaults.baseURL}${banner}`
  }
  // Otherwise, assume it's a filename and prepend /uploads/
  return `${api.defaults.baseURL}/uploads/${banner}`
}

// File preview for upload dialog
const getFilePreview = (file) => {
  if (file instanceof File) {
    return URL.createObjectURL(file)
  }
  return getBannerUrl(file)
}

// File upload rejection handler
const onFileRejected = (rejectedEntries) => {
  $q.notify({
    type: 'negative',
    message: `File rejected: ${rejectedEntries[0]?.failedPropValidation || 'Invalid file'}`
  })
}

const filteredPrograms = computed(() => {
  let filtered = programs.value

  // Status filter
  if (statusFilter.value !== "all") {
    filtered = filtered.filter(p => p.t_status === statusFilter.value)
  }

  // Category filter
  if (categoryFilter.value) {
    filtered = filtered.filter(p => p.t_category?._id === categoryFilter.value)
  }

  // Room filter
  if (roomFilter.value) {
    filtered = filtered.filter(p => p.t_room?._id === roomFilter.value)
  }

  // Trainer filter (multi-select)
  if (trainerFilter.value && trainerFilter.value.length) {
    filtered = filtered.filter(p =>
      courses.value.some(c =>
        c.t_program?._id === p._id && trainerFilter.value.includes(c.trainer?._id)
      )
    )
  }

  // Search filter (name or description)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.t_name.toLowerCase().includes(query) ||
      (p.t_description && p.t_description.toLowerCase().includes(query))
    )
  }

  return filtered
})


const paginatedPrograms = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return filteredPrograms.value.slice(start, end)
})

const maxPages = computed(() =>
  Math.max(1, Math.ceil(filteredPrograms.value.length / rowsPerPage.value))
)

watch([statusFilter, rowsPerPage], () => {
  currentPage.value = 1
})

// --- Columns ---
const courseColumns = [
  { name: "tc_topic", label: "Topic", field: "tc_topic", sortable: true },
  { name: "tc_description", label: "Description", field: "tc_description" },
  { name: "tc_start_time", label: "Start", field: row => new Date(row.tc_start_time).toLocaleDateString() },
  { name: "tc_end_time", label: "End", field: row => new Date(row.tc_end_time).toLocaleDateString() },
  { name: "tc_session", label: "Sessions", field: "tc_session" },
  { name: "trainer", label: "Trainer", field: row => row.trainer?.full_name || "-" }
]

const trainerColumns = [
  { name: "full_name", label: "Name", field: "full_name" },
  { name: "email", label: "Email", field: "email" },
  { name: "mobile", label: "Mobile", field: "mobile" },
  {
    name: "department",
    label: "Department",
    field: row => {
      const dep = departments.value.find(d => d._id === row.department)
      return dep ? dep.name : "-"
    }
  },
  { name: "designation", label: "Designation", field: "designation" }
]

// --- Utility ---
const formatDate = str => new Date(str).toLocaleDateString()

const getProgramStatusColor = status => {
  if (status === "Upcoming") return "secondary"
  if (status === "Ongoing") return "orange"
  if (status === "Finished") return "green"
  return "grey"
}

const getProgramName = programId => programs.value.find(p => p._id === programId)?.t_name || ""

// --- Helpers ---
const programCourses = (programId) => courses.value.filter(c => c.t_program?._id === programId)

const programTrainers = (programId) => {
  const courseList = courses.value.filter(c => c.t_program?._id === programId)
  const trainerSet = new Set(courseList.map(c => c.trainer?._id).filter(Boolean))
  return trainers.value.filter(t => trainerSet.has(t._id))
}

const allTrainersOptions = computed(() =>
  trainers.value.map(t => ({ label: t.full_name, value: t._id }))
)

// --- API Calls ---
async function fetchPrograms() {
  loading.value = true
  try {
    const res = await api.get("/admin/api/get-all-training-program?page=1&limit=100")
    programs.value = res.data.programs || []
    programs.value.forEach(p => {
      activeTab.value[p._id] = "courses"

      // Debug: log banner information
      console.log(`Program: ${p.t_name}`, {
        bannerField: p.t_banner,
        bannerUrl: getBannerUrl(p.t_banner),
        hasBanner: !!p.t_banner
      })
    })

  } catch (err) {
    console.error("Failed to fetch programs:", err)
    $q.notify({ type: "negative", message: "Failed to load programs" })
  } finally {
    loading.value = false
  }
}

async function fetchCourses() {
  try {
    const res = await api.get("/admin/api/get-all-training-course?page=1&limit=100")
    courses.value = res.data.courses || []
  } catch (err) {
    console.error("Failed to fetch courses:", err)
    $q.notify({ type: "negative", message: "Failed to load courses" })
  }
}

async function fetchTrainers() {
  try {
    const res = await api.get("/admin/api/trainers?page=1&limit=100")
    trainers.value = res.data.trainers || []
  } catch (err) {
    console.error("Failed to fetch trainers:", err)
    $q.notify({ type: "negative", message: "Failed to load trainers" })
  }
}

async function fetchDropdowns() {
  try {
    const [roomRes, catRes, deptRes] = await Promise.all([
      api.get("/admin/api/get-training-room"),
      api.get("/admin/api/get-training-category"),
      api.get("/admin/api/departments?limit=100")
    ])

    roomsOptions.value = (roomRes.data.rooms || []).map(r => ({
      label: r.room_name,
      value: r._id
    }))

    catOptions.value = (catRes.data.categories || []).map(c => ({
      label: c.name,
      value: c._id
    }))

    departments.value = deptRes.data.departments || []
  } catch (err) {
    console.error("Failed to fetch dropdowns:", err)
    $q.notify({ type: "negative", message: "Failed to load dropdown options" })
  }
}

// --- Submits ---
async function submitProgram() {
  submitProgramLoading.value = true
  try {
    const formData = new FormData()

    // Append all form fields
    Object.keys(programForm.value).forEach(key => {
      if (programForm.value[key] !== null && programForm.value[key] !== undefined) {
        if (key === 't_banner' && programForm.value[key] instanceof File) {
          formData.append('t_banner', programForm.value[key])
        } else {
          formData.append(key, programForm.value[key])
        }
      }
    })

    // Fixed: removed unused 'response' variable
    await api.post("/admin/api/submit-training-program", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })

    $q.notify({ type: "positive", message: "Program created successfully" })
    showProgramDialog.value = false

    // Reset form
    programForm.value = {
      t_name: "",
      t_description: "",
      t_start_date: "",
      t_end_date: "",
      t_duration: 0,
      t_eligibility: "",
      t_organizer: "",
      t_capacity: null,
      t_room: null,
      t_category: null,
      t_banner: null
    }

    await fetchPrograms()
  } catch (err) {
    console.error("Failed to submit program:", err)
    $q.notify({
      type: "negative",
      message: err.response?.data?.message || "Failed to create program"
    })
  } finally {
    submitProgramLoading.value = false
  }
}

async function submitCourse() {
  submitCourseLoading.value = true
  try {
    courseForm.value.t_program = selectedProgramId.value
    await api.post("/admin/api/submit-training-course", courseForm.value)
    $q.notify({ type: "positive", message: "Course added successfully" })
    showCourseDialog.value = false
    courseForm.value = {
      tc_topic: "",
      tc_description: "",
      tc_start_time: "",
      tc_end_time: "",
      tc_session: 1,
      trainer: null
    }
    await fetchCourses()
  } catch (err) {
    console.error("Failed to submit course:", err)
    $q.notify({
      type: "negative",
      message: err.response?.data?.message || "Failed to add course"
    })
  } finally {
    submitCourseLoading.value = false
  }
}

async function submitTrainer() {
  submitTrainerLoading.value = true
  try {
    trainerForm.value.t_program = selectedTrainerProgramId.value
    await api.post("/admin/api/submit-trainer", trainerForm.value)
    $q.notify({ type: "positive", message: "Trainer added successfully" })
    showTrainerDialog.value = false
    trainerForm.value = {
      full_name: "",
      email: "",
      password: "",
      mobile: "",
      department: null,
      designation: "",
      district: [],
      roles: []
    }
    await fetchTrainers()
  } catch (err) {
    console.error("Failed to submit trainer:", err)
    $q.notify({
      type: "negative",
      message: err.response?.data?.message || "Failed to add trainer"
    })
  } finally {
    submitTrainerLoading.value = false
  }
}

// --- Dialogs ---
function openProgramDialog() {
  showProgramDialog.value = true
}

function openCourseDialog(programId) {
  selectedProgramId.value = programId;
  showCourseDialog.value = true
}

function openTrainerDialog(programId) {
  selectedTrainerProgramId.value = programId;
  showTrainerDialog.value = true
}

// Duration calculation
watch(
  () => [programForm.value.t_start_date, programForm.value.t_end_date],
  ([start, end]) => {
    if (start && end) {
      const startDate = new Date(start)
      const endDate = new Date(end)
      const diffTime = endDate - startDate
      programForm.value.t_duration = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 : 0
    } else {
      programForm.value.t_duration = 0
    }
  }
)

// --- Mounted ---
onMounted(async () => {
  await Promise.all([fetchPrograms(), fetchCourses(), fetchTrainers(), fetchDropdowns()])
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

.hover-card
  transition: all 0.2s ease-in-out
  &:hover
    transform: translateY(-4px)
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12)

// Ensure images display properly
.q-img
  background-color: #f5f5f5
  .q-img__content
    background-size: cover
    background-position: center

// Gradient for banner text overlay
.bg-gradient-to-top
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)

// Custom rounded borders
.rounded-borders-top
  border-top-left-radius: 8px
  border-top-right-radius: 8px

.rounded-borders
  border-radius: 8px
</style>

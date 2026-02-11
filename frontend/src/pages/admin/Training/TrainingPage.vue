<template>
  <div class="q-pa-md">
    <!-- Status Tabs -->
    <q-tabs
      v-model="statusFilter"
      dense
      class="text-primary q-mb-md"
      align="left"
      active-color="primary"
      indicator-color="primary"
    >
      <q-tab name="all" label="All" />
      <q-tab name="Draft" label="Draft" />
      <q-tab name="Upcoming" label="Upcoming" />
      <q-tab name="Ongoing" label="Ongoing" />
      <q-tab name="Completed" label="Completed" />
    </q-tabs>

    <!-- Filters & Search -->
    <div class="row q-col-gutter-md q-mb-md items-center">
      <!-- Search -->
      <div class="col-12 col-md-4">
        <q-input
          dense
          debounce="300"
          v-model="searchQuery"
          placeholder="Search programs..."
          outlined
          clearable
          @update:model-value="currentPage = 1"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- Category Filter -->
      <div class="col-12 col-md-2">
        <q-select
          dense
          v-model="categoryFilter"
          :options="catOptions.map((c) => ({ label: c.label, value: c.value }))"
          label="Category"
          outlined
          clearable
          emit-value
          map-options
          @update:model-value="currentPage = 1"
        />
      </div>

      <!-- Room Filter -->
      <div class="col-12 col-md-2">
        <q-select
          dense
          v-model="roomFilter"
          :options="roomsOptions.map((r) => ({ label: r.label, value: r.value }))"
          label="Room"
          outlined
          clearable
          emit-value
          map-options
          @update:model-value="currentPage = 1"
        />
      </div>

      <!-- Actions -->
      <div class="col-12 col-md-4 text-right">
        <q-btn icon="add" color="primary" label="Add Program" @click="openProgramDialog" />
      </div>
    </div>

    <!-- Programs Table -->
    <q-table
      flat
      bordered
      :rows="paginatedPrograms"
      :columns="columns"
      row-key="_id"
      :loading="loading"
      :pagination="pagination"
      @request="onRequest"
      class="sticky-header-table"
    >
      <!-- Header Slot -->
      <template #top>
        <div class="text-h6">Training Programs</div>
        <q-space />
        <div class="text-caption text-grey">
          Showing {{ filteredPrograms.length }} of {{ programs.length }} programs
        </div>
      </template>

      <!-- Body Slots -->
      <template #body-cell-name="props">
        <q-td :props="props">
          <div class="row items-center no-wrap">
            <div class="q-mr-sm" style="width: 60px; height: 40px">
              <q-img
                :src="getBannerUrl(props.row.t_banner)"
                style="width: 60px; height: 40px; border-radius: 4px"
                class="cursor-pointer"
                @click="showBanner(props.row)"
              >
                <template v-if="!props.row.t_banner">
                  <div class="absolute-full flex flex-center bg-grey-3">
                    <q-icon name="image" size="20px" color="grey-6" />
                  </div>
                </template>
              </q-img>
            </div>
            <div>
              <div class="text-weight-medium">{{ props.row.t_name }}</div>
              <div class="text-caption text-grey-7 ellipsis" style="max-width: 200px">
                {{ props.row.t_description || 'No description' }}
              </div>
            </div>
          </div>
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-chip
            dense
            :color="getProgramStatusColor(props.row.t_status)"
            text-color="white"
            size="sm"
          >
            {{ props.row.t_status }}
          </q-chip>
        </q-td>
      </template>

      <template #body-cell-dates="props">
        <q-td :props="props">
          <div>{{ formatDate(props.row.t_start_date) }}</div>
          <div class="text-caption text-grey-7">to {{ formatDate(props.row.t_end_date) }}</div>
        </q-td>
      </template>

      <template #body-cell-capacity="props">
        <q-td :props="props">
          <div class="row items-center">
            <q-icon name="people" size="16px" class="q-mr-xs" />
            <span>{{ props.row.t_capacity > 0 ? props.row.t_capacity : 'Unlimited' }}</span>
          </div>
        </q-td>
      </template>

      <template #body-cell-rating="props">
        <q-td :props="props">
          <div class="row items-center">
            <q-rating
              :model-value="props.row.averageRating || 0"
              max="5"
              color="yellow"
              readonly
              size="16px"
            />
            <span class="q-ml-xs text-caption">({{ props.row.ratingsCount || 0 }})</span>
          </div>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props">
          <div class="row no-wrap q-gutter-xs">
            <q-btn
              dense
              flat
              color="primary"
              icon="visibility"
              size="sm"
              @click="viewProgramDetails(props.row)"
            >
              <q-tooltip>View Details</q-tooltip>
            </q-btn>
            <q-btn
              dense
              flat
              color="secondary"
              icon="edit"
              size="sm"
              @click="editProgram(props.row)"
            >
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn
              dense
              flat
              color="negative"
              icon="delete"
              size="sm"
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <!-- Empty State -->
      <template #no-data>
        <div class="full-width row flex-center text-grey q-gutter-sm q-py-lg">
          <q-icon name="info" size="2em" />
          <span>No programs found</span>
          <q-btn flat label="Create First Program" color="primary" @click="openProgramDialog" />
        </div>
      </template>
    </q-table>

    <!-- Banner Preview Dialog -->
    <q-dialog v-model="showBannerDialog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedProgram?.t_name }} - Banner</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-img
            :src="getBannerUrl(selectedProgram?.t_banner)"
            style="max-width: 600px; max-height: 400px"
            class="rounded-borders"
          >
            <template v-if="!selectedProgram?.t_banner">
              <div class="absolute-full flex flex-center bg-grey-3">
                <q-icon name="image" size="48px" color="grey-6" />
                <div class="text-grey-6 q-mt-md">No Banner Available</div>
              </div>
            </template>
          </q-img>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add/Edit Program Dialog -->
    <q-dialog v-model="showProgramDialog" persistent>
      <q-card style="min-width: 600px; max-width: 800px" class="q-pa-md">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-primary">{{ editMode ? 'Edit' : 'Add' }} Training Program</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 70vh" class="scroll">
          <q-form @submit.prevent="submitProgram" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <!-- Left Column -->
              <div class="col-12 col-md-6">
                <q-input
                  v-model="programForm.t_name"
                  label="Program Name"
                  outlined
                  required
                  :rules="[required('Program name is required')]"
                />

                <q-input
                  v-model="programForm.t_description"
                  label="Description"
                  type="textarea"
                  outlined
                  rows="3"
                />

                <div class="row q-col-gutter-sm">
                  <div class="col-6">
                    <q-input
                      v-model="programForm.t_start_date"
                      type="date"
                      label="Start Date"
                      outlined
                      required
                      :rules="[() => validDates()]"
                      @update:model-value="calculateDuration"
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      v-model="programForm.t_end_date"
                      type="date"
                      label="End Date"
                      outlined
                      required
                      :rules="[() => validDates()]"
                      @update:model-value="calculateDuration"
                    />
                  </div>
                </div>

                <q-input
                  v-model.number="programForm.t_duration"
                  label="Duration (days)"
                  type="number"
                  outlined
                  readonly
                />

                <q-input
                  v-model="programForm.t_eligibility"
                  label="Eligibility Criteria"
                  outlined
                />
              </div>

              <!-- Right Column -->
              <div class="col-12 col-md-6">
                <q-input v-model="programForm.t_organizer" label="Organizer" outlined />

                <q-input
                  v-model.number="programForm.t_capacity"
                  label="Capacity"
                  type="number"
                  outlined
                  hint="-1 for unlimited"
                  :rules="[validCapacity]"
                />

                <q-select
                  v-model="programForm.t_room"
                  :options="roomsOptions"
                  label="Select Room"
                  outlined
                  emit-value
                  map-options
                  :rules="[required('Room is required')]"
                />

                <q-select
                  v-model="programForm.t_category"
                  :options="catOptions"
                  label="Select Category"
                  outlined
                  emit-value
                  map-options
                  :rules="[required('Category is required')]"
                />

                <!-- Banner Upload -->
                <div>
                  <div class="text-caption q-mb-xs">Program Banner</div>
                  <q-file
                    v-model="programForm.t_banner"
                    accept="image/*"
                    outlined
                    label="Choose banner image"
                    clearable
                    max-file-size="5242880"
                    :rules="[(val) => !isCreateMode || !!val || 'Banner is required']"
                    @rejected="onFileRejected"
                  >
                    <template #prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>

                  <div class="text-caption text-grey">Max size: 5MB (JPG, PNG, GIF)</div>

                  <!-- Preview -->
                  <div v-if="programForm.t_banner" class="q-mt-sm">
                    <div class="text-caption">Preview:</div>
                    <q-img
                      :src="getFilePreview(programForm.t_banner)"
                      style="max-width: 200px; max-height: 100px"
                      class="q-mt-xs rounded-borders"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="row justify-end q-gutter-sm q-mt-lg">
              <q-btn flat label="Cancel" color="negative" v-close-popup />
              <q-btn
                type="submit"
                :label="editMode ? 'Update' : 'Save'"
                color="primary"
                :loading="submitProgramLoading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()

const $q = useQuasar()

// --- State ---
const programs = ref([])
const loading = ref(false)
const statusFilter = ref('all')
const showProgramDialog = ref(false)
const showBannerDialog = ref(false)
const editMode = ref(false)
const submitProgramLoading = ref(false)
const selectedProgram = ref(null)
const isCreateMode = computed(() => !editMode.value)

// Filters
const searchQuery = ref('')
const categoryFilter = ref(null)
const roomFilter = ref(null)
// generic required validator
const required = (msg) => (val) => !!val || msg

// capacity validator (backend-safe)
const validCapacity = (val) => {
  if (val === null || val === '') return true
  if (val === -1) return true
  if (val > 0) return true
  return 'Capacity must be greater than 0 or -1 for unlimited'
}

// date validator (mirrors backend logic)
const validDates = () => {
  const { t_start_date, t_end_date } = programForm.value

  if (!t_start_date || !t_end_date) {
    return 'Start Date and End Date are required'
  }

  const start = new Date(t_start_date)
  const end = new Date(t_end_date)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid date format'
  }

  if (end < start) {
    return 'End Date cannot be earlier than Start Date'
  }

  return true
}
// Table pagination
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const programForm = ref({
  t_name: '',
  t_description: '',
  t_start_date: '',
  t_end_date: '',
  t_duration: 0,
  t_eligibility: '',
  t_organizer: '',
  t_capacity: null,
  t_room: null,
  t_category: null,
  t_banner: null,
})

const roomsOptions = ref([])
const catOptions = ref([])

// Table Columns
const columns = [
  {
    name: 'name',
    required: true,
    label: 'PROGRAM',
    align: 'left',
    field: (row) => row.t_name,
    sortable: true,
  },
  {
    name: 'status',
    label: 'STATUS',
    align: 'center',
    field: (row) => row.t_status,
    sortable: true,
  },
  {
    name: 'dates',
    label: 'DATES',
    align: 'center',
    field: (row) => row.t_start_date,
    sortable: true,
    sort: (a, b) => new Date(a) - new Date(b),
  },
  {
    name: 'duration',
    label: 'DURATION',
    align: 'center',
    field: (row) => `${row.t_duration} days`,
    sortable: true,
  },
  {
    name: 'category',
    label: 'CATEGORY',
    align: 'center',
    field: (row) => row.t_category?.name,
    sortable: true,
  },
  {
    name: 'room',
    label: 'ROOM',
    align: 'center',
    field: (row) => row.t_room?.room_name,
    sortable: true,
  },
  {
    name: 'capacity',
    label: 'CAPACITY',
    align: 'center',
    field: (row) => row.t_capacity,
    sortable: true,
  },
  {
    name: 'rating',
    label: 'RATING',
    align: 'center',
    field: (row) => row.averageRating,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'ACTIONS',
    align: 'center',
    sortable: false,
  },
]

// --- Computed Properties ---
const filteredPrograms = computed(() => {
  let filtered = programs.value

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter((p) => p.t_status === statusFilter.value)
  }

  // Category filter
  if (categoryFilter.value) {
    filtered = filtered.filter((p) => p.t_category?._id === categoryFilter.value)
  }

  // Room filter
  if (roomFilter.value) {
    filtered = filtered.filter((p) => p.t_room?._id === roomFilter.value)
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.t_name.toLowerCase().includes(query) ||
        (p.t_description && p.t_description.toLowerCase().includes(query)) ||
        (p.t_organizer && p.t_organizer.toLowerCase().includes(query)) ||
        (p.t_category?.name && p.t_category.name.toLowerCase().includes(query)),
    )
  }

  return filtered
})

const paginatedPrograms = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
  const end = start + pagination.value.rowsPerPage
  return filteredPrograms.value.slice(start, end)
})

// --- Utility Functions ---
const getBannerUrl = (banner) => {
  if (!banner) return ''
  if (banner.startsWith('http://') || banner.startsWith('https://')) return banner
  if (banner.startsWith('/')) return `${api.defaults.baseURL}${banner}`
  return `${api.defaults.baseURL}/uploads/${banner}`
}

const getFilePreview = (file) => {
  if (file instanceof File) return URL.createObjectURL(file)
  return getBannerUrl(file)
}

const formatDate = (str) => {
  if (!str) return 'N/A'
  const date = new Date(str)
  if (isNaN(date.getTime())) return 'Invalid Date'

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getProgramStatusColor = (status) => {
  const colors = {
     Draft: 'grey-7',
    Upcoming: 'secondary',
    Ongoing: 'orange',
    Completed: 'green',
  }
  return colors[status] || 'grey'
}

const onFileRejected = (rejectedEntries) => {
  $q.notify({
    type: 'negative',
    message: `File rejected: ${rejectedEntries[0]?.failedPropValidation || 'Invalid file'}`,
  })
}

// --- Table Functions ---
function onRequest(props) {
  const { page, rowsPerPage } = props.pagination
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.rowsNumber = filteredPrograms.value.length
}

// --- API Functions ---
async function fetchPrograms() {
  loading.value = true
  try {
    const res = await api.get('/admin-api/get-all-training-program?page=1&limit=100')

    programs.value = (res.data.programs || []).map(p => ({
      ...p,
      t_status: p.t_status === 'Finished' ? 'Completed' : p.t_status
    }))

    pagination.value.rowsNumber = programs.value.length
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Failed to load programs', err })
  } finally {
    loading.value = false
  }
}


async function fetchDropdowns() {
  try {
    const [roomRes, catRes] = await Promise.all([
      api.get('/admin-api/get-training-room'),
      api.get('/admin-api/get-training-category'),
    ])

    roomsOptions.value = (roomRes.data.rooms || []).map((r) => ({
      label: r.room_name,
      value: r._id,
    }))

    catOptions.value = (catRes.data.categories || []).map((c) => ({
      label: c.name,
      value: c._id,
    }))
  } catch (err) {
    console.error('Failed to fetch dropdowns:', err)
    $q.notify({ type: 'negative', message: 'Failed to load dropdown options' })
  }
}

async function submitProgram() {
  submitProgramLoading.value = true
  try {
    const formData = new FormData()

    Object.keys(programForm.value).forEach((key) => {
      if (programForm.value[key] !== null && programForm.value[key] !== undefined) {
        if (key === 't_banner' && programForm.value[key] instanceof File) {
          formData.append('t_banner', programForm.value[key])
        } else {
          formData.append(key, programForm.value[key])
        }
      }
    })

    const url = editMode.value
      ? `/admin-api/update-training-program/${programForm.value._id}`
      : '/admin-api/submit-training-program'

    const method = editMode.value ? 'put' : 'post'

    const response = await api[method](url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    if (response.status == 200) {
      if (response.data.status == 409) {
        $q.notify({ type: 'negative', message: response.data.message })
      } else if (response.data.status == 201) {
        resetForm()
        await fetchPrograms()
        $q.notify({ type: 'positive', message: response.data.message })
      } else {
        $q.notify({ type: 'negative', message: response.data.message })
      }
    }

    showProgramDialog.value = false
  } catch (err) {
    console.error('Failed to submit program:', err)
    $q.notify({
      type: 'negative',
      message:
        err.response?.data?.message || `Failed to ${editMode.value ? 'update' : 'create'} program`,
    })
  } finally {
    submitProgramLoading.value = false
  }
}

async function deleteProgram(programId) {
  try {
    await api.delete(`/admin-api/admin-api/program/${programId}`)
    $q.notify({ type: 'positive', message: 'Program deleted successfully' })
    await fetchPrograms()
  } catch (err) {
    console.error('Failed to delete program:', err)
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Failed to delete program',
    })
  }
}

// --- UI Functions ---
function openProgramDialog() {
  editMode.value = false
  resetForm()
  showProgramDialog.value = true
}

function editProgram(program) {
  editMode.value = true
  programForm.value = { ...program }

  // Trigger duration calculation when editing
  calculateDuration()

  showProgramDialog.value = true
}

function resetForm() {
  programForm.value = {
    t_name: '',
    t_description: '',
    t_start_date: '',
    t_end_date: '',
    t_duration: 0,
    t_eligibility: '',
    t_organizer: '',
    t_capacity: null,
    t_room: null,
    t_category: null,
    t_banner: null,
  }
}

function viewProgramDetails(program) {
  router.push(`/admin/training/${program._id}`)
}

function showBanner(program) {
  selectedProgram.value = program
  showBannerDialog.value = true
}

function confirmDelete(program) {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete "${program.t_name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteProgram(program._id)
  })
}

// Duration calculation
const calculateDuration = () => {
  const { t_start_date, t_end_date } = programForm.value

  if (t_start_date && t_end_date) {
    try {
      const startDate = new Date(t_start_date)
      const endDate = new Date(t_end_date)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        programForm.value.t_duration = 0
        return
      }

      const diffTime = endDate - startDate
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      programForm.value.t_duration = Math.max(0, Math.ceil(diffDays))
    } catch (error) {
      console.error('Error calculating duration:', error)
      programForm.value.t_duration = 0
    }
  } else {
    programForm.value.t_duration = 0
  }
}

// --- Mounted ---
onMounted(async () => {
  await Promise.all([fetchPrograms(), fetchDropdowns()])
})
</script>

<style lang="sass">
.sticky-header-table
  .q-table__top
    border-bottom: 1px solid #e0e0e0

  .q-table__middle
    max-height: calc(100vh - 250px)

  .q-td, .q-th
    padding: 8px 16px

  .q-th
    font-weight: 600
    text-transform: uppercase
    font-size: 12px
    color: #666

  .q-tr:hover
    background-color: #f5f9ff

.ellipsis
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.rounded-borders
  border-radius: 8px

// Status colors
.text-secondary
  color: $secondary !important

.text-orange
  color: $orange !important

.text-green
  color: $green !important
</style>

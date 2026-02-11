<template>
  <div v-if="loading" class="flex flex-center q-pa-xl">
    <q-spinner color="primary" size="50px" />
  </div>

  <div v-else class="q-pa-md">
    <!-- Back -->
    <q-btn
      flat
      icon="arrow_back"
      label="Back to Programs"
      class="q-mb-md"
      @click="$router.back()"
    />

    <!-- ================= PROGRAM CARD ================= -->
    <q-card flat bordered class="q-pa-lg q-mb-lg">
      <div class="row q-col-gutter-xl items-start">
        <!-- Banner -->
        <div class="col-3">
          <q-img
            :src="getBannerUrl(program.t_banner)"
            @click="showBanner(program)"
            ratio="16/9"
            class="rounded-borders"
            style="min-height: 180px"
            spinner-color="primary"
          >
            <template #loading>
              <div class="absolute-full flex flex-center">
                <q-spinner color="primary" />
              </div>
            </template>

            <template #error>
              <div class="absolute-full flex flex-center bg-grey-2">
                <q-icon name="image" size="48px" color="grey-6" />
              </div>
            </template>
          </q-img>
        </div>

        <!-- Info -->
        <div class="col-9">
          <div class="text-h4 text-weight-bold q-mb-sm">
            {{ program.t_name }}
          </div>

          <div class="text-body1 text-grey-7 q-mb-md">
            {{ program.t_description || '—' }}
          </div>

          <div class="row q-col-gutter-md text-body2">
            <div class="col-6"><b>Duration:</b> {{ program.t_duration }} days</div>
            <div class="col-6"><b>Capacity:</b> {{ program.t_capacity ?? 'Unlimited' }}</div>
            <div class="col-6">
              <b>Dates:</b>
              {{ formatDate(program.t_start_date) }} –
              {{ formatDate(program.t_end_date) }}
            </div>
            <div class="col-6">
              <b>Status:</b>
              <q-badge :color="getProgramStatusColor(program.t_status)">
                {{ program.t_status }}
              </q-badge>
            </div>
            <q-btn
              v-if="program.t_status === 'Draft'"
              color="primary"
              icon="publish"
              label="Publish Program"
              class="q-mt-sm"
              @click="publishProgram"
            />
          </div>
        </div>
      </div>
    </q-card>

    <!-- ================= STICKY COURSE HEADER ================= -->
    <div class="sticky-course-header q-pa-sm q-mb-sm">
      <div class="row items-center">
        <div class="col">
          <div class="row items-center q-gutter-sm">
            <div class="text-h5">Courses in this Program</div>
          </div>

          <div class="text-caption text-grey">
            {{ program.t_name }}
          </div>
        </div>

        <div class="col-auto">
          <q-btn
            color="primary"
            icon="add"
            label="Add Course"
            :disable="program.t_status === 'Finished' || !trainersLoaded || capacityReached"
            @click="showAddCourseDialog = true"
          >
            <q-tooltip v-if="capacityReached"> Course capacity reached </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <q-separator class="q-mb-md" />

    <!-- ================= COURSE TABLE ================= -->
    <q-card flat bordered>
      <q-table
        flat
        :rows="paginatedCourses"
        :columns="courseColumns"
        row-key="_id"
        class="sticky-header-table"
        no-data-label="No courses found for this program"
      >
        <template #body-cell-topic="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{ props.row.tc_topic }}
            </div>
            <div class="text-caption text-grey-7">
              {{ props.row.tc_description || 'No description' }}
            </div>
          </q-td>
        </template>

        <template #body-cell-dates="props">
          <q-td :props="props">
            {{ formatDateTime(props.row.tc_start_time) }}
            <div class="text-caption text-grey-7">
              to {{ formatDateTime(props.row.tc_end_time) }}
            </div>
          </q-td>
        </template>

        <template #body-cell-trainer="props">
          <q-td :props="props">
            {{ props.row.trainerName || '—' }}
          </q-td>
        </template>

        <template #bottom>
          <div class="row justify-center q-pa-md">
            <q-pagination
              v-model="page"
              :max="totalPages"
              :max-pages="6"
              boundary-numbers
              color="primary"
            />
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- ================= ADD COURSE DIALOG ================= -->
    <q-dialog v-model="showAddCourseDialog" persistent>
      <q-card style="min-width: 500px" class="q-pa-md">
        <q-card-section class="text-h6"> Add Sessions </q-card-section>

        <q-form @submit.prevent="submitCourse" class="q-gutter-md">
          <q-input label="Program" :model-value="program.t_name" readonly outlined />

          <q-input
            v-model="courseForm.tc_topic"
            label="Topic"
            outlined
            :rules="[required('Topic is required')]"
          />

          <q-input
            v-model="courseForm.tc_description"
            label="Description"
            type="textarea"
            outlined
          />
          <q-input
            v-model="courseForm.tc_date"
            type="date"
            label="Course Date"
            outlined
            :rules="[required('Date is required')]"
          />

          <div class="row q-col-gutter-sm">
            <q-input
              v-model="courseForm.tc_start_time"
              type="time"
              label="Start Time"
              outlined
              :rules="[required('Start time is required')]"
            />

            <q-input
              v-model="courseForm.tc_end_time"
              type="time"
              label="End Time"
              outlined
              :rules="[required('End time is required'), validTimeOrder]"
            />
          </div>

          <q-input
            v-model.number="courseForm.tc_session"
            type="number"
            label="Sessions"
            outlined
            min="1"
          />

          <q-select
            v-model="courseForm.trainer"
            :options="trainerOptions"
            label="Trainer"
            outlined
            emit-value
            map-options
            clearable
            :disable="trainerOptions.length === 0"
            hint="Select a trainer"
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn color="primary" type="submit" :loading="courseLoading" label="Add" />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const route = useRoute()

const loading = ref(true)
const courseLoading = ref(false)

const program = ref({})
const trainers = ref([])
const showAddCourseDialog = ref(false)

const page = ref(1)
const rowsPerPage = 5
// Validation
const required = (msg) => (val) => !!val || msg
const combineDateTime = (date, time) => {
  if (!date || !time) return null
  const iso = `${date}T${time}`
  const d = new Date(iso)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

const validTimeOrder = () => {
  const { tc_date, tc_start_time, tc_end_time } = courseForm.value
  if (!tc_date || !tc_start_time || !tc_end_time) return true

  const start = new Date(`${tc_date}T${tc_start_time}`)
  const end = new Date(`${tc_date}T${tc_end_time}`)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid date or time'
  }
  if (end <= start) {
    return 'End time must be after start time'
  }
  return true
}

// ---------- COMPUTED ----------
const trainersLoaded = computed(() => trainers.value.length > 0)

const courses = computed(() => {
  if (!program.value.trainingCourse) return []
  return program.value.trainingCourse.map((c) => ({
    ...c,
    trainerName: trainers.value.find((t) => t._id === c.trainer)?.full_name || '',
  }))
})

const capacityReached = computed(() => {
  if (program.value.t_capacity == null) return false
  return courses.value.length >= program.value.t_capacity
})

const totalPages = computed(() => Math.ceil(courses.value.length / rowsPerPage))

const paginatedCourses = computed(() => {
  const start = (page.value - 1) * rowsPerPage
  return courses.value.slice(start, start + rowsPerPage)
})

const trainerOptions = computed(() =>
  trainers.value.map((t) => ({
    label: t.full_name,
    value: t._id,
  })),
)

// ---------- TABLE ----------
const courseColumns = [
  { name: 'topic', label: 'TOPIC', field: (row) => row.tc_topic, align: 'left', sortable: true },
  {
    name: 'dates',
    label: 'DATES',
    field: (row) => row.tc_start_time,
    sortable: true,
    sort: (a, b) => new Date(a) - new Date(b),
  },
  { name: 'trainer', label: 'TRAINER', field: (row) => row.trainerName, sortable: true },
]

// ---------- UTILS ----------
const getBannerUrl = (banner) => {
  if (!banner) return ''
  if (banner.startsWith('http://') || banner.startsWith('https://')) return banner
  if (banner.startsWith('/')) return `${api.defaults.baseURL}${banner}`
  return `${api.defaults.baseURL}/uploads/${banner}`
}
// function showBanner(program) {
//   selectedProgram.value = program
//   showBannerDialog.value = true
// }

const formatDate = (d) => new Date(d).toLocaleDateString()
const formatDateTime = (d) => new Date(d).toLocaleString()

const getProgramStatusColor = (s) =>
  ({ Upcoming: 'secondary', Ongoing: 'orange', Completed: 'green' })[s] || 'grey'

// ---------- API ----------
async function fetchProgram() {
  const res = await api.get(`/admin-api/program/${route.params.id}`)
  program.value = res.data.trainingProgram
}

async function submitCourse() {
  courseLoading.value = true
  try {
    const tc_start_time = combineDateTime(courseForm.value.tc_date, courseForm.value.tc_start_time)
    const tc_end_time = combineDateTime(courseForm.value.tc_date, courseForm.value.tc_end_time)

    if (!tc_start_time || !tc_end_time) {
      $q.notify({ type: 'negative', message: 'Invalid date or time' })
      return
    }

    const res = await api.post('/admin-api/submit-training-course', {
      tc_topic: courseForm.value.tc_topic,
      tc_description: courseForm.value.tc_description,
      tc_date: courseForm.value.tc_date, // 👈 backend uses this
      tc_start_time,
      tc_end_time,
      tc_session: courseForm.value.tc_session,
      trainer: courseForm.value.trainer,
      t_program: route.params.id,
    })

    if (res.data.status === 409 || res.data.status === 400) {
      $q.notify({ type: 'negative', message: res.data.message })
      return
    }

    $q.notify({ type: 'positive', message: res.data.message })

    showAddCourseDialog.value = false
    await fetchProgram()

    // reset
    courseForm.value = {
      tc_topic: '',
      tc_description: '',
      tc_date: '',
      tc_start_time: '',
      tc_end_time: '',
      tc_session: 1,
      trainer: null,
    }
  } finally {
    courseLoading.value = false
  }
}

const courseForm = ref({
  tc_topic: '',
  tc_description: '',
  tc_date: '', // 👈 date only
  tc_start_time: '', // 👈 time only (HH:mm)
  tc_end_time: '', // 👈 time only (HH:mm)
  tc_session: 1,
  trainer: null,
})
async function publishProgram () {
  try {
    await api.put(`/admin-api/update-training-program/${program.value._id}`, {
      t_status: 'Upcoming'
    })

    program.value.t_status = 'Upcoming'

    $q.notify({
      type: 'positive',
      message: 'Program published. Status set to Upcoming.'
    })
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: `Failed to publish program: ${err.message}`,
    })
  }
}

onMounted(async () => {
  trainers.value = (await api.get('/admin-api/get-trainer')).data.trainers || []
  await fetchProgram()
  loading.value = false
})
</script>

<style lang="sass">
.sticky-course-header
  position: sticky
  top: 0
  z-index: 3
  background: white
  border-bottom: 1px solid #e0e0e0

.sticky-header-table
  .q-table__middle
    max-height: calc(100vh - 300px)

  .q-th
    font-weight: 600
    text-transform: uppercase
    font-size: 12px
    color: #666

  .q-tr:hover
    background-color: #f5f9ff

.rounded-borders
  border-radius: 8px
</style>

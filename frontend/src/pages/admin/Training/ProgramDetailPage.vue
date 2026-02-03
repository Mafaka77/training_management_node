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
            ratio="16/9"
            class="rounded-borders"
            style="min-height:180px"
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

            <!-- Course Count -->
            <q-badge color="primary" outline>
              {{ courseCount }} / {{ program.t_capacity ?? '∞' }}
            </q-badge>
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
            :disable="program.t_status === 'Finished'
              || !trainersLoaded
              || capacityReached"
            @click="showAddCourseDialog = true"
          >
            <q-tooltip v-if="capacityReached">
              Course capacity reached
            </q-tooltip>
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
      <q-card style="min-width:500px" class="q-pa-md">
        <q-card-section class="text-h6">
          Add Course
        </q-card-section>

        <q-form @submit.prevent="submitCourse" class="q-gutter-md">
          <q-input
            label="Program"
            :model-value="program.t_name"
            readonly
            outlined
          />

          <q-input v-model="courseForm.tc_topic" label="Topic" outlined required />
          <q-input
            v-model="courseForm.tc_description"
            label="Description"
            type="textarea"
            outlined
          />

          <div class="row q-col-gutter-sm">
            <q-input
              class="col-6"
              type="datetime-local"
              v-model="courseForm.tc_start_time"
              outlined
              required
            />
            <q-input
              class="col-6"
              type="datetime-local"
              v-model="courseForm.tc_end_time"
              outlined
              required
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
            <q-btn
              color="primary"
              type="submit"
              :loading="courseLoading"
              label="Add"
            />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'

const route = useRoute()

const loading = ref(true)
const courseLoading = ref(false)

const program = ref({})
const trainers = ref([])
const showAddCourseDialog = ref(false)

const page = ref(1)
const rowsPerPage = 5

// ---------- COMPUTED ----------
const trainersLoaded = computed(() => trainers.value.length > 0)

const courses = computed(() => {
  if (!program.value.trainingCourse) return []
  return program.value.trainingCourse.map(c => ({
    ...c,
    trainerName: trainers.value.find(t => t._id === c.trainer)?.full_name || ''
  }))
})

const courseCount = computed(() => courses.value.length)

const capacityReached = computed(() => {
  if (program.value.t_capacity == null) return false
  return courseCount.value >= program.value.t_capacity
})

const totalPages = computed(() =>
  Math.ceil(courses.value.length / rowsPerPage)
)

const paginatedCourses = computed(() => {
  const start = (page.value - 1) * rowsPerPage
  return courses.value.slice(start, start + rowsPerPage)
})

const trainerOptions = computed(() =>
  trainers.value.map(t => ({
    label: t.full_name,
    value: t._id
  }))
)

// ---------- TABLE ----------
const courseColumns = [
  { name: 'topic', label: 'TOPIC', field: row => row.tc_topic, align: 'left', sortable: true },
  {
    name: 'dates',
    label: 'DATES',
    field: row => row.tc_start_time,
    sortable: true,
    sort: (a, b) => new Date(a) - new Date(b)
  },
  { name: 'trainer', label: 'TRAINER', field: row => row.trainerName, sortable: true }
]

// ---------- UTILS ----------
const getBannerUrl = (banner) => {
  if (!banner) return ''
  if (banner.startsWith('http')) return banner
  if (banner.startsWith('/uploads')) return `${window.location.origin}${banner}`
  return banner
}

const formatDate = d => new Date(d).toLocaleDateString()
const formatDateTime = d => new Date(d).toLocaleString()

const getProgramStatusColor = s =>
  ({ Upcoming: 'secondary', Ongoing: 'orange', Finished: 'green' }[s] || 'grey')

// ---------- API ----------
async function fetchProgram () {
  const res = await api.get(`/admin-api/program/${route.params.id}`)
  program.value = res.data.trainingProgram
}

async function submitCourse () {
  courseLoading.value = true

  await api.post('/admin-api/submit-training-course', {
    ...courseForm.value,
    t_program: route.params.id,
    tc_start_time: new Date(courseForm.value.tc_start_time).toISOString(),
    tc_end_time: new Date(courseForm.value.tc_end_time).toISOString()
  })

  showAddCourseDialog.value = false
  await fetchProgram()
  courseLoading.value = false

  courseForm.value = {
    tc_topic: '',
    tc_description: '',
    tc_start_time: '',
    tc_end_time: '',
    tc_session: 1,
    trainer: null
  }
}

const courseForm = ref({
  tc_topic: '',
  tc_description: '',
  tc_start_time: '',
  tc_end_time: '',
  tc_session: 1,
  trainer: null
})

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

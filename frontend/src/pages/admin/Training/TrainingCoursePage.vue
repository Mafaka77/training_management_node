<template>
  <div class="q-pa-md">

    <!-- Header -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h4 text-weight-bold">
          Training Courses
          <q-badge
            outline
            color="primary"
            class="q-ml-sm"
          >
            {{ pagination.rowsNumber }}
          </q-badge>
        </div>
        <div class="text-caption text-grey">
          Manage all training courses
        </div>
      </div>

      <div class="col-auto row items-center q-gutter-sm">
        <q-input
          dense
          outlined
          debounce="300"
          v-model="search"
          placeholder="Search courses..."
          clearable
          @update:model-value="onSearch"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          color="primary"
          icon="add"
          label="Add Course"
          @click="showDialog = true"
        />
      </div>
    </div>

    <q-separator class="q-mb-md" />

    <!-- Courses Table -->
    <q-card flat bordered>
      <q-table
        flat
        bordered
        row-key="_id"
        class="sticky-header-table"
        :rows="courses"
        :columns="columns"
        :loading="loading"
        v-model:pagination="pagination"
        @request="onRequest"
        no-data-label="No courses found"
      >
        <!-- Topic column -->
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

        <!-- Dates -->
        <template #body-cell-dates="props">
          <q-td :props="props">
            {{ formatDate(props.row.tc_start_time) }}
            <div class="text-caption text-grey-7">
              to {{ formatDate(props.row.tc_end_time) }}
            </div>
          </q-td>
        </template>

        <!-- Program -->
        <template #body-cell-program="props">
          <q-td :props="props">
            {{ props.row.t_program?.t_name || '—' }}
          </q-td>
        </template>

        <!-- Trainer -->
        <template #body-cell-trainer="props">
          <q-td :props="props">
            {{ props.row.trainer?.full_name || '—' }}
          </q-td>
        </template>

        <!-- Empty -->
        <template #no-data>
          <div class="full-width row flex-center q-pa-lg text-grey">
            <q-icon name="school" size="md" class="q-mr-sm" />
            No training courses available
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Add Course Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 520px" class="q-pa-md">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-primary">Add Course</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="submitForm" class="q-gutter-md">

            <q-input v-model="form.tc_topic" label="Topic" outlined required />
            <q-input
              v-model="form.tc_description"
              label="Description"
              type="textarea"
              outlined
            />

            <div class="row q-col-gutter-sm">
              <q-input
                class="col-6"
                type="date"
                v-model="form.tc_start_time"
                label="Start Date"
                outlined
              />
              <q-input
                class="col-6"
                type="date"
                v-model="form.tc_end_time"
                label="End Date"
                outlined
              />
            </div>

            <q-input
              v-model.number="form.tc_session"
              label="Sessions"
              type="number"
              outlined
              min="1"
            />

            <q-select
              v-model="form.t_program"
              :options="programOptions"
              label="Training Program"
              outlined
              emit-value
              map-options
            />

            <q-select
              v-model="form.trainer"
              :options="trainerOptions"
              label="Trainer"
              outlined
              emit-value
              map-options
              clearable
            />

            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                color="primary"
                label="Save"
                type="submit"
                :loading="saving"
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

const $q = useQuasar()

const courses = ref([])
const programs = ref([])
const trainers = ref([])

const loading = ref(false)
const saving = ref(false)
const search = ref('')
const showDialog = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

const form = ref({
  tc_topic: '',
  tc_description: '',
  tc_start_time: '',
  tc_end_time: '',
  tc_session: 1,
  t_program: null,
  trainer: null
})

const columns = [
  { name: 'topic', label: 'TOPIC', align: 'left' },
  { name: 'dates', label: 'DATES', align: 'left' },
  { name: 'tc_session', label: 'SESSIONS', field: 'tc_session', align: 'center' },
  { name: 'program', label: 'PROGRAM', align: 'left' },
  { name: 'trainer', label: 'TRAINER', align: 'left' }
]

const programOptions = computed(() =>
  programs.value.map(p => ({ label: p.t_name, value: p._id }))
)

const trainerOptions = computed(() =>
  trainers.value.map(t => ({ label: t.full_name, value: t._id }))
)

const formatDate = d => new Date(d).toLocaleDateString()

async function fetchCourses () {
  loading.value = true
  const { page, rowsPerPage } = pagination.value

  const res = await api.get(
    `/admin-api/get-all-training-course?page=${page}&limit=${rowsPerPage}&search=${search.value}`
  )

  courses.value = res.data.courses || []
  pagination.value.rowsNumber = res.data.total || 0
  loading.value = false
}

function onRequest (props) {
  pagination.value = props.pagination
  fetchCourses()
}

function onSearch () {
  pagination.value.page = 1
  fetchCourses()
}

async function submitForm () {
  saving.value = true

  await api.post('/admin-api/submit-training-course', {
    ...form.value
  })

  $q.notify({ type: 'positive', message: 'Course added successfully' })

  showDialog.value = false
  saving.value = false
  form.value = {
    tc_topic: '',
    tc_description: '',
    tc_start_time: '',
    tc_end_time: '',
    tc_session: 1,
    t_program: null,
    trainer: null
  }

  fetchCourses()
}

onMounted(async () => {
  const [programRes, trainerRes] = await Promise.all([
    api.get('/admin-api/get-all-training-program?page=1&limit=100'),
    api.get('/admin-api/get-trainer')
  ])

  programs.value = programRes.data.programs || []
  trainers.value = trainerRes.data.trainers || []

  fetchCourses()
})
</script>

<style lang="sass">
.sticky-header-table
  .q-table__top
    border-bottom: 1px solid #e0e0e0

  .q-th
    text-transform: uppercase
    font-size: 12px
    font-weight: 600
    color: #666

  .q-td
    vertical-align: top
</style>

<template>
  <div class="q-pa-md">
    <!-- Filters -->
    <div class="row q-col-gutter-md q-mb-md items-center">
      <div class="col-12 col-md-4">
        <q-input
          dense
          debounce="300"
          v-model="searchQuery"
          placeholder="Search programs..."
          outlined
          clearable
          @update:model-value="pagination.page = 1"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
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
      <template #top>
        <div class="text-h6">Program Enrollments</div>
        <q-space />
        <div class="text-caption text-grey">
          Showing {{ filteredPrograms.length }} of {{ programs.length }} programs
        </div>
      </template>

      <template #body-cell-name="props">
        <q-td :props="props">
          <div class="row items-center no-wrap">
            <div class="q-mr-sm" style="width: 60px; height: 40px">
              <q-img
                :src="getBannerUrl(programBanner(props.row))"
                style="width: 60px; height: 40px; border-radius: 4px"
                class="cursor-pointer"
              >
                <template v-if="!programBanner(props.row)">
                  <div class="absolute-full flex flex-center bg-grey-3">
                    <q-icon name="image" size="20px" color="grey-6" />
                  </div>
                </template>
              </q-img>
            </div>
            <div>
              <div class="text-weight-medium">{{ programName(props.row) }}</div>
              <div class="text-caption text-grey-7 ellipsis" style="max-width: 200px">
                {{ programDescription(props.row) || 'No description' }}
              </div>
            </div>
          </div>
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-chip dense :color="getProgramStatusColor(programStatus(props.row))" text-color="white" size="sm">
            {{ programStatus(props.row) }}
          </q-chip>
        </q-td>
      </template>

      <template #body-cell-dates="props">
        <q-td :props="props">
          <div>{{ formatDate(programStartDate(props.row)) }}</div>
          <div class="text-caption text-grey-7">to {{ formatDate(programEndDate(props.row)) }}</div>
        </q-td>
      </template>

      <template #body-cell-capacity="props">
        <q-td :props="props">
          <div class="row items-center">
            <q-icon name="people" size="16px" class="q-mr-xs" />
            <span>{{ programCapacity(props.row) ?? 'Unlimited' }}</span>
          </div>
        </q-td>
      </template>

      <template #body-cell-enrollments="props">
        <q-td :props="props">
          {{ props.row.enrollments.length }}
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
              @click="viewEnrollments(props.row)"
            >
              <q-tooltip>View Enrollments</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <template #no-data>
        <div class="full-width row flex-center text-grey q-gutter-sm q-py-lg">
          <q-icon name="info" size="2em" />
          <span>No programs found</span>
        </div>
      </template>
    </q-table>

    <q-inner-loading :showing="loading">
      <q-spinner color="primary" size="50px" />
    </q-inner-loading>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const router = useRouter()

const loading = ref(false)
const enrollments = ref([])
const programs = ref([])

const searchQuery = ref('')

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const columns = [
  { name: 'name', label: 'PROGRAM', align: 'left', field: (row) => row._id, sortable: true },
  { name: 'status', label: 'STATUS', align: 'center', field: (row) => programStatus(row), sortable: true },
  { name: 'dates', label: 'DATES', align: 'center', field: (row) => programStartDate(row), sortable: true },
  { name: 'capacity', label: 'CAPACITY', align: 'center', field: (row) => programCapacity(row), sortable: true },
  { name: 'enrollments', label: 'ENROLLMENTS', align: 'center', field: (row) => row.enrollments.length },
  { name: 'actions', label: 'ACTIONS', align: 'center', sortable: false },
]

const filteredPrograms = computed(() => {
  let filtered = programs.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        programName(p).toLowerCase().includes(query) ||
        (programDescription(p) || '').toLowerCase().includes(query),
    )
  }

  return filtered
})

const paginatedPrograms = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
  return filteredPrograms.value.slice(start, start + pagination.value.rowsPerPage)
})

function onRequest(props) {
  const { page, rowsPerPage } = props.pagination
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.rowsNumber = filteredPrograms.value.length
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

const getBannerUrl = (banner) => {
  if (!banner) return ''
  if (banner.startsWith('http://') || banner.startsWith('https://')) return banner
  if (banner.startsWith('/')) return `${api.defaults.baseURL}${banner}`
  return `${api.defaults.baseURL}/uploads/${banner}`
}

const getProgramStatusColor = (status) => {
  const colors = {
    Upcoming: 'secondary',
    Ongoing: 'orange',
    Completed: 'green',
  }
  return colors[status] || 'grey'
}

const programName = (program) => program?.t_name || program?.title || 'Program'
const programDescription = (program) => program?.t_description || program?.description || ''
const programStatus = (program) => {
  const raw = program?.t_status || program?.status || 'Unknown'
  return raw === 'Finished' ? 'Completed' : raw
}
const programStartDate = (program) => program?.t_start_date || program?.start_date
const programEndDate = (program) => program?.t_end_date || program?.end_date
const programCapacity = (program) => program?.t_capacity ?? program?.capacity
const programBanner = (program) => program?.t_banner || program?.banner

const fetchEnrollments = async () => {
  loading.value = true
  try {
    let allEnrollments = []
    let page = 1
    let totalPages = 1

    do {
      const res = await api.get('/admin-api/enrollments', { params: { page } })
      allEnrollments.push(...(res.data.enrollments || []))
      totalPages = res.data.pagination.totalPages
      page++
    } while (page <= totalPages)

    enrollments.value = allEnrollments

    const grouped = {}
    enrollments.value.forEach((en) => {
      const prog = en.training_program
      if (!prog || !prog._id) return
      if (!grouped[prog._id]) {
        grouped[prog._id] = { ...prog, enrollments: [] }
      }
      grouped[prog._id].enrollments.push(en)
    })

    programs.value = Object.values(grouped)
    pagination.value.rowsNumber = programs.value.length
  } catch (error) {
    console.error('Fetch error:', error)
  } finally {
    loading.value = false
  }
}

const viewEnrollments = (program) => {
  if (!program.enrollments?.length) return

  const enrollmentId = program.enrollments[0]._id
  router.push(`/admin/enrollment/${enrollmentId}`)
}

onMounted(fetchEnrollments)
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
</style>

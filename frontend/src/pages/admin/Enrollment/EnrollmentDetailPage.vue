<template>
  <div class="q-pa-md">
    <!-- Back -->
    <q-btn
      flat
      icon="arrow_back"
      label="Back to Programs"
      class="q-mb-md"
      @click="$router.back()"
    />

    <!-- Program Card -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section class="row items-center q-col-gutter-md">
        <div class="col-auto">
          <q-img
            v-if="program?.t_banner"
            :src="getBannerUrl(program.t_banner)"
            style="width: 180px; height: 110px; border-radius: 8px"
          />
        </div>

        <div class="col">
          <div class="text-h5 text-weight-bold">
            {{ program?.t_name || 'Program' }}
          </div>

          <div class="text-grey-7 q-mt-xs">
            {{ program?.t_description || 'No description' }}
          </div>

          <div class="row q-col-gutter-lg q-mt-md">
            <div><strong>Duration:</strong> {{ program?.t_duration ?? 'N/A' }} days</div>
            <div><strong>Capacity:</strong> {{ program?.t_capacity ?? 'Unlimited' }}</div>
            <div>
              <strong>Status:</strong>
              <q-chip dense size="sm" color="green" text-color="white">
                {{ formatProgramStatus(program?.t_status) }}
              </q-chip>
            </div>
          </div>

          <div class="q-mt-sm">
            <strong>Dates:</strong>
            {{ formatDate(program?.t_start_date) }} –
            {{ formatDate(program?.t_end_date) }}
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Enrollment -->
    <div class="text-h6 q-mb-sm">Enrollment</div>

    <q-table
      flat
      bordered
      :rows="enrollment ? [enrollment] : []"
      :columns="columns"
      row-key="_id"
      :loading="loading"
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-select
            dense
            outlined
            emit-value
            map-options
            :options="statusOptions"
            v-model="props.row.status"
            :loading="statusUpdating"
            @update:model-value="handleStatusChange(props.row)"
            style="min-width: 150px"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Wishlist -->
    <q-card v-if="enrollment?.status === 'Waitlisted'" class="q-mt-lg bg-blue-1" flat bordered>
      <q-card-section class="text-h6">Waitlisted Trainee</q-card-section>
      <q-separator />
      <q-card-section>
        <div>{{ enrollment.user.full_name }}</div>
        <div class="text-grey">{{ enrollment.user.email }} • {{ enrollment.user.mobile }}</div>
      </q-card-section>
    </q-card>

    <!-- Audit Trail -->
    <q-card flat bordered class="q-mt-lg">
      <q-card-section class="text-h6">Status History</q-card-section>
      <q-separator />

      <q-card-section v-if="auditTrail.length">
        <q-timeline>
          <q-timeline-entry
            v-for="(a, i) in auditTrail"
            :key="i"
            :title="a.status"
            :subtitle="a.time"
          >
            Updated by Admin
          </q-timeline-entry>
        </q-timeline>
      </q-card-section>

      <q-card-section v-else class="text-grey"> No status changes yet. </q-card-section>
    </q-card>

    <q-inner-loading :showing="loading">
      <q-spinner size="40px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()

const loading = ref(false)
const statusUpdating = ref(false)
const enrollment = ref(null)
const auditTrail = ref([])

const program = computed(() => enrollment.value?.training_program)

const statusOptions = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Waitlisted', value: 'Waitlisted' },
]

const columns = [
  { name: 'name', label: 'NAME', field: (r) => r.user.full_name },
  { name: 'email', label: 'EMAIL', field: (r) => r.user.email },
  { name: 'mobile', label: 'MOBILE', field: (r) => r.user.mobile },
  { name: 'status', label: 'STATUS', field: (r) => r.status, align: 'center' },
]
const auditKey = computed(() =>
  enrollment.value ? `enrollment_audit_${enrollment.value._id}` : null,
)

const loadAuditTrail = () => {
  if (!auditKey.value) return

  const saved = localStorage.getItem(auditKey.value)
  auditTrail.value = saved ? JSON.parse(saved) : []
}

const saveAuditTrail = () => {
  if (!auditKey.value) return
  localStorage.setItem(auditKey.value, JSON.stringify(auditTrail.value))
}
const fetchEnrollment = async () => {
  loading.value = true
  try {
    const res = await api.get(`/admin-api/enrollment/${route.params.id}`)
    enrollment.value = res.data.enrollment
    loadAuditTrail()
    if (auditTrail.value.length === 0) {
      auditTrail.value.unshift({
        status: enrollment.value.status,
        time: new Date(enrollment.value.enrolledAt).toLocaleString('en-GB'),
        note: 'Initial status',
      })
      saveAuditTrail()
    }
  } finally {
    loading.value = false
  }
}

const handleStatusChange = (row) => {
  if (row.status === 'Rejected') {
    $q.dialog({
      title: 'Confirm Rejection',
      message: 'Are you sure you want to reject this enrollment?',
      cancel: true,
      persistent: true,
    })
      .onOk(() => submitStatus(row))
      .onCancel(() => (row.status = enrollment.value.status))
  } else {
    submitStatus(row)
  }
}

const submitStatus = async (row) => {
  statusUpdating.value = true
  try {
    const res = await api.patch(`/admin-api/enrollment/${row._id}`, {
      status: row.status,
    })

    if (res.data.status !== 200) {
      throw new Error(res.data.message)
    }

    enrollment.value.status = row.status
    auditTrail.value.unshift({
      status: row.status,
      time: new Date().toLocaleString('en-GB'),
    })
    saveAuditTrail()

    $q.notify({ type: 'positive', message: 'Status updated' })
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message || 'Update failed',
    })
    row.status = enrollment.value.status
  } finally {
    statusUpdating.value = false
  }
}

const formatDate = (val) => (val ? new Date(val).toLocaleDateString('en-GB') : 'N/A')

const getBannerUrl = (b) => (b?.startsWith('http') ? b : `${api.defaults.baseURL}${b}`)

const formatProgramStatus = (s) => (s === 'Finished' ? 'Completed' : s)

onMounted(fetchEnrollment)
</script>

<style scoped>
.q-table {
  margin-top: 8px;
}
</style>

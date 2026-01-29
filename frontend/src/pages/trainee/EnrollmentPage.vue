<template>
  <q-page class="q-pa-md">
    <!-- Page Header -->
    <div class="text-h5 text-weight-bold q-mb-lg">My Enrollments</div>

    <!-- Status Filter Tabs -->
    <q-tabs v-model="statusFilter" dense class="text-primary q-mb-md" align="left" active-color="primary"
      indicator-color="primary">
      <q-tab name="all" label="All" />
      <q-tab name="Upcoming" label="Upcoming" />
      <q-tab name="Ongoing" label="Ongoing" />
      <q-tab name="Finished" label="Finished" />
    </q-tabs>

    <!-- Enrollment Cards Grid -->
    <div class="row q-col-gutter-md">
      <div v-for="enroll in filteredEnrollments" :key="enroll._id" class="col-12 col-md-6 col-lg-4">
        <q-card flat bordered class="cursor-pointer hoverable-card" @click="openEnrollmentDetails(enroll)">
          <!-- Banner -->
          <!-- Banner Section -->
          <q-img :src="getBanner(enroll.training_program?.t_banner)" :ratio="16 / 9" alt="Training Banner"
            class="training-banner rounded-borders">
            <!-- Fallback when no banner -->
            <template v-if="!enroll.training_program?.t_banner">
              <div class="absolute-full flex flex-center bg-grey-4" style="height: 180px;">
                <q-icon name="image" size="48px" color="grey-6" />
                <div class="text-grey-6 q-mt-md">No Banner Available</div>
              </div>
            </template>

            <!-- Overlay details -->
            <div class="absolute-bottom bg-gradient-to-top text-white q-pa-md">
              <div class="text-h6 q-mb-xs">
                {{ enroll.training_program?.t_name || "N/A" }}
              </div>
              <div class="text-caption ellipsis">
                {{ enroll.training_program?.t_description || "No description available" }}
              </div>
              <div class="row items-center q-mt-xs justify-between">
                <q-chip dense :color="statusColor(enroll.training_program?.t_status)" text-color="white">
                  {{ enroll.training_program?.t_status || "Unknown" }}
                </q-chip>
                <div class="row items-center">
                  <q-rating v-model="enroll.training_program.averageRating" max="5" color="yellow" readonly
                    size="18px" />
                  <div class="text-caption q-ml-xs">
                    ({{ enroll.training_program.ratingsCount || 0 }})
                  </div>
                </div>
              </div>
            </div>
          </q-img>





          <q-card-section>
            <!-- Program Name -->
            <!-- <div class="text-h6 text-weight-bold ellipsis">{{ enroll.training_program?.t_name }}</div> -->

            <div class="row items-center justify-between q-mb-xs">
              <div class="text-subtitle2 text-primary text-weight-medium">
                {{ enroll.training_program?.t_category?.name || "General" }}

              </div>
              <q-badge :color="statusColor(enroll.training_program?.t_status)"
                :label="enroll.training_program?.t_status" align="middle" class="text-uppercase" />
            </div>


            <!-- Status Badges -->
            <div class="row items-center justify-between q-mt-xs">

              <div class="text-caption text-grey">
                Enrolled On: {{ formatDate(enroll.enrolledAt) }}
              </div>
              <q-badge :color="enrollmentStatusColor(enroll.status)" outline align="middle">
                {{ enroll.status }}
              </q-badge>
            </div>

            <!-- Dates & Duration -->
            <div class="text-caption text-grey q-mt-xs">
              {{ formatDate(enroll.training_program?.t_start_date) }} →
              {{ formatDate(enroll.training_program?.t_end_date) }}
              • Duration: {{ enroll.training_program?.t_duration || 0 }} days
            </div>

            <!-- Organizer & Eligibility -->
            <div class="text-caption text-grey">
              Organizer: {{ enroll.training_program?.t_organizer || "N/A" }} •
              Eligibility: {{ enroll.training_program?.t_eligibility || "N/A" }}
            </div>

            <!-- Category & Capacity -->
            <div class="text-caption text-grey">
              Category: {{ enroll.training_program?.t_category?.name || "N/A" }} •
              Capacity: {{ enroll.training_program?.t_capacity || "N/A" }}
            </div>

            <!-- Description -->
            <div class="text-body2 q-mt-sm ellipsis-3-lines">
              {{ enroll.training_program?.t_description || "No description available" }}
            </div>

            <!-- Rating -->
            <div class="row items-center q-mt-xs">
              <q-icon v-for="n in Math.round(enroll.training_program?.averageRating || 0)" :key="n" name="star"
                color="amber" size="16px" />
              <span class="text-caption text-grey q-ml-xs">
                ({{ enroll.training_program?.ratingsCount || 0 }})
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Enrollment Details Dialog -->
    <q-dialog v-model="showEnrollmentDialog" maximized>
      <q-card class="enrollment-dialog-card q-relative">

        <!-- Banner Section -->
        <q-img v-if="selectedEnrollment.training_program?.t_banner"
          :src="getBanner(selectedEnrollment.training_program.t_banner)" class="banner-image" alt="Training Banner">
          <div class="absolute-bottom bg-gradient-to-top from-black/60 text-white q-pa-md">
            <div class="text-h5 text-weight-bold ellipsis">
              {{ selectedEnrollment.training_program?.t_name }}
            </div>
            <div class="text-subtitle2 ellipsis">
              Enrollment Details
            </div>
          </div>
        </q-img>

        <!-- Fallback banner if no image -->
        <div v-else class="banner-fallback flex flex-center bg-grey-3">
          <q-icon name="image" size="64px" color="grey-5" />
          <div class="text-h6 text-grey-6 q-ml-md">No Banner Available</div>
        </div>

        <!-- Close button -->
        <q-btn flat round icon="close" class="absolute-top-right text-white" v-close-popup />

        <!-- Scrollable Content -->
        <q-card-section class="scroll q-pa-md" style="max-height: 75vh; overflow-y: auto;">

          <!-- Program Overview -->
          <q-card flat bordered class="q-mb-md shadow-1">
            <q-card-section>
              <div class="section-title">Program Overview</div>
              <p class="q-mt-sm text-body1">
                {{ selectedEnrollment.training_program?.t_description || "No description available" }}
              </p>

              <div class="row q-col-gutter-md q-mt-md">
                <div class="col-12 col-sm-6" v-for="(field, i) in programFields" :key="i">
                  <div class="text-caption text-grey">{{ field.label }}</div>
                  <div class="text-body1 text-weight-medium">{{ field.value }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Status Cards -->
          <div class="row q-col-gutter-md q-mb-md">
            <StatusCard title="Enrollment Status" :status="selectedEnrollment.status"
              :date="selectedEnrollment.enrolledAt" :color="enrollmentStatusColor(selectedEnrollment.status)" />
            <StatusCard title="Program Status" :status="selectedEnrollment.training_program?.t_status"
              :extra="`Capacity: ${selectedEnrollment.training_program?.t_capacity || 0}`"
              :color="statusColor(selectedEnrollment.training_program?.t_status)" />
          </div>

          <!-- Training Location -->
          <q-card flat bordered class="q-mb-md shadow-1">
            <q-card-section>
              <div class="section-title">Training Location</div>
              <div class="q-mt-sm">
                <q-icon name="location_on" size="18px" class="q-mr-xs text-primary" />
                <span class="text-body1 text-weight-medium">
                  {{ selectedEnrollment.training_program?.t_room?.room_name || "N/A" }}
                </span>
                <div class="text-caption text-grey">
                  Room No: {{ selectedEnrollment.training_program?.t_room?.room_no || "N/A" }}
                </div>
                <div class="text-caption text-grey">
                  Capacity: {{ selectedEnrollment.training_program?.t_room?.capacity || "N/A" }} people
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Rating Section -->
          <RatingSection v-if="showRatingSection" :existing-rating="existingRating"
            v-model:showDialog="showRatingDialog" :training-id="selectedEnrollment.training_program?._id"
            @submitted="fetchEnrollments" />

          <!-- Training Sessions -->
          <q-card flat bordered class="q-mb-md shadow-1">
            <q-card-section>
              <div class="section-title">Training Sessions</div>
              <q-list separator>
                <TrainingSession v-for="course in selectedEnrollment.training_program?.trainingCourse || []"
                  :key="course._id" :course="course" />
              </q-list>
            </q-card-section>
          </q-card>

          <!-- Materials -->
          <q-card v-if="hasMaterials" flat bordered class="q-mb-md bg-green-1 shadow-1">
            <q-card-section>
              <div class="section-title">Training Materials</div>
              <div class="text-caption q-mb-sm">
                Total {{ totalMaterialsCount }} materials available across all sessions
              </div>
              <q-btn label="Download All Materials" color="primary" icon="download" @click="downloadAllMaterials" />
            </q-card-section>
          </q-card>

        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Close" color="primary" v-close-popup />
          <q-btn v-if="selectedEnrollment.status === 'Pending'" label="Cancel Enrollment" color="negative"
            @click="cancelEnrollment" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { api } from "boot/axios"
import { date, useQuasar } from "quasar"
import StatusCard from "src/components/StatusCard.vue"
import TrainingSession from "src/components/TrainingSession.vue"
import RatingSection from "src/components/RatingSection.vue"

const $q = useQuasar()
const enrollments = ref([])
const selectedEnrollment = ref({})
const showEnrollmentDialog = ref(false)
const showRatingDialog = ref(false)
const existingRating = ref(null)
const statusFilter = ref("all")

// Fetch Enrollments
const fetchEnrollments = async () => {
  try {
    const res = await api.get("/api/enrollments")
    enrollments.value = res.data.enrollments || []
  } catch {
    $q.notify({ type: "negative", message: "Failed to load enrollments" })
  }
}

// Filter enrollments by program status
const filteredEnrollments = computed(() => {
  if (statusFilter.value === "all") return enrollments.value
  return enrollments.value.filter(
    (e) => e.training_program?.t_status === statusFilter.value
  )
})

const getBanner =(banner) => {
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
const formatDate = (d) => (d ? date.formatDate(d, "DD MMM YYYY") : "N/A")
const statusColor = (s) => ({ Upcoming: "blue", Ongoing: "green", Finished: "grey" }[s] || "primary")
const enrollmentStatusColor = (s) => ({ Pending: "orange", Approved: "green", Rejected: "red", Completed: "primary" }[s] || "grey")

// Fields for dialog
const programFields = computed(() => {
  const p = selectedEnrollment.value.training_program || {}
  return [
    { label: "Start Date", value: formatDate(p.t_start_date) },
    { label: "End Date", value: formatDate(p.t_end_date) },
    { label: "Duration", value: `${p.t_duration || 0} days` },
    { label: "Category", value: p.t_category?.name || "N/A" },
  ]
})

// Rating visibility
const showRatingSection = computed(() => {
  const s = selectedEnrollment.value.status
  return ["Approved", "Completed", "Finished"].includes(s)
})

// Materials
const totalMaterialsCount = computed(() => {
  const courses = selectedEnrollment.value.training_program?.trainingCourse || []
  return courses.reduce((t, c) => t + (c.materials?.length || 0), 0)
})
const hasMaterials = computed(() => totalMaterialsCount.value > 0)

// Handlers
const openEnrollmentDetails = async (enroll) => {
  selectedEnrollment.value = enroll
  showEnrollmentDialog.value = true
  if (showRatingSection.value) await checkExistingRating()
}

const checkExistingRating = async () => {
  try {
    const id = selectedEnrollment.value.training_program?._id
    if (!id) return
    const res = await api.get(`/api/training/${id}/ratings`)
    existingRating.value = res.data.rating || null
  } catch {
    existingRating.value = null
  }
}

const cancelEnrollment = async () => {
  $q.dialog({
    title: "Cancel Enrollment",
    message: "Are you sure you want to cancel this enrollment?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await api.patch(`/api/enrollment/${selectedEnrollment.value._id}`, { status: "Cancelled" })
      $q.notify({ type: "positive", message: "Enrollment cancelled" })
      showEnrollmentDialog.value = false
      fetchEnrollments()
    } catch {
      $q.notify({ type: "negative", message: "Failed to cancel enrollment" })
    }
  })
}

// Download Materials
const downloadMaterial = (m) => {
  const url = `https://staging2.egovmz.in${m.file_url}`
  window.open(url, "_blank")
}
const downloadAllMaterials = () => {
  const all = selectedEnrollment.value.training_program?.trainingCourse?.flatMap(c => c.materials || []) || []
  if (!all.length) return $q.notify({ type: "info", message: "No materials to download" })
  $q.notify({ type: "positive", message: `Opening ${all.length} materials` })
  all.forEach(downloadMaterial)
}

onMounted(fetchEnrollments)
</script>

<style scoped>
.hoverable-card:hover {
  transform: translateY(-4px);
  transition: all 0.2s ease;
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* .enrollment-dialog-card {
  min-width: 60vw;
  max-width: 800px;
} */



.enrollment-dialog-card {
  max-width: 900px;
  width: 95%;
  border-radius: 12px;
  overflow: hidden;
}

.banner-image {
  height: 200px;
  object-fit: cover;
}

.banner-fallback {
  height: 200px;
}

.absolute-top-right {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  border-left: 4px solid #1976d2;
  padding-left: 8px;
  margin-bottom: 8px;
}

.scroll::-webkit-scrollbar {
  width: 6px;
}

.scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>

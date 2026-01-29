<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Page Title -->
    <div class="text-h5 text-weight-bold q-mb-lg">Available Trainings</div>

    <!-- Status Tabs -->
    <q-tabs v-model="statusFilter" dense class="text-primary q-mb-md" align="left" active-color="primary"
      indicator-color="primary">
      <q-tab name="all" label="All" />
      <q-tab name="Upcoming" label="Upcoming" />
      <q-tab name="Ongoing" label="Ongoing" />
      <q-tab name="Finished" label="Finished" />
    </q-tabs>

    <!-- Training Cards Grid -->
    <div class="row q-col-gutter-md">
      <div v-for="program in filteredPrograms" :key="program._id" class="col-12 col-md-6 col-lg-4">
        <q-card flat bordered class="cursor-pointer hover-scale" @click="openTraining(program)">

          <q-img :src="getBanner(program.t_banner)" :ratio="16 / 9" alt="Training Banner">
            <template v-if="!program.t_banner">
              <div class="absolute-full flex flex-center bg-grey-4" style="height: 180px;">
                <q-icon name="image" size="48px" color="grey-6" />
                <div class="text-grey-6 q-mt-md">No Banner Available</div>
              </div>
            </template>

            <div class="absolute-bottom bg-gradient-to-top text-white q-pa-md">
              <div class="text-h6 q-mb-xs">{{ program.t_name }}</div>
              <div class="text-caption ellipsis">{{ program.t_description }}</div>
              <div class="row items-center q-mt-xs justify-between">
                <q-chip dense :color="statusColor(program.t_status)" text-color="white">
                  {{ program.t_status }}
                </q-chip>
                <div class="row items-center">
                  <q-rating v-model="program.averageRating" max="5" color="yellow" readonly size="18px" />
                  <div class="text-caption q-ml-xs">({{ program.ratingsCount }})</div>
                </div>
              </div>
            </div>
          </q-img>

          <q-card-section class="q-pt-sm">
            <div class="row items-center justify-between q-mb-xs">
              <div class="text-subtitle2 text-primary text-weight-medium">
                {{ program.t_category?.name || "General" }}
              </div>
              <q-badge :color="statusColor(program.t_status)" :label="program.t_status" class="text-uppercase" />
            </div>

            <div class="text-grey-8 text-caption">
              <q-icon name="event" size="16px" class="q-mr-xs" />
              {{ formatDate(program.t_start_date) }} → {{ formatDate(program.t_end_date) }}
            </div>
            <div class="text-grey-8 text-caption">
              <q-icon name="hourglass_bottom" size="16px" class="q-mr-xs" />
              Duration: {{ program.t_duration }} days
            </div>
            <div class="text-grey-8 text-caption">
              <q-icon name="badge" size="16px" class="q-mr-xs" />
              Eligibility: <strong>{{ program.t_eligibility || 'All Employees' }}</strong>
            </div>
            <div class="text-grey-8 text-caption q-mb-sm">
              <q-icon name="account_balance" size="16px" class="q-mr-xs" />
              Organizer: <strong>{{ program.t_organizer || 'ATI' }}</strong>
            </div>

            <div class="text-body2 text-grey-9 ellipsis-3-lines q-mb-md">
              {{ program.t_description }}
            </div>

            <div class="row items-center justify-between">
              <div class="row items-center">
                <q-icon v-if="program.averageRating > 0" name="star" color="amber" size="18px" class="q-mr-xs" />
                <span v-if="program.averageRating > 0">{{ program.averageRating.toFixed(1) }}</span>
                <span v-else class="text-grey">No ratings yet</span>
              </div>

              <q-btn :label="getEnrollLabel(program)" :color="getEnrollColor(program)"
                :disable="program.isEnrolled || program.t_status === 'Finished'" @click.stop="handleEnroll(program)"
                rounded size="sm" unelevated />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-if="filteredPrograms.length === 0" class="text-center q-pa-xl text-grey-7">
      <q-icon name="school" size="64px" color="grey-5" />
      <div class="text-h6 q-mt-md">No trainings found for this status</div>
    </div>

    <!-- Training Details Dialog -->
    <q-dialog v-model="showTrainingDialog" style="min-width: 750px;">
      <q-card class="q-relative enrollment-dialog-card">
        <!-- Banner Section -->
        <q-img v-if="selectedProgram?.t_banner" :src="getBanner(selectedProgram.t_banner)" class="banner-image"
          alt="Training Banner">
          <div class="absolute-bottom bg-gradient-to-top from-black/60 text-white q-pa-md">
            <div class="text-h5 text-weight-bold ellipsis">{{ selectedProgram.t_name }}</div>
            <div class="text-subtitle2 ellipsis">Training Details</div>
          </div>
        </q-img>

        <div v-else class="banner-fallback flex flex-center bg-grey-3">
          <q-icon name="image" size="64px" color="grey-5" />
          <div class="text-h6 text-grey-6 q-ml-md">No Banner Available</div>
        </div>

        <q-btn flat round icon="close" class="absolute-top-right text-white" v-close-popup />

        <!-- Scrollable Content -->
        <q-card-section class="scroll q-pa-md" style="max-height: 75vh; overflow-y: auto;">
          <q-card flat bordered class="q-mb-md shadow-1">
            <q-card-section>
              <div class="text-h6 text-primary text-weight-bold q-mb-sm">Program Overview</div>
              <div class="text-body1 q-mb-md">
                {{ selectedProgram.t_description || "No description available." }}
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey">Category</div>
                  <div class="text-body1 text-weight-medium">{{ selectedProgram.t_category?.name || "General" }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey">Organizer</div>
                  <div class="text-body1 text-weight-medium">{{ selectedProgram.t_organizer || "ATI" }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey">Start Date</div>
                  <div class="text-body1 text-weight-medium">{{ formatDate(selectedProgram.t_start_date) }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey">End Date</div>
                  <div class="text-body1 text-weight-medium">{{ formatDate(selectedProgram.t_end_date) }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Training Room -->
          <q-card flat bordered class="q-mb-md shadow-1">
            <q-card-section>
              <div class="text-h6 text-primary text-weight-bold q-mb-sm">Training Location</div>
              <div>
                <q-icon name="location_on" size="18px" class="q-mr-xs text-primary" />
                <span class="text-body1 text-weight-medium">
                  {{ selectedProgram.t_room?.room_name || "Not Assigned" }}
                </span>
                <div class="text-caption text-grey">Room No: {{ selectedProgram.t_room?.room_no || "N/A" }}</div>
                <div class="text-caption text-grey">Capacity: {{ selectedProgram.t_room?.capacity || "N/A" }} people
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Close" color="grey" v-close-popup />

          <!-- Enroll -->
          <q-btn v-if="!selectedProgram.isEnrolled && selectedProgram.t_status !== 'Finished'" label="Enroll Now"
            color="primary" @click="handleEnroll(selectedProgram)" />

          <!-- Enrolled -->
          <template v-else-if="selectedProgram.isEnrolled">
            <q-btn label="Already Enrolled" color="positive" disable />
            <q-btn color="secondary" label="View Study Materials" icon="school" @click="openMaterialsDialog" />

          </template>

          <!-- Finished -->
          <q-btn v-else label="Training Finished" color="grey" disable />
        </q-card-actions>

      </q-card>

      <!-- Study Materials Dialog -->
      <!-- 📘 Study Materials Dialog -->
      <q-dialog v-model="showMaterialsDialog" persistent>
        <q-card class="q-pa-md" style="min-width: 500px; max-width: 800px;">
          <!-- Header -->
          <q-card-section class="row items-center justify-between">
            <div class="text-h6 text-primary">
              Study Materials – {{ selectedProgram.t_name }}
            </div>
            <q-btn flat dense icon="close" color="negative" @click="showMaterialsDialog = false" />
          </q-card-section>

          <q-separator />

          <!-- Content -->
          <q-card-section>
            <div v-if="loadingMaterials" class="text-center q-pa-md">
              <q-spinner color="primary" size="2em" />
              <div class="text-caption q-mt-sm">Loading materials...</div>
            </div>

            <q-list v-else-if="materials.length" bordered separator>
              <q-item v-for="m in materials" :key="m._id" clickable tag="a" :href="getFileUrl(m.file_url)"
                target="_blank">
                <q-item-section avatar>
                  <q-icon name="description" color="primary" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ m.file_name }}</q-item-label>
                  <q-item-label caption>{{ m.mime_type }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon name="open_in_new" />
                </q-item-section>
              </q-item>
            </q-list>

            <div v-else class="text-grey text-center q-pa-md">
              No study materials found for this training.
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const $q = useQuasar();

const statusFilter = ref("all");
const programs = ref([]);
const enrollments = ref([]);
const showTrainingDialog = ref(false);
const selectedProgram = ref(null);
// const showDialog = ref(false)
// const loading = ref(false)
const materials = ref([])

const showMaterialsDialog = ref(false)
// const materials = ref([])
const loadingMaterials = ref(false)

const fetchEnrollments = async () => {
  try {
    const res = await api.get("/api/enrollments");
    enrollments.value = res.data.enrollments || [];
  } catch (err) {
    console.error("Failed to load enrollments:", err);
  }
};

const fetchPrograms = async () => {
  try {
    const res = await api.get("/api/trainings");
    const programsData = res.data.programs || [];

    if (!enrollments.value.length) await fetchEnrollments();

    programs.value = programsData.map((p) => {
      const enrolledCount = enrollments.value.filter(
        (e) => e.training_program?._id === p._id
      ).length;
      const isEnrolled = enrollments.value.some(
        (e) => e.training_program?._id === p._id
      );

      return {
        ...p,
        isEnrolled,
        enrolledCount,
        remainingSeats:
          p.t_capacity === -1 ? Infinity : p.t_capacity - enrolledCount,
      };
    });
  } catch (err) {
    console.error("Failed to load programs:", err);
  }
};

const filteredPrograms = computed(() => {
  if (statusFilter.value === "all") return programs.value;
  return programs.value.filter((p) => p.t_status === statusFilter.value);
});



const getBanner = (banner) => {
  if (!banner) return "";
  if (banner.startsWith("http://") || banner.startsWith("https://")) return banner;
  if (banner.startsWith("/")) return `${api.defaults.baseURL}${banner}`;
  return `${api.defaults.baseURL}/${banner}`;
};



const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const statusColor = (status) =>
({
  Upcoming: "blue",
  Ongoing: "green",
  Finished: "grey",
}[status] || "primary");

const getEnrollLabel = (p) => {
  if (p.t_status === "Finished") return "View Summary";
  if (p.isEnrolled) return "Enrolled";
  if (p.remainingSeats <= 0) return "Full";
  return "Enroll Now";
};

const getEnrollColor = (p) => {
  if (p.t_status === "Finished") return "grey";
  if (p.isEnrolled) return "positive";
  if (p.remainingSeats <= 0) return "negative";
  return "primary";
};

const handleEnroll = async (program) => {
  if (program.t_status === "Finished") return;
  if (program.isEnrolled) {
    $q.notify({ type: "info", message: "You are already enrolled!" });
    return;
  }
  if (program.remainingSeats <= 0) {
    $q.notify({ type: "negative", message: "This training is full!" });
    return;
  }
  $q.dialog({
    title: "Enroll in Training",
    message: `Do you want to enroll for "${program.t_name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await api.post(`/api/training/${program._id}/enrollments`);
      $q.notify({ type: "positive", message: "Successfully enrolled!" });
      await fetchEnrollments();
      await fetchPrograms();
    } catch (err) {
      $q.notify({ type: "negative", message: "Enrollment failed.", error: err });
    }
  });
};

// Open Dialog
const openTraining = async (program) => {
  selectedProgram.value = program;
  showTrainingDialog.value = true;
};

// --- Helper to build full URL safely
const getFileUrl = (url) => {
  if (!url) return "#"

  // If already an absolute URL, just return it
  if (url.startsWith("http")) return url

  // Normalize: ensure uploads path starts with /uploads
  const normalizedPath = url.replace(/^.*\/uploads/, "/uploads")

  // Return with full live domain prefix
  return `https://staging2.egovmz.in${normalizedPath}`
}

// --- Fetch Study Materials
const fetchMaterials = async (programId) => {
  materials.value = []
  loadingMaterials.value = true

  try {
    const { data } = await api.get(`/api/enrollment/${programId}/material`)
    materials.value = data.materials || []
  } catch (err) {
    console.error('Failed to fetch materials:', err)
    $q.notify({ type: 'negative', message: 'Unable to load materials' })
  } finally {
    loadingMaterials.value = false
  }
}
// --- Open Material Dialog
const openMaterialsDialog = async () => {
  if (!selectedProgram.value?._id) return
  showMaterialsDialog.value = true
  await fetchMaterials(selectedProgram.value._id)
}
// const openDialog = async () => {
//   showDialog.value = true
//   materials.value = []  // Reset old data
//   loading.value = true

//   try {
//     const { data } = await api.get(`/api/enrollment/${selectedProgram.value._id}/material`)
//     materials.value = data.materials || []
//   } catch (err) {
//     console.error('Failed to fetch materials:', err)
//   } finally {
//     loading.value = false
//   }
// }


onMounted(async () => {
  await fetchEnrollments();
  await fetchPrograms();
});
</script>

<style scoped>
.hover-scale {
  transition: transform 0.2s ease-in-out;
}

.hover-scale:hover {
  transform: scale(1.02);
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.banner-image {
  height: 250px;
  object-fit: cover;
}
</style>

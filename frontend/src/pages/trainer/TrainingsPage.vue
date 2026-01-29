<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Header -->
    <div class="text-h5 text-weight-bold q-mb-lg">Trainer Programs</div>

    <!-- Tabs -->
    <q-tabs v-model="statusFilter" dense class="text-primary q-mb-md" align="left" active-color="primary"
      indicator-color="primary">
      <q-tab name="all" label="All" />
      <q-tab name="Upcoming" label="Upcoming" />
      <q-tab name="Ongoing" label="Ongoing" />
      <q-tab name="Finished" label="Finished" />
    </q-tabs>

    <!-- Trainings -->
    <div class="row q-col-gutter-md q-mt-md">
      <div v-for="training in paginatedTrainings" :key="training._id" class="col-12 col-md-6 col-lg-4">
        <q-card flat bordered class="hover-scale shadow-sm cursor-pointer">
          <!-- Banner -->
          <div @click="viewDetails(training._id)" class="cursor-pointer">

            <q-img :src="getBanner(training.t_program?.t_banner)" :ratio="16 / 9" alt="Training Banner">
              <template v-if="!training.t_program?.t_banner">
                <div class="absolute-full flex flex-center bg-grey-4">
                  <q-icon name="image" size="48px" color="grey-6" />
                  <div class="text-grey-6 q-mt-md">No Banner Available</div>
                </div>
              </template>

              <div class="absolute-bottom bg-black/60 text-white q-pa-sm">
                <div class="text-h6 q-mb-xs">
                  {{ training.t_program?.t_name || "Untitled Program" }}
                </div>
                <div class="text-caption ellipsis">{{ training.t_program?.t_description }}</div>
                <div class="row items-center q-mt-xs justify-between">
                  <q-chip dense :color="getStatusColor(training.t_program?.t_status)" text-color="white">
                    {{ training.t_program?.t_status }}
                  </q-chip>
                  <!-- <div class="row items-center">
                  <q-rating
                    v-model="training.t_program?.averageRating"
                    max="5"
                    color="yellow"
                    readonly
                    size="18px"
                  />
                  <div class="text-caption q-ml-xs">({{ training.t_program?.ratingsCount }})</div>
                </div> -->
                </div>
              </div>
            </q-img>

            <!-- Info -->
            <q-card-section class="q-pt-sm">
              <div class="row items-center justify-between q-mb-xs">
                <div class="text-subtitle2 text-primary text-weight-medium">
                  {{ training.t_program?.t_category?.name || "General" }}
                </div>
                <q-badge :color="getStatusColor(training.t_program?.t_status)" :label="training.t_program?.t_status"
                  class="text-uppercase" />
              </div>

              <div class="text-grey-8 text-caption">
                <q-icon name="event" size="16px" class="q-mr-xs" />
                {{ formatDate(training.t_program?.t_start_date) }} → {{ formatDate(training.t_program?.t_end_date) }}
              </div>

              <div class="text-grey-8 text-caption">
                <q-icon name="hourglass_bottom" size="16px" class="q-mr-xs" />
                Duration: {{ training.t_program?.t_duration }} days
              </div>

              <div class="text-grey-8 text-caption">
                <q-icon name="badge" size="16px" class="q-mr-xs" />
                Eligibility: <strong>{{ training.t_program?.t_eligibility || "All Employees" }}</strong>
              </div>

              <div class="text-grey-8 text-caption q-mb-sm">
                <q-icon name="account_balance" size="16px" class="q-mr-xs" />
                Organizer: <strong>{{ training.t_program?.t_organizer || "ATI" }}</strong>
              </div>

              <div class="q-mt-sm text-body2 text-grey-9 ellipsis-3-lines">
                <strong>Topic:</strong> {{ training.tc_topic }}<br />
                <strong>Description:</strong> {{ training.tc_description }}
              </div>
            </q-card-section>

          </div>
          <q-separator />

          <!-- Upload Section -->
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">Training Materials</div>

            <q-file v-model="selectedFiles[training._id]" multiple outlined use-chips label="Select materials..."
              accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg" class="q-mt-md" />

            <q-btn color="primary" label="Upload" icon="upload" class="q-mt-sm" @click="uploadFiles(training)"
              :disable="!selectedFiles[training._id]?.length" />

            <div v-if="uploadProgress[training._id]" class="q-mt-sm">
              <q-linear-progress :value="uploadProgress[training._id]" color="green" size="10px" rounded stripe
                animated />
            </div>

            <div v-if="training.materials?.length">
              <div v-for="mat in training.materials" :key="mat._id" class="q-mb-xs flex items-center">
                <q-icon :name="getFileIcon(mat.mime_type)" :color="getFileColor(mat.mime_type)" size="40px"
                  class="q-mr-sm" />
                <a :href="getFileUrl(mat.file_url)" target="_blank" class="text-primary text-weight-medium ellipsis">
                  {{ mat.file_name }}
                </a>
              </div>
            </div>

            <div v-for="file in uploadQueue[training._id] || []" :key="file.name" class="q-mt-xs">
              {{ file.name }}
              <q-linear-progress :value="file.progress" color="primary" track-color="grey-3" class="q-mt-xs" />
              <span v-if="file.status === 'done'">✅</span>
              <span v-else-if="file.status === 'error'">❌</span>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Extra Info -->
          <q-expansion-item label="More Info" icon="info" dense>
            <div><b>Session:</b> {{ training.tc_session }}</div>
            <div><b>Created:</b> {{ formatDate(training.createdAt) }}</div>
            <div><b>Capacity:</b> {{ formatCapacity(training.t_program?.t_capacity) }}</div>
          </q-expansion-item>
        </q-card>
      </div>
    </div>

    <!-- Pagination -->
    <div class="q-mt-lg q-pa-md flex flex-center column">
      <q-pagination v-model="currentPage" :max="maxPages" max-pages="7" boundary-numbers direction-links color="primary"
        class="q-mb-md" />
      <q-select v-model="rowsPerPage" :options="[6, 12, 24]" label="Rows per page" outlined dense
        style="width: 150px" />
    </div>

    <!-- Loading -->
    <q-inner-loading :showing="loading">
      <q-spinner color="primary" size="50px" />
    </q-inner-loading>

    <!-- Dialog -->
    <!-- Training Details Dialog -->
    <q-dialog v-model="showDialog" style="min-width: 750px;">
      <q-card class="q-relative enrollment-dialog-card">
        <!-- Banner -->
        <q-img v-if="selectedCourse?.t_program?.t_banner" :src="getBanner(selectedCourse.t_program.t_banner)"
          class="banner-image" alt="Training Banner">
          <div class="absolute-bottom bg-gradient-to-top from-black/60 text-white q-pa-md">
            <div class="text-h5 text-weight-bold ellipsis">{{ selectedCourse.t_program.t_name }}</div>
            <div class="text-subtitle2 ellipsis">Training Details</div>
          </div>
        </q-img>

        <div v-else class="banner-fallback flex flex-center bg-grey-3" style="height: 200px;">
          <q-icon name="image" size="64px" color="grey-5" />
          <div class="text-h6 text-grey-6 q-ml-md">No Banner Available</div>
        </div>

        <q-btn flat round icon="close" class="absolute-top-right text-white" v-close-popup />

        <!-- Scrollable Content -->
        <q-card-section class="scroll q-pa-md" style="max-height: 75vh; overflow-y: auto;">
          <!-- Program Overview -->
          <q-card flat bordered class="q-mb-md shadow-1">
            <q-card-section>
              <div class="text-h6 text-primary text-weight-bold q-mb-sm">Program Overview</div>
              <div class="text-body1 q-mb-md">
                {{ selectedCourse.t_program?.t_description || "No description available." }}
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey">Category</div>
                  <div class="text-body1 text-weight-medium">{{ selectedCourse.t_program?.t_category?.name || "General"
                  }}
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey">Organizer</div>
                  <div class="text-body1 text-weight-medium">{{ selectedCourse.t_program?.t_organizer || "ATI" }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey">Start Date</div>
                  <div class="text-body1 text-weight-medium">{{ formatDate(selectedCourse.t_program?.t_start_date) }}
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="text-caption text-grey">End Date</div>
                  <div class="text-body1 text-weight-medium">{{ formatDate(selectedCourse.t_program?.t_end_date) }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Trainer Details -->
          <q-card flat bordered class="q-mb-md shadow-1">
            <q-card-section>
              <div class="text-h6 text-primary text-weight-bold q-mb-sm">Trainer Session Details</div>
              <div><b>Topic:</b> {{ selectedCourse.tc_topic || 'N/A' }}</div>
              <div><b>Description:</b> {{ selectedCourse.tc_description || 'No details available' }}</div>
              <div><b>Session:</b> {{ selectedCourse.tc_session || '—' }}</div>
              <div><b>Created On:</b> {{ formatDate(selectedCourse.createdAt) }}</div>
            </q-card-section>
          </q-card>

          <!-- Materials -->
          <q-card flat bordered class="shadow-1">
            <q-card-section>
              <div class="text-h6 text-primary text-weight-bold q-mb-sm">Training Materials</div>
              <div v-if="selectedCourse.materials?.length">
                <div v-for="mat in selectedCourse.materials" :key="mat._id" class="q-mb-sm">
                  <a :href="getFileUrl(mat.file_url)" target="_blank" class="text-primary text-weight-medium">
                    {{ mat.file_name }}
                  </a>
                </div>
              </div>
              <div v-else class="text-grey text-caption">No materials uploaded yet.</div>
            </q-card-section>
          </q-card>
        </q-card-section>

        <!-- Actions -->
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Close" color="grey" v-close-popup />
          <q-btn color="primary" label="Upload Materials" icon="upload"
            @click="() => $q.notify({ type: 'info', message: 'Upload via training card section.' })" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const $q = useQuasar();

// --- State
const trainings = ref([]);
const loading = ref(false);
const statusFilter = ref("all");
const currentPage = ref(1);
const rowsPerPage = ref(6);
const uploadQueue = ref({});
const showDialog = ref(false);
const selectedCourse = ref(null);
const selectedFiles = ref({})
const uploadProgress = ref({})

// --- Fetch Trainings
const fetchTrainings = async () => {
  loading.value = true;
  try {
    const res = await api.get("/admin/trainer/training/program");
    trainings.value = res.data.data || [];
  } catch {
    $q.notify({ type: "negative", message: "Failed to load trainings" });
  } finally {
    loading.value = false;
  }
};

// --- Upload Files
const uploadFiles = async (training) => {
  const files = selectedFiles.value[training._id]
  if (!files || files.length === 0) {
    $q.notify({ type: 'warning', message: 'Please select files to upload' })
    return
  }

  for (const file of files) {
    const formData = new FormData()
    formData.append('materials', file)


    uploadProgress.value[training._id] = 0

    try {
      const res = await api.post(
        `/admin/trainer/course/${training._id}/materials`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            uploadProgress.value[training._id] = e.loaded / e.total
          }
        }
      )

      if (res.status === 201 || res.status === 200) {
        $q.notify({ type: 'positive', message: `${file.name} uploaded successfully` })
      } else {
        throw new Error()
      }
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message)
      $q.notify({
        type: 'negative',
        message: err.response?.data?.message || `Failed to upload ${file.name}`,
      })
    } finally {
      uploadProgress.value[training._id] = 0
    }
  }

  selectedFiles.value[training._id] = []
}


// --- Dialog / Details
const viewDetails = async (id) => {
  try {
    const res = await api.get(`/admin/trainer/training/${id}`);
    selectedCourse.value = res.data?.course;
    showDialog.value = true;
  } catch {
    $q.notify({ type: "negative", message: "Failed to load details" });
  }
};

// --- Helpers
const formatDate = (d) => (d ? new Date(d).toLocaleString("en-IN") : "—");
const formatCapacity = (c) => (c === -1 ? "Unlimited" : c || "N/A");
const getStatusColor = (s) =>
  s === "Upcoming" ? "blue" : s === "Ongoing" ? "green" : s === "Finished" ? "grey" : "primary";

const getBanner = (banner) => {
  if (!banner) return "";
  if (banner.startsWith("http://") || banner.startsWith("https://")) return banner;
  if (banner.startsWith("/")) return `${api.defaults.baseURL}${banner}`;
  return `${api.defaults.baseURL}/uploads/${banner}`;
};
const getFileUrl = (p) => (p ? `https://staging2.egovmz.in${p.replace(/^.*\/uploads/, "/uploads")}` : "#");

const getFileIcon = (mime) =>
  mime?.startsWith("image/") ? "image" : mime === "application/pdf" ? "picture_as_pdf" : "insert_drive_file";
const getFileColor = (mime) =>
  mime?.startsWith("image/") ? "blue" : mime === "application/pdf" ? "red" : "grey";

// --- Pagination
const filteredTrainings = computed(() =>
  statusFilter.value === "all"
    ? trainings.value
    : trainings.value.filter((t) => t.t_program?.t_status === statusFilter.value)
);

const paginatedTrainings = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  return filteredTrainings.value.slice(start, start + rowsPerPage.value);
});

const maxPages = computed(() =>
  Math.max(1, Math.ceil(filteredTrainings.value.length / rowsPerPage.value))
);

watch([statusFilter, rowsPerPage], () => (currentPage.value = 1));

onMounted(fetchTrainings);
</script>

<style scoped>
.hover-scale {
  transition: transform 0.2s ease-in-out;
}

.hover-scale:hover {
  transform: scale(1.02);
}

.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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

<template>
  <div class="q-pa-md">
    <!-- Page Header -->
    <div class="text-h5 text-weight-bold q-mb-lg">Program Enrollments</div>

    <!-- Programs Grid -->
    <div class="row q-col-gutter-lg">
      <div
        v-for="program in paginatedPrograms"
        :key="program._id"
        class="col-12 col-md-6 col-lg-4"
      >
        <q-card
          flat
          bordered
          class="hoverable-card cursor-pointer"
          @click="openDialog(program)"
        >
          <!-- Banner Section -->
          <q-img
            :src="getBanner(program.t_banner)"
            :ratio="16/9"
            alt="Program Banner"
            class="rounded-t-borders"
          >
            <!-- Fallback for Missing Banner -->
            <template v-if="!program.t_banner">
              <div class="absolute-full flex flex-center bg-grey-4 text-grey-7">
                <q-icon name="image" size="48px" class="q-mr-sm" />
                <div>No Banner Available</div>
              </div>
            </template>

            <!-- Overlay Content -->
            <div class="absolute-bottom bg-gradient-to-top from-black/70 text-white q-pa-md">
              <div class="text-h6 q-mb-xs ellipsis">{{ program.t_name }}</div>
              <div class="text-caption ellipsis">{{ program.t_description }}</div>

              <div class="row items-center justify-between q-mt-xs">
                <q-chip
                  dense
                  :color="statusColor(program.t_status)"
                  text-color="white"
                >
                  {{ program.t_status }}
                </q-chip>
                <div class="row items-center">
                  <q-rating
                    v-model="program.averageRating"
                    max="5"
                    color="amber"
                    readonly
                    size="16px"
                  />
                  <span class="text-caption q-ml-xs">({{ program.ratingsCount || 0 }})</span>
                </div>
              </div>
            </div>
          </q-img>

          <!-- Details -->
          <q-card-section>
            <div class="text-caption"><b>Start:</b> {{ formatDate(program.t_start_date) }}</div>
            <div class="text-caption"><b>End:</b> {{ formatDate(program.t_end_date) }}</div>
            <div class="text-caption"><b>Duration:</b> {{ program.t_duration }} days</div>
            <div class="text-caption"><b>Capacity:</b> {{ program.t_capacity }}</div>
            <div class="text-caption"><b>Enrollments:</b> {{ program.enrollments.length }}</div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn
              color="primary"
              flat
              icon="people"
              label="View Enrollments"
              @click.stop="openDialog(program)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="q-mt-lg q-pa-md flex flex-center column">
      <q-pagination
        v-model="currentPage"
        :max="maxPages"
        max-pages="7"
        boundary-numbers
        direction-links
        color="primary"
        class="q-mb-md"
      />
      <q-select
        v-model="rowsPerPage"
        :options="[6, 12, 24]"
        label="Rows per page"
        outlined
        dense
        style="width: 150px"
      />
    </div>

    <!-- Enrollment Dialog -->
    <q-dialog v-model="dialog">
      <q-card style="min-width: 700px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedProgram?.t_name }} - Enrollments</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- Filters -->
          <div class="row q-gutter-sm q-mb-md items-center">
            <q-input dense outlined debounce="300" v-model="search" placeholder="Search user/email" clearable>
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>

            <q-select
              dense
              outlined
              v-model="statusFilter"
              :options="['all', 'Approved', 'Pending', 'Waitlisted', 'Rejected']"
              style="min-width: 150px"
            />
          </div>

          <!-- Users Table -->
          <q-table :rows="filteredUsers" :columns="columns" row-key="_id" flat bordered>
            <template v-slot:body-cell-actions="props">
              <q-td align="right">
                <q-select
                  dense
                  outlined
                  v-model="props.row.status"
                  :options="statusOptions"
                  emit-value
                  map-options
                  style="min-width: 120px"
                  @update:model-value="updateEnrollmentStatus(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Loading Indicator -->
    <q-inner-loading :showing="loading">
      <q-spinner color="primary" size="50px" />
    </q-inner-loading>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();
const loading = ref(false);
const enrollments = ref([]);
const programs = ref([]);
const dialog = ref(false);
const selectedProgram = ref(null);

// Pagination
const currentPage = ref(1);
const rowsPerPage = ref(6);

// Filters
const search = ref("");
const statusFilter = ref("all");

// ✅ Date formatter
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ✅ Banner helper (same logic as trainee)
const getBanner = (banner) => {
  if (!banner) return "";
  if (banner.startsWith("http")) return banner;
  if (banner.startsWith("/")) return `${api.defaults.baseURL}${banner}`;
  return `${api.defaults.baseURL}/uploads/${banner}`;
};

// ✅ Status color
const statusColor = (status) =>
  ({
    Upcoming: "blue",
    Ongoing: "green",
    Finished: "grey",
  }[status] || "primary");

// ✅ Pagination logic
const paginatedPrograms = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return programs.value.slice(start, end);
});

const maxPages = computed(() =>
  Math.max(1, Math.ceil(programs.value.length / rowsPerPage.value))
);

// ✅ Table columns
const columns = [
  { name: "name", label: "Name", field: (row) => row.user.full_name, align: "left" },
  { name: "email", label: "Email", field: (row) => row.user.email, align: "left" },
  { name: "mobile", label: "Mobile", field: (row) => row.user.mobile, align: "left" },
  { name: "status", label: "Status", field: "status", align: "center" },
  { name: "actions", label: "Actions", field: "actions", align: "right" },
];

const statusOptions = [
  { label: "Approved", value: "Approved" },
  { label: "Pending", value: "Pending" },
  { label: "Rejected", value: "Rejected" },
  { label: "Waitlisted", value: "Waitlisted" },
];

// ✅ Fetch all enrollments
const fetchEnrollments = async () => {
  loading.value = true;
  try {
    let allEnrollments = [];
    let page = 1;
    let totalPages = 1;

    do {
      const res = await api.get("/admin-api/enrollments", { params: { page, limit: '' } });
      allEnrollments.push(...(res.data.enrollments || []));
      totalPages = res.data.pagination.totalPages;
      page++;
    } while (page <= totalPages);

    enrollments.value = allEnrollments;

    // Group by program
    const grouped = {};
    enrollments.value.forEach((en) => {
      const prog = en.training_program;
      if (!grouped[prog._id]) grouped[prog._id] = { ...prog, enrollments: [] };
      grouped[prog._id].enrollments.push(en);
    });

    programs.value = Object.values(grouped);
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    loading.value = false;
  }
};

// ✅ Open dialog
const openDialog = (program) => {
  selectedProgram.value = program;
  dialog.value = true;
};

// ✅ Filter users
const filteredUsers = computed(() => {
  if (!selectedProgram.value) return [];
  return selectedProgram.value.enrollments.filter((e) => {
    const matchesSearch =
      e.user.full_name.toLowerCase().includes(search.value.toLowerCase()) ||
      e.user.email.toLowerCase().includes(search.value.toLowerCase());
    const matchesStatus = statusFilter.value === "all" || e.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

// ✅ Update enrollment status
const updateEnrollmentStatus = async (row) => {
  try {
    await api.patch(`/admin-api/enrollment/${row._id}`, { status: row.status });
    $q.notify({
      type: "positive",
      message: `Status updated to ${row.status}`,
    });
  } catch (error) {
    // Handle backend response if training is full
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to update status";

    if (
      error.response?.status === 400 &&
      message.includes("Training capacity reached")
    ) {
      $q.notify({
        type: "warning",
        message: "Training capacity reached! Enrollment moved to Waitlist.",
      });
    } else {
      console.error("Status update failed:", error.response?.data || error.message);
      $q.notify({
        type: "negative",
        message,
      });
    }
  }
};


onMounted(fetchEnrollments);
</script>

<style scoped>
.hoverable-card:hover {
  transform: translateY(-4px);
  transition: all 0.2s ease;
}
</style>

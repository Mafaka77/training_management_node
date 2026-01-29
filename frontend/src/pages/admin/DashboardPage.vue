<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Welcome, Admin!</div>

    <!-- Stats Row -->
    <div class="q-pa-md row q-gutter-md">

      <q-card class="col-3 bg-primary text-white">
        <q-card-section class="flex items-center">
          <q-icon name="groups" size="32px" class="q-mr-md" />
          <div>
            <div class="text-subtitle2">Total Trainees</div>
            <div class="text-h6">{{ totalTrainees }}</div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="col-3 bg-positive text-white">
        <q-card-section class="flex items-center">
          <q-icon name="event" size="32px" class="q-mr-md" />
          <div>
            <div class="text-subtitle2">Upcoming Trainings</div>
            <div class="text-h6">{{ upcomingTrainings }}</div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="col-3 bg-info text-white">
        <q-card-section class="flex items-center">
          <q-icon name="play_circle" size="32px" class="q-mr-md" />
          <div>
            <div class="text-subtitle2">Ongoing Trainings</div>
            <div class="text-h6">{{ onGoingTrainings }}</div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="col-3 bg-warning text-white">
        <q-card-section class="flex items-center">
          <q-icon name="hourglass_empty" size="32px" class="q-mr-md" />
          <div>
            <div class="text-subtitle2">Pending Enrollments</div>
            <div class="text-h6">{{ pendingEnrollments }}</div>
          </div>
        </q-card-section>
      </q-card>

    </div>


    <!-- Charts + Activity -->
    <div class="row q-col-gutter-md">

      <!-- Chart Card -->
      <div class="col-8">
        <q-card class="q-pa-md shadow-2 rounded-borders">
          <div class="row items-center q-mb-sm">
            <q-icon name="bar_chart" size="28px" class="text-primary q-mr-sm" />
            <div class="text-h6">Enrollments Last 7 Days</div>
          </div>
          <!-- Replace with chart component -->
          <BarChart :data="chartData" />
          <div class="q-mt-md text-grey text-caption">
            Chart placeholder
          </div>
        </q-card>
      </div>

      <!-- Activity Card -->
      <div class="col-4">
        <q-card class="q-pa-md shadow-2 rounded-borders">
          <div class="row items-center q-mb-sm">
            <q-icon name="history" size="24px" class="text-primary q-mr-sm" />
            <div class="text-h6">Recent Activity</div>
          </div>

          <q-list separator>
            <q-item v-for="activity in recentActivity" :key="activity.id">
              <q-item-section avatar>
                <q-icon name="notifications" color="secondary" />
              </q-item-section>
              <q-item-section>{{ activity.message }}</q-item-section>
              <q-item-section side class="text-caption text-grey">
                {{ activity.time }}
              </q-item-section>
            </q-item>

            <q-item v-if="recentActivity.length === 0">
              <q-item-section class="text-grey">No recent activity</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted,computed } from "vue";
import { api } from "boot/axios";
import dayjs from "dayjs";
import BarChart from "components/BarChart.vue"; // 👈 import


const trainees = ref([])
const programs = ref([])
const enrollments = ref([])

const recentActivity = ref([]);
// const enrollments = ref([]); // for chart

const totalTrainees = ref(0)
const upcomingTrainings = ref(0)
const onGoingTrainings = ref(0)
const pendingEnrollments = ref(0)
const fetchDashboardData = async () => {
  try {
    const [traineesRes, programsRes, enrollmentsRes] = await Promise.all([
      api.get("/admin/trainees?page=1&limit=10&search="),
      api.get("/admin/get-all-training-program?page=1&limit=10&search="),
      api.get("/admin/enrollments"),
    ]);

    const trainees = traineesRes.data.trainees;
    const programs = programsRes.data.programs;
    enrollments.value = enrollmentsRes.data.enrollments;

    // Counts
    totalTrainees.value = trainees.length;
    upcomingTrainings.value = programs.filter(p => p.t_status === "Upcoming").length;
    onGoingTrainings.value = programs.filter(p => p.t_status === "Ongoing").length;
    pendingEnrollments.value = enrollments.value.filter(e => e.status === "Pending").length;

    // Activity
    recentActivity.value = enrollments.value
      .slice(-5)
      .map(e => ({
        id: e._id,
        message: `${e.user?.full_name || "Unknown"} enrolled in ${e.training_program?.t_name || "Program"}`,
        time: dayjs(e.createdAt).fromNow()
      }));
  } catch (err) {
    console.error("Dashboard fetch error:", err);
  }
};


onMounted(fetchDashboardData);
onMounted(async () => {
  // Fetch all APIs in parallel
  const [traineesRes, programsRes, enrollmentsRes] = await Promise.all([
    api.get('https://staging2.egovmz.in/admin/trainees?page=1&limit=10&search='),
    api.get('https://staging2.egovmz.in/admin/get-all-training-program?page=1&limit=10&search='),
    api.get('https://staging2.egovmz.in/admin/enrollments')
  ])

  trainees.value = traineesRes.data.trainees
  programs.value = programsRes.data.programs
  enrollments.value = enrollmentsRes.data.enrollments

  // Compute counts
  totalTrainees.value = trainees.value.length
  upcomingTrainings.value = programs.value.filter(p => p.t_status === 'Upcoming').length
  onGoingTrainings.value = programs.value.filter(p => p.t_status === 'Ongoing').length
  pendingEnrollments.value = enrollments.value.filter(e => e.status === 'Pending').length
})


const chartData = computed(() => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = dayjs().subtract(6 - i, "day");
    return d.format("YYYY-MM-DD");
  });

  const counts = last7Days.map(d =>
    enrollments.value.filter(e =>
      dayjs(e.createdAt).format("YYYY-MM-DD") === d
    ).length
  );

  return {
    labels: last7Days,
    datasets: [
      {
        label: "Enrollments",
        data: counts,
        backgroundColor: "#42A5F5",
      },
    ],
  };
});

</script>

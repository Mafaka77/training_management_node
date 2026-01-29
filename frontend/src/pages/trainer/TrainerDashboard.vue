<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md row">

      <!-- Stats Cards (unchanged) -->
      <q-card class="col-12 col-md-3 text-center bg-primary text-white">
        <q-card-section>
          <div class="text-h6">Total Trainings</div>
          <div class="text-h4">{{ stats.totalTrainings }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-3 text-center bg-teal text-white">
        <q-card-section>
          <div class="text-h6">Upcoming Trainings</div>
          <div class="text-h4">{{ stats.upcomingTrainings }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-3 text-center bg-orange text-white">
        <q-card-section>
          <div class="text-h6">Materials Uploaded</div>
          <div class="text-h4">{{ stats.materialsUploaded }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-3 text-center bg-purple text-white">
        <q-card-section>
          <div class="text-h6">Avg Rating</div>
          <q-rating
            v-model="stats.averageRating"
            color="yellow"
            max="5"
            size="25px"
            readonly
          />
          <div>{{ stats.averageRating.toFixed(1) }}/5</div>
        </q-card-section>
      </q-card>

    </div>

    <q-separator class="q-my-md" />

    <!-- Upcoming Trainings List -->
    <div>
      <div class="text-h6 q-mb-md">Upcoming Trainings</div>
      <q-card
        v-for="training in upcomingList"
        :key="training._id"
        class="q-mb-md hover bordered"
      >
        <q-card-section>
          <div class="text-h6">{{ training.t_program.t_name }}</div>
          <div class="text-subtitle2 text-grey">{{ training.t_program.t_description }}</div>

          <div class="q-mt-sm row items-center q-gutter-xs">
            <q-badge color="primary">{{ training.t_program.t_status }}</q-badge>
            <q-badge color="secondary">{{ training.tc_start_time }} - {{ training.tc_end_time }}</q-badge>

            <!-- Countdown with tooltip -->
            <q-tooltip anchor="bottom middle" self="top middle">
              Starts at: {{ formatFullDate(training.tc_start_time) }}
            </q-tooltip>
            <q-chip color="red" v-if="countdowns[training._id]">
              {{ countdowns[training._id] }}
            </q-chip>
          </div>

          <!-- Editable rating stars -->
          <div class="q-mt-sm">
            <q-rating
              v-model="training.userRating"
              color="yellow"
              max="5"
              size="20px"
              @input="submitRating(training._id, training.userRating)"
            />
            <span class="text-caption q-ml-sm">{{ training.userRating }}/5</span>
          </div>

          <!-- Material upload progress -->
          <q-linear-progress
            v-if="training.materialsUploaded && training.t_program.t_capacity"
            :value="training.materialsUploaded / training.t_program.t_capacity"
            color="teal"
            class="q-mt-sm"
          >
            <div class="text-caption text-white">
              {{ training.materialsUploaded || 0 }}/{{ training.t_program.t_capacity }} materials
            </div>
          </q-linear-progress>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";

const stats = ref({
  totalTrainings: 0,
  upcomingTrainings: 0,
  materialsUploaded: 0,
  averageRating: 0
});

const upcomingList = ref([]);
const countdowns = ref({});

const fetchStats = async () => {
  try {
    const res = await api.get("/admin/trainer/training/program");
    const trainings = res.data.data || [];

    // Add a property for user's rating
    trainings.forEach(t => t.userRating = t.t_program.averageRating || 0);

    upcomingList.value = trainings.filter(t => t.t_program.t_status === "Upcoming");

    stats.value.totalTrainings = trainings.length;
    stats.value.upcomingTrainings = upcomingList.value.length;
    stats.value.averageRating = trainings.reduce((acc, t) => acc + (t.t_program.averageRating || 0), 0) / (trainings.length || 1);

    // Fetch uploaded materials
    const matRes = await api.get("/trainer/materials");
    stats.value.materialsUploaded = matRes.data.data?.length || 0;

    // Setup countdowns
    upcomingList.value.forEach(t => {
      const start = new Date(t.tc_start_time).getTime();
      const now = new Date().getTime();
      const diff = start - now;
      if(diff > 0){
        const days = Math.floor(diff / (1000*60*60*24));
        const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
        countdowns.value[t._id] = `${days}d ${hours}h`;
      } else {
        countdowns.value[t._id] = "Started";
      }
    });

  } catch (err) {
    console.error(err);
  }
};

const formatFullDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour:'2-digit', minute:'2-digit' });
};

// Submit rating to API
const submitRating = async (trainingId, rating) => {
  try {
    await api.post(`/trainer/training/${trainingId}/rate`, { rating });
    console.log(`Rating submitted for training ${trainingId}: ${rating}`);
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchStats);
</script>

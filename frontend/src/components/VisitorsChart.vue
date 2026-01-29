<template>
  <div class="q-pa-md bg-white rounded-borders shadow-md">
    <h6 class="text-lg font-bold mb-2">Visitors Overview</h6>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const chartCanvas = ref(null);

onMounted(() => {
  new Chart(chartCanvas.value, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Visitors",
          data: [120, 200, 150, 300, 250, 400, 350],
          borderColor: "#42A5F5",
          backgroundColor: "rgba(66, 165, 245, 0.2)",
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
});
</script>

<style scoped>
div {
  height: 300px;
}
</style>
